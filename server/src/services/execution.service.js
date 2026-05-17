const axios = require("axios");
const { execSync, execFile } = require("child_process");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const vm = require("vm");
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

function isSpawnPermissionError(error) {
  const message = `${error?.message || ""} ${error?.code || ""}`;
  return error?.code === "EPERM" || /spawn(?:Sync)?\s+\S*\s*EPERM/i.test(message);
}

function stringifyConsoleValue(value) {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack || value.message;

  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
}

function localRuntimeBlockedMessage(command) {
  return [
    "Local execution could not start.",
    "",
    `Reason: the backend process is not allowed to launch '${command}' (spawn EPERM).`,
    "",
    "This is a runtime permission problem, not a problem in your solution code.",
    "Start the backend from a normal terminal with process-launch permission, or configure EXECUTION_STRATEGY=remote with a reachable execution service.",
  ].join("\n");
}

async function executeJavaScriptInProcess(code) {
  const start = Date.now();
  const output = [];
  const consoleSink = (...values) => {
    output.push(values.map(stringifyConsoleValue).join(" "));
    return undefined;
  };
  const sandbox = {
    console: {
      log: consoleSink,
      info: consoleSink,
      warn: consoleSink,
      error: consoleSink,
    },
  };

  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;

  try {
    const result = vm.runInNewContext(code, sandbox, {
      timeout: 10000,
      displayErrors: true,
    });

    if (result !== undefined) {
      output.push(stringifyConsoleValue(result));
    }

    return {
      output: output.join("\n") || "✅ Execution completed with no output",
      type: "terminal",
      stats: { strategy: "local-js-vm", command: "vm", duration: `${Date.now() - start}ms` },
    };
  } catch (error) {
    return {
      output: `❌ Execution failed:\n${error.stack || error.message || String(error)}`,
      type: "terminal",
      stats: { strategy: "local-js-vm", command: "vm", phase: "run", duration: `${Date.now() - start}ms` },
    };
  }
}

/**
 * Adaptive Local Executor
 * Intelligently determines how to run a file based on its extension or content.
 */
async function executeLocal(code, language, fileName = "") {
  let type = "terminal";

  // 1. Check for Visual Content (HTML, Style, Markdown)
  const visualLangs = ["html", "css", "markdown"];
  if (visualLangs.includes(language) || fileName.endsWith(".html") || fileName.endsWith(".md")) {
    return {
      output: code,
      type: "visual",
      stats: { strategy: "visual-render", language },
    };
  }

  // 2. Map Standard Languages to Commands
  const CMD_MAP = {
    javascript: "node",
    python: "python",
    cpp: "g++",
    c: "gcc",
    java: "java",
    go: "go",
    rust: "rustc",
  };

  let bin = CMD_MAP[language] || language;

  // 3. Command Probing (Adaptive Discovery)
  if (!probeSystem(bin)) {
    const ext = fileName.split(".").pop();
    if (ext && CMD_MAP[ext] && probeSystem(CMD_MAP[ext])) {
      bin = CMD_MAP[ext];
    } else {
      throw new HttpError(
        400,
        `No local runtime found for '${language}'. Install the compiler/interpreter or switch EXECUTION_STRATEGY to remote.`
      );
    }
  }

  const start = Date.now();
  const run = (cmd, args, options = {}) =>
    new Promise((resolve) => {
      let settled = false;
      const finish = (payload) => {
        if (settled) return;
        settled = true;
        resolve(payload);
      };

      try {
        const child = execFile(
          cmd,
          args,
          { timeout: 10000, windowsHide: true, ...options },
          (error, stdout, stderr) => {
            finish({ error, stdout, stderr });
          }
        );

        child.once("error", (error) => {
          finish({ error, stdout: "", stderr: "" });
        });
      } catch (error) {
        finish({ error, stdout: "", stderr: "" });
      }
    });

  let workDir = null;

  try {
    if (bin === "node") {
      return await executeJavaScriptInProcess(code);
    }

    if (bin === "python") {
      const result = await run("python", ["-c", code]);
      return formatExecResult(result, start, type, { strategy: "local-adaptive", command: "python" });
    }

    workDir = await fs.mkdtemp(path.join(os.tmpdir(), "codeverse-run-"));

    if (language === "c" || bin === "gcc") {
      const sourcePath = path.join(workDir, "main.c");
      const outPath = path.join(workDir, process.platform === "win32" ? "main.exe" : "main");
      await fs.writeFile(sourcePath, code);
      const compile = await run("gcc", [sourcePath, "-O2", "-Wall", "-o", outPath], { cwd: workDir });
      if (compile.error) return formatCompileFailure(compile, "C", "gcc");
      const result = await run(outPath, [], { cwd: workDir });
      return formatExecResult(result, start, type, { strategy: "local-compiled", command: "gcc" });
    }

    if (language === "cpp" || bin === "g++") {
      const sourcePath = path.join(workDir, "main.cpp");
      const outPath = path.join(workDir, process.platform === "win32" ? "main.exe" : "main");
      await fs.writeFile(sourcePath, code);
      const compile = await run("g++", [sourcePath, "-std=c++17", "-O2", "-Wall", "-o", outPath], { cwd: workDir });
      if (compile.error) return formatCompileFailure(compile, "C++", "g++");
      const result = await run(outPath, [], { cwd: workDir });
      return formatExecResult(result, start, type, { strategy: "local-compiled", command: "g++" });
    }

    if (language === "java" || bin === "java") {
      const sourcePath = path.join(workDir, "Main.java");
      await fs.writeFile(sourcePath, code);
      const compile = await run("javac", [sourcePath], { cwd: workDir });
      if (compile.error) return formatCompileFailure(compile, "Java", "javac");
      const result = await run("java", ["-cp", workDir, "Main"], { cwd: workDir });
      return formatExecResult(result, start, type, { strategy: "local-compiled", command: "javac/java" });
    }

    throw new HttpError(400, `Local execution for '${language}' is not configured yet.`);
  } finally {
    if (workDir) {
      fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

function formatCompileFailure(result, label, command = label) {
  if (isSpawnPermissionError(result.error)) {
    return {
      output: localRuntimeBlockedMessage(command),
      type: "terminal",
      stats: { strategy: "local-compiled", command, phase: "compile", blocked: true },
    };
  }

  return {
    output: `❌ ${label} compilation failed:\n${result.stderr || result.stdout || result.error.message}`,
    type: "terminal",
    stats: { strategy: "local-compiled", phase: "compile" },
  };
}

function formatExecResult(result, start, type, stats) {
  const duration = Date.now() - start;
  if (result.error && result.error.killed) {
    return { output: "🛑 Execution timed out (10s limit)", type, stats: { ...stats, duration: `${duration}ms` } };
  }

  if (result.error) {
    if (isSpawnPermissionError(result.error)) {
      return {
        output: localRuntimeBlockedMessage(stats.command || "runtime"),
        type,
        stats: { ...stats, duration: `${duration}ms`, phase: "spawn", blocked: true },
      };
    }

    return {
      output: `❌ Execution failed:\n${result.stderr || result.stdout || result.error.message || "Unknown runtime error"}`,
      type,
      stats: { ...stats, duration: `${duration}ms`, phase: "run" },
    };
  }

  const output = result.stdout || result.stderr || "✅ Execution completed with no output";
  return {
    output,
    type,
    stats: { ...stats, duration: `${duration}ms` },
  };
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

