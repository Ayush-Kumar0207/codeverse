const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const crypto = require("node:crypto");
const Y = require("yjs");
const { Server } = require("socket.io");
const { io: createClient } = require("socket.io-client");
const socketHandler = require("../src/sockets");
const { createCollaborationInfrastructure } = require("../src/collaboration/infrastructure");
const { SOCKET_EVENTS } = require("../../shared/constants/socket-events");

const redisUrl = process.env.TEST_REDIS_URL;

function waitForEvent(socket, event, predicate = () => true, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.off(event, handler);
      reject(new Error(`Timed out waiting for ${event}`));
    }, timeoutMs);
    const handler = (payload) => {
      if (!predicate(payload)) return;
      clearTimeout(timeout);
      socket.off(event, handler);
      resolve(payload);
    };
    socket.on(event, handler);
  });
}

async function startNode(prefix, instanceId) {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: true, credentials: true } });
  const infrastructure = await createCollaborationInfrastructure(io, {
    redisUrl,
    requireRedis: true,
    prefix,
  });
  const runtime = socketHandler(io, {
    ...infrastructure,
    instanceId,
    authorizeJoin: async ({ suppliedUser }) => ({
      username: suppliedUser.username,
      userId: suppliedUser.userId,
      status: "Editing",
      role: suppliedUser.isOrganizer ? "organizer" : "editor",
      isOrganizer: Boolean(suppliedUser.isOrganizer),
      project: null,
      recovered: false,
    }),
    loadSnapshot: async () => null,
    persistSnapshot: async () => true,
  });
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  return { httpServer, io, infrastructure, runtime, url: `http://127.0.0.1:${httpServer.address().port}` };
}

async function connect(url) {
  const socket = createClient(url, { transports: ["websocket"], forceNew: true });
  await waitForEvent(socket, "connect");
  return socket;
}

function join(socket, roomId, user) {
  return new Promise((resolve, reject) => {
    socket.timeout(8000).emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user,
      initialFiles: { "main.js": "export const distributed = true;" },
      activeFile: "main.js",
    }, (error, response) => {
      if (error) return reject(error);
      if (!response?.ok) return reject(new Error(response?.message || "Room join failed"));
      return resolve(response);
    });
  });
}

test("Redis adapter shares presence, CRDT traffic, and room state across two server instances", {
  skip: redisUrl ? false : "TEST_REDIS_URL is not configured",
}, async () => {
  const prefix = `codeverse:test:${crypto.randomUUID()}`;
  const firstNode = await startNode(prefix, "node-a");
  const secondNode = await startNode(prefix, "node-b");
  const clients = [];
  try {
    const owner = await connect(firstNode.url);
    const reviewer = await connect(secondNode.url);
    clients.push(owner, reviewer);
    const roomId = `room-${crypto.randomUUID()}`;
    await join(owner, roomId, { username: "Owner", userId: "owner", isOrganizer: true });
    const crossNodePresence = waitForEvent(owner, SOCKET_EVENTS.USER_JOINED, (payload) =>
      !Array.isArray(payload) && payload.username === "Reviewer"
    );
    await join(reviewer, roomId, { username: "Reviewer", userId: "reviewer", isOrganizer: false });
    const presence = await crossNodePresence;
    assert.equal(presence.instanceId, "node-b");

    const room = await firstNode.infrastructure.store.getRoom(roomId);
    const doc = new Y.Doc();
    Y.applyUpdate(doc, new Uint8Array(Buffer.from(room.crdtState, "base64")));
    let update;
    doc.once("update", (value) => { update = value; });
    doc.getMap("files").get("main.js").insert(0, "// cross-node\n");

    const received = waitForEvent(reviewer, SOCKET_EVENTS.CRDT_UPDATE, (payload) => payload.actor === "Owner");
    const acknowledged = new Promise((resolve, reject) => {
      owner.timeout(8000).emit(SOCKET_EVENTS.CRDT_UPDATE, {
        roomId,
        activeFile: "main.js",
        operationId: crypto.randomUUID(),
        update: Buffer.from(update).toString("base64"),
      }, (error, result) => error ? reject(error) : resolve(result));
    });
    const [broadcast, ack] = await Promise.all([received, acknowledged]);
    assert.equal(ack.ok, true);
    assert.equal(broadcast.revision, ack.revision);
    const stateFromSecondNode = await secondNode.infrastructure.store.getRoom(roomId);
    assert.equal(stateFromSecondNode.revision, ack.revision);
    assert.match(stateFromSecondNode.files["main.js"], /cross-node/);
  } finally {
    clients.forEach((client) => client.disconnect());
    await firstNode.io.close();
    await secondNode.io.close();
    await firstNode.runtime.drain();
    await secondNode.runtime.drain();
    await firstNode.infrastructure.close();
    await secondNode.infrastructure.close();
    if (firstNode.httpServer.listening) await new Promise((resolve) => firstNode.httpServer.close(resolve));
    if (secondNode.httpServer.listening) await new Promise((resolve) => secondNode.httpServer.close(resolve));
  }
});
