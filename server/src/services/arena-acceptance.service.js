const { executeSealedWorkspace } = require("./evidence-runtime.service");

const BUILT_IN_TESTS = {
  "prod-outage": [{
    id: "service-recovers-with-sealed-runtime-config",
    fileName: "service.js",
    code: `const assert = require("node:assert/strict");
delete process.env.PORT;
const service = require("../service.js");
Promise.resolve(service()).then((value) => {
  assert.ok(Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 65535, "service must recover with a safe port when configuration is absent");
  console.log("outage acceptance passed");
});`,
  }],
  "memory-leak": [{
    id: "retained-state-is-bounded",
    fileName: "cache.js",
    code: `const assert = require("node:assert/strict");
const cache = require("../cache.js");
let size = 0;
for (let index = 0; index < 5000; index += 1) size = cache.remember({ index });
assert.ok(Number(size) <= 1000, "retained state must be bounded");
console.log("memory acceptance passed");`,
  }],
  "concurrency-race": [{
    id: "concurrent-withdrawal-preserves-invariant",
    fileName: "ledger.js",
    code: `const assert = require("node:assert/strict");
const ledger = require("../ledger.js");
Promise.allSettled([ledger.withdraw(60), ledger.withdraw(60)]).then((results) => {
  const fulfilled = results.filter((item) => item.status === "fulfilled");
  const values = fulfilled.map((item) => Number(item.value));
  assert.equal(fulfilled.length, 1, "exactly one withdrawal may commit against a balance of 100");
  assert.deepEqual(values, [40]);
  assert.equal(results.filter((item) => item.status === "rejected").length, 1);
  console.log("concurrency acceptance passed");
});`,
  }],
  "dependency-compromise": [{
    id: "compromised-dependency-is-unreachable",
    fileName: "package.json",
    code: `const assert = require("node:assert/strict");
const fs = require("node:fs");
const manifest = JSON.parse(fs.readFileSync("../package.json", "utf8"));
const all = { ...(manifest.dependencies || {}), ...(manifest.devDependencies || {}) };
assert.equal(Object.hasOwn(all, "analytics-helper"), false, "compromised dependency must be removed");
assert.equal(typeof manifest.scripts?.postinstall === "string" && /analytics-helper/.test(manifest.scripts.postinstall), false);
console.log("dependency acceptance passed");`,
  }],
  "database-recovery": [{
    id: "migration-is-transactional-and-scoped",
    fileName: "migration.sql",
    code: `const assert = require("node:assert/strict");
const fs = require("node:fs");
const sql = fs.readFileSync("../migration.sql", "utf8");
assert.match(sql, /BEGIN|START TRANSACTION/i, "migration must be transactional");
assert.match(sql, /WHERE/i, "recovery mutation must be scoped");
assert.doesNotMatch(sql, /SET\\s+balance\\s*=\\s*balance\\s*\\*\\s*-1\\s*;?\\s*$/im);
console.log("database acceptance passed");`,
  }],
  "malicious-ai-patch": [{
    id: "anonymous-caller-is-never-admin",
    fileName: "auth.js",
    code: `const assert = require("node:assert/strict");
const auth = require("../auth.js");
let value;
try { value = auth.authorize({ headers: {} }); } catch { value = false; }
assert.notEqual(value, "admin");
assert.notEqual(value, true);
console.log("authentication acceptance passed");`,
  }],
  "api-latency": [{
    id: "owner-fetch-is-not-n-plus-one",
    fileName: "catalog.js",
    code: `const assert = require("node:assert/strict");
const catalog = require("../catalog.js");
let ownerCalls = 0;
const rows = Array.from({ length: 25 }, (_, id) => ({ id }));
const db = {
  all: async () => rows,
  owner: async (id) => { ownerCalls += 1; return { id }; },
  owners: async (ids) => Object.fromEntries(ids.map((id) => [id, { id }])),
};
Promise.resolve(catalog.list(db)).then((value) => {
  assert.equal(value.length, rows.length);
  assert.ok(ownerCalls <= 1, "owner lookup must be batched");
  console.log("latency acceptance passed");
});`,
  }],
  "vulnerable-api": [{
    id: "query-is-parameterized",
    fileName: "route.js",
    code: `const assert = require("node:assert/strict");
const route = require("../route.js");
let captured = [];
const db = { query: (...args) => { captured = args; return []; } };
route.load(db, { query: { id: "1 OR 1=1" } });
assert.ok(captured.length >= 2 || /[$?][0-9]?/.test(String(captured[0])), "query must use parameters");
assert.doesNotMatch(String(captured[0]), /1 OR 1=1/);
console.log("API acceptance passed");`,
  }],
};

function testsFor(scenario) {
  if (BUILT_IN_TESTS[scenario.id]) return BUILT_IN_TESTS[scenario.id];
  return Array.isArray(scenario.acceptanceTests) ? scenario.acceptanceTests : [];
}
async function evaluateArenaSubmission(scenario, submittedFiles) {
  const tests = testsFor(scenario);
  if (!tests.length) throw new Error("Arena scenario has no hidden executable acceptance tests");
  const results = [];
  for (const test of tests.slice(0, 12)) {
    const hiddenName = ".evidence/" + String(test.id || "acceptance").replace(/[^a-z0-9_-]/gi, "-") + ".cjs";
    const execution = await executeSealedWorkspace({
      files: { ...submittedFiles, [hiddenName]: String(test.code || "") },
      command: "node " + hiddenName,
      language: "javascript",
      engine: process.env.ARENA_EXECUTION_ENGINE,
      containerImage: process.env.ARENA_RUNNER_IMAGE,
      timeoutMs: Math.max(1000, Math.min(30_000, Number(test.timeoutMs || 10_000))),
    });
    results.push({
      id: String(test.id || hiddenName),
      passed: execution.exitCode === 0 && !execution.timedOut && !execution.launchError,
      exitCode: execution.exitCode,
      outputDigest: execution.outputDigest,
      durationMs: execution.durationMs,
      engine: execution.engine,
      image: execution.image,
      sandbox: execution.sandbox,
    });
  }
  const passed = results.filter((item) => item.passed).length;
  return {
    passed,
    total: results.length,
    score: Math.round((passed / Math.max(1, results.length)) * 100),
    verified: passed === results.length,
    results,
  };
}
module.exports = { evaluateArenaSubmission };
