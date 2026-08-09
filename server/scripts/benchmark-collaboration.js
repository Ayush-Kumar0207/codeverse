const http = require("node:http");
const crypto = require("node:crypto");
const { performance } = require("node:perf_hooks");
const Y = require("yjs");
const { Server } = require("socket.io");
const { io: createClient } = require("socket.io-client");
const socketHandler = require("../src/sockets");
const { createCollaborationInfrastructure } = require("../src/collaboration/infrastructure");
const { SOCKET_EVENTS } = require("../../shared/constants/socket-events");

const redisUrl = process.env.BENCHMARK_REDIS_URL || process.env.TEST_REDIS_URL || process.env.REDIS_URL;
const clientCounts = (process.env.BENCHMARK_CLIENTS || "100,500")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isInteger(value) && value > 1);
const updateCount = Math.max(10, Number(process.env.BENCHMARK_UPDATES || 100));
const updateConcurrency = Math.max(1, Number(process.env.BENCHMARK_UPDATE_CONCURRENCY || 5));
const timeoutMs = Math.max(5000, Number(process.env.BENCHMARK_TIMEOUT_MS || 30000));

if (!redisUrl) {
  console.error("BENCHMARK_REDIS_URL (or REDIS_URL) is required for the distributed benchmark.");
  process.exitCode = 1;
  return;
}

function percentile(values, quantile) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * quantile) - 1)] * 100) / 100;
}

function distribution(values) {
  return {
    samples: values.length,
    p50: percentile(values, 0.5),
    p95: percentile(values, 0.95),
    p99: percentile(values, 0.99),
    max: values.length ? Math.round(Math.max(...values) * 100) / 100 : null,
  };
}

function waitForEvent(socket, event, timeout = timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, handler);
      reject(new Error(`Timed out waiting for ${event}`));
    }, timeout);
    const handler = (...args) => {
      clearTimeout(timer);
      socket.off(event, handler);
      resolve(args);
    };
    socket.on(event, handler);
  });
}

async function inBatches(values, size, operation) {
  const results = [];
  for (let index = 0; index < values.length; index += size) {
    results.push(...await Promise.all(values.slice(index, index + size).map(operation)));
  }
  return results;
}

async function startNode(prefix, instanceId) {
  const httpServer = http.createServer();
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
    transports: ["websocket"],
    maxHttpBufferSize: 4_000_000,
  });
  const infrastructure = await createCollaborationInfrastructure(io, {
    redisUrl,
    requireRedis: true,
    prefix,
  });
  const runtime = socketHandler(io, {
    ...infrastructure,
    instanceId,
    authorizeJoin: async ({ suppliedUser, reconnectToken }) => ({
      username: suppliedUser.username,
      userId: suppliedUser.userId,
      status: "Benchmarking",
      role: suppliedUser.isOrganizer ? "organizer" : "editor",
      isOrganizer: Boolean(suppliedUser.isOrganizer),
      project: null,
      recovered: Boolean(reconnectToken),
    }),
    loadSnapshot: async () => null,
    persistSnapshot: async () => true,
  });
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  return { httpServer, io, infrastructure, runtime, url: `http://127.0.0.1:${httpServer.address().port}` };
}

async function connectClient(url) {
  const startedAt = performance.now();
  const socket = createClient(url, {
    transports: ["websocket"],
    forceNew: true,
    reconnection: false,
    timeout: timeoutMs,
  });
  await waitForEvent(socket, "connect");
  return { socket, latencyMs: performance.now() - startedAt };
}

function joinClient(client, roomId, index, reconnectToken = "") {
  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    client.socket.timeout(timeoutMs).emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      reconnectToken,
      user: {
        username: `bench-${index}`,
        userId: `bench-${index}`,
        isOrganizer: index === 0,
      },
      initialFiles: { "main.js": "export const benchmark = true;" },
      activeFile: "main.js",
    }, (error, response) => {
      if (error) return reject(error);
      if (!response?.ok) return reject(new Error(response?.message || "Room join failed"));
      return resolve({
        ...response,
        latencyMs: performance.now() - startedAt,
      });
    });
  });
}

async function sendUpdate(client, roomId, infrastructure, sequence) {
  const room = await infrastructure.store.getRoom(roomId);
  const doc = new Y.Doc();
  Y.applyUpdate(doc, new Uint8Array(Buffer.from(room.crdtState, "base64")));
  let update;
  doc.once("update", (value) => { update = value; });
  doc.getMap("files").get("main.js").insert(0, `// ${sequence}\n`);
  const startedAt = performance.now();
  return new Promise((resolve, reject) => {
    client.socket.timeout(timeoutMs).emit(SOCKET_EVENTS.CRDT_UPDATE, {
      roomId,
      activeFile: "main.js",
      operationId: crypto.randomUUID(),
      update: Buffer.from(update).toString("base64"),
    }, (error, response) => {
      if (error) return reject(error);
      if (!response?.ok) return reject(new Error(response?.reason || "CRDT update failed"));
      return resolve(performance.now() - startedAt);
    });
  });
}

async function runScenario(count, nodes) {
  const roomId = `benchmark-${count}-${crypto.randomUUID()}`;
  const indices = Array.from({ length: count }, (_, index) => index);
  const clients = [];
  const connectionStartedAt = performance.now();
  const connections = await inBatches(indices, 50, async (index) => {
    const connection = await connectClient(nodes[index % nodes.length].url);
    clients.push({ ...connection, index, nodeIndex: index % nodes.length });
    return connection.latencyMs;
  });
  const connectionDurationMs = performance.now() - connectionStartedAt;
  clients.sort((left, right) => left.index - right.index);

  const joinStartedAt = performance.now();
  const joins = await inBatches(clients, 40, async (client) => joinClient(client, roomId, client.index));
  const joinDurationMs = performance.now() - joinStartedAt;

  const editLatencies = [];
  for (let index = 0; index < updateCount; index += updateConcurrency) {
    const batch = Array.from({ length: Math.min(updateConcurrency, updateCount - index) }, (_, offset) => {
      const client = clients[(index + offset) % clients.length];
      return sendUpdate(client, roomId, nodes[client.nodeIndex].infrastructure, index + offset);
    });
    editLatencies.push(...await Promise.all(batch));
  }

  const sender = clients[0];
  const propagationStartedAt = performance.now();
  const propagationLatencies = [];
  let remaining = clients.length - 1;
  let resolvePropagation;
  const propagated = new Promise((resolve) => { resolvePropagation = resolve; });
  const operationId = crypto.randomUUID();
  const handlers = [];
  for (const client of clients.slice(1)) {
    const handler = (payload) => {
      if (payload.operationId !== operationId) return;
      propagationLatencies.push(performance.now() - propagationStartedAt);
      remaining -= 1;
      if (remaining === 0) resolvePropagation();
    };
    handlers.push([client, handler]);
    client.socket.on(SOCKET_EVENTS.CRDT_UPDATE, handler);
  }
  const room = await nodes[sender.nodeIndex].infrastructure.store.getRoom(roomId);
  const propagationDoc = new Y.Doc();
  Y.applyUpdate(propagationDoc, new Uint8Array(Buffer.from(room.crdtState, "base64")));
  let propagationUpdate;
  propagationDoc.once("update", (value) => { propagationUpdate = value; });
  propagationDoc.getMap("files").get("main.js").insert(0, "// propagation\n");
  const propagationAck = new Promise((resolve, reject) => {
    sender.socket.timeout(timeoutMs).emit(SOCKET_EVENTS.CRDT_UPDATE, {
      roomId,
      activeFile: "main.js",
      operationId,
      update: Buffer.from(propagationUpdate).toString("base64"),
    }, (error, response) => error ? reject(error) : resolve(response));
  });
  await Promise.race([
    Promise.all([propagationAck, propagated]),
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error(`Propagation reached ${propagationLatencies.length}/${count - 1} clients`)), timeoutMs);
      timer.unref?.();
    }),
  ]);
  handlers.forEach(([client, handler]) => client.socket.off(SOCKET_EVENTS.CRDT_UPDATE, handler));

  const reconnectCount = Math.min(20, Math.max(5, Math.ceil(count * 0.05)));
  const reconnectLatencies = [];
  let reconnectSuccesses = 0;
  for (const client of clients.slice(-reconnectCount)) {
    const joined = joins[client.index];
    client.socket.disconnect();
    const replacement = await connectClient(nodes[client.nodeIndex].url);
    const recovered = await joinClient(replacement, roomId, client.index, joined.reconnectToken);
    reconnectLatencies.push(replacement.latencyMs + recovered.latencyMs);
    if (recovered.recovered) reconnectSuccesses += 1;
    client.socket = replacement.socket;
  }

  const finalRoom = await nodes[0].infrastructure.store.getRoom(roomId);
  const result = {
    clients: count,
    serverInstances: nodes.length,
    connectionWallMs: Math.round(connectionDurationMs),
    joinWallMs: Math.round(joinDurationMs),
    connectionLatencyMs: distribution(connections),
    joinLatencyMs: distribution(joins.map((join) => join.latencyMs)),
    crdtAcknowledgementMs: distribution(editLatencies),
    crossInstancePropagationMs: distribution(propagationLatencies),
    reconnectLatencyMs: distribution(reconnectLatencies),
    reconnectSuccessRate: Math.round((reconnectSuccesses / reconnectCount) * 10_000) / 100,
    finalRevision: finalRoom.revision,
    finalFileBytes: Buffer.byteLength(finalRoom.files["main.js"] || "", "utf8"),
  };

  clients.forEach((client) => client.socket.disconnect());
  await Promise.all(nodes.map((node) => node.runtime.drain()));
  return result;
}

async function main() {
  const prefix = `codeverse:benchmark:${crypto.randomUUID()}`;
  const nodes = await Promise.all([
    startNode(prefix, "benchmark-a"),
    startNode(prefix, "benchmark-b"),
  ]);
  const startedAt = new Date().toISOString();
  try {
    const scenarios = [];
    for (const count of clientCounts) {
      scenarios.push(await runScenario(count, nodes));
    }
    const memory = process.memoryUsage();
    console.log(JSON.stringify({
      benchmark: "CodeVerse distributed Yjs collaboration",
      startedAt,
      completedAt: new Date().toISOString(),
      node: process.version,
      redis: "required",
      scenarios,
      processMemoryMb: {
        rss: Math.round(memory.rss / 1024 / 1024),
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      },
    }, null, 2));
  } finally {
    for (const node of nodes) {
      await node.io.close();
      await node.runtime.drain();
      await node.infrastructure.close();
      if (node.httpServer.listening) await new Promise((resolve) => node.httpServer.close(resolve));
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
