const crypto = require("crypto");
const Y = require("yjs");
const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");
const { MemoryCollaborationStore } = require("../collaboration/store");
const { RealtimeMetrics } = require("../collaboration/realtimeMetrics");
const { issueInviteToken, issueReconnectToken } = require("../collaboration/tokens");
const collaborationService = require("../services/collaboration.service");

const MAX_FILES = 100;
const MAX_WORKSPACE_BYTES = 2_000_000;
const PERSIST_DELAY_MS = Number(process.env.COLLABORATION_PERSIST_DELAY_MS || 750);

function normalizeFiles(files) {
  if (!files || typeof files !== "object" || Array.isArray(files)) return null;
  const normalized = {};
  let totalBytes = 0;

  for (const [fileName, content] of Object.entries(files)) {
    if (typeof fileName !== "string" || !fileName || fileName.length > 200 || fileName.includes("..")) return null;
    if (typeof content !== "string") return null;
    totalBytes += Buffer.byteLength(content, "utf8");
    if (totalBytes > MAX_WORKSPACE_BYTES) return null;
    normalized[fileName] = content;
  }

  return Object.keys(normalized).length > 0 && Object.keys(normalized).length <= MAX_FILES
    ? normalized
    : null;
}

function normalizeJoinPayload(payload) {
  if (typeof payload === "string") return { roomId: payload, user: null };
  if (!payload || typeof payload !== "object") return { roomId: "", user: null };
  return {
    roomId: typeof payload.roomId === "string" ? payload.roomId.trim() : "",
    user: payload.user && typeof payload.user === "object" ? payload.user : null,
    inviteToken: typeof payload.inviteToken === "string" ? payload.inviteToken : "",
    reconnectToken: typeof payload.reconnectToken === "string" ? payload.reconnectToken : "",
    initialFiles: normalizeFiles(payload.initialFiles),
    activeFile: typeof payload.activeFile === "string" ? payload.activeFile : "",
  };
}

function decodeUpdate(value) {
  if (typeof value !== "string" || value.length > 4_000_000) throw new Error("Invalid CRDT update");
  return new Uint8Array(Buffer.from(value, "base64"));
}

function encodeUpdate(value) {
  return Buffer.from(value).toString("base64");
}

function docFromRoom(room) {
  const doc = new Y.Doc();
  if (room.crdtState) {
    Y.applyUpdate(doc, decodeUpdate(room.crdtState), "restore");
    return doc;
  }

  const fileMap = doc.getMap("files");
  doc.transact(() => {
    for (const [fileName, content] of Object.entries(room.files || {})) {
      const text = new Y.Text();
      text.insert(0, content);
      fileMap.set(fileName, text);
    }
  }, "bootstrap");
  return doc;
}

function materializeDoc(doc) {
  const files = {};
  for (const [fileName, value] of doc.getMap("files").entries()) {
    if (value instanceof Y.Text) files[fileName] = value.toString();
  }
  return files;
}

function replaceText(text, nextValue) {
  const currentValue = text.toString();
  if (currentValue === nextValue) return;

  let prefix = 0;
  while (prefix < currentValue.length && prefix < nextValue.length && currentValue[prefix] === nextValue[prefix]) {
    prefix += 1;
  }
  let currentSuffix = currentValue.length;
  let nextSuffix = nextValue.length;
  while (
    currentSuffix > prefix &&
    nextSuffix > prefix &&
    currentValue[currentSuffix - 1] === nextValue[nextSuffix - 1]
  ) {
    currentSuffix -= 1;
    nextSuffix -= 1;
  }

  if (currentSuffix > prefix) text.delete(prefix, currentSuffix - prefix);
  if (nextSuffix > prefix) text.insert(prefix, nextValue.slice(prefix, nextSuffix));
}

function synchronizeFiles(doc, nextFiles) {
  const fileMap = doc.getMap("files");
  doc.transact(() => {
    for (const fileName of [...fileMap.keys()]) {
      if (!Object.hasOwn(nextFiles, fileName)) fileMap.delete(fileName);
    }
    for (const [fileName, content] of Object.entries(nextFiles)) {
      let text = fileMap.get(fileName);
      if (!(text instanceof Y.Text)) {
        text = new Y.Text();
        fileMap.set(fileName, text);
      }
      replaceText(text, content);
    }
  }, "workspace-sync");
}

function presenceRole(role) {
  return role === "organizer" ? "organizer" : "collaborator";
}

function socketHandler(io, options = {}) {
  const store = options.store || new MemoryCollaborationStore();
  const metrics = options.metrics || new RealtimeMetrics();
  const authorizeJoin = options.authorizeJoin || collaborationService.authorizeRoomJoin;
  const loadSnapshot = options.loadSnapshot || collaborationService.loadRoomSnapshot;
  const persistSnapshot = options.persistSnapshot || collaborationService.persistRoomSnapshot;
  const initialRoomFromProject = options.initialRoomFromProject || collaborationService.initialRoomFromProject;
  const instanceId = options.instanceId || "local";
  const logger = options.logger || console;
  const persistTimers = new Map();
  const pendingDisconnects = new Set();

  function schedulePersist(room) {
    if (persistTimers.has(room.roomId)) clearTimeout(persistTimers.get(room.roomId));
    const timer = setTimeout(() => {
      persistTimers.delete(room.roomId);
      void persistSnapshot(room).catch((error) => {
        metrics.recordError();
        logger.error("Failed to persist collaboration room:", error.message || error);
      });
    }, PERSIST_DELAY_MS);
    timer.unref?.();
    persistTimers.set(room.roomId, timer);
  }

  async function roomAccess(roomId) {
    const room = await store.getRoom(roomId);
    return {
      roomId,
      collaboratorsCanEdit: room?.collaboratorsCanEdit !== false,
      organizerUsername: room?.organizer?.username || "",
      organizerUserId: room?.organizer?.userId || "",
      revision: Number(room?.revision || 0),
      storage: store.mode,
    };
  }

  async function canSocketEdit(socket, roomId) {
    if (!roomId || socket.data.roomId !== roomId || !socket.rooms.has(roomId)) return false;
    if (socket.data.role === "viewer") return false;
    if (socket.data.role === "organizer") return true;
    const room = await store.getRoom(roomId);
    return room?.collaboratorsCanEdit !== false;
  }

  async function emitPermissionDenied(socket, roomId, reason = "Editing is currently organizer-only.") {
    metrics.recordPermissionDenial();
    const room = await store.getRoom(roomId);
    socket.emit(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, {
      roomId,
      reason,
      state: await roomAccess(roomId),
      files: room?.files || null,
    });
  }

  async function broadcastPresence(roomId) {
    io.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, await store.listPresence(roomId));
  }

  async function leaveTrackedRoom(socket, roomId) {
    if (!roomId) return;
    const presence = await store.removePresence(roomId, socket.id);
    socket.leave(roomId);
    if (presence) {
      socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, presence);
    }
    if (socket.data.roomId === roomId) socket.data.roomId = "";
  }

  async function applyCrdtUpdate(roomId, update, activeFile) {
    return store.mutateRoom(roomId, (room) => {
      const doc = docFromRoom(room);
      Y.applyUpdate(doc, update, "client");
      room.files = materializeDoc(doc);
      room.activeFile = Object.hasOwn(room.files, activeFile)
        ? activeFile
        : room.activeFile || Object.keys(room.files)[0] || "";
      room.crdtState = encodeUpdate(Y.encodeStateAsUpdate(doc));
      room.revision = Number(room.revision || 0) + 1;
      return room;
    });
  }

  io.on("connection", (socket) => {
    metrics.connected();

    socket.on(SOCKET_EVENTS.JOIN_ROOM, async (payload, acknowledge) => {
      const join = normalizeJoinPayload(payload);
      if (!join.roomId) return;

      try {
        const identity = await authorizeJoin({
          roomId: join.roomId,
          authUser: socket.data.authUser,
          suppliedUser: join.user,
          inviteToken: join.inviteToken,
          reconnectToken: join.reconnectToken,
        });
        const previousRoomId = socket.data.roomId;
        if (
          previousRoomId === join.roomId &&
          socket.data.userId === identity.userId &&
          socket.rooms.has(join.roomId)
        ) {
          const room = await store.getRoom(join.roomId);
          const role = socket.data.role || identity.role;
          const joinedPayload = {
            roomId: join.roomId,
            role,
            recovered: false,
            reconnectToken: issueReconnectToken({ roomId: join.roomId, userId: identity.userId, role }),
            revision: Number(room?.revision || 0),
            collaborationMode: store.mode,
            instanceId,
            idempotent: true,
          };
          socket.emit(SOCKET_EVENTS.ROOM_JOINED, joinedPayload);
          socket.emit(SOCKET_EVENTS.EDIT_PERMISSION_STATE, await roomAccess(join.roomId));
          socket.emit(SOCKET_EVENTS.CRDT_SYNC, {
            roomId: join.roomId,
            update: room?.crdtState || "",
            files: room?.files || {},
            activeFile: room?.activeFile || "",
            revision: Number(room?.revision || 0),
          });
          if (typeof acknowledge === "function") acknowledge({ ok: true, ...joinedPayload });
          return;
        }
        if (previousRoomId && previousRoomId !== join.roomId) await leaveTrackedRoom(socket, previousRoomId);

        const durableSnapshot = await loadSnapshot(join.roomId);
        const initialRoom = durableSnapshot || initialRoomFromProject(identity.project, join.initialFiles, join.activeFile);
        let room = await store.ensureRoom(join.roomId, initialRoom);
        if (identity.isOrganizer || !room.crdtState) {
          room = await store.mutateRoom(join.roomId, (current) => {
            if (identity.isOrganizer) {
              current.organizer = { socketId: socket.id, username: identity.username, userId: identity.userId };
            }
            if (!current.crdtState) {
              const doc = docFromRoom(current);
              current.crdtState = encodeUpdate(Y.encodeStateAsUpdate(doc));
            }
            return current;
          });
        }

        socket.join(join.roomId);
        socket.data.roomId = join.roomId;
        socket.data.username = identity.username;
        socket.data.userId = identity.userId;
        socket.data.role = identity.role;
        socket.data.recovered = identity.recovered;

        const presence = {
          username: identity.username,
          avatar: identity.avatar,
          userId: identity.userId,
          status: identity.status || "Editing",
          socketId: socket.id,
          role: presenceRole(identity.role),
          permission: identity.role,
          canEdit: identity.role !== "viewer" && (identity.isOrganizer || room.collaboratorsCanEdit !== false),
          instanceId,
        };
        await store.setPresence(join.roomId, socket.id, presence);

        const reconnectToken = issueReconnectToken({ roomId: join.roomId, userId: identity.userId, role: identity.role });
        const joinedPayload = {
          roomId: join.roomId,
          role: identity.role,
          recovered: identity.recovered,
          reconnectToken,
          revision: room.revision,
          collaborationMode: store.mode,
          instanceId,
        };
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, joinedPayload);
        if (typeof acknowledge === "function") acknowledge({ ok: true, ...joinedPayload });
        socket.emit(SOCKET_EVENTS.EDIT_PERMISSION_STATE, await roomAccess(join.roomId));
        socket.emit(SOCKET_EVENTS.SYNC_CODE, { files: room.files, activeFile: room.activeFile });
        socket.emit(SOCKET_EVENTS.CRDT_SYNC, {
          roomId: join.roomId,
          update: room.crdtState,
          files: room.files,
          activeFile: room.activeFile,
          revision: room.revision,
        });
        socket.to(join.roomId).emit(SOCKET_EVENTS.USER_JOINED, presence);
        socket.emit(SOCKET_EVENTS.USER_JOINED, await store.listPresence(join.roomId));
        schedulePersist(room);
        if (identity.recovered) metrics.totalReconnects += 1;
      } catch (error) {
        metrics.recordPermissionDenial();
        const failure = { roomId: join.roomId, message: error?.message || "Unable to join collaboration room." };
        socket.emit(SOCKET_EVENTS.ROOM_JOIN_ERROR, failure);
        if (typeof acknowledge === "function") acknowledge({ ok: false, ...failure });
      }
    });

    socket.on(SOCKET_EVENTS.ROOM_INVITE_CREATE, async ({ roomId, role = "editor" } = {}, acknowledge) => {
      if (!roomId || socket.data.roomId !== roomId || socket.data.role !== "organizer") {
        const result = { ok: false, message: "Only the organizer can create workspace invites." };
        if (typeof acknowledge === "function") acknowledge(result);
        else await emitPermissionDenied(socket, roomId || "", result.message);
        return;
      }
      const room = await store.getRoom(roomId);
      if (room) {
        await persistSnapshot(room);
      }
      const token = issueInviteToken({ roomId, organizerUserId: socket.data.userId, role });
      const result = { ok: true, roomId, role: role === "viewer" ? "viewer" : "editor", token };
      if (typeof acknowledge === "function") acknowledge(result);
    });

    socket.on(SOCKET_EVENTS.CRDT_UPDATE, async (payload = {}, acknowledge) => {
      const startedAt = Date.now();
      const roomId = typeof payload.roomId === "string" ? payload.roomId : "";
      const operationId = typeof payload.operationId === "string" ? payload.operationId : "";
      try {
        if (!roomId || !operationId || !(await canSocketEdit(socket, roomId))) {
          await emitPermissionDenied(socket, roomId);
          if (typeof acknowledge === "function") acknowledge({ ok: false, reason: "permission-denied" });
          return;
        }
        if (!(await store.markOperation(roomId, operationId))) {
          metrics.recordDuplicate();
          const duplicate = { ok: true, duplicate: true, operationId };
          socket.emit(SOCKET_EVENTS.CRDT_ACK, duplicate);
          if (typeof acknowledge === "function") acknowledge(duplicate);
          return;
        }

        const room = await applyCrdtUpdate(roomId, decodeUpdate(payload.update), payload.activeFile);
        const durationMs = Date.now() - startedAt;
        metrics.recordUpdate(durationMs);
        const broadcast = {
          roomId,
          update: payload.update,
          operationId,
          actor: socket.data.username,
          activeFile: room.activeFile,
          revision: room.revision,
          serverAt: Date.now(),
        };
        socket.to(roomId).emit(SOCKET_EVENTS.CRDT_UPDATE, broadcast);
        const ack = { ok: true, operationId, revision: room.revision, durationMs };
        socket.emit(SOCKET_EVENTS.CRDT_ACK, ack);
        if (typeof acknowledge === "function") acknowledge(ack);
        schedulePersist(room);
      } catch (error) {
        metrics.recordError();
        const failure = { ok: false, operationId, reason: error?.message || "CRDT update failed" };
        socket.emit(SOCKET_EVENTS.CRDT_ACK, failure);
        if (typeof acknowledge === "function") acknowledge(failure);
      }
    });

    socket.on(SOCKET_EVENTS.FILES_CHANGE, async ({ roomId, files, activeFile, operationId } = {}) => {
      if (!roomId || !(await canSocketEdit(socket, roomId))) {
        await emitPermissionDenied(socket, roomId || "");
        return;
      }
      const nextFiles = normalizeFiles(files);
      if (!nextFiles) return;
      const safeOperationId = typeof operationId === "string" && operationId ? operationId : crypto.randomUUID();
      if (!(await store.markOperation(roomId, safeOperationId))) {
        metrics.recordDuplicate();
        return;
      }
      const room = await store.mutateRoom(roomId, (current) => {
        const doc = docFromRoom(current);
        synchronizeFiles(doc, nextFiles);
        current.files = materializeDoc(doc);
        current.activeFile = Object.hasOwn(current.files, activeFile) ? activeFile : Object.keys(current.files)[0] || "";
        current.crdtState = encodeUpdate(Y.encodeStateAsUpdate(doc));
        current.revision = Number(current.revision || 0) + 1;
        return current;
      });
      socket.to(roomId).emit(SOCKET_EVENTS.FILES_CHANGE, {
        roomId,
        files: room.files,
        activeFile: room.activeFile,
        revision: room.revision,
      });
      socket.to(roomId).emit(SOCKET_EVENTS.CRDT_SYNC, {
        roomId,
        update: room.crdtState,
        files: room.files,
        activeFile: room.activeFile,
        revision: room.revision,
      });
      schedulePersist(room);
    });

    socket.on(SOCKET_EVENTS.CODE_CHANGE, async ({ roomId, code, fileName } = {}) => {
      if (!roomId || typeof code !== "string" || !fileName || !(await canSocketEdit(socket, roomId))) {
        if (roomId) await emitPermissionDenied(socket, roomId);
        return;
      }
      const room = await store.mutateRoom(roomId, (current) => {
        const doc = docFromRoom(current);
        const fileMap = doc.getMap("files");
        let text = fileMap.get(fileName);
        if (!(text instanceof Y.Text)) {
          text = new Y.Text();
          fileMap.set(fileName, text);
        }
        doc.transact(() => replaceText(text, code), "legacy-code-change");
        current.files = materializeDoc(doc);
        current.crdtState = encodeUpdate(Y.encodeStateAsUpdate(doc));
        current.revision = Number(current.revision || 0) + 1;
        return current;
      });
      socket.to(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, { fileName, code, revision: room.revision });
      socket.to(roomId).emit(SOCKET_EVENTS.CRDT_SYNC, {
        roomId,
        update: room.crdtState,
        files: room.files,
        activeFile: room.activeFile,
        revision: room.revision,
      });
      schedulePersist(room);
    });

    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, async ({ roomId, collaboratorsCanEdit } = {}) => {
      if (!roomId || socket.data.roomId !== roomId || socket.data.role !== "organizer") {
        await emitPermissionDenied(socket, roomId || "", "Only the organizer can change editing access.");
        return;
      }
      const room = await store.mutateRoom(roomId, (current) => {
        current.collaboratorsCanEdit = Boolean(collaboratorsCanEdit);
        current.revision = Number(current.revision || 0) + 1;
        return current;
      });
      io.to(roomId).emit(SOCKET_EVENTS.EDIT_PERMISSION_STATE, await roomAccess(roomId));
      const presence = await store.listPresence(roomId);
      await Promise.all(presence.map((entry) => store.setPresence(roomId, entry.socketId, {
        ...entry,
        canEdit: entry.permission !== "viewer" && (entry.permission === "organizer" || room.collaboratorsCanEdit),
      })));
      await broadcastPresence(roomId);
      schedulePersist(room);
    });

    socket.on(SOCKET_EVENTS.REMOVE_COLLABORATOR, async ({ roomId, username, socketId } = {}) => {
      if (!roomId || socket.data.roomId !== roomId || socket.data.role !== "organizer") {
        await emitPermissionDenied(socket, roomId || "", "Only the organizer can remove collaborators.");
        return;
      }
      const presence = await store.listPresence(roomId);
      const target = presence.find((candidate) => candidate.permission !== "organizer" && (
        (socketId && candidate.socketId === socketId) || (username && candidate.username === username)
      ));
      if (!target) {
        await emitPermissionDenied(socket, roomId, "Collaborator is not active in this workspace.");
        return;
      }
      io.to(target.socketId).emit(SOCKET_EVENTS.COLLABORATOR_REMOVED, {
        roomId,
        username: target.username,
        reason: "Removed by organizer.",
      });
      io.in(target.socketId).socketsLeave(roomId);
      await store.removePresence(roomId, target.socketId);
      io.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, target);
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async (message = {}) => {
      if (!message.roomId || socket.data.roomId !== message.roomId || !socket.rooms.has(message.roomId)) {
        await emitPermissionDenied(socket, message.roomId || "", "You are no longer in this workspace.");
        return;
      }
      io.to(message.roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, message);
    });

    for (const [sourceEvent, targetEvent, fields] of [
      [SOCKET_EVENTS.EXECUTION_START, SOCKET_EVENTS.EXECUTION_START, ["user"]],
      [SOCKET_EVENTS.EXECUTION_RESULT, SOCKET_EVENTS.EXECUTION_RESULT, ["user", "output"]],
      [SOCKET_EVENTS.EXECUTION_ERROR, SOCKET_EVENTS.EXECUTION_ERROR, ["user", "error"]],
    ]) {
      socket.on(sourceEvent, (payload = {}) => {
        if (!payload.roomId || socket.data.roomId !== payload.roomId) return;
        socket.to(payload.roomId).emit(targetEvent, Object.fromEntries(fields.map((field) => [field, payload[field]])));
      });
    }

    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, async ({ roomId, status } = {}) => {
      if (!roomId || socket.data.roomId !== roomId) return;
      const current = (await store.listPresence(roomId)).find((entry) => entry.socketId === socket.id);
      if (!current) return;
      const updated = { ...current, status: typeof status === "string" ? status.slice(0, 160) : "Editing" };
      await store.setPresence(roomId, socket.id, updated);
      socket.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, updated);
    });

    socket.on(SOCKET_EVENTS.CURSOR_MOVE, ({ roomId, position, selection } = {}) => {
      if (!roomId || socket.data.roomId !== roomId || !position) return;
      socket.to(roomId).emit(SOCKET_EVENTS.CURSOR_MOVE, {
        username: socket.data.username,
        userId: socket.data.userId,
        position,
        selection,
      });
    });

    socket.on(SOCKET_EVENTS.REALTIME_PING, async (payload = {}) => {
      if (socket.data.roomId) {
        const current = (await store.listPresence(socket.data.roomId)).find((entry) => entry.socketId === socket.id);
        if (current) await store.setPresence(socket.data.roomId, socket.id, current);
      }
      socket.emit(SOCKET_EVENTS.REALTIME_PONG, {
        sentAt: payload.sentAt,
        serverAt: Date.now(),
        instanceId,
        mode: store.mode,
      });
    });

    socket.on("disconnect", () => {
      metrics.disconnected();
      const roomId = socket.data.roomId;
      if (roomId) {
        const task = leaveTrackedRoom(socket, roomId).catch(() => metrics.recordError());
        pendingDisconnects.add(task);
        void task.finally(() => pendingDisconnects.delete(task));
      }
    });
  });

  return {
    store,
    metrics,
    async drain() {
      await Promise.allSettled([...pendingDisconnects]);
    },
  };
}

module.exports = socketHandler;
module.exports.docFromRoom = docFromRoom;
module.exports.materializeDoc = materializeDoc;
module.exports.replaceText = replaceText;
module.exports.synchronizeFiles = synchronizeFiles;
