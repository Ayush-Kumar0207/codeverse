require("./src/config/env");

const { start } = require("./src/start");

start().catch((error) => {
  console.error("CodeVerse startup failed:", error);
  process.exitCode = 1;
});
