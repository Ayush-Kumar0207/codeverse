const assert = require("node:assert/strict");
const test = require("node:test");
const { getPistonRuntime } = require("../src/utils/languageRuntime");

test("supported languages map to deterministic remote runtimes", () => {
  assert.deepEqual(getPistonRuntime("python"), { language: "python", version: "3.10.0" });
  assert.deepEqual(getPistonRuntime("cpp"), { language: "c++", version: "10.2.0" });
  assert.deepEqual(getPistonRuntime("c++"), { language: "c++", version: "10.2.0" });
});

test("unknown languages do not silently select a runtime", () => {
  assert.equal(getPistonRuntime("brainfuck"), null);
  assert.equal(getPistonRuntime(""), null);
});
