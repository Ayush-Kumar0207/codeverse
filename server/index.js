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

dotenv.config(); // Load environment variables

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",                          // for local dev
  "https://codeverse-rho.vercel.app",               // your deployed frontend
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "super_secret_key",
  resave: false,
  saveUninitialized: false,
}));

// ✅ AI Route
const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);

// ✅ Execute Route
const executeRoute = require("./routes/execute");
app.use("/api/execute", executeRoute);

// ✅ Passport middleware
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/code", codeRoutes);
const testRoutes = require("./routes/test");
app.use("/api/test", testRoutes);
const versionRoutes = require('./routes/versions');
app.use('/api/versions', versionRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ CodeVerse Backend Running!");
});

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  }
});
global._io = io;
app.set("io", io);
socketHandler(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});