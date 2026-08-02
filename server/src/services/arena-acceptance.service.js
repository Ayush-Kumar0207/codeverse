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

const ADVERSARIAL_TESTS = {
  "prod-outage": [
    { id: "configured-port-is-preserved", code: `const assert=require("node:assert/strict");process.env.PORT="4321";const service=require("../service.js");Promise.resolve(service()).then(value=>{assert.equal(Number(value),4321);console.log("configured port passed")});`, weight: 1 },
    { id: "invalid-port-cannot-escape-range", code: `const assert=require("node:assert/strict");process.env.PORT="99999";const service=require("../service.js");Promise.resolve(service()).then(value=>{assert.ok(Number(value)>0&&Number(value)<=65535);console.log("invalid port passed")});`, weight: 1 },
  ],
  "memory-leak": [
    { id: "retention-remains-bounded-under-burst", code: `const assert=require("node:assert/strict");const cache=require("../cache.js");let size=0;for(let i=0;i<25000;i++)size=cache.remember({i,payload:"x".repeat(64)});assert.ok(Number(size)<=1000);console.log("burst retention passed")`, weight: 2, trials: 2 },
    { id: "retention-bound-is-stable-across-phases", code: `const assert=require("node:assert/strict");const cache=require("../cache.js");for(let phase=0;phase<5;phase++){let size=0;for(let i=0;i<1500;i++)size=cache.remember({phase,i});assert.ok(Number(size)<=1000)}console.log("phased retention passed")`, weight: 1 },
  ],
  "concurrency-race": [
    { id: "mixed-concurrent-withdrawal-is-serializable", code: `const assert=require("node:assert/strict");const ledger=require("../ledger.js");Promise.allSettled([ledger.withdraw(80),ledger.withdraw(30)]).then(results=>{const ok=results.filter(x=>x.status==="fulfilled");assert.equal(ok.length,1);assert.ok([20,70].includes(Number(ok[0].value)));assert.equal(results.filter(x=>x.status==="rejected").length,1);console.log("mixed race passed")});`, weight: 2, trials: 3 },
    { id: "four-way-withdrawal-never-overdraws", code: `const assert=require("node:assert/strict");const ledger=require("../ledger.js");Promise.allSettled([30,30,30,30].map(value=>ledger.withdraw(value))).then(results=>{const values=results.filter(x=>x.status==="fulfilled").map(x=>Number(x.value)).sort((a,b)=>b-a);assert.deepEqual(values,[70,40,10]);assert.equal(results.filter(x=>x.status==="rejected").length,1);console.log("four way race passed")});`, weight: 2, trials: 3 },
  ],
  "dependency-compromise": [
    { id: "install-hooks-cannot-reintroduce-compromise", code: `const assert=require("node:assert/strict"),fs=require("node:fs");const p=JSON.parse(fs.readFileSync("../package.json","utf8"));for(const [name,value] of Object.entries(p.scripts||{}))assert.doesNotMatch(name+":"+value,/analytics-helper|curl|wget|nc\s/i);console.log("install hooks passed")`, weight: 2 },
    { id: "lockfile-cannot-retain-compromised-package", code: `const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");for(const name of ["package-lock.json","npm-shrinkwrap.json","yarn.lock","pnpm-lock.yaml"]){const target=path.join("..",name);if(fs.existsSync(target))assert.doesNotMatch(fs.readFileSync(target,"utf8"),/analytics-helper/i)}console.log("lockfile passed")`, weight: 1 },
  ],
  "database-recovery": [
    { id: "migration-defines-explicit-rollback", code: `const assert=require("node:assert/strict"),fs=require("node:fs");const sql=fs.readFileSync("../migration.sql","utf8");assert.match(sql,/ROLLBACK|COMMIT/i);assert.match(sql,/BEGIN|START TRANSACTION/i);console.log("rollback boundary passed")`, weight: 1 },
    { id: "destructive-statements-are-scoped", code: `const assert=require("node:assert/strict"),fs=require("node:fs");const sql=fs.readFileSync("../migration.sql","utf8");for(const statement of sql.split(";").filter(x=>/\b(?:UPDATE|DELETE)\b/i.test(x)))assert.match(statement,/\bWHERE\b/i);console.log("scoped statements passed")`, weight: 2 },
  ],
  "malicious-ai-patch": [
    { id: "null-request-fails-closed", code: `const assert=require("node:assert/strict"),auth=require("../auth.js");let value=false;try{value=auth.authorize(null)}catch{}assert.notEqual(value,true);assert.notEqual(value,"admin");console.log("null auth passed")`, weight: 1 },
    { id: "forged-header-cannot-grant-admin", code: `const assert=require("node:assert/strict"),auth=require("../auth.js");let value=false;try{value=auth.authorize({headers:{"x-user":"admin"}})}catch{}assert.notEqual(value,true);assert.notEqual(value,"admin");console.log("forged header passed")`, weight: 2 },
  ],
  "api-latency": [
    { id: "batch-owner-fetch-receives-complete-keyset", code: `const assert=require("node:assert/strict"),catalog=require("../catalog.js");const rows=Array.from({length:40},(_,id)=>({id}));let batches=[];const db={all:async()=>rows,owner:async()=>{throw Error("N+1")},owners:async ids=>{batches.push(ids);return Object.fromEntries(ids.map(id=>[id,{id}]))}};Promise.resolve(catalog.list(db)).then(value=>{assert.equal(value.length,40);assert.equal(batches.length,1);assert.equal(new Set(batches[0]).size,40);console.log("batch keys passed")});`, weight: 2, trials: 2 },
    { id: "large-catalog-remains-constant-query-count", code: `const assert=require("node:assert/strict"),catalog=require("../catalog.js");let calls=0;const rows=Array.from({length:200},(_,id)=>({id}));const db={all:async()=>rows,owner:async()=>{calls++;return{}},owners:async ids=>Object.fromEntries(ids.map(id=>[id,{id}]))};Promise.resolve(catalog.list(db)).then(()=>{assert.ok(calls<=1);console.log("large catalog passed")});`, weight: 2, trials: 3 },
  ],
  "vulnerable-api": [
    { id: "normal-identifier-remains-compatible", code: `const assert=require("node:assert/strict"),route=require("../route.js");let captured=[];route.load({query:(...args)=>{captured=args;return[]}}, {query:{id:"42"}});assert.ok(captured.length>=2||/[$?][0-9]?/.test(String(captured[0])));assert.ok(captured.slice(1).flat(Infinity).map(String).includes("42"));console.log("normal identifier passed")`, weight: 1 },
    { id: "missing-identifier-does-not-broaden-query", code: `const assert=require("node:assert/strict"),route=require("../route.js");let sql="";try{route.load({query:(...args)=>{sql=String(args[0]);return[]}}, {query:{}})}catch{}assert.doesNotMatch(sql,/WHERE\s+id\s*=\s*(?:undefined|null)?\s*$/i);console.log("missing identifier passed")`, weight: 1 },
  ],
};
function testsFor(scenario) {
  if (BUILT_IN_TESTS[scenario.id]) return [...BUILT_IN_TESTS[scenario.id], ...(ADVERSARIAL_TESTS[scenario.id] || [])];
  return Array.isArray(scenario.acceptanceTests) ? scenario.acceptanceTests : [];
}
async function evaluateArenaSubmission(scenario, submittedFiles) {
  const tests = testsFor(scenario);
  if (!tests.length) throw new Error("Arena scenario has no hidden executable acceptance tests");
  const results = [];
  for (const test of tests.slice(0, 32)) {
    const hiddenName = ".evidence/" + String(test.id || "acceptance").replace(/[^a-z0-9_-]/gi, "-") + ".cjs";
    const trials = [];
    for (let trial = 0; trial < Math.max(1, Math.min(5, Number(test.trials || 1))); trial += 1) trials.push(await executeSealedWorkspace({
      files: { ...submittedFiles, [hiddenName]: String(test.code || "") },
      command: "node " + hiddenName,
      language: "javascript",
      engine: process.env.ARENA_EXECUTION_ENGINE,
      containerImage: process.env.ARENA_RUNNER_IMAGE,
      timeoutMs: Math.max(1000, Math.min(30_000, Number(test.timeoutMs || 10_000))),
    }));
    const successfulTrials = trials.filter((execution) => execution.exitCode === 0 && !execution.timedOut && !execution.launchError).length;
    const execution = trials.at(-1);
    const durations = trials.map((item) => item.durationMs).sort((left, right) => left - right);
    results.push({
      id: String(test.id || hiddenName),
      passed: successfulTrials === trials.length,
      passedTrials: successfulTrials,
      trials: trials.length,
      weight: Math.max(1, Number(test.weight || 1)),
      exitCode: execution.exitCode,
      outputDigest: execution.outputDigest,
      durationMs: execution.durationMs,
      p95DurationMs: durations[Math.min(durations.length - 1, Math.ceil(durations.length * 0.95) - 1)],
      engine: execution.engine,
      image: execution.image,
      sandbox: execution.sandbox,
    });
  }
  const passed = results.filter((item) => item.passed).length;
  const totalWeight = results.reduce((sum, item) => sum + item.weight * item.trials, 0);
  const earnedWeight = results.reduce((sum, item) => sum + item.weight * item.passedTrials, 0);
  return {
    passed,
    total: results.length,
    score: Math.round((earnedWeight / Math.max(1, totalWeight)) * 100),
    verified: passed === results.length,
    calibration: { weighted: true, repeatedTrials: results.reduce((sum, item) => sum + item.trials, 0), p95Measured: true },
    results,
  };
}
module.exports = { evaluateArenaSubmission };
