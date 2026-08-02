const { execFile } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { createHash } = require("crypto");

const MAX_FILES = 80;
const MAX_FILE_BYTES = 200 * 1024;
const MAX_OUTPUT_BYTES = 512 * 1024;
const DEFAULT_TIMEOUT_MS = 15_000;
const PROCESS_COMMANDS = new Set(["node", "python", "python3"]);

function digest(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function cleanRelativePath(fileName) {
  const normalized = path.posix.normalize(String(fileName || "").replace(/\\/g, "/"));
  if (!normalized || normalized === "." || normalized.startsWith("../") || normalized.startsWith("/") || /^[a-z]:/i.test(normalized)) {
    throw new Error("Workspace contains an unsafe file path");
  }
  return normalized;
}

function validateFiles(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Workspace files are required");
  const entries = Object.entries(value);
  if (!entries.length || entries.length > MAX_FILES) throw new Error("Workspace file count is outside the execution limit");
  return Object.fromEntries(entries.map(([name, content]) => {
    if (typeof content !== "string" || Buffer.byteLength(content, "utf8") > MAX_FILE_BYTES) {
      throw new Error("Workspace file exceeds the execution limit");
    }
    return [cleanRelativePath(name), content];
  }));
}

function tokenize(command) {
  const input = String(command || "").trim();
  if (!input) throw new Error("A sealed replay command is required");
  if (/[\r\n;&|<>\x60$]/.test(input)) throw new Error("Replay command contains shell control syntax");
  const tokens = [];
  let token = "";
  let quote = "";
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quote) {
      if (character === quote) quote = "";
      else token += character;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (/\s/.test(character)) {
      if (token) {
        tokens.push(token);
        token = "";
      }
      continue;
    }
    token += character;
  }
  if (quote) throw new Error("Replay command contains an unterminated quote");
  if (token) tokens.push(token);
  return tokens;
}

function runtimeCommand(command, files, language) {
  const tokens = tokenize(command);
  if (tokens[0] !== "run") return tokens;
  const fileName = cleanRelativePath(tokens[1] || Object.keys(files)[0]);
  const extension = path.extname(fileName).toLowerCase();
  if (language === "python" || extension === ".py") return ["python", fileName];
  if ([".js", ".cjs", ".mjs"].includes(extension)) return ["node", fileName];
  throw new Error("The recorded run command has no supported deterministic runtime");
}

function runFile(command, args, options) {
  return new Promise((resolve) => {
    execFile(command, args, {
      cwd: options.cwd,
      env: options.env,
      windowsHide: true,
      timeout: options.timeoutMs,
      maxBuffer: MAX_OUTPUT_BYTES,
    }, (error, stdout, stderr) => {
      const numericCode = Number(error?.code);
      resolve({
        exitCode: error ? (Number.isFinite(numericCode) ? numericCode : 1) : 0,
        stdout: String(stdout || ""),
        stderr: String(stderr || ""),
        timedOut: Boolean(error?.killed),
        launchError: error && !Number.isFinite(numericCode) ? String(error.message || error) : "",
      });
    });
  });
}

async function materialize(files) {
  const root = path.resolve(process.env.EVIDENCE_WORKSPACE_ROOT || os.tmpdir());
  await fs.mkdir(root, { recursive: true });
  const directory = await fs.mkdtemp(path.join(root, "codeverse-evidence-"));
  for (const [fileName, content] of Object.entries(files)) {
    const target = path.join(directory, ...fileName.split("/"));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, { encoding: "utf8", flag: "wx" });
  }
  return directory;
}

function safeEnvironment(keys, supplied = {}) {
  const allowed = {};
  for (const key of Array.isArray(keys) ? keys : []) {
    if (!/^[A-Z_][A-Z0-9_]{0,79}$/.test(key)) continue;
    if (Object.hasOwn(supplied, key)) allowed[key] = String(supplied[key]);
    else if (Object.hasOwn(process.env, key)) allowed[key] = String(process.env[key]);
  }
  return {
    PATH: process.env.PATH || "",
    SystemRoot: process.env.SystemRoot || "",
    TEMP: process.env.TEMP || os.tmpdir(),
    TMP: process.env.TMP || os.tmpdir(),
    NODE_ENV: "test",
    ...allowed,
  };
}

async function executeWithProcess(directory, tokens, options) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Production evidence execution requires the Docker sandbox");
  }
  const executable = tokens[0] === "node" ? process.execPath : tokens[0];
  if (!PROCESS_COMMANDS.has(tokens[0])) throw new Error("Replay process runtime is not allow-listed");
  const result = await runFile(executable, tokens.slice(1), {
    cwd: directory,
    timeoutMs: options.timeoutMs,
    env: safeEnvironment(options.environmentKeys, options.environment),
  });
  return { ...result, engine: "isolated-process", image: null };
}

function configuredImage(tokens, requested) {
  const image = String(requested || (["python", "python3"].includes(tokens[0])
    ? process.env.EVIDENCE_PYTHON_RUNNER_IMAGE
    : process.env.EVIDENCE_NODE_RUNNER_IMAGE) || "").trim();
  if (!image || !/^[a-z0-9][a-z0-9./:@_-]{2,240}$/i.test(image)) {
    throw new Error("A configured container image is required for Docker execution");
  }
  if (process.env.NODE_ENV === "production" && !/@sha256:[0-9a-f]{64}$/i.test(image)) {
    throw new Error("Production evidence images must be pinned by SHA-256 digest");
  }
  const allowList = new Set([
    ...(process.env.EVIDENCE_ALLOWED_IMAGES || "").split(","),
    process.env.EVIDENCE_NODE_RUNNER_IMAGE,
    process.env.EVIDENCE_PYTHON_RUNNER_IMAGE,
    process.env.ARENA_RUNNER_IMAGE,
    process.env.UNDERSTANDING_RUNNER_IMAGE,
  ].map((item) => String(item || "").trim()).filter(Boolean));
  if (process.env.NODE_ENV === "production" && !allowList.has(image)) {
    throw new Error("Container image is not in the production evidence allow-list");
  }
  return image;
}
function dockerClientEnvironment() {
  const environment = safeEnvironment([], {});
  for (const key of ["DOCKER_HOST", "DOCKER_TLS_VERIFY", "DOCKER_CERT_PATH", "DOCKER_CONTEXT"]) {
    if (process.env[key]) environment[key] = process.env[key];
  }
  return environment;
}

async function dockerCommand(args, timeoutMs, cwd) {
  return runFile("docker", args, { cwd, timeoutMs, env: dockerClientEnvironment() });
}

async function executeWithDocker(directory, tokens, options) {
  const image = configuredImage(tokens, options.containerImage);
  const volumeName = "codeverse-evidence-" + digest(directory + ":" + Date.now()).slice(0, 24);
  let seedContainer = "";
  let executionContainer = "";
  try {
    const volume = await dockerCommand(["volume", "create", "--label", "codeverse.evidence=sealed-workspace", volumeName], 10_000, directory);
    if (volume.exitCode !== 0 || volume.launchError) {
      return { ...volume, engine: "docker", image, launchError: volume.launchError || volume.stderr || "Docker could not create the sealed workspace volume" };
    }
    const seed = await dockerCommand([
      "create", "--network", "none", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
      "--read-only", "--pids-limit", "16", "--memory", "64m", "--cpus", "0.25",
      "--tmpfs", "/tmp:rw,noexec,nosuid,size=8m",
      "--mount", "type=volume,source=" + volumeName + ",target=/workspace",
      image, "/bin/sh", "-c", "while :; do sleep 3600; done",
    ], 30_000, directory);
    seedContainer = seed.stdout.trim();
    if (seed.exitCode !== 0 || seed.launchError || !/^[a-f0-9]{12,64}$/i.test(seedContainer)) {
      return { ...seed, engine: "docker", image, launchError: seed.launchError || seed.stderr || "Docker could not create the sealed workspace loader" };
    }
    const seedStarted = await dockerCommand(["start", seedContainer], 10_000, directory);
    if (seedStarted.exitCode !== 0 || seedStarted.launchError) {
      return { ...seedStarted, engine: "docker", image, launchError: seedStarted.launchError || seedStarted.stderr || "Docker could not start the sealed workspace loader" };
    }
    const copied = await dockerCommand(["cp", directory + path.sep + ".", seedContainer + ":/workspace"], Math.min(options.timeoutMs, 30_000), directory);
    if (copied.exitCode !== 0 || copied.launchError) {
      return { ...copied, engine: "docker", image, launchError: copied.launchError || copied.stderr || "Docker could not copy the sealed workspace" };
    }
    await dockerCommand(["rm", "--force", seedContainer], 10_000, directory);
    seedContainer = "";
    const args = [
      "create", "--network", "none", "--read-only",
      "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
      "--pids-limit", "64", "--memory", "256m", "--cpus", "1",
      "--user", "65534:65534", "--tmpfs", "/tmp:rw,noexec,nosuid,size=32m",
      "--mount", "type=volume,source=" + volumeName + ",target=/workspace,readonly",
      "--workdir", "/workspace",
    ];
    for (const [key, value] of Object.entries(safeEnvironment(options.environmentKeys, options.environment))) {
      if (["PATH", "SystemRoot", "TEMP", "TMP"].includes(key)) continue;
      args.push("--env", key + "=" + value);
    }
    args.push(image, ...tokens);
    const created = await dockerCommand(args, Math.min(options.timeoutMs, 30_000), directory);
    executionContainer = created.stdout.trim();
    if (created.exitCode !== 0 || created.launchError || !/^[a-f0-9]{12,64}$/i.test(executionContainer)) {
      return { ...created, engine: "docker", image, launchError: created.launchError || created.stderr || "Docker could not create the evidence container" };
    }
    const started = await dockerCommand(["start", "--attach", executionContainer], options.timeoutMs, directory);
    const inspected = await dockerCommand(["inspect", "--format", "{{.State.ExitCode}}", executionContainer], 10_000, directory);
    const exitCode = Number(inspected.stdout.trim());
    return {
      ...started,
      exitCode: Number.isFinite(exitCode) ? exitCode : started.exitCode,
      engine: "docker",
      image,
      launchError: started.launchError || (inspected.exitCode !== 0 ? inspected.stderr || "Docker could not inspect evidence exit status" : ""),
    };
  } finally {
    if (executionContainer) await dockerCommand(["rm", "--force", executionContainer], 10_000, directory).catch(() => undefined);
    if (seedContainer) await dockerCommand(["rm", "--force", seedContainer], 10_000, directory).catch(() => undefined);
    await dockerCommand(["volume", "rm", "--force", volumeName], 10_000, directory).catch(() => undefined);
  }
}
async function executeSealedWorkspace(input) {
  const files = validateFiles(input.files);
  const tokens = runtimeCommand(input.command, files, input.language);
  const timeoutMs = Math.max(1000, Math.min(60_000, Number(input.timeoutMs || DEFAULT_TIMEOUT_MS)));
  const engine = input.engine || process.env.EVIDENCE_REPLAY_ENGINE || (process.env.NODE_ENV === "production" ? "docker" : "process");
  const directory = await materialize(files);
  const startedAt = Date.now();
  try {
    const options = {
      timeoutMs,
      containerImage: input.containerImage,
      environmentKeys: input.environmentKeys,
      environment: input.environment,
    };
    const execution = engine === "docker"
      ? await executeWithDocker(directory, tokens, options)
      : engine === "process"
        ? await executeWithProcess(directory, tokens, options)
        : (() => { throw new Error("Unsupported evidence execution engine"); })();
    const output = execution.stdout + execution.stderr;
    return {
      ...execution,
      command: tokens.join(" "),
      output,
      outputDigest: digest(output),
      durationMs: Date.now() - startedAt,
      sandbox: execution.engine === "docker"
        ? { network: "none", filesystem: "read-only", capabilities: "dropped", resourceLimits: true }
        : { network: "inherited", filesystem: "temporary-workspace", capabilities: "process-user", resourceLimits: true },
    };
  } finally {
    await fs.rm(directory, { recursive: true, force: true }).catch(() => undefined);
  }
}

module.exports = {
  executeSealedWorkspace,
  runtimeCommand,
  validateFiles,
};
