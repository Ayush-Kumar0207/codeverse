const assert = require("node:assert/strict");
const test = require("node:test");
const { generateToken, verifyToken } = require("../src/utils/jwt");
const { resolveSecret } = require("../src/config/secrets");

test("JWT tokens round-trip and reject tampering", () => {
  const token = generateToken({ id: "user-1", role: "organizer" });
  const decoded = verifyToken(token);

  assert.equal(decoded.id, "user-1");
  assert.equal(decoded.role, "organizer");
  assert.equal(verifyToken(`${token}tampered`), null);
});

test("production secrets reject weak and placeholder values", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousSecret = process.env.CODEVERSE_TEST_SECRET;
  process.env.NODE_ENV = "production";

  try {
    process.env.CODEVERSE_TEST_SECRET = "too-short";
    assert.throws(() => resolveSecret("CODEVERSE_TEST_SECRET"), /at least 32 characters/);

    process.env.CODEVERSE_TEST_SECRET = "replace-with-a-long-random-secret-value";
    assert.throws(() => resolveSecret("CODEVERSE_TEST_SECRET"), /at least 32 characters/);

    const strongSecret = "A9!".repeat(16);
    process.env.CODEVERSE_TEST_SECRET = strongSecret;
    assert.equal(resolveSecret("CODEVERSE_TEST_SECRET"), strongSecret);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousSecret === undefined) delete process.env.CODEVERSE_TEST_SECRET;
    else process.env.CODEVERSE_TEST_SECRET = previousSecret;
  }
});