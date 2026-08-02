const assert = require("node:assert/strict");
const test = require("node:test");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { executeSealedWorkspace } = require("../src/services/evidence-runtime.service");

const execFileAsync = promisify(execFile);
const enabled = process.env.RUN_PRODUCTION_EVIDENCE_DOCKER_TESTS === "true";
const dockerTest = enabled ? test : test.skip;

dockerTest("production evidence replay is proven inside the hardened Docker path", { timeout: 120_000 }, async () => {
  const image = process.env.EVIDENCE_DOCKER_TEST_IMAGE || "node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32";
  process.env.NODE_ENV = "production";
  process.env.EVIDENCE_REPLAY_ENGINE = "docker";
  process.env.EVIDENCE_NODE_RUNNER_IMAGE = image;
  process.env.EVIDENCE_ALLOWED_IMAGES = image;
  const source = `const fs = require("node:fs");
const net = require("node:net");
(async () => {
  let readOnly = false;
  try { fs.writeFileSync("/workspace/escape.txt", "blocked"); } catch { readOnly = true; }
  const networkBlocked = await new Promise((resolve) => {
    const socket = net.createConnection({ host: "1.1.1.1", port: 53 });
    const finish = (value) => { socket.destroy(); resolve(value); };
    socket.once("connect", () => finish(false));
    socket.once("error", () => finish(true));
    socket.setTimeout(750, () => finish(true));
  });
  const result = { uid: process.getuid?.(), readOnly, networkBlocked };
  console.log("EVIDENCE_DOCKER_RESULT:" + JSON.stringify(result));
  if (result.uid !== 65534 || !readOnly || !networkBlocked) process.exitCode = 9;
})();`;
  const execution = await executeSealedWorkspace({
    files: { "sandbox-check.js": source },
    command: "node sandbox-check.js",
    language: "javascript",
    engine: "docker",
    containerImage: image,
    timeoutMs: 20_000,
  });
  assert.equal(execution.exitCode, 0, execution.output);
  assert.equal(execution.engine, "docker");
  assert.equal(execution.image, image);
  assert.deepEqual(execution.sandbox, { network: "none", filesystem: "read-only", capabilities: "dropped", resourceLimits: true });
  const marker = execution.output.split(/\r?\n/).find((line) => line.startsWith("EVIDENCE_DOCKER_RESULT:"));
  assert.deepEqual(JSON.parse(marker.slice("EVIDENCE_DOCKER_RESULT:".length)), { uid: 65534, readOnly: true, networkBlocked: true });

  const failed = await executeSealedWorkspace({
    files: { "failure.js": "console.error('sealed failure'); process.exit(7);" },
    command: "node failure.js",
    language: "javascript",
    engine: "docker",
    containerImage: image,
  });
  assert.equal(failed.exitCode, 7);
  assert.match(failed.output, /sealed failure/);
  const timedOut = await executeSealedWorkspace({
    files: { "timeout.js": "setTimeout(() => console.log('too late'), 5000);" },
    command: "node timeout.js",
    language: "javascript",
    engine: "docker",
    containerImage: image,
    timeoutMs: 1000,
  });
  assert.equal(timedOut.timedOut, true);
  assert.equal(timedOut.exitCode, 124);
  assert.match(timedOut.launchError, /timeout/i);
  const { stdout } = await execFileAsync("docker", ["volume", "ls", "--filter", "label=codeverse.evidence=sealed-workspace", "--format", "{{.Name}}"]);
  assert.equal(stdout.trim(), "", "sealed Docker volumes must be removed after execution");
});
