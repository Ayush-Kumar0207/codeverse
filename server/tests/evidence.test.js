process.env.EVIDENCE_SIGNING_KEY = "evidence-test-key-4d6b9c0f225c48dba74a";
process.env.EVIDENCE_SIGNING_ISSUER = "codeverse-test-evaluator";
process.env.EVIDENCE_SIGNING_KEY_ID = "evidence-test-v1";
process.env.ARENA_SIGNING_KEY = "arena-test-key-42b47f081ce34e5eb345";
process.env.ARENA_SIGNING_ISSUER = "codeverse-test-arena";
process.env.ARENA_SIGNING_KEY_ID = "arena-test-v1";
process.env.EVIDENCE_REPLAY_ENGINE = "process";
process.env.EVIDENCE_ANALYZER_ENGINE = "process";
process.env.ARENA_EXECUTION_ENGINE = "process";
process.env.UNDERSTANDING_EXECUTION_ENGINE = "process";
const assert = require("node:assert/strict");
const test = require("node:test");
const evidenceService = require("../src/services/evidence.service");
const arenaService = require("../src/services/arena.service");
const advancedEvidence = require("../src/services/evidence-advanced.service");
const evidenceSigning = require("../src/services/evidence-signing.service");
const arenaAcceptance = require("../src/services/arena-acceptance.service");
const evidenceRuntime = require("../src/services/evidence-runtime.service");
const reviewOrchestrator = require("../src/services/evidence-review-orchestrator.service");
const understandingExecution = require("../src/services/understanding-execution.service");
const { spawnSync } = require("node:child_process");

function projectId(label) {
  return label + "-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

test("proof and Arena signing use independent identities and fail closed", () => {
  const payload = { artifact: "sha256:fixture" };
  const evidenceAttestation = evidenceSigning.sign(payload, "evidence");
  const arenaAttestation = evidenceSigning.sign(payload, "arena");
  assert.match(evidenceAttestation.signature, /^hmac-sha256:evidence-test-v1:/);
  assert.match(arenaAttestation.signature, /^hmac-sha256:arena-test-v1:/);
  assert.notEqual(evidenceAttestation.signature, arenaAttestation.signature);
  assert.equal(evidenceSigning.verify(payload, evidenceAttestation.signature, evidenceAttestation, "evidence"), true);
  assert.equal(evidenceSigning.verify(payload, evidenceAttestation.signature, evidenceAttestation, "arena"), false);

  const arenaKey = process.env.ARENA_SIGNING_KEY;
  process.env.ARENA_SIGNING_KEY = process.env.EVIDENCE_SIGNING_KEY;
  assert.throws(() => evidenceSigning.sign(payload, "arena"), /independent/i);
  process.env.ARENA_SIGNING_KEY = arenaKey;

  const issuer = process.env.EVIDENCE_SIGNING_ISSUER;
  delete process.env.EVIDENCE_SIGNING_ISSUER;
  assert.throws(() => evidenceSigning.sign(payload, "evidence"), /issuer/i);
  process.env.EVIDENCE_SIGNING_ISSUER = issuer;

  const evidenceKey = process.env.EVIDENCE_SIGNING_KEY;
  process.env.EVIDENCE_SIGNING_KEY = "a".repeat(64);
  assert.throws(() => evidenceSigning.sign(payload, "evidence"), /high-entropy/i);
  process.env.EVIDENCE_SIGNING_KEY = evidenceKey;
});

test("production execution and compatibility attestations fail closed", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalOverride = process.env.EVIDENCE_ALLOW_PROCESS_SANDBOX;
  process.env.NODE_ENV = "production";
  process.env.EVIDENCE_ALLOW_PROCESS_SANDBOX = "true";
  try {
    await assert.rejects(evidenceRuntime.executeSealedWorkspace({
      files: { "index.js": "console.log('must not run on the host')" },
      command: "node index.js",
      language: "javascript",
      engine: "process",
    }), /requires the Docker sandbox/);
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalOverride === undefined) delete process.env.EVIDENCE_ALLOW_PROCESS_SANDBOX;
    else process.env.EVIDENCE_ALLOW_PROCESS_SANDBOX = originalOverride;
  }

  const files = { "api-route.js": "module.exports = request => ({ ok: Boolean(request) });" };
  const compatibility = advancedEvidence.buildProofAttestations(files, [], [], [], { apiCompatibility: "passed" })
    .find((item) => item.kind === "compatibility");
  assert.equal(compatibility.status, "unavailable");
  assert.equal(compatibility.eventId, undefined);
});
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
  const outputDigest = advancedEvidence.digest("ok\n");
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
        lockfileHash: "lock-sha256",
        dependencyVersions: { node: "22.18.0" },
        environmentKeys: ["NODE_ENV"],
        environment: { NODE_ENV: "test" },
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
    payload: { files, command: "run app.js", language: "javascript", exitCode: 0, outputDigest },
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
    command: "forged command is ignored",
    exitCode: 99,
    outputDigest: "caller-supplied-output-is-ignored",
    actor: { name: "Ada", kind: "human" },
    newSessionId: "replay-verification",
  });
  assert.equal(report.verified, true);
  assert.equal(report.serverExecuted, true);
  assert.equal(report.actual.engine, "isolated-process");
  assert.equal(report.actual.outputDigest, outputDigest);
  assert.equal(report.commandVerified, true);
});

test("adversarial review executes seven isolated roles through challenge, revision, and consensus", async () => {
  const id = projectId("review");
  const review = await evidenceService.runReview(id, {
    requirement: "Authenticate API requests without embedding credentials.",
    rollback: "Restore the prior authentication module.",
    rootCause: "Authentication loaded a credential from source instead of the secret boundary.",
    sessionId: "session-review",
    files: {
      "auth.js": "const apiKey = 'definitely-exposed-key';\nexport function auth() { return apiKey; }",
      "auth.test.js": "const auth = require('./auth'); test('auth', () => auth.auth());",
    },
  });

  assert.equal(review.agents.length, 7);
  assert.equal(review.rounds.length, 3);
  assert.equal(review.executedTools.length, 7);
  assert.equal(review.verdict, "approved");
  assert.equal(review.agents.find((agent) => agent.id === "security").status, "passed");
  assert.ok(review.builderActions.some((action) => /environment boundary/i.test(action.action)));
  assert.ok(review.rounds[0].challenges.some((challenge) => /credential/i.test(challenge.claim)));
  assert.ok(review.rounds[1].challenges.every((challenge) => challenge.resolved));
  assert.ok(review.agents.every((agent) => agent.toolRuns.length === 1));
  assert.equal(review.initialPatchDigest, advancedEvidence.workspaceDigest({
    "auth.js": "const apiKey = 'definitely-exposed-key';\nexport function auth() { return apiKey; }",
    "auth.test.js": "const auth = require('./auth'); test('auth', () => auth.auth());",
  }));
  assert.notEqual(review.patchDigest, review.initialPatchDigest);
  assert.doesNotMatch(review.revisedFiles["auth.js"], /definitely-exposed-key/);
  assert.equal(review.isolation.independentProcesses, 7);
});

test("general autonomous Builder revisions are isolated and revalidated", async () => {
  const original = {
    "parser.js": "exports.parse = input => eval(input);",
    "parser.test.js": "const parser = require('./parser'); test('parse', () => parser.parse('{\"ok\":true}'));",
  };
  const revised = {
    "parser.js": "exports.parse = input => JSON.parse(input);",
    "parser.test.js": original["parser.test.js"],
  };
  const result = await reviewOrchestrator.runIsolatedReviewBoard(
    original,
    "Parse JSON without executable input.",
    "Restore the prior digest-addressed parser.",
    { rootCause: "Dynamic evaluation crossed an executable trust boundary." },
    { generateRevision: async () => ({ files: revised, actions: [{ findingId: "security-boundary", fileName: "parser.js", action: "Replaced dynamic evaluation with JSON parsing." }], model: "test-builder", provider: "deterministic-fixture" }) }
  );
  const builder = result.agents.find((agent) => agent.id === "builder");
  assert.equal(result.verdict, "approved");
  assert.equal(builder.strategy, "general-autonomous");
  assert.equal(builder.model, "test-builder");
  assert.equal(result.revisedFiles["parser.js"], revised["parser.js"]);
  assert.ok(result.rounds[0].challenges.some((challenge) => /executable trust boundary/i.test(challenge.claim)));
  assert.ok(result.rounds[1].challenges.every((challenge) => challenge.resolved));
});

test("understanding adapters parse six languages and execute every available compiler", async () => {
  const cases = [
    { command: "python", name: "score.py", source: "def score(values):\n    return sum(values or [])", fixture: [1, 2], expected: 3 },
    { command: "java", name: "Score.java", source: "class Score { int score(int value) { return value + 1; } }", fixture: [1, 2], expected: 2 },
    { command: "gcc", name: "score.c", source: "int score(int value) { return value + 2; }", fixture: [1, 2], expected: 3 },
    { command: "g++", name: "score.cpp", source: "int score(int value) { return value + 3; }", fixture: [1, 2], expected: 4 },
    { command: "go", name: "score.go", source: "package score\nfunc score(value int) int { return value + 4 }", fixture: [1, 2], expected: 5 },
    { command: "rustc", name: "score.rs", source: "fn score(value:i32)->i32 { value + 5 }", fixture: [1, 2], expected: 6 },
  ];
  const parsedLanguages = [];
  const executedLanguages = [];
  for (const item of cases) {
    const analysis = understandingExecution.sourceAnalysis(item.name, item.source);
    parsedLanguages.push(analysis.language);
    const versionArgs = item.command === "go" ? ["version"] : ["--version"];
    const available = spawnSync(item.command, versionArgs, { windowsHide: true }).status === 0;
    if (!available) {
      if (process.env.REQUIRE_ALL_LANGUAGE_ADAPTERS === "true") assert.fail(item.command + " is required for full language parity");
      continue;
    }
    const result = await understandingExecution.probeLanguageBehavior({ [item.name]: item.source }, item.name, item.source, analysis.primary, item.fixture);
    assert.equal(result.status, "returned", item.name);
    assert.equal(result.value, item.expected, item.name);
    assert.equal(result.execution.exitCode, 0, item.name);
    executedLanguages.push(analysis.language);
  }
  assert.deepEqual(parsedLanguages.sort(), ["c", "cpp", "go", "java", "python", "rust"]);
  assert.ok(executedLanguages.length >= 4);
});
test("hands-on verification and proof package bind every claim to the exact artifact", async () => {
  const id = projectId("proof");
  const code = "function summarizeScores(input) { if (!input.length) return []; return input.map(Number); } module.exports = { summarizeScores };";
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
        ? "When input is empty, the first branch returns [] because no mapping executes."
        : question.focus === "modification"
          ? "function summarizeScores(input) { if (!Array.isArray(input)) throw new Error('validate input'); if (!input.length) return []; return input.map(Number); } module.exports = { summarizeScores };"
          : question.focus === "debugging"
            ? "The first operation is a TypeError trace when null input reaches the unsafe length access."
            : question.focus === "dataflow"
              ? "input -> input.map -> return"
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
  assert.ok(verification.dimensions.modification >= 80);
  assert.ok(verification.dimensions.debugging >= 70);
  assert.equal(verification.executionEvidence.modification.compiled, true);
  assert.equal(verification.executionEvidence.modification.preservesValid, true);

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
  assert.match(evidencePackage.signature, /^hmac-sha256:evidence-test-v1:/);
  assert.equal(evidencePackage.signatureIssuer, "codeverse-test-evaluator");
  assert.equal(evidenceService.verifyEvidencePackage(evidencePackage), true);
  const packageVerification = await evidenceService.verifyPackage(id, evidencePackage.id);
  assert.equal(packageVerification.verified, true);
  assert.equal(packageVerification.attestationCoverage, 100);
  assert.deepEqual(packageVerification.invalidAttestations, []);
});

test("digital twin combines static dependencies with runtime, data, queue, provider, and deployment telemetry", () => {
  const events = [
    { id: "trace-event", type: "trace.observed", fileName: "src/app.js", payload: { traceId: "trace-1", callerFile: "src/app.js", calleeFile: "src/scores.js" } },
    { id: "network-event", type: "network.request", fileName: "src/app.js", payload: { url: "/api/scores" } },
    { id: "database-event", type: "database.change", fileName: "src/scores.js", payload: { target: "scores", operation: "read" } },
    { id: "deployment-event", type: "deployment.succeeded", payload: {} },
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
      "analytics/score.py": "def normalize(value): return abs(value)",
      "analytics/Score.java": "class Score { int normalize(int value) { return Math.abs(value); } }",
      "native/score.c": "int normalize_c(int value) { return value; }",
      "native/score.cpp": "int normalize_cpp(int value) { return value; }",
      "workers/score.go": "package workers\nfunc Normalize(value int) int { return value }",
      "workers/score.rs": "fn normalize(value:i32)->i32 { value }",
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
  assert.ok(twin.analysis.runtimeCorrelations >= 3);
  assert.ok(twin.edges.some((edge) => edge.evidence === "runtime-trace" || edge.evidence === "otel-span"));
  assert.equal(twin.analysis.engine, "multi-language-compiler-ast");
  assert.deepEqual(twin.analysis.languages.sort(), ["c", "cpp", "go", "java", "python", "rust"]);
  assert.equal(Object.keys(twin.analysis.languageEngines).length, 6);
});

test("every built-in Arena fault fails its private executable acceptance suite", async () => {
  const scenarios = await arenaService.listScenarios({ includeHidden: true });
  const builtIns = scenarios.filter((scenario) => !scenario.organizationId);
  assert.ok(builtIns.length >= 8);
  for (const scenario of builtIns) {
    const baseline = await arenaAcceptance.evaluateArenaSubmission(scenario, scenario.starterFiles);
    assert.equal(baseline.verified, false, scenario.id + " starter fault must fail hidden acceptance");
  }
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
    acceptanceTests: [{ id: "worker-recovers", code: "const assert = require('node:assert/strict'); const worker = require('../worker.js'); assert.equal(worker.recovered(), true);" }],
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
  const failingSession = await arenaService.startSession(id, {
    scenarioId: "vulnerable-api",
    consentRecorded: true,
    privacyMode: "full",
  }, { username: "Baseline Candidate" });
  const failingGrade = await arenaService.submitSession(id, failingSession.id, { files: failingSession.workspace }, { events: [], integrity: { verified: true, checkedEvents: 0 } });
  assert.equal(failingGrade.acceptance.verified, false);
  assert.ok(failingGrade.score.finalCorrectness > 0);
  assert.ok(failingGrade.score.finalCorrectness < 100);
  assert.equal(failingGrade.acceptance.calibration.weighted, true);

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
  const graded = await arenaService.submitSession(id, session.id, {
    files: { "route.js": "exports.load = (db, request) => db.query('SELECT * FROM users WHERE id = $1', [request.query.id]);" },
    reviewerNotes: ["Candidate contained the trust boundary."],
  }, evidenceSnapshot);
  assert.equal(graded.status, "graded");
  assert.ok(graded.weightedScore > 0);
  assert.equal(graded.acceptance.verified, true);
  assert.equal(graded.acceptance.score, 100);
  assert.equal(graded.score.finalCorrectness, 100);
  assert.equal(graded.signedReport.consentRecorded, true);
  assert.equal(graded.signedReport.privacyMode, "redacted");
  assert.match(graded.signedReport.signature, /^hmac-sha256:arena-test-v1:/);
  assert.equal(graded.signedReport.signatureIssuer, "codeverse-test-arena");
  const reportVerification = await arenaService.verifySignedReport(id, graded.id);
  assert.equal(reportVerification.verified, true);
  assert.equal(reportVerification.digestVerified, true);
  assert.equal(reportVerification.signatureVerified, true);

  const board = await arenaService.leaderboard("vulnerable-api");
  const entry = board.find((item) => item.sessionId === session.id);
  assert.equal(entry.participant, "Anonymous candidate");
  assert.equal(entry.integrityVerified, true);
});