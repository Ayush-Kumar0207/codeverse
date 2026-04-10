const axios = require("axios");
const { exec, execSync } = require("child_process");
const HttpError = require("../utils/httpError");
const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");
const { SUPPORTED_LANGUAGES } = require("../../../shared/constants/languages");
const { getPistonRuntime } = require("../utils/languageRuntime");

/**
 * Probes the system PATH to see if a command exists for a given language.
 */
function probeSystem(command) {
  try {
    const checkCmd = process.platform === "win32" ? `where ${command}` : `which ${command}`;
    execSync(checkCmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Adaptive Local Executor
 * Intelligently determines how to run a file based on its extension or content.
 */
async function executeLocal(code, language, fileName = "") {
  return new Promise((resolve, reject) => {
    let command = "";
    let type = "terminal";

    // 1. Check for Visual Content (HTML, Style, Markdown)
    const visualLangs = ["html", "css", "markdown"];
    if (visualLangs.includes(language) || fileName.endsWith(".html") || fileName.endsWith(".md")) {
      return resolve({ 
        output: code, 
        type: "visual", 
        stats: { strategy: "visual-render", language } 
      });
    }

    // 2. Map Standard Languages to Commands
    const CMD_MAP = {
      javascript: "node",
      python: "python",
      cpp: "g++",
      c: "gcc",
      java: "java",
      go: "go",
      rust: "rustc"
    };

    let bin = CMD_MAP[language] || language;

    // 3. Command Probing (Adaptive Discovery)
    if (!probeSystem(bin)) {
       // If standard command fails, try to infer from extension
       const ext = fileName.split('.').pop();
       if (ext && CMD_MAP[ext] && probeSystem(CMD_MAP[ext])) {
          bin = CMD_MAP[ext];
       } else {
          return reject(new HttpError(400, `No local runtime found for '${language}'. Please install the necessary compiler/interpreter or switch to 'remote' strategy.`));
       }
    }

    // 4. Build Execution Command
    if (bin === "node") {
      const escapedCode = code.replace(/`/g, "\\`").replace(/\$/g, "\\$");
      command = `node -e "${escapedCode}"`;
    } else if (bin === "python") {
      const escapedCode = code.replace(/"/g, '\\"');
      command = `python -c "${escapedCode}"`;
    } else {
      // For compiled languages, we'd ideally use temporary files
      // For now, providing a professional placeholder/warning
      return reject(new HttpError(400, `Direct shell execution for ${language} requires temporary file buffers. This high-fidelity feature is being synchronized.`));
    }

    const start = Date.now();
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      const duration = Date.now() - start;
      if (error && error.killed) return resolve({ output: "🛑 Execution Timed Out (10s limit)" });
      
      const output = stdout || stderr || "✅ Execution completed with no output";
      resolve({ 
        output, 
        type,
        stats: { duration: `${duration}ms`, strategy: "local-adaptive", command: bin } 
      });
    });
  });
}

/**
 * Executes code remotely via Piston API.
 */
async function executeRemote(code, language, runtime) {
  const PISTON_URL = process.env.PISTON_URL || "https://emkc.org/api/v2/piston/execute";
  const payload = {
    language: runtime.language,
    version: runtime.version,
    files: [{ name: "main", content: code }],
  };

  try {
    const response = await axios.post(PISTON_URL, payload, {
      timeout: 15000,
      headers: { 
        "Content-Type": "application/json",
        ...(process.env.PISTON_API_KEY && { "X-Api-Key": process.env.PISTON_API_KEY })
      },
    });

    const run = response?.data?.run || {};
    const output = run.stdout || run.stderr || "✅ No output";
    return { output, type: "terminal", stats: { strategy: "remote" } };
  } catch (error) {
    const upstreamMessage = error?.response?.data?.message || error.message || "Execution failed.";
    throw new HttpError(502, `Execution service error: ${upstreamMessage}`);
  }
}

async function executeCode({ code, language, roomId, user, fileName }) {
  if (!code || !language || !roomId) {
    throw new HttpError(400, "Code, language, and roomId are required");
  }

  const io = global._io;
  if (io) {
    io.to(roomId).emit(SOCKET_EVENTS.EXECUTION_START, { user });
  }

  const strategy = process.env.EXECUTION_STRATEGY || "local";

  if (strategy === "local" || ["html", "css", "markdown"].includes(language)) {
    return await executeLocal(code, language, fileName);
  } else {
    const runtime = getPistonRuntime(language);
    if (!runtime) {
      // Fallback to local adaptive if no remote mapping exists
      return await executeLocal(code, language, fileName);
    }
    return await executeRemote(code, language, runtime);
  }
}

module.exports = {
  executeCode,
};

