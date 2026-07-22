const axios = require("axios");
const { execFile } = require("child_process");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const HttpError = require("../utils/httpError");
const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");
const { getPistonRuntime } = require("../utils/languageRuntime");

const EXECUTION_TIMEOUT_MS = 10000;
const MAX_CODE_BYTES = 100 * 1024;
const MAX_OUTPUT_BYTES = 256 * 1024;
const VISUAL_LANGUAGES = new Set(["html", "css", "markdown"]);

function assertExecutionInput({ code, language, roomId }) {
  if (typeof code !== "string" || !language || !roomId) {
    throw new HttpError(400, "Code, language, and roomId are required");
  }
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    throw new HttpError(413, "Code exceeds the 100 KB execution limit.");
  }
}

function isSpawnPermissionError(error) {
  const message = `${error?.message || ""} ${error?.code || ""}`;
  return error?.code === "EPERM" || /spawn(?:Sync)?\s+\S*\s*EPERM/i.test(message);
}

function localRuntimeBlockedMessage(command) {
  return [
    "Local execution could not start.",
    "",
    `Reason: the backend process is not allowed to launch '${command}' (spawn EPERM).`,
    "",
    "This is a runtime permission problem, not a problem in your solution code.",
    "Use the remote execution service or start a development backend with process-launch permission.",
  ].join("\n");
}

function runFile(command, args, options = {}) {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      {
        maxBuffer: MAX_OUTPUT_BYTES,
        timeout: EXECUTION_TIMEOUT_MS,
        windowsHide: true,
        ...options,
      },
      (error, stdout, stderr) => resolve({ error, stdout, stderr })
    );
  });
}

function formatCompileFailure(result, label, command) {
  if (isSpawnPermissionError(result.error)) {
    return {
      output: localRuntimeBlockedMessage(command),
      type: "terminal",
      stats: { strategy: "local-compiled", command, phase: "compile", blocked: true },
    };
  }
  return {
    output: `❌ ${label} compilation failed:\n${result.stderr || result.stdout || result.error?.message || "Unknown compiler error"}`,
    type: "terminal",
    stats: { strategy: "local-compiled", command, phase: "compile" },
  };
}

function formatExecResult(result, start, stats) {
  const duration = `${Date.now() - start}ms`;
  if (result.error?.killed) {
    return { output: "🛑 Execution timed out (10s limit)", type: "terminal", stats: { ...stats, duration } };
  }
  if (result.error) {
    const output = isSpawnPermissionError(result.error)
      ? localRuntimeBlockedMessage(stats.command)
      : result.stderr || result.stdout || result.error.message || "Unknown runtime error";
    return { output: `❌ Execution failed:\n${output}`, type: "terminal", stats: { ...stats, duration, phase: "run" } };
  }
  return {
    output: result.stdout || result.stderr || "✅ Execution completed with no output",
    type: "terminal",
    stats: { ...stats, duration },
  };
}

async function executeLocal(code, language) {
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_LOCAL_EXECUTION !== "true") {
    throw new HttpError(503, "Local execution is disabled. Configure the remote execution service.");
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "codeverse-run-"));
  const start = Date.now();

  try {
    if (language === "javascript") {
      const sourcePath = path.join(workDir, "main.js");
      await fs.writeFile(sourcePath, code, { encoding: "utf8", flag: "wx" });
      return formatExecResult(await runFile("node", [sourcePath], { cwd: workDir }), start, {
        strategy: "local-isolated-process",
        command: "node",
      });
    }

    if (language === "python") {
      const sourcePath = path.join(workDir, "main.py");
      await fs.writeFile(sourcePath, code, { encoding: "utf8", flag: "wx" });
      return formatExecResult(await runFile("python", [sourcePath], { cwd: workDir }), start, {
        strategy: "local-isolated-process",
        command: "python",
      });
    }

    if (language === "c" || language === "cpp") {
      const cpp = language === "cpp";
      const sourcePath = path.join(workDir, cpp ? "main.cpp" : "main.c");
      const outPath = path.join(workDir, process.platform === "win32" ? "main.exe" : "main");
      const compiler = cpp ? "g++" : "gcc";
      await fs.writeFile(sourcePath, code, { encoding: "utf8", flag: "wx" });
      const compileArgs = cpp
        ? [sourcePath, "-std=c++17", "-O2", "-Wall", "-o", outPath]
        : [sourcePath, "-O2", "-Wall", "-o", outPath];
      const compile = await runFile(compiler, compileArgs, { cwd: workDir });
      if (compile.error) return formatCompileFailure(compile, cpp ? "C++" : "C", compiler);
      return formatExecResult(await runFile(outPath, [], { cwd: workDir }), start, {
        strategy: "local-isolated-process",
        command: compiler,
      });
    }

    if (language === "java") {
      const sourcePath = path.join(workDir, "Main.java");
      await fs.writeFile(sourcePath, code, { encoding: "utf8", flag: "wx" });
      const compile = await runFile("javac", [sourcePath], { cwd: workDir });
      if (compile.error) return formatCompileFailure(compile, "Java", "javac");
      return formatExecResult(await runFile("java", ["-cp", workDir, "Main"], { cwd: workDir }), start, {
        strategy: "local-isolated-process",
        command: "java",
      });
    }

    throw new HttpError(400, `Local execution for '${language}' is not supported.`);
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

async function executeRemote(code, runtime) {
  const pistonUrl = process.env.PISTON_URL || "https://emkc.org/api/v2/piston/execute";
  const payload = {
    language: runtime.language,
    version: runtime.version,
    files: [{ name: "main", content: code }],
  };

  try {
    const response = await axios.post(pistonUrl, payload, {
      timeout: 15000,
      maxContentLength: MAX_OUTPUT_BYTES,
      headers: {
        "Content-Type": "application/json",
        ...(process.env.PISTON_API_KEY ? { "X-Api-Key": process.env.PISTON_API_KEY } : {}),
      },
    });
    const run = response?.data?.run || {};
    const output = String(run.stdout || run.stderr || "✅ No output").slice(0, MAX_OUTPUT_BYTES);
    return { output, type: "terminal", stats: { strategy: "remote" } };
  } catch (error) {
    const upstreamMessage = error?.response?.data?.message || error.message || "Execution failed.";
    throw new HttpError(502, `Execution service error: ${upstreamMessage}`);
  }
}

async function executeCode(request) {
  assertExecutionInput(request);
  const { code, language, roomId, user } = request;
  global._io?.to(roomId).emit(SOCKET_EVENTS.EXECUTION_START, { user });

  if (VISUAL_LANGUAGES.has(language)) {
    return { output: code, type: "visual", stats: { strategy: "visual-render", language } };
  }

  const strategy = process.env.EXECUTION_STRATEGY || "remote";
  if (strategy === "local") return executeLocal(code, language);
  if (strategy !== "remote") throw new HttpError(500, "Invalid execution strategy configuration.");

  const runtime = getPistonRuntime(language);
  if (!runtime) throw new HttpError(400, `Remote execution for '${language}' is not supported.`);
  return executeRemote(code, runtime);
}

module.exports = { executeCode };
