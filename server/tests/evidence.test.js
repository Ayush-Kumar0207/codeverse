const assert = require("node:assert/strict");
const test = require("node:test");
const evidenceService = require("../src/services/evidence.service");

function projectId(label) {
  return label + "-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

test("engineering events form a verifiable causal hash chain", async () => {
  const id = projectId("chain");
  const first = await evidenceService.recordEvent(id, {
    type: "session.started",
    sessionId: "session-a",
    actor: { name: "Ada", kind: "human" },
    summary: "Assessment started.",
    source: "session",
  });
  const second = await evidenceService.recordEvent(id, {
    type: "runtime.succeeded",
    sessionId: "session-a",
    actor: { name: "Ada", kind: "human" },
    summary: "Regression path passed.",
    source: "runner",
    causedBy: first.id,
  });

  assert.equal(first.previousHash, "GENESIS");
  assert.equal(second.previousHash, first.integrityHash);
  assert.deepEqual(evidenceService.verifyIntegrity([first, second]), {
    verified: true,
    checkedEvents: 2,
  });

  const tampered = [{ ...first, summary: "Changed after sealing." }, second];
  assert.equal(evidenceService.verifyIntegrity(tampered).verified, false);
});

test("adversarial review runs seven agents and blocks credential leakage", async () => {
  const id = projectId("review");
  const review = await evidenceService.runReview(id, {
    requirement: "Authenticate API requests without embedding credentials.",
    rollback: "Restore the prior authentication module.",
    sessionId: "session-review",
    files: {
      "auth.js": "const apiKey = 'definitely-exposed-key';\nexport function auth() { return apiKey; }",
      "auth.test.js": "test('auth', () => true);",
    },
  });

  assert.equal(review.agents.length, 7);
  assert.equal(review.verdict, "blocked");
  assert.equal(review.agents.find((agent) => agent.id === "security").status, "blocked");
  assert.match(
    review.agents.find((agent) => agent.id === "security").findings[0].title,
    /credential/i
  );
});

test("understanding verification and proof packages share the same evidence ledger", async () => {
  const id = projectId("proof");
  const code = "function summarizeScores(input) { if (!input.length) return []; return input.map(Number); }";
  await evidenceService.recordEvent(id, {
    type: "test.passed",
    sessionId: "session-proof",
    actor: { name: "Lin", kind: "human" },
    summary: "Empty input regression passed.",
    source: "runner",
  });
  await evidenceService.runReview(id, {
    requirement: "Handle empty score input safely.",
    rollback: "Restore the previous module snapshot.",
    sessionId: "session-proof",
    files: {
      "scores.js": code,
      "scores.test.js": "test('empty input', () => summarizeScores([]));",
    },
  });

  const challenge = evidenceService.createChallenge(id, {
    fileName: "scores.js",
    code,
  });
  const answers = Object.fromEntries(challenge.questions.map((question) => [
    question.id,
    "The input is validated before state changes. Empty input follows the guarded error path, preserves valid output state, and the trust boundary requires sanitized input and permission checks.",
  ]));
  const verification = await evidenceService.verifyUnderstanding(id, {
    challengeId: challenge.id,
    fileName: "scores.js",
    code,
    answers,
    sessionId: "session-proof",
    actor: { name: "Lin", kind: "human" },
  });

  assert.equal(verification.passed, true);

  const evidencePackage = await evidenceService.createPackage(id, {
    title: "Make score summaries total",
    requirement: "Handle empty score input safely.",
    rationale: "A guard makes the function total for all accepted inputs.",
    rollback: "Restore the previous module snapshot.",
    files: {
      "scores.js": code,
      "scores.test.js": "test('empty input', () => summarizeScores([]));",
    },
  }, { username: "Lin" });

  assert.equal(evidencePackage.createdBy.name, "Lin");
  assert.ok(evidencePackage.score >= 75);
  assert.equal(evidencePackage.checks.find((item) => item.id === "understanding").status, "passed");

  const snapshot = await evidenceService.getSnapshot(id);
  assert.equal(snapshot.integrity.verified, true);
  assert.equal(snapshot.verifications.length, 1);
  assert.equal(snapshot.packages.length, 1);
  assert.ok(snapshot.graph.nodes.some((node) => node.kind === "requirement"));
  assert.equal(snapshot.scorecard.codeComprehension, verification.score);
});

test("engineering digital twin predicts dependency impact and linked tests", () => {
  const twin = evidenceService.createDigitalTwin({
    activeFile: "src/scores.js",
    files: {
      "src/app.js": "const scores = require('./scores');\nfetch('/api/scores');",
      "src/scores.js": "module.exports = function summarize(values) { return values.length; };",
      "src/scores.test.js": "const summarize = require('./scores');\ntest('scores', () => summarize([]));",
    },
  });

  assert.ok(twin.nodes.some((node) => node.id === "api:/api/scores"));
  assert.ok(twin.edges.some((edge) => edge.target === "file:src/scores.js"));
  assert.ok(twin.impact.affectedFiles.includes("src/app.js"));
  assert.ok(twin.impact.testsToRun.includes("src/scores.test.js"));
});

