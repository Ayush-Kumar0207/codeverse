const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const createApp = require("../src/app");
const { isAllowedOrigin } = createApp;

async function startTestServer() {
  const server = http.createServer(createApp());
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
}

test("health endpoint reports a usable service snapshot", async (context) => {
  const service = await startTestServer();
  context.after(service.close);

  const response = await fetch(`${service.baseUrl}/api/health`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, "ok");
  assert.equal(typeof payload.uptime, "number");
  assert.equal(typeof payload.timestamp, "string");
  assert.equal(typeof payload.memory.heapUsedMb, "number");
});

test("CORS only trusts CodeVerse origins", () => {
  assert.equal(isAllowedOrigin(undefined), true);
  assert.equal(isAllowedOrigin("https://codeverse-rho.vercel.app"), true);
  assert.equal(
    isAllowedOrigin("https://codeverse-git-feature-ayush-kumar0207s-projects.vercel.app"),
    true
  );
  assert.equal(isAllowedOrigin("https://evil.vercel.app"), false);
  assert.equal(isAllowedOrigin("not-a-url"), false);
});

test("protected deployment endpoint rejects anonymous writes", async (context) => {
  const service = await startTestServer();
  context.after(service.close);

  const response = await fetch(`${service.baseUrl}/api/deploy`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId: "anonymous", files: { "index.html": "blocked" } }),
  });

  assert.equal(response.status, 401);
});

test("internal test-only database endpoint is not exposed", async (context) => {
  const service = await startTestServer();
  context.after(service.close);

  const response = await fetch(`${service.baseUrl}/api/test/test-user`);
  assert.equal(response.status, 404);
});
