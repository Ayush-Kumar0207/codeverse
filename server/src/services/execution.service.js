const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("../utils/httpError");
const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");
const { SUPPORTED_LANGUAGES } = require("../../../shared/constants/languages");

const filenameMap = {
  python: "main.py",
  cpp: "main.cpp",
  c: "main.c",
  java: "Main.java",
  javascript: "main.js",
};

const dockerImageMap = {
  python: "python:3.10-slim",
  cpp: "gcc:latest",
  c: "gcc:latest",
  java: "openjdk:17",
  javascript: "node:18-alpine",
};

const runCommandMap = {
  python: (fileName) => `python /code/${fileName}`,
  cpp: (fileName) => `bash -c "g++ /code/${fileName} -o /code/a.out && /code/a.out"`,
  c: (fileName) => `bash -c "gcc /code/${fileName} -o /code/a.out && /code/a.out"`,
  java: () => `bash -c "cd /code && javac Main.java && java Main"`,
  javascript: (fileName) => `node /code/${fileName}`,
};

async function executeCode({ code, language, roomId, user }) {
  if (!code || !language) {
    throw new HttpError(400, "Code and language are required");
  }

  if (!roomId) {
    throw new HttpError(400, "roomId is required");
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new HttpError(400, `Unsupported language: ${language}`);
  }

  const jobId = uuidv4();
  const tempDir = path.join(__dirname, "..", "..", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const fileName = language === "java" ? "Main.java" : `${jobId}-${filenameMap[language]}`;
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, code);

  const image = dockerImageMap[language];
  const command = runCommandMap[language](fileName);
  const dockerCmd = `docker run --rm --privileged -m 128m --cpus=".5" --pids-limit=64 -v "${tempDir.replace(/\\/g, "/")}:/code" ${image} ${command}`;

  const io = global._io;
  if (io) {
    io.to(roomId).emit(SOCKET_EVENTS.EXECUTION_START, { user });
  }

  return new Promise((resolve, reject) => {
    exec(dockerCmd, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        return reject(new HttpError(500, stderr || err.message));
      }
      resolve({ output: stdout });
    });
  });
}

module.exports = {
  executeCode,
};

