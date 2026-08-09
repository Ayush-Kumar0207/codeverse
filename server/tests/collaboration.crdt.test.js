const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const crypto = require("node:crypto");
const Y = require("yjs");
const { Server } = require("socket.io");
const { io: createClient } = require("socket.io-client");
const socketHandler = require("../src/sockets");
const { MemoryCollaborationStore } = require("../src/collaboration/store");
const { verifyReconnectToken } = require("../src/collaboration/tokens");
const { SOCKET_EVENTS } = require("../../shared/constants/socket-events");

function waitForEvent(socket, event, predicate = () => true, timeoutMs = 5000) {
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

function decodeUpdate(value) {
  return new Uint8Array(Buffer.from(value, "base64"));
}

function encodeUpdate(value) {
  return Buffer.from(value).toString("base64");
}

async function createHarness(context) {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: true, credentials: true } });
  const store = new MemoryCollaborationStore();
  const authorizeJoin = async ({ roomId, suppliedUser, reconnectToken }) => {
    const role = suppliedUser?.isOrganizer ? "organizer" : "editor";
    return {
      username: suppliedUser.username,
      userId: suppliedUser.userId,
      avatar: suppliedUser.avatar,
      status: suppliedUser.status,
      role,
      isOrganizer: role === "organizer",
      project: null,
      recovered: Boolean(verifyReconnectToken(reconnectToken, roomId, suppliedUser.userId)),
    };
  };
  const runtime = socketHandler(io, {
    store,
    authorizeJoin,
    loadSnapshot: async () => null,
    persistSnapshot: async () => true,
    instanceId: "crdt-test",
  });
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${httpServer.address().port}`;
  const clients = [];

  context.after(async () => {
    clients.forEach((client) => client.disconnect());
    await io.close();
    if (httpServer.listening) await new Promise((resolve) => httpServer.close(resolve));
  });

  async function connect() {
    const socket = createClient(url, { transports: ["websocket"], forceNew: true });
    clients.push(socket);
    await waitForEvent(socket, "connect");
    return socket;
  }

  async function join(socket, roomId, user, reconnectToken = "") {
    const joined = waitForEvent(socket, SOCKET_EVENTS.ROOM_JOINED, (payload) => payload.roomId === roomId);
    const sync = waitForEvent(socket, SOCKET_EVENTS.CRDT_SYNC, (payload) => payload.roomId === roomId);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user,
      reconnectToken,
      initialFiles: { "main.js": "const value = 1;" },
      activeFile: "main.js",
    });
    return Promise.all([joined, sync]);
  }

  return { connect, join, runtime, store };
}

function localInsert(doc, text) {
  let update;
  doc.once("update", (nextUpdate) => { update = nextUpdate; });
  const source = doc.getMap("files").get("main.js");
  source.insert(source.length, text);
  return update;
}

function emitCrdt(socket, roomId, update, operationId = crypto.randomUUID()) {
  return new Promise((resolve, reject) => {
    socket.timeout(5000).emit(SOCKET_EVENTS.CRDT_UPDATE, {
      roomId,
      activeFile: "main.js",
      operationId,
      update: encodeUpdate(update),
    }, (error, result) => error ? reject(error) : resolve(result));
  });
}

const owner = { username: "Owner", userId: "owner-crdt", isOrganizer: true, status: "Editing" };
const reviewer = { username: "Reviewer", userId: "reviewer-crdt", isOrganizer: false, status: "Editing" };

test("concurrent Yjs updates converge without lost edits and duplicate operations are idempotent", async (context) => {
  const harness = await createHarness(context);
  const first = await harness.connect();
  const second = await harness.connect();
  const roomId = `crdt-${Date.now()}`;
  const [[, firstSync], [, secondSync]] = await Promise.all([
    harness.join(first, roomId, owner),
    harness.join(second, roomId, reviewer),
  ]);

  const firstDoc = new Y.Doc();
  const secondDoc = new Y.Doc();
  Y.applyUpdate(firstDoc, decodeUpdate(firstSync.update));
  Y.applyUpdate(secondDoc, decodeUpdate(secondSync.update));

  const firstUpdate = localInsert(firstDoc, "\n// owner");
  const secondUpdate = localInsert(secondDoc, "\n// reviewer");
  const firstRemote = waitForEvent(first, SOCKET_EVENTS.CRDT_UPDATE, (payload) => payload.actor === reviewer.username);
  const secondRemote = waitForEvent(second, SOCKET_EVENTS.CRDT_UPDATE, (payload) => payload.actor === owner.username);
  const operationId = crypto.randomUUID();

  const [firstAck, secondAck, firstBroadcast, secondBroadcast] = await Promise.all([
    emitCrdt(first, roomId, firstUpdate, operationId),
    emitCrdt(second, roomId, secondUpdate),
    firstRemote,
    secondRemote,
  ]);
  assert.equal(firstAck.ok, true);
  assert.equal(secondAck.ok, true);
  Y.applyUpdate(firstDoc, decodeUpdate(firstBroadcast.update));
  Y.applyUpdate(secondDoc, decodeUpdate(secondBroadcast.update));
  assert.equal(firstDoc.getMap("files").get("main.js").toString(), secondDoc.getMap("files").get("main.js").toString());
  assert.match(firstDoc.getMap("files").get("main.js").toString(), /owner/);
  assert.match(firstDoc.getMap("files").get("main.js").toString(), /reviewer/);

  const duplicate = await emitCrdt(first, roomId, firstUpdate, operationId);
  assert.equal(duplicate.ok, true);
  assert.equal(duplicate.duplicate, true);
  assert.equal(harness.runtime.metrics.snapshot().duplicateOperations, 1);
});

test("a signed reconnect token restores identity and the durable room revision", async (context) => {
  const harness = await createHarness(context);
  const first = await harness.connect();
  const roomId = `reconnect-${Date.now()}`;
  const [joined, sync] = await harness.join(first, roomId, owner);
  const doc = new Y.Doc();
  Y.applyUpdate(doc, decodeUpdate(sync.update));
  const acknowledgement = await emitCrdt(first, roomId, localInsert(doc, "\n// durable"));
  first.disconnect();

  const replacement = await harness.connect();
  const [rejoined, restored] = await harness.join(replacement, roomId, owner, joined.reconnectToken);
  assert.equal(rejoined.recovered, true);
  assert.ok(rejoined.revision >= acknowledgement.revision);
  const restoredDoc = new Y.Doc();
  Y.applyUpdate(restoredDoc, decodeUpdate(restored.update));
  assert.match(restoredDoc.getMap("files").get("main.js").toString(), /durable/);
});
