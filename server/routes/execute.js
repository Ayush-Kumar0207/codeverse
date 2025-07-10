// server/routes/execute.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language, roomId, user } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  const jobId = uuidv4();
  const tempDir = path.join(__dirname, "..", "temp");

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filenameMap = {
    python: "main.py",
    cpp: "main.cpp",
    c: "main.c",
    java: "Main.java",
    javascript: "main.js",
  };

  let fileName, filePath;

  if (language === "java") {
    fileName = "Main.java"; // Must be exactly this
    filePath = path.join(tempDir, fileName);
  } else {
    fileName = `${jobId}-${filenameMap[language]}`;
    filePath = path.join(tempDir, fileName);
  }

  if (language === "javascript") {
    const filename = "Main.js";
    fs.writeFileSync(filename, code);

    exec(`node ${filename}`, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) return res.status(200).json({ output: stderr || error.message });
      return res.status(200).json({ output: stdout });
    });
  }

  try {
    fs.writeFileSync(filePath, code);
  } catch (err) {
    console.error("❌ Failed to write code file:", err);
    return res.status(500).json({ error: "Failed to write code file." });
  }

  const dockerImageMap = {
    python: "python:3.10-slim",
    cpp: "gcc:latest",
    c: "gcc:latest",
    java: "openjdk:17",
    javascript: "node:18-alpine",
  };

  const runCommandMap = {
    python: `python /code/${fileName}`,
    cpp: `bash -c "g++ /code/${fileName} -o /code/a.out && /code/a.out"`,
    c: `bash -c "gcc /code/${fileName} -o /code/a.out && /code/a.out"`,
    java: `bash -c "cd /code && javac Main.java && java Main"`,
    javascript: `node /code/${fileName}`,
  };

  const image = dockerImageMap[language];
  const command = runCommandMap[language];

  const dockerCmd = `docker run --rm --privileged -m 128m --cpus=".5" \
  --pids-limit=64 \
  -v "${tempDir.replace(/\\/g, "/")}:/code" ${image} ${command}`;

  const io = global._io;

  io.to(roomId).emit("execution:start", { user });

  console.log("🚀 Running Docker Command:", dockerCmd);

  try {
    exec(dockerCmd, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ JavaScript execution error:", err.message, stderr);
        return res.status(500).json({ output: stderr || err.message });
      }
      return res.json({ output: stdout });
    });
  } catch (execError) {
    console.error("Docker Exec Failed:", execError.message);
    return res.status(500).json({ error: "Internal server error during execution." });
  }

});

module.exports = router;