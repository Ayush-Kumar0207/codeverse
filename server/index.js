// index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const { Server } = require("socket.io");

const socketHandler = require("./sockets");
const connectDB = require("./config/db");
const codeRoutes = require("./routes/code");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const aiRoutes = require("./routes/ai");
const executeRoute = require("./routes/execute");
const testRoutes = require("./routes/test");
const versionRoutes = require("./routes/versions");

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Allow multiple frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://codeverse-rho.vercel.app", // your main frontend domain
  "https://codeverse-q1qyjuzgj-ayush-kumar0207s-projects.vercel.app", // preview deployment
];

// ✅ CORS Middleware with dynamic origin validation
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "super_secret_key",
  resave: false,
  saveUninitialized: false,
}));

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/execute", executeRoute);
app.use("/api/test", testRoutes);
app.use("/api/versions", versionRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ CodeVerse Backend Running!");
});

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Socket.IO CORS blocked: " + origin));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global._io = io;
app.set("io", io);
socketHandler(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
