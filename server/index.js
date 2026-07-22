require("./src/config/env");
const http = require("http");
const { Server } = require("socket.io");
const createApp = require("./src/app");
const socketHandler = require("./src/sockets");
const { connectDB } = require("./src/config/db");

connectDB();

const app = createApp();
const server = http.createServer(app);

const socketAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  "https://codeverse-rho.vercel.app",
].filter(Boolean);

function isAllowedSocketOrigin(origin) {
  if (!origin) return true;
  if (socketAllowedOrigins.includes(origin)) return true;

  try {
    const hostname = new URL(origin).hostname;
    return hostname === "codeverse-rho.vercel.app" || hostname.endsWith("-ayush-kumar0207s-projects.vercel.app");
  } catch {
    return false;
  }
}

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (isAllowedSocketOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket origin not allowed: " + origin));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global._io = io;
app.set("io", io);
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`⚠️ CodeVerse backend is already running on port ${PORT}. Keep one server process open at a time.`);
    process.exit(0);
  }

  throw error;
});

server.listen(PORT, () => {
  console.log(`🚀 Primary Core running on http://localhost:${PORT}`);
});

// Aegis Deployment Engine - Secondary Listener
const express = require("express");
const path = require("path");
const { DEPLOY_DIR } = require("./src/services/deployment.service");
const { slugifyProjectId } = require("./src/utils/slug");
const {
  isDeploymentTunnelEnabled,
  startDeploymentTunnel,
} = require("./src/services/deploymentTunnel.service");
const deployApp = express();
const DEPLOY_PORT = process.env.DEPLOY_PORT || 5001;

// Allow CORS for the deployment server
deployApp.use(require("cors")());

// Dynamic static serving for all projects
deployApp.use('/:projectId', (req, res, next) => {
  const projectId = slugifyProjectId(req.params.projectId);
  const projectPath = path.join(DEPLOY_DIR, projectId);
  express.static(projectPath, { extensions: ["html"], index: "index.html" })(req, res, next);
});

const deployServer = deployApp.listen(DEPLOY_PORT, () => {
  console.log(`📡 Aegis Deployment Bridge active on port ${DEPLOY_PORT}`);

  if (isDeploymentTunnelEnabled()) {
    startDeploymentTunnel({ port: DEPLOY_PORT })
      .then((tunnel) => {
        if (tunnel?.url) {
          console.log(`🌐 Public deployment tunnel active at ${tunnel.url}`);
        }
      })
      .catch((error) => {
        console.error("🌐 Failed to start deployment tunnel:", error.message || error);
      });
  }
});

deployServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`⚠️ Deployment bridge is already running on port ${DEPLOY_PORT}.`);
    return;
  }

  throw error;
});
