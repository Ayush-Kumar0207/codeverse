// server/sockets/index.js

const codeRooms = {}; // In-memory store for room code

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join Room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`👥 ${socket.id} joined room ${roomId}`);

      // Send last synced code if available
      if (codeRooms[roomId]) {
        socket.emit("syncCode", codeRooms[roomId]);
      }
    });

    // Collaborative Code Change
    socket.on("codeChange", ({ roomId, code }) => {
      codeRooms[roomId] = code;
      socket.to(roomId).emit("codeChange", code);
    });

    // ✅ Collaborative Execution Events
    socket.on("execution:start", ({ roomId, user }) => {
      socket.to(roomId).emit("execution:start", { user });
    });

    socket.on("execution:result", ({ roomId, user, output }) => {
      socket.to(roomId).emit("execution:result", { user, output });
    });

    socket.on("execution:error", ({ roomId, user, error }) => {
      socket.to(roomId).emit("execution:error", { user, error });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
