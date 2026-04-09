const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");

const codeRooms = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      console.log(`👥 ${socket.id} joined room ${roomId}`);

      if (codeRooms[roomId]) {
        socket.emit(SOCKET_EVENTS.SYNC_CODE, codeRooms[roomId]);
      }
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg) => {
      io.to(msg.roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, msg);
    });

    socket.on(SOCKET_EVENTS.CODE_CHANGE, ({ roomId, code }) => {
      codeRooms[roomId] = code;
      socket.to(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, code);
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

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;

