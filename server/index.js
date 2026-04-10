require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const createApp = require("./src/app");
const socketHandler = require("./src/sockets");
const { connectDB } = require("./src/config/db");

connectDB();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://codeverse-rho.vercel.app", "https://codeverse-q1qyjuzgj-ayush-kumar0207s-projects.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global._io = io;
app.set("io", io);
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Primary Core running on http://localhost:${PORT}`);
});

// Aegis Deployment Engine - Secondary Listener
const express = require("express");
const path = require("path");
const deployApp = express();
const DEPLOY_PORT = process.env.DEPLOY_PORT || 5001;

// Allow CORS for the deployment server
deployApp.use(require("cors")());

// Dynamic static serving for all projects
deployApp.use('/:projectId', (req, res, next) => {
  const projectId = req.params.projectId;
  const projectPath = path.join(__dirname, 'deployments', projectId);
  express.static(projectPath)(req, res, next);
});

deployApp.listen(DEPLOY_PORT, () => {
  console.log(`📡 Aegis Deployment Bridge active on port ${DEPLOY_PORT}`);
});
