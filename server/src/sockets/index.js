const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");

const roomFiles = {};
const roomUsers = {};
const roomAccess = {};

function normalizeUser(user) {
  if (!user || typeof user !== "object") return null;

  return {
    username: typeof user.username === "string" ? user.username.trim() : "",
    avatar: typeof user.avatar === "string" ? user.avatar : undefined,
    status: typeof user.status === "string" ? user.status : "Editing",
    userId: typeof user.userId === "string" ? user.userId : "",
    isOrganizer: Boolean(user.isOrganizer),
    organizerKnown: Boolean(user.organizerKnown),
  };
}

function normalizeJoinPayload(payload) {
  if (typeof payload === "string") {
    return { roomId: payload, user: null };
  }

  if (!payload || typeof payload !== "object") {
    return { roomId: "", user: null };
  }

  return {
    roomId: typeof payload.roomId === "string" ? payload.roomId : "",
    user: normalizeUser(payload.user),
  };
}

function serializeRoomUsers(roomId) {
  return Object.values(roomUsers[roomId] || {});
}

function getRoomAccess(roomId) {
  if (!roomAccess[roomId]) {
    roomAccess[roomId] = {
      collaboratorsCanEdit: true,
      organizer: null,
    };
  }

  return roomAccess[roomId];
}

function serializeAccessState(roomId) {
  const access = getRoomAccess(roomId);

  return {
    roomId,
    collaboratorsCanEdit: access.collaboratorsCanEdit,
    organizerUsername: access.organizer?.username || "",
    organizerUserId: access.organizer?.userId || "",
  };
}

function isOrganizerSocket(socket, roomId) {
  const organizer = getRoomAccess(roomId).organizer;
  if (!organizer) return false;

  return (
    organizer.socketId === socket.id ||
    (organizer.userId && organizer.userId === socket.data.userId) ||
    (organizer.username && organizer.username === socket.data.username)
  );
}

function canSocketEdit(socket, roomId) {
  const access = getRoomAccess(roomId);
  if (!access.organizer) return true;
  return access.collaboratorsCanEdit || isOrganizerSocket(socket, roomId);
}

function normalizeFiles(files) {
  if (!files || typeof files !== "object" || Array.isArray(files)) return null;

  return Object.fromEntries(
    Object.entries(files).filter(
      ([fileName, content]) => typeof fileName === "string" && typeof content === "string"
    )
  );
}

function emitPermissionDenied(socket, roomId, reason = "Editing is currently organizer-only.") {
  socket.emit(SOCKET_EVENTS.EDIT_PERMISSION_DENIED, {
    roomId,
    reason,
    state: serializeAccessState(roomId),
    files: roomFiles[roomId] || null,
  });
}

function maybeAssignOrganizer(roomId, socket, user) {
  const access = getRoomAccess(roomId);
  if (!user?.username) return;

  const shouldClaimOrganizer = user.isOrganizer || (!access.organizer && !user.organizerKnown);
  const isCurrentOrganizer =
    access.organizer &&
    ((user.userId && user.userId === access.organizer.userId) ||
      (user.username && user.username === access.organizer.username));

  if (shouldClaimOrganizer || isCurrentOrganizer) {
    access.organizer = {
      socketId: socket.id,
      username: user.username,
      userId: user.userId,
    };
  }
}

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload) => {
      const { roomId, user } = normalizeJoinPayload(payload);
      if (!roomId) return;

      socket.join(roomId);
      socket.data.roomId = roomId;
      console.log(`👥 ${socket.id} joined room ${roomId}`);

      if (user?.username) {
        maybeAssignOrganizer(roomId, socket, user);
        socket.data.username = user.username;
        socket.data.userId = user.userId;

        const room = roomUsers[roomId] || {};
        const presence = {
          username: user.username,
          avatar: user.avatar,
          status: user.status || "Editing",
          socketId: socket.id,
          role: isOrganizerSocket(socket, roomId) ? "organizer" : "collaborator",
          canEdit: canSocketEdit(socket, roomId),
        };

        room[socket.id] = presence;
        roomUsers[roomId] = room;
        socket.emit(SOCKET_EVENTS.USER_JOINED, serializeRoomUsers(roomId));
        socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, presence);
      }

      socket.emit(SOCKET_EVENTS.EDIT_PERMISSION_STATE, serializeAccessState(roomId));

      if (roomFiles[roomId]) {
        socket.emit(SOCKET_EVENTS.SYNC_CODE, { files: roomFiles[roomId] });
      }
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg) => {
      io.to(msg.roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, msg);
    });

    socket.on(SOCKET_EVENTS.CODE_CHANGE, ({ roomId, code, fileName }) => {
      if (!roomId || typeof code !== "string") return;
      if (!canSocketEdit(socket, roomId)) {
        emitPermissionDenied(socket, roomId);
        return;
      }

      if (fileName) {
        roomFiles[roomId] = {
          ...(roomFiles[roomId] || {}),
          [fileName]: code,
        };
        socket.to(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, { fileName, code });
        return;
      }

      roomFiles[roomId] = {
        ...(roomFiles[roomId] || {}),
        __active__: code,
      };
      socket.to(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, code);
    });

    socket.on(SOCKET_EVENTS.FILES_CHANGE, ({ roomId, files, activeFile }) => {
      if (!roomId) return;
      if (!canSocketEdit(socket, roomId)) {
        emitPermissionDenied(socket, roomId);
        return;
      }

      const nextFiles = normalizeFiles(files);
      if (!nextFiles) return;

      roomFiles[roomId] = nextFiles;
      socket.to(roomId).emit(SOCKET_EVENTS.FILES_CHANGE, {
        roomId,
        files: nextFiles,
        activeFile: typeof activeFile === "string" ? activeFile : undefined,
      });
    });

    socket.on(SOCKET_EVENTS.EDIT_PERMISSION_UPDATE, ({ roomId, collaboratorsCanEdit }) => {
      if (!roomId) return;

      if (!isOrganizerSocket(socket, roomId)) {
        emitPermissionDenied(socket, roomId, "Only the organizer can change editing access.");
        return;
      }

      getRoomAccess(roomId).collaboratorsCanEdit = Boolean(collaboratorsCanEdit);
      io.to(roomId).emit(SOCKET_EVENTS.EDIT_PERMISSION_STATE, serializeAccessState(roomId));
    });

    socket.on(SOCKET_EVENTS.EXECUTION_START, ({ roomId, user }) => {
      socket.to(roomId).emit(SOCKET_EVENTS.EXECUTION_START, { user });
    });

    socket.on(SOCKET_EVENTS.EXECUTION_RESULT, ({ roomId, user, output }) => {
      socket.to(roomId).emit(SOCKET_EVENTS.EXECUTION_RESULT, { user, output });
    });

    socket.on(SOCKET_EVENTS.EXECUTION_ERROR, ({ roomId, user, error }) => {
      socket.to(roomId).emit(SOCKET_EVENTS.EXECUTION_ERROR, { user, error });
    });
    
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, ({ roomId, username, status }) => {
      if (roomId && roomUsers[roomId]?.[socket.id]) {
        roomUsers[roomId][socket.id] = {
          ...roomUsers[roomId][socket.id],
          username,
          status,
          canEdit: canSocketEdit(socket, roomId),
        };
      }
      socket.to(roomId).emit(SOCKET_EVENTS.PRESENCE_UPDATE, { username, status });
    });

    socket.on(SOCKET_EVENTS.CURSOR_MOVE, ({ roomId, username, position }) => {
      if (!roomId || !username || !position) return;
      socket.to(roomId).emit(SOCKET_EVENTS.CURSOR_MOVE, { username, position });
    });

    socket.on(SOCKET_EVENTS.REALTIME_PING, (payload = {}) => {
      socket.emit(SOCKET_EVENTS.REALTIME_PONG, {
        sentAt: payload.sentAt,
        serverAt: Date.now(),
      });
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (roomId && roomUsers[roomId]?.[socket.id]) {
        const user = roomUsers[roomId][socket.id];
        delete roomUsers[roomId][socket.id];
        socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, user);
        if (Object.keys(roomUsers[roomId]).length === 0) {
          delete roomUsers[roomId];
          delete roomAccess[roomId];
        }
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;

