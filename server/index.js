const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const createApp = require("./src/app");
const socketHandler = require("./src/sockets");
const { connectDB } = require("./src/config/db");

dotenv.config();

connectDB();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://codeverse-rho.vercel.app", "https://codeverse-q1qyjuzgj-ayush-kumar0207s-projects.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global._io = io;
app.set("io", io);
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
