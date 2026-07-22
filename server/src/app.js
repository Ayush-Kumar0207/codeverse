const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

require("./config/env");
require("./config/passport");
const { sessionSecret } = require("./config/secrets");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projects.routes");
const codeRoutes = require("./routes/code.routes");
const aiRoutes = require("./routes/ai.routes");
const executeRoutes = require("./routes/execute.routes");
const versionRoutes = require("./routes/versions.routes");
const deploymentRoutes = require("./routes/deployment.routes");
const settingsRoutes = require("./routes/settings.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  "https://codeverse-rho.vercel.app",
  "https://codeverse-q1qyjuzgj-ayush-kumar0207s-projects.vercel.app",
].filter(Boolean);
const deploymentsDir = path.join(__dirname, "../../deployments");

function isAllowedOrigin(origin) {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === "codeverse-rho.vercel.app" || hostname.endsWith("-ayush-kumar0207s-projects.vercel.app");
  } catch {
    return false;
  }
}

function createApp() {
  const app = express();
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error("❌ Not allowed by CORS: " + origin));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(
    session({
      name: "codeverse.sid",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    "/deployments",
    express.static(deploymentsDir, {
      extensions: ["html"],
      index: "index.html",
    })
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/code", codeRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/execute", executeRoutes);
  app.use("/api/versions", versionRoutes);
  app.use("/api/deploy", deploymentRoutes);
  app.use("/api/settings", settingsRoutes);

  app.get("/", (req, res) => {
    res.send("✅ CodeVerse Backend Running!");
  });

  app.get("/api/health", (req, res) => {
    const memory = process.memoryUsage();
    res.json({
      status: "ok",
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      memory: {
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
        rssMb: Math.round(memory.rss / 1024 / 1024),
      },
      load: osLoadAverage(),
    });
  });

  app.use(errorMiddleware);

  return app;
}

function osLoadAverage() {
  try {
    return require("os").loadavg()[0];
  } catch {
    return 0;
  }
}

module.exports = createApp;
module.exports.isAllowedOrigin = isAllowedOrigin;

