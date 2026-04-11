const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projects.routes");
const codeRoutes = require("./routes/code.routes");
const aiRoutes = require("./routes/ai.routes");
const executeRoutes = require("./routes/execute.routes");
const versionRoutes = require("./routes/versions.routes");
const deploymentRoutes = require("./routes/deployment.routes");
const testRoutes = require("./routes/test.routes");
const settingsRoutes = require("./routes/settings.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://codeverse-rho.vercel.app",
  "https://codeverse-q1qyjuzgj-ayush-kumar0207s-projects.vercel.app",
];

function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
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
      secret: process.env.SESSION_SECRET || "super_secret_key",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/code", codeRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/execute", executeRoutes);
  app.use("/api/versions", versionRoutes);
  app.use("/api/deploy", deploymentRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api/settings", settingsRoutes);

  app.get("/", (req, res) => {
    res.send("✅ CodeVerse Backend Running!");
  });

  app.use(errorMiddleware);

  return app;
}

module.exports = createApp;

