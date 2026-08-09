require("./config/env");

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const { Server } = require("socket.io");
const createApp = require("./app");
const socketHandler = require("./sockets");
const authenticateSocket = require("./collaboration/socketAuth");
const { createCollaborationInfrastructure } = require("./collaboration/infrastructure");
const { connectDB } = require("./config/db");
const { DEPLOY_DIR } = require("./services/deployment.service");
const { slugifyProjectId } = require("./utils/slug");
const { isDeploymentTunnelEnabled, startDeploymentTunnel } = require("./services/deploymentTunnel.service");

const PORT = Number(process.env.PORT || 5000);
const DEPLOY_PORT = Number(process.env.DEPLOY_PORT || 5001);

function createSocketServer(httpServer) {
  return new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (createApp.isAllowedOrigin(origin)) callback(null, true);
        else callback(new Error(`Socket origin not allowed: ${origin}`));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    maxHttpBufferSize: 4_000_000,
    connectionStateRecovery: {
      maxDisconnectionDuration: Number(process.env.COLLABORATION_RECOVERY_WINDOW_MS || 120_000),
      skipMiddlewares: false,
    },
  });
}

function createDeploymentServer() {
  const deployApp = express();
  deployApp.use(cors());
  deployApp.use("/:projectId", (req, res, next) => {
    const projectId = slugifyProjectId(req.params.projectId);
    const projectPath = path.join(DEPLOY_DIR, projectId);
    express.static(projectPath, { extensions: ["html"], index: "index.html" })(req, res, next);
  });
  return deployApp;
}

async function start() {
  await connectDB();
  const app = createApp();
  const httpServer = http.createServer(app);
  const io = createSocketServer(httpServer);
  io.use(authenticateSocket);

  const collaboration = await createCollaborationInfrastructure(io);
  app.set("collaboration", collaboration);
  global._io = io;
  app.set("io", io);
  const realtime = socketHandler(io, collaboration);

  httpServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`CodeVerse backend is already running on port ${PORT}.`);
      return;
    }
    throw error;
  });

  await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(`CodeVerse API and realtime core running on http://localhost:${PORT} (${collaboration.mode})`);

  const deployServer = createDeploymentServer().listen(DEPLOY_PORT, async () => {
    console.log(`Aegis deployment bridge active on port ${DEPLOY_PORT}`);
    if (!isDeploymentTunnelEnabled()) return;
    try {
      const tunnel = await startDeploymentTunnel({ port: DEPLOY_PORT });
      if (tunnel?.url) console.log(`Public deployment tunnel active at ${tunnel.url}`);
    } catch (error) {
      console.error("Failed to start deployment tunnel:", error.message || error);
    }
  });

  deployServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Deployment bridge is already running on port ${DEPLOY_PORT}.`);
      return;
    }
    throw error;
  });

  const close = async () => {
    await io.close();
    await realtime.drain();
    await collaboration.close();
    if (httpServer.listening) {
      await new Promise((resolve) => httpServer.close(resolve));
    }
    if (deployServer.listening) {
      await new Promise((resolve) => deployServer.close(resolve));
    }
  };

  return { app, io, httpServer, deployServer, collaboration, close };
}

module.exports = { createSocketServer, start };
