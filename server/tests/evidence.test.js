const assert = require("node:assert/strict");
const test = require("node:test");
const evidenceService = require("../src/services/evidence.service");
const arenaService = require("../src/services/arena.service");
const advancedEvidence = require("../src/services/evidence-advanced.service");

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
  assert.deepEqual(evidenceService.verifyIntegrity([first, second]), { verified: true, checkedEvents: 2 });

  const tampered = [{ ...first, summary: "Changed after sealing." }, second];
  assert.equal(evidenceService.verifyIntegrity(tampered).verified, false);
});

test("causal graph uses semantic engineering relations instead of adjacency", async () => {
  const id = projectId("causal");
  const files = {
    "scores.js": "exports.score = values => values.reduce((sum, value) => sum + value, 0);",
    "scores.test.js": "const scores = require('./scores'); test('score', () => scores.score([1]));",
  };
  const requirementPackage = await evidenceService.createPackage(id, {
    title: "Total scores",
    requirement: "Sum accepted scores.",
    rationale: "A total is needed by the report.",
    rollback: "Restore the previous source snapshot.",
    files,
  }, { username: "Ada" });
  const failure = await evidenceService.recordEvent(id, {
    type: "test.failed", sessionId: "causal-session", summary: "Empty input failed.", source: "runner", payload: { files },
  });
  const change = await evidenceService.recordEvent(id, {
    type: "code.changed", sessionId: "causal-session", summary: "Guarded empty input.", source: "editor", fileName: "scores.js", causedBy: failure.id, payload: { files },
  });
  await evidenceService.recordEvent(id, {
    type: "test.passed", sessionId: "causal-session", summary: "Empty input passed.", source: "runner", fileName: "scores.test.js", causedBy: change.id, payload: { files },
  });
  await evidenceService.recordEvent(id, {
    type: "deployment.succeeded", sessionId: "causal-session", summary: "Artifact deployed.", source: "deployment", payload: { files },
  });
  const snapshot = await evidenceService.getSnapshot(id);
  const relations = new Set(snapshot.graph.edges.map((edge) => edge.relation));
  assert.ok(relations.has("implements"));
  assert.ok(relations.has("caused-fix"));
  assert.ok(relations.has("verified-by"));
  assert.ok(relations.has("deployed-as"));
  assert.ok(snapshot.graph.nodes.some((node) => node.id === "requirement:" + requirementPackage.id));
  assert.equal(snapshot.graph.edges.some((edge) => edge.relation === "supports"), false);
});

test("replay captures complete state and verifies deterministic re-execution", async () => {
  const id = projectId("replay");
  const sessionId = "session-replay";
  const files = { "app.js": "console.log('ok');" };
  const outputDigest = "sealed-output-digest";
  await evidenceService.recordEvent(id, {
    type: "session.environment",
    sessionId,
    summary: "Captured exact environment.",
    source: "session-recorder",
    payload: {
      files,
      activeFile: "app.js",
      manifest: {
        runtime: "node 22.18.0",
        platform: "linux",
        architecture: "x64",
        containerImage: "codeverse/runner@sha256:abc",
        lockfileHash: "lock-sha256",
        dependencyVersions: { node: "22.18.0" },
        environmentKeys: ["NODE_ENV"],
      },
    },
  });
  await evidenceService.recordEvent(id, {
    type: "cursor.moved", sessionId, summary: "Cursor moved.", source: "editor", fileName: "app.js", payload: { lineNumber: 1, column: 8 },
  });
  await evidenceService.recordEvent(id, {
    type: "debugger.checkpoint", sessionId, summary: "Breakpoint captured.", source: "debugger", fileName: "app.js", payload: { breakpoints: [{ fileName: "app.js", line: 1 }], variables: { mode: "test" } },
  });
  await evidenceService.recordEvent(id, {
    type: "network.request", sessionId, summary: "Health request.", source: "network", payload: { method: "GET", url: "/health", status: 200, durationMs: 4 },
  });
  await evidenceService.recordEvent(id, {
    type: "database.change", sessionId, summary: "Fixture inserted.", source: "database", payload: { operation: "insert", target: "fixtures", mutationDigest: "mutation-sha" },
  });
  await evidenceService.recordEvent(id, {
    type: "trace.observed", sessionId, summary: "Trace captured.", source: "tracing", payload: { traceId: "trace-1", spanId: "span-1", service: "api", durationMs: 8 },
  });
  await evidenceService.recordEvent(id, {
    type: "command.executed",
    sessionId,
    summary: "Executed app.js.",
    source: "runner",
    fileName: "app.js",
    payload: { files, command: "run app.js", exitCode: 0, outputDigest },
  });

  const snapshot = await evidenceService.getSnapshot(id);
  const replay = snapshot.replay.find((item) => item.sessionId === sessionId);
  assert.equal(replay.deterministic, true);
  assert.equal(replay.frames.at(-1).cursor.lineNumber, 1);
  assert.equal(replay.frames.at(-1).debugger.variables.mode, "test");
  assert.equal(replay.frames.at(-1).network[0].status, 200);
  assert.equal(replay.frames.at(-1).database[0].target, "fixtures");
  assert.equal(replay.frames.at(-1).traces[0].traceId, "trace-1");

  const report = await evidenceService.verifyReplay(id, sessionId, {
    files,
    command: "run app.js",
    exitCode: 0,
    outputDigest,
    actor: { name: "Ada", kind: "human" },
    newSessionId: "replay-verification",
  });
  assert.equal(report.verified, true);
});

test("adversarial review executes seven independent tools over two rounds", async () => {
  const id = projectId("review");
  const review = await evidenceService.runReview(id, {
    requirement: "Authenticate API requests without embedding credentials.",
    rollback: "Restore the prior authentication module.",
    rootCause: "Authentication loaded a credential from source instead of the secret boundary.",
    sessionId: "session-review",
    files: {
      "auth.js": "const apiKey = 'definitely-exposed-key';\nexport function auth() { return apiKey; }",
      "auth.test.js": "test('auth', () => true);",
    },
  });

  assert.equal(review.agents.length, 7);
  assert.equal(review.rounds.length, 2);
  assert.equal(review.executedTools.length, 7);
  assert.equal(review.verdict, "blocked");
  assert.equal(review.agents.find((agent) => agent.id === "security").status, "blocked");
  assert.match(review.agents.find((agent) => agent.id === "security").findings[0].title, /credential/i);
  assert.ok(review.agents.every((agent) => agent.toolRuns.length === 1));
  assert.equal(review.patchDigest, advancedEvidence.workspaceDigest({
    "auth.js": "const apiKey = 'definitely-exposed-key';\nexport function auth() { return apiKey; }",
    "auth.test.js": "test('auth', () => true);",
  }));
});

test("hands-on verification and proof package bind every claim to the exact artifact", async () => {
  const id = projectId("proof");
  const code = "function summarizeScores(input) { if (!input.length) return []; return input.map(Number); }";
  const files = {
    "scores.js": code,
    "scores.test.js": "const { summarizeScores } = require('./scores'); test('empty input', () => summarizeScores([]));",
  };
  const subjectDigest = evidenceService.workspaceDigest(files);
  const record = (type, summary, extra = {}) => evidenceService.recordEvent(id, {
    type,
    sessionId: "session-proof",
    actor: { name: "Lin", kind: "human" },
    summary,
    source: "test-fixture",
    payload: { files, subjectDigest, sourceDigest: subjectDigest, ...extra },
  });
  await record("artifact.attested", "Exact artifact sealed.");
  await record("test.passed", "Empty input regression passed.");
  await record("runtime.succeeded", "Runtime behavior passed.");
  await record("performance.measurement", "p95 remained in budget.", { durationMs: 8 });
  await record("deployment.succeeded", "Exact artifact deployed.");
  await record("replay.executed", "Rollback rehearsal passed.");

  const review = await evidenceService.runReview(id, {
    requirement: "Handle empty score input safely.",
    rollback: "Restore the previous module snapshot.",
    rootCause: "The implementation dereferenced empty input before guarding it.",
    sessionId: "session-proof",
    files,
  });
  assert.equal(review.verdict, "approved");

  const challenge = evidenceService.createChallenge(id, { fileName: "scores.js", code, files });
  const answers = Object.fromEntries(challenge.questions.map((question) => {
    const answer = question.focus === "purpose"
      ? "summarizescores transforms validated input because each value becomes a numeric output."
      : question.focus === "prediction"
        ? "When input is empty, the first branch returns an empty result because no mapping executes."
        : question.focus === "modification"
          ? "if (!Array.isArray(input)) throw new Error('validate input'); return summarizeScores(input);"
          : question.focus === "debugging"
            ? "The first unsafe operation receives null input, so length access fails and the trace stops there."
            : question.focus === "dataflow"
              ? "untrusted input -> validate trust boundary -> trusted state -> persistence output"
              : "For a batch, preserve the invariant for each input before producing each output.";
    return [question.id, answer];
  }));
  const verification = await evidenceService.verifyUnderstanding(id, {
    challengeId: challenge.id,
    fileName: "scores.js",
    code,
    workspaceDigest: subjectDigest,
    files,
    answers,
    signals: { elapsedMs: 240000, revisionCount: 4, idleResumes: 0 },
    sessionId: "session-proof",
    actor: { name: "Lin", kind: "human" },
  });
  assert.equal(verification.passed, true);
  assert.ok(verification.dimensions.modification >= 60);
  assert.ok(verification.dimensions.debugging >= 60);

  const evidencePackage = await evidenceService.createPackage(id, {
    title: "Make score summaries total",
    requirement: "Handle empty score input safely.",
    rationale: "A guard fixes the exact failing dereference path.",
    rollback: "Restore the previous module snapshot.",
    requireRollbackDrill: true,
    sessionId: "session-proof",
    files,
  }, { username: "Lin" });

  assert.equal(evidencePackage.createdBy.name, "Lin");
  assert.equal(evidencePackage.changeDigest, subjectDigest);
  assert.equal(evidencePackage.exactArtifactVerified, true);
  assert.equal(evidencePackage.status, "ready");
  assert.equal(evidencePackage.score, 100);
  assert.equal(evidencePackage.attestations.every((item) => item.status === "verified"), true);
  assert.equal(evidenceService.verifyEvidencePackage(evidencePackage), true);
  const packageVerification = await evidenceService.verifyPackage(id, evidencePackage.id);
  assert.equal(packageVerification.verified, true);
  assert.equal(packageVerification.attestationCoverage, 100);
  assert.deepEqual(packageVerification.invalidAttestations, []);
});

test("digital twin combines static dependencies with runtime, data, queue, provider, and deployment telemetry", () => {
  const events = [
    { type: "trace.observed" },
    { type: "network.request" },
    { type: "database.change" },
    { type: "deployment.succeeded" },
  ];
  const twin = evidenceService.createDigitalTwin({
    activeFile: "src/scores.js",
    events,
    files: {
      "src/app.js": "const scores = require('./scores');\nfetch('/api/scores');",
      "src/scores.js": "const stripe = require('stripe'); module.exports = db => db.from('scores');",
      "src/worker.js": "sendToQueue('score-events');",
      "src/scores.test.js": "const scores = require('./scores'); test('scores', () => scores([]));",
      "migrations/001_scores.sql": "CREATE TABLE scores(id int);",
      "k8s/deployment.yaml": "kind: Deployment",
    },
  });
  assert.ok(twin.nodes.some((node) => node.id === "api:/api/scores"));
  assert.ok(twin.nodes.some((node) => node.id === "provider:stripe"));
  assert.ok(twin.nodes.some((node) => node.id === "queue:score-events"));
  assert.ok(twin.nodes.some((node) => node.kind === "migration"));
  assert.ok(twin.nodes.some((node) => node.kind === "deployment"));
  assert.ok(twin.edges.some((edge) => edge.target === "file:src/scores.js"));
  assert.ok(twin.impact.affectedFiles.includes("src/app.js"));
  assert.ok(twin.impact.testsToRun.includes("src/scores.test.js"));
  assert.equal(twin.telemetry.traces, 1);
  assert.equal(twin.telemetry.deployments, 1);
  assert.ok(twin.impact.confidence >= 60);
});

test("engineering arena provides eight scenarios, consent, timing, policies, grading, reports, and leaderboard", async () => {
  const id = projectId("arena");
  const scenarios = await arenaService.listScenarios();
  assert.ok(scenarios.length >= 8);
  assert.equal(scenarios.every((scenario) => scenario.injectedFaults.every((fault) => Object.keys(fault.files).length === 0)), true);

  const custom = await arenaService.createScenarioTemplate({
    organizationId: "acme-evaluation",
    title: "Restore the billing worker",
    briefing: "Diagnose a failed billing worker and prove safe recovery.",
    kind: "outage",
    difficulty: "advanced",
    timeLimitMinutes: 35,
    allowedAI: "limited",
    starterFiles: { "worker.js": "throw new Error('billing unavailable');" },
    injectedFaults: [{ id: "billing-fault", description: "Worker aborts before retry.", hidden: true, files: { "worker.js": "throw new Error('billing unavailable');" } }],
  }, { username: "Evaluator One" });
  assert.equal(custom.organizationId, "acme-evaluation");
  assert.ok((await arenaService.listScenarios({ includeHidden: true })).some((scenario) => scenario.id === custom.id));

  const lobby = await arenaService.startSession(id, {
    scenarioId: custom.id,
    consentRecorded: true,
    privacyMode: "full",
    lobby: true,
  }, { id: "captain", username: "Team Captain" });
  assert.equal(lobby.status, "lobby");
  assert.equal(lobby.deadlineAt, undefined);
  assert.equal(lobby.environmentLocked, true);
  const joined = await arenaService.joinLobby(id, lobby.id, { name: "Teammate" }, { id: "teammate" });
  assert.equal(joined.participants.length, 2);
  const codeJoined = await arenaService.joinLobbyByCode(id, { lobbyCode: lobby.lobbyCode, name: "Code Joiner" }, { id: "code-joiner" });
  assert.equal(codeJoined.participants.length, 3);
  const begun = await arenaService.beginLobby(id, lobby.id);
  assert.equal(begun.status, "running");
  assert.ok(Date.parse(begun.deadlineAt) > Date.parse(begun.startedAt));
  const queued = await arenaService.matchmake(id, { scenarioId: custom.id, privacyMode: "redacted", name: "Queued One" }, { id: "queued-one" });
  assert.equal(queued.matched, false);
  const matched = await arenaService.matchmake(id, { scenarioId: custom.id, privacyMode: "redacted", name: "Queued Two" }, { id: "queued-two" });
  assert.equal(matched.matched, true);
  assert.equal(matched.session.id, queued.session.id);
  assert.equal(matched.session.participants.length, 2);

  await assert.rejects(
    arenaService.startSession(id, { scenarioId: "vulnerable-api", consentRecorded: false }, {}),
    /consent/i
  );
  const session = await arenaService.startSession(id, {
    scenarioId: "vulnerable-api",
    consentRecorded: true,
    privacyMode: "redacted",
  }, { username: "Candidate One" });
  assert.equal(session.status, "running");
  assert.ok(Date.parse(session.deadlineAt) > Date.parse(session.startedAt));
  assert.ok(Object.hasOwn(session.workspace, "route.js"));

  await arenaService.recordAction(id, session.id, { type: "decision.recorded", summary: "The request id crosses an unvalidated SQL boundary." });
  await arenaService.recordAction(id, session.id, { type: "ai.prompted", summary: "Disallowed AI attempt." });
  const evidenceSnapshot = {
    events: [
      { type: "runtime.failed", occurredAt: session.startedAt },
      { type: "security.finding", occurredAt: session.startedAt },
      { type: "test.failed", occurredAt: session.startedAt },
      { type: "code.changed", occurredAt: session.startedAt },
      { type: "test.passed", occurredAt: session.startedAt },
      { type: "runtime.succeeded", occurredAt: session.startedAt },
      { type: "review.completed", occurredAt: session.startedAt },
      { type: "replay.executed", occurredAt: session.startedAt },
    ],
    integrity: { verified: true, checkedEvents: 8 },
  };
  const graded = await arenaService.submitSession(id, session.id, { reviewerNotes: ["Candidate contained the trust boundary."] }, evidenceSnapshot);
  assert.equal(graded.status, "graded");
  assert.ok(graded.weightedScore > 0);
  assert.equal(graded.signedReport.consentRecorded, true);
  assert.equal(graded.signedReport.privacyMode, "redacted");
  assert.match(graded.signedReport.signature, /^(sha256|hmac-sha256):/);
  const reportVerification = await arenaService.verifySignedReport(id, graded.id);
  assert.equal(reportVerification.verified, true);
  assert.equal(reportVerification.digestVerified, true);
  assert.equal(reportVerification.signatureVerified, true);

  const board = await arenaService.leaderboard("vulnerable-api");
  const entry = board.find((item) => item.sessionId === session.id);
  assert.equal(entry.participant, "Anonymous candidate");
  assert.equal(entry.integrityVerified, true);
});