const assert = require("node:assert/strict");
const test = require("node:test");
const { clearAuthCookie, setAuthCookie, unsealAuthToken } = require("../src/utils/authCookie");
const createRequestSecurityMiddleware = require("../src/middlewares/requestSecurity.middleware");
const { executeCode } = require("../src/services/execution.service");

function runRequestSecurity(headers) {
  const request = {
    method: "POST",
    get(name) {
      return headers[name.toLowerCase()];
    },
  };
  let outcome;
  createRequestSecurityMiddleware((origin) => origin === "https://codeverse-rho.vercel.app")(
    request,
    {},
    (error) => {
      outcome = error || null;
    }
  );
  return outcome;
}

test("unsafe browser requests require a trusted origin and verification header", () => {
  assert.equal(
    runRequestSecurity({
      origin: "https://codeverse-rho.vercel.app",
      "x-codeverse-client": "web-v1",
      "sec-fetch-site": "cross-site",
    }),
    null
  );
  assert.equal(runRequestSecurity({ origin: "https://evil.example", "x-codeverse-client": "web-v1" }).statusCode, 403);
  assert.equal(runRequestSecurity({ origin: "https://codeverse-rho.vercel.app" }).statusCode, 403);
});

test("authentication cookies are HttpOnly and production-safe", () => {
  const originalEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const calls = [];
  const response = {
    cookie: (...args) => calls.push(["set", ...args]),
    clearCookie: (...args) => calls.push(["clear", ...args]),
  };

  try {
    setAuthCookie(response, "signed-token");
    clearAuthCookie(response);
  } finally {
    if (originalEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalEnvironment;
  }

  assert.equal(calls[0][1], "codeverse.auth");
  assert.notEqual(calls[0][2], "signed-token");
  assert.equal(unsealAuthToken(calls[0][2]), "signed-token");
  assert.equal(calls[0][3].httpOnly, true);
  assert.equal(calls[0][3].secure, true);
  assert.equal(calls[0][3].sameSite, "none");
  assert.equal(calls[1][1], "codeverse.auth");
});

test("local code execution is opt-in and input size is bounded", async () => {
  const previousStrategy = process.env.EXECUTION_STRATEGY;
  const previousLocalFlag = process.env.ALLOW_LOCAL_EXECUTION;
  process.env.EXECUTION_STRATEGY = "local";
  delete process.env.ALLOW_LOCAL_EXECUTION;

  try {
    await assert.rejects(
      executeCode({ code: "console.log('safe')", language: "javascript", roomId: "room-1" }),
      /Local execution is disabled/
    );
    await assert.rejects(
      executeCode({ code: "x".repeat(101 * 1024), language: "javascript", roomId: "room-1" }),
      /100 KB execution limit/
    );
  } finally {
    if (previousStrategy === undefined) delete process.env.EXECUTION_STRATEGY;
    else process.env.EXECUTION_STRATEGY = previousStrategy;
    if (previousLocalFlag === undefined) delete process.env.ALLOW_LOCAL_EXECUTION;
    else process.env.ALLOW_LOCAL_EXECUTION = previousLocalFlag;
  }
});
