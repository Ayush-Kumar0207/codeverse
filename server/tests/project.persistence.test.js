const assert = require("node:assert/strict");
const test = require("node:test");
const { canUseLocalProjectStore, decodeWorkspace, encodeWorkspace } = require("../src/services/project.service");
const { canUseLocalCodeStore } = require("../src/services/code.service");
const { canUseLocalAuthStore } = require("../src/services/auth.service");

test("production project and version writes never fall back to ephemeral server storage", { concurrency: false }, () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    assert.equal(canUseLocalProjectStore(), false);
    assert.equal(canUseLocalCodeStore(), false);
    assert.equal(canUseLocalAuthStore(), false);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test("development retains local stores for offline work", { concurrency: false }, () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";
  try {
    assert.equal(canUseLocalProjectStore(), true);
    assert.equal(canUseLocalCodeStore(), true);
    assert.equal(canUseLocalAuthStore(), true);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
test("workspace payloads round-trip all files through the durable project record", () => {
  const encoded = encodeWorkspace(
    { "index.html": "<h1>Hello</h1>", "script.js": "console.log('ready')" },
    "script.js"
  );
  assert.deepEqual(decodeWorkspace(encoded), {
    files: { "index.html": "<h1>Hello</h1>", "script.js": "console.log('ready')" },
    activeFile: "script.js",
  });
});
