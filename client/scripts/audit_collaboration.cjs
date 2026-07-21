const assert = require("node:assert/strict");
const http = require("node:http");
const { Server } = require("../../server/node_modules/socket.io");
const { io: createClient } = require("../node_modules/socket.io-client");
const socketHandler = require("../../server/src/sockets");
const { SOCKET_EVENTS } = require("../../shared/constants/socket-events");

const timeoutMs = 4000;

function waitForEvent(socket, eventName, predicate = () => true) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.off(eventName, handler);
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeoutMs);
    const handler = (payload) => {
      if (!predicate(payload)) return;
      clearTimeout(timeout);
      socket.off(eventName, handler);
      resolve(payload);
    };
    socket.on(eventName, handler);
  });
}

function connectClient(url) {
  return new Promise((resolve, reject) => {
    const socket = createClient(url, {
      forceNew: true,
      reconnection: false,
      transports: ["websocket"],
    });
    const timeout = setTimeout(() => reject(new Error("Socket connection timed out")), timeoutMs);
    socket.once("connect", () => {
      clearTimeout(timeout);
      resolve(socket);
    });
    socket.once("connect_error", reject);
  });
}

async function run() {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: "*" } });
  socketHandler(io);

  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  const url = `http://127.0.0.1:${address.port}`;
  const roomId = `audit-${Date.now()}`;
  const organizer = await connectClient(url);
  const collaborator = await connectClient(url);

  try {
    const organizerState = waitForEvent(
      organizer,
      SOCKET_EVENTS.EDIT_PERMISSION_STATE,
      (payload) => payload.roomId === roomId
    );
    organizer.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user: {
        username: "Organizer",
        userId: "organizer-1",
        isOrganizer: true,
        organizerKnown: true,
      },
    });
    assert.equal((await organizerState).organizerUserId, "organizer-1");

    const collaboratorPresence = waitForEvent(
      organizer,
      SOCKET_EVENTS.USER_JOINED,
      (payload) => !Array.isArray(payload) && payload.username === "Collaborator"
    );
    collaborator.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user: {
        username: "Collaborator",
        userId: "collaborator-1",
        isOrganizer: false,
        organizerKnown: true,
      },
    });
    assert.equal((await collaboratorPresence).role, "collaborator");

    const lockedState = waitForEvent(
      collaborator,
      SOCKET_EVENTS.EDIT_PERMISSION_STATE,
      (payload) => payload.roomId === roomId && payload.collaboratorsCanEdit === false
    );
    organizer.emit(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, {
      roomId,
      collaboratorsCanEdit: false,
    });
    await lockedState;

    const deniedEdit = waitForEvent(
      collaborator,
      SOCKET_EVENTS.EDIT_PERMISSION_DENIED,
      (payload) => payload.roomId === roomId
    );
    collaborator.emit(SOCKET_EVENTS.CODE_CHANGE, {
      roomId,
      fileName: "main.cpp",
      code: "blocked",
    });
    assert.match((await deniedEdit).reason, /organizer-only/i);

    let duplicateJoinAnnouncements = 0;
    const duplicateJoinListener = (payload) => {
      if (!Array.isArray(payload) && payload?.username === "Collaborator") {
        duplicateJoinAnnouncements += 1;
      }
    };
    organizer.on(SOCKET_EVENTS.USER_JOINED, duplicateJoinListener);
    collaborator.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      user: {
        username: "Collaborator",
        userId: "collaborator-1",
        isOrganizer: true,
        organizerKnown: true,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 120));
    organizer.off(SOCKET_EVENTS.USER_JOINED, duplicateJoinListener);
    assert.equal(duplicateJoinAnnouncements, 0, "same-room joins must be idempotent");
    const deniedTakeover = waitForEvent(
      collaborator,
      SOCKET_EVENTS.EDIT_PERMISSION_DENIED,
      (payload) => /Only the organizer/i.test(payload.reason)
    );
    collaborator.emit(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, {
      roomId,
      collaboratorsCanEdit: true,
    });
    await deniedTakeover;

    const relayedCode = waitForEvent(
      collaborator,
      SOCKET_EVENTS.CODE_CHANGE,
      (payload) => payload.fileName === "main.cpp"
    );
    organizer.emit(SOCKET_EVENTS.CODE_CHANGE, {
      roomId,
      fileName: "main.cpp",
      code: "int main() { return 0; }",
    });
    assert.equal((await relayedCode).code, "int main() { return 0; }");

    const safePresence = waitForEvent(
      organizer,
      SOCKET_EVENTS.PRESENCE_UPDATE,
      (payload) => payload.status === "Reviewing"
    );
    collaborator.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
      roomId,
      username: "Organizer",
      status: "Reviewing",
    });
    assert.equal((await safePresence).username, "Collaborator");

    const safeCursor = waitForEvent(
      organizer,
      SOCKET_EVENTS.CURSOR_MOVE,
      (payload) => payload.position?.lineNumber === 3
    );
    collaborator.emit(SOCKET_EVENTS.CURSOR_MOVE, {
      roomId,
      username: "Organizer",
      position: { lineNumber: 3, column: 2 },
    });
    assert.equal((await safeCursor).username, "Collaborator");

    const removed = waitForEvent(
      collaborator,
      SOCKET_EVENTS.COLLABORATOR_REMOVED,
      (payload) => payload.roomId === roomId
    );
    organizer.emit(SOCKET_EVENTS.REMOVE_COLLABORATOR, {
      roomId,
      socketId: collaborator.id,
    });
    assert.equal((await removed).username, "Collaborator");

    const deniedAfterRemoval = waitForEvent(
      collaborator,
      SOCKET_EVENTS.EDIT_PERMISSION_DENIED,
      (payload) => /no longer/i.test(payload.reason)
    );
    collaborator.emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      id: "removed-message",
      roomId,
      message: "should not relay",
    });
    await deniedAfterRemoval;

    console.log("Collaboration audit passed: presence, idempotent joins, relay, organizer lock, spoof resistance, and removal.");
  } finally {
    organizer.disconnect();
    collaborator.disconnect();
    await new Promise((resolve) => io.close(resolve));
    await new Promise((resolve) => httpServer.close(resolve));
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
