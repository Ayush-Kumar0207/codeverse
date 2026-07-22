const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { Server } = require("socket.io");
const { io: createClient } = require("socket.io-client");
const socketHandler = require("../src/sockets");
const { SOCKET_EVENTS } = require("../../shared/constants/socket-events");

function waitForEvent(socket, event, predicate = () => true, timeoutMs = 3000) {
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

async function createHarness(context) {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: true, credentials: true } });
  socketHandler(io);
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  const url = `http://127.0.0.1:${address.port}`;
  const clients = [];

  context.after(async () => {
    clients.forEach((client) => client.disconnect());
    await io.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  async function connect() {
    const client = createClient(url, { transports: ["websocket"], forceNew: true });
    clients.push(client);
    await waitForEvent(client, "connect");
    return client;
  }

  return { connect };
}

function join(socket, roomId, user) {
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, user });
}

const organizer = {
  username: "Owner",
  userId: "owner-1",
  isOrganizer: true,
  organizerKnown: true,
  status: "Editing",
};

const collaborator = {
  username: "Reviewer",
  userId: "reviewer-1",
  isOrganizer: false,
  organizerKnown: true,
  status: "Reviewing",
};

test("Socket.IO joins are idempotent and broadcast both collaborators", async (context) => {
  const harness = await createHarness(context);
  const ownerSocket = await harness.connect();
  const reviewerSocket = await harness.connect();
  const roomId = `presence-${Date.now()}`;

  const ownerInitial = waitForEvent(ownerSocket, SOCKET_EVENTS.USER_JOINED);
  join(ownerSocket, roomId, organizer);
  await ownerInitial;

  const ownerSeesReviewer = waitForEvent(
    ownerSocket,
    SOCKET_EVENTS.USER_JOINED,
    (payload) => !Array.isArray(payload) && payload?.username === collaborator.username
  );
  const reviewerSeesRoom = waitForEvent(
    reviewerSocket,
    SOCKET_EVENTS.USER_JOINED,
    (payload) => Array.isArray(payload) && payload.length === 2
  );
  join(reviewerSocket, roomId, collaborator);

  const [reviewerPresence, roomPresence] = await Promise.all([ownerSeesReviewer, reviewerSeesRoom]);
  assert.equal(reviewerPresence.role, "collaborator");
  assert.deepEqual(roomPresence.map((presence) => presence.username).sort(), ["Owner", "Reviewer"]);

  join(reviewerSocket, roomId, collaborator);
  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(reviewerSocket.connected, true);
});

test("organizer permissions reject collaborator writes and allow trusted synchronization", async (context) => {
  const harness = await createHarness(context);
  const ownerSocket = await harness.connect();
  const reviewerSocket = await harness.connect();
  const roomId = `permissions-${Date.now()}`;

  join(ownerSocket, roomId, organizer);
  await waitForEvent(ownerSocket, SOCKET_EVENTS.EDIT_PERMISSION_STATE);
  join(reviewerSocket, roomId, collaborator);
  await waitForEvent(reviewerSocket, SOCKET_EVENTS.EDIT_PERMISSION_STATE);

  const locked = waitForEvent(
    reviewerSocket,
    SOCKET_EVENTS.EDIT_PERMISSION_STATE,
    (payload) => payload?.collaboratorsCanEdit === false
  );
  ownerSocket.emit(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, { roomId, collaboratorsCanEdit: false });
  await locked;

  const denied = waitForEvent(reviewerSocket, SOCKET_EVENTS.EDIT_PERMISSION_DENIED);
  reviewerSocket.emit(SOCKET_EVENTS.FILES_CHANGE, {
    roomId,
    files: { "main.cpp": "untrusted" },
    activeFile: "main.cpp",
  });
  const denial = await denied;
  assert.match(denial.reason, /organizer-only/i);

  const synchronized = waitForEvent(
    reviewerSocket,
    SOCKET_EVENTS.FILES_CHANGE,
    (payload) => payload?.files?.["main.cpp"] === "trusted"
  );
  ownerSocket.emit(SOCKET_EVENTS.FILES_CHANGE, {
    roomId,
    files: { "main.cpp": "trusted" },
    activeFile: "main.cpp",
  });
  assert.equal((await synchronized).activeFile, "main.cpp");
});

test("only the organizer can remove an active collaborator", async (context) => {
  const harness = await createHarness(context);
  const ownerSocket = await harness.connect();
  const reviewerSocket = await harness.connect();
  const roomId = `removal-${Date.now()}`;

  join(ownerSocket, roomId, organizer);
  await waitForEvent(ownerSocket, SOCKET_EVENTS.EDIT_PERMISSION_STATE);
  const roomPresence = waitForEvent(
    reviewerSocket,
    SOCKET_EVENTS.USER_JOINED,
    (payload) => Array.isArray(payload) && payload.length === 2
  );
  join(reviewerSocket, roomId, collaborator);
  const users = await roomPresence;
  const reviewer = users.find((presence) => presence.username === collaborator.username);

  const removed = waitForEvent(reviewerSocket, SOCKET_EVENTS.COLLABORATOR_REMOVED);
  ownerSocket.emit(SOCKET_EVENTS.REMOVE_COLLABORATOR, {
    roomId,
    username: reviewer.username,
    socketId: reviewer.socketId,
  });
  const payload = await removed;
  assert.equal(payload.username, collaborator.username);
  assert.match(payload.reason, /organizer/i);
});
