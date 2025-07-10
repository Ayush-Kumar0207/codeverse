// index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const { Server } = require("socket.io");

const socketHandler = require("./sockets");
const connectDB = require("./config/db"); // MongoDB connection
const codeRoutes = require("./routes/code");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

dotenv.config(); // Load .env

// Connect to DB
connectDB();

// Initialize app/server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // React frontend
  credentials: true,
}));
app.use(express.json());

// ✅ Setup express-session BEFORE passport
app.use(session({
  secret: process.env.SESSION_SECRET || "super_secret_key", // use env var in prod
  resave: false,
  saveUninitialized: false,
}));

const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);

const executeRoute = require("./routes/execute");
app.use("/api/execute", executeRoute);

// ✅ Passport middleware
require("./config/passport"); // Make sure this configures GitHub strategy
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api/code", codeRoutes);

const testRoutes = require("./routes/test");
app.use("/api/test", testRoutes);


// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ CodeVerse Backend Running!");
});

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // ✅ matches frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});
  
global._io = io; // 👈 Make io globally accessible
app.set("io", io);          // ✅ Attach io to app
socketHandler(io);          // ✅ Setup socket events

const versionRoutes = require('./routes/versions');
// console.log("✅ versionRoutes loaded:", typeof versionRoutes); // 🧪 Debug
app.use('/api/versions', versionRoutes); // ❌ CRASHES if versionRoutes is not a function

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
