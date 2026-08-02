const fs = require("fs/promises");
const path = require("path");
const posixPath = require("path").posix;
const { createHash, randomUUID } = require("crypto");
const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");
const advancedEvidence = require("./evidence-advanced.service");
const arenaService = require("./arena.service");
const aiService = require("./ai.service");

const DATA_FILE = path.join(__dirname, "../../.data/evidence.json");
const COLLECTIONS = {
  events: "engineering_events",
  packages: "evidence_packages",
  reviews: "evidence_reviews",
  verifications: "understanding_verifications",
};
const EVENT_TYPES = new Set([
  "session.started", "code.changed", "file.created", "file.deleted",
  "ai.prompted", "ai.responded", "command.executed", "test.passed",
  "test.failed", "runtime.succeeded", "runtime.failed", "debugger.checkpoint",
  "trace.observed", "network.request", "database.change", "security.finding",
  "performance.measurement", "snapshot.created",
  "branch.created", "decision.recorded", "review.completed",
  "understanding.verified", "deployment.attempted", "deployment.succeeded",
  "deployment.failed", "session.environment", "cursor.moved", "clipboard.pasted", "chat.message",
  "artifact.attested", "proof.verified", "replay.executed",
  "arena.started", "arena.action", "arena.completed",
]);
let writeQueue = Promise.resolve();
const eventQueues = new Map();

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function text(value, limit = 4000) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = canonicalize(value[key]);
    return result;
  }, {});
}

function digest(value) {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

function safeObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

function cleanActor(actor, fallbackName = "CodeVerse user") {
  const candidate = safeObject(actor);
  const kind = ["human", "ai", "system"].includes(candidate.kind) ? candidate.kind : "human";
  return {
    ...(text(candidate.id, 160) ? { id: text(candidate.id, 160) } : {}),
    name: text(candidate.name, 120) || fallbackName,
    kind,
  };
}

function cleanFiles(value) {
  const candidate = safeObject(value);
  const entries = Object.entries(candidate)
    .filter(([name, content]) => typeof name === "string" && typeof content === "string")
    .slice(0, 80)
    .map(([name, content]) => [name.slice(0, 240), content.slice(0, 70000)]);
  return Object.fromEntries(entries);
}

function exactFiles(value) {
  const candidate = safeObject(value);
  const entries = Object.entries(candidate);
  if (entries.length > 80 || entries.some(([name, content]) =>
    typeof name !== "string" || !name || name.length > 240 || typeof content !== "string" || content.length > 70000
  )) {
    throw new HttpError(413, "Exact artifact exceeds EvidenceOS file count, name, or per-file limits");
  }
  return Object.fromEntries(entries);
}

async function readLocalStore() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      packages: Array.isArray(parsed.packages) ? parsed.packages : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      verifications: Array.isArray(parsed.verifications) ? parsed.verifications : [],
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { events: [], packages: [], reviews: [], verifications: [] };
    }
    throw error;
  }
}

async function appendLocal(collection, item) {
  writeQueue = writeQueue.then(async () => {
    const store = await readLocalStore();
    store[collection].push(item);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2) + "\n", "utf8");
  });
  await writeQueue;
  return item;
}

function toRow(collection, item) {
  if (collection === "events") {
    return {
      id: item.id, project_id: item.projectId, session_id: item.sessionId,
      sequence: item.sequence, type: item.type, actor: item.actor,
      summary: item.summary, source: item.source, file_name: item.fileName || null,
      payload: item.payload, caused_by: item.causedBy || null,
      occurred_at: item.occurredAt, previous_hash: item.previousHash,
      integrity_hash: item.integrityHash,
    };
  }
  if (collection === "packages") {
    return {
      id: item.id, project_id: item.projectId, title: item.title,
      requirement: item.requirement, rationale: item.rationale,
      rollback: item.rollback, files: item.files, checks: item.checks,
      score: item.score, status: item.status, created_by: item.createdBy,
      created_at: item.createdAt, change_digest: item.changeDigest,
      base_digest: item.baseDigest || null, manifest_digest: item.manifestDigest,
      attestations: item.attestations || [], signature: item.signature,
      exact_artifact_verified: Boolean(item.exactArtifactVerified),
    };
  }
  if (collection === "reviews") {
    return {
      id: item.id, project_id: item.projectId, requirement: item.requirement,
      verdict: item.verdict, score: item.score, agents: item.agents,
      created_at: item.createdAt, patch_digest: item.patchDigest,
      rounds: item.rounds || [], consensus: item.consensus || 0,
      executed_tools: item.executedTools || [],
    };
  }
  return {
    id: item.id, project_id: item.projectId, challenge_id: item.challengeId,
    file_name: item.fileName, score: item.score, passed: item.passed,
    feedback: item.feedback, created_at: item.createdAt,
    dimensions: item.dimensions || {}, behavioral_signals: item.behavioralSignals || {},
    code_digest: item.codeDigest || "",
  };
}

function fromRow(collection, row) {
  if (collection === "events") {
    return {
      id: row.id, projectId: row.project_id, sessionId: row.session_id,
      sequence: Number(row.sequence), type: row.type, actor: row.actor,
      summary: row.summary, source: row.source, fileName: row.file_name || undefined,
      payload: row.payload || {}, causedBy: row.caused_by || undefined,
      occurredAt: row.occurred_at, previousHash: row.previous_hash,
      integrityHash: row.integrity_hash,
    };
  }
  if (collection === "packages") {
    return {
      id: row.id, projectId: row.project_id, title: row.title,
      requirement: row.requirement, rationale: row.rationale,
      rollback: row.rollback, files: row.files || [], checks: row.checks || [],
      score: Number(row.score), status: row.status, createdBy: row.created_by,
      createdAt: row.created_at, changeDigest: row.change_digest || "",
      baseDigest: row.base_digest || undefined, manifestDigest: row.manifest_digest || "",
      attestations: row.attestations || [], signature: row.signature || "",
      exactArtifactVerified: Boolean(row.exact_artifact_verified),
    };
  }
  if (collection === "reviews") {
    return {
      id: row.id, projectId: row.project_id, requirement: row.requirement,
      verdict: row.verdict, score: Number(row.score), agents: row.agents || [],
      createdAt: row.created_at, patchDigest: row.patch_digest || "",
      rounds: row.rounds || [], consensus: Number(row.consensus || 0),
      executedTools: row.executed_tools || [],
    };
  }
  return {
    id: row.id, projectId: row.project_id, challengeId: row.challenge_id,
    fileName: row.file_name, score: Number(row.score), passed: Boolean(row.passed),
    feedback: row.feedback || [], createdAt: row.created_at,
    dimensions: row.dimensions || { explanation: 0, prediction: 0, modification: 0, debugging: 0, dataFlow: 0 },
    behavioralSignals: row.behavioral_signals || { answerSimilarity: 0, revisionCount: 0, elapsedMs: 0, continuity: 0, pasteCount: 0, externalFocusChanges: 0 },
    codeDigest: row.code_digest || "",
  };
}

async function listCollection(collection, projectId) {
  if (supabase) {
    try {
      const dateColumn = collection === "events" ? "occurred_at" : "created_at";
      const { data, error } = await supabase
        .from(COLLECTIONS[collection])
        .select("*")
        .eq("project_id", projectId)
        .order(dateColumn, { ascending: true });
      if (error) throw error;
      return (data || []).map((row) => fromRow(collection, row));
    } catch (error) {
      console.warn("EvidenceOS Supabase read fell back to local storage:", error.message);
    }
  }
  const store = await readLocalStore();
  return store[collection].filter((item) => item.projectId === projectId);
}

async function persist(collection, item) {
  if (supabase) {
    try {
      const { error } = await supabase.from(COLLECTIONS[collection]).insert([toRow(collection, item)]);
      if (error) throw error;
      return item;
    } catch (error) {
      console.warn("EvidenceOS Supabase write fell back to local storage:", error.message);
    }
  }
  return appendLocal(collection, item);
}

function eventHashInput(event) {
  return {
    projectId: event.projectId, sessionId: event.sessionId, sequence: event.sequence,
    type: event.type, actor: event.actor, summary: event.summary, source: event.source,
    fileName: event.fileName || "", payload: event.payload, causedBy: event.causedBy || "",
    occurredAt: event.occurredAt, previousHash: event.previousHash,
  };
}

async function recordEventUnlocked(projectId, payload, recorder = {}) {
  const cleanProjectId = text(projectId, 160);
  if (!cleanProjectId) throw new HttpError(400, "Project id is required");
  if (!EVENT_TYPES.has(payload.type)) throw new HttpError(400, "Unsupported engineering event type");

  const events = await listCollection("events", cleanProjectId);
  const previous = [...events].sort((a, b) => a.sequence - b.sequence).at(-1);
  const recorderName = text(recorder.username || recorder.email, 120) || "CodeVerse system";
  const recorderId = text(recorder.id || recorder._id || recorder.sub, 160);
  const actor = cleanActor(payload.actor, recorderName);
  const event = {
    id: randomUUID(),
    projectId: cleanProjectId,
    sessionId: text(payload.sessionId, 160) || "session-" + Date.now(),
    sequence: previous ? previous.sequence + 1 : 1,
    type: payload.type,
    actor,
    summary: text(payload.summary, 500) || payload.type,
    source: text(payload.source, 120) || "workspace",
    ...(text(payload.fileName, 240) ? { fileName: text(payload.fileName, 240) } : {}),
    payload: {
      ...safeObject(payload.payload),
      recordedBy: { ...(recorderId ? { id: recorderId } : {}), name: recorderName },
    },
    ...(text(payload.causedBy, 160) ? { causedBy: text(payload.causedBy, 160) } : {}),
    occurredAt: payload.occurredAt && Number.isFinite(Date.parse(payload.occurredAt))
      ? new Date(payload.occurredAt).toISOString()
      : new Date().toISOString(),
    previousHash: previous?.integrityHash || "GENESIS",
  };
  event.integrityHash = digest(eventHashInput(event));
  await persist("events", event);
  return event;
}

function recordEvent(projectId, payload, recorder = {}) {
  const queueKey = text(projectId, 160);
  const previous = eventQueues.get(queueKey) || Promise.resolve();
  const task = previous.then(() => recordEventUnlocked(projectId, payload, recorder));
  eventQueues.set(queueKey, task.catch(() => undefined));
  return task;
}


function verifyIntegrity(events) {
  const ordered = [...events].sort((a, b) => a.sequence - b.sequence);
  let previousHash = "GENESIS";
  for (const event of ordered) {
    const valid = event.previousHash === previousHash && digest(eventHashInput(event)) === event.integrityHash;
    if (!valid) return { verified: false, checkedEvents: ordered.indexOf(event), brokenAt: event.id };
    previousHash = event.integrityHash;
  }
  return { verified: true, checkedEvents: ordered.length };
}

function check(id, label, status, detail) {
  return { id, label, status, detail };
}

async function createPackage(projectId, payload, recorder = {}) {
  const files = exactFiles(payload.files);
  if (!Object.keys(files).length) throw new HttpError(400, "Files are required for a proof package");
  const [events, reviews, verifications] = await Promise.all([
    listCollection("events", projectId),
    listCollection("reviews", projectId),
    listCollection("verifications", projectId),
  ]);
  const requirement = text(payload.requirement, 1600);
  const rationale = text(payload.rationale, 2400);
  const rollback = text(payload.rollback, 1600);
  const changeDigest = advancedEvidence.workspaceDigest(files);
  const replay = advancedEvidence.buildReplaySessions(events);
  const manifestDigest = advancedEvidence.digest(replay.at(-1)?.manifest || { sourceDigest: changeDigest });
  const attestations = advancedEvidence.buildProofAttestations(files, events, reviews, verifications, payload);
  const checks = [
    check("requirement", "Requirement linked", requirement ? "passed" : "missing", requirement || "Link an explicit, falsifiable requirement."),
    check("rationale", "Root cause and rationale", rationale ? "passed" : "missing", rationale || "State the root cause and why the patch changes that path."),
    check("rollback-document", "Rollback documented", rollback ? "passed" : "missing", rollback || "Document a safe reversal."),
    ...attestations.map((item) => check(
      "attestation-" + item.kind,
      item.kind.charAt(0).toUpperCase() + item.kind.slice(1) + " attested",
      item.status === "verified" ? "passed" : item.status === "failed" ? "missing" : "warning",
      item.detail
    )),
  ];
  const points = checks.reduce((sum, item) => sum + (item.status === "passed" ? 1 : item.status === "warning" ? 0.35 : 0), 0);
  const score = clamp((points / checks.length) * 100);
  const exactArtifactVerified = ["source", "test", "runtime", "security"].every((kind) => attestations.find((item) => item.kind === kind)?.status === "verified");
  const item = {
    id: randomUUID(),
    projectId,
    title: text(payload.title, 240) || "Workspace change",
    requirement,
    rationale,
    rollback,
    files: Object.keys(files),
    checks,
    score,
    status: checks.every((candidate) => candidate.status === "passed") && exactArtifactVerified ? "ready" : "needs-evidence",
    createdAt: new Date().toISOString(),
    createdBy: cleanActor(payload.createdBy, text(recorder.username, 120) || "CodeVerse user"),
    changeDigest,
    ...(text(payload.baseDigest, 160) ? { baseDigest: text(payload.baseDigest, 160) } : {}),
    manifestDigest,
    attestations,
    signature: "",
    exactArtifactVerified,
  };
  item.signature = advancedEvidence.signEvidencePackage(item);
  await persist("packages", item);
  await recordEvent(projectId, {
    type: "proof.verified",
    sessionId: text(payload.sessionId, 160),
    actor: { name: item.createdBy.name, kind: "human" },
    summary: "Sealed proof package " + item.title + " at " + score + "%.",
    source: "proof-engine",
    payload: { packageId: item.id, subjectDigest: changeDigest, signature: item.signature, exactArtifactVerified, status: item.status },
  }, recorder);
  return item;
}
function finding(severity, title, detail, recommendation, fileName, line) {
  return { id: randomUUID(), severity, title, detail, recommendation, ...(fileName ? { fileName } : {}), ...(line ? { line } : {}) };
}

function firstMatch(files, pattern) {
  for (const [fileName, content] of Object.entries(files)) {
    const match = pattern.exec(content);
    pattern.lastIndex = 0;
    if (match) return { fileName, line: content.slice(0, match.index).split("\n").length };
  }
  return null;
}

function agent(id, name, responsibility, findings, passingSummary) {
  const status = findings.some((item) => item.severity === "critical") ? "blocked" : findings.length ? "warning" : "passed";
  return { id, name, responsibility, status, summary: findings.length ? findings.length + " challenge" + (findings.length === 1 ? "" : "s") + " raised." : passingSummary, findings };
}

async function enrichReviewWithIndependentAI(result, files, requirement, rollback) {
  const enabled = process.env.EVIDENCE_REVIEW_AI === "true" && Boolean(process.env.OPENAI_API_KEY || process.env.OLLAMA_URL);
  if (!enabled) return result;
  const exactArtifact = JSON.stringify(Object.entries(files).sort(([left], [right]) => left.localeCompare(right))).slice(0, 90000);
  const agents = await Promise.all(result.agents.map(async (agentResult) => {
    try {
      const response = await aiService.generateNeuralInsight({
        provider: process.env.AI_PROVIDER,
        fast: false,
        maxTokens: 320,
        systemPrompt: "You are the independent " + agentResult.name + " on an adversarial engineering board. Do not trust other agents. Inspect only the exact digest-addressed artifact. Return one falsifiable claim, the evidence that supports it, and a concrete acceptance test.",
        prompt: [
          "Patch digest: " + result.patchDigest,
          "Requirement: " + requirement,
          "Rollback: " + rollback,
          "Tool findings: " + JSON.stringify(agentResult.findings),
          "Exact artifact: " + exactArtifact,
        ].join("\n"),
      });
      return {
        ...agentResult,
        engine: "hybrid",
        summary: agentResult.summary + " Independent AI challenge: " + response.suggestion.slice(0, 900),
        toolRuns: [
          ...(agentResult.toolRuns || []),
          {
            tool: "independent-ai:" + (response.provider || "local") + ":" + response.model,
            status: "passed",
            durationMs: 1,
            outputDigest: advancedEvidence.digest(response.suggestion),
            summary: "Independent model critique is sealed to the patch digest.",
          },
        ],
      };
    } catch (error) {
      return {
        ...agentResult,
        toolRuns: [
          ...(agentResult.toolRuns || []),
          {
            tool: "independent-ai",
            status: "failed",
            durationMs: 1,
            outputDigest: advancedEvidence.digest(String(error?.message || error)),
            summary: "AI provider was unavailable; deterministic tools remain authoritative.",
          },
        ],
      };
    }
  }));
  return {
    ...result,
    agents,
    executedTools: agents.flatMap((agentResult) => agentResult.toolRuns.map((run) => run.tool)),
  };
}

async function runReview(projectId, payload) {
  const files = exactFiles(payload.files);
  if (!Object.keys(files).length) throw new HttpError(400, "Files are required for review");
  const evidence = {
    ...safeObject(payload.evidence),
    rootCause: text(payload.rootCause || payload.rationale, 2000),
    testDigest: text(payload.testDigest, 160),
    performanceDeltaPct: payload.performanceDeltaPct,
    performanceBudgetPct: payload.performanceBudgetPct,
  };
  const deterministicResult = advancedEvidence.analyzeReviewBoard(
    files,
    text(payload.requirement, 1600),
    text(payload.rollback, 1600),
    evidence
  );
  const result = await enrichReviewWithIndependentAI(
    deterministicResult,
    files,
    text(payload.requirement, 1600),
    text(payload.rollback, 1600)
  );
  const review = {
    id: randomUUID(),
    projectId,
    requirement: text(payload.requirement, 1600),
    verdict: result.verdict,
    score: result.score,
    agents: result.agents,
    createdAt: new Date().toISOString(),
    patchDigest: result.patchDigest,
    rounds: result.rounds,
    consensus: result.consensus,
    executedTools: result.executedTools,
  };
  await persist("reviews", review);
  await recordEvent(projectId, {
    type: "review.completed",
    sessionId: text(payload.sessionId, 160),
    actor: { name: "Autonomous review board", kind: "ai" },
    summary: "Multi-round review completed with verdict " + review.verdict + ".",
    source: "review-board",
    payload: {
      reviewId: review.id,
      verdict: review.verdict,
      score: review.score,
      patchDigest: review.patchDigest,
      rounds: review.rounds.length,
      executedTools: review.executedTools,
    },
  });
  return review;
}
function createChallenge(projectId, payload) {
  const fileName = text(payload.fileName, 240) || "active file";
  const code = text(payload.code, 70000);
  const files = exactFiles(payload.files);
  const subjectDigest = Object.keys(files).length ? advancedEvidence.workspaceDigest(files) : undefined;
  return advancedEvidence.createHandsOnChallenge(projectId, fileName, code, subjectDigest);
}

async function verifyUnderstanding(projectId, payload) {
  const challenge = createChallenge(projectId, payload);
  if (payload.challengeId && payload.challengeId !== challenge.id) throw new HttpError(409, "The file changed; generate a fresh understanding challenge");
  if (payload.expiresAt && Date.parse(payload.expiresAt) < Date.now()) throw new HttpError(409, "The understanding challenge expired");
  const evaluation = advancedEvidence.evaluateHandsOnChallenge(
    challenge,
    safeObject(payload.answers),
    safeObject(payload.signals)
  );
  const verification = {
    id: randomUUID(),
    projectId,
    challengeId: challenge.id,
    fileName: challenge.fileName,
    score: evaluation.score,
    passed: evaluation.passed,
    feedback: evaluation.feedback,
    createdAt: new Date().toISOString(),
    dimensions: evaluation.dimensions,
    behavioralSignals: evaluation.behavioralSignals,
    codeDigest: evaluation.codeDigest,
  };
  await persist("verifications", verification);
  await recordEvent(projectId, {
    type: "understanding.verified",
    sessionId: text(payload.sessionId, 160),
    actor: payload.actor,
    summary: "Hands-on understanding verification scored " + evaluation.score + "%.",
    source: "understanding-verifier",
    fileName: challenge.fileName,
    payload: {
      verificationId: verification.id,
      score: verification.score,
      passed: verification.passed,
      codeDigest: verification.codeDigest,
      dimensions: verification.dimensions,
      behavioralSignals: verification.behavioralSignals,
    },
  });
  return verification;
}
function classifyFile(fileName) {
  if (/test|spec/i.test(fileName)) return "test";
  if (/\.env|config|\.json$|\.ya?ml$/i.test(fileName)) return "config";
  if (/route|controller|api/i.test(fileName)) return "api";
  if (/service|server|socket/i.test(fileName)) return "service";
  if (/schema|migration|model|store|db/i.test(fileName)) return "data";
  if (/\.tsx?$|\.jsx?$|\.html$|\.css$/i.test(fileName)) return "frontend";
  return "module";
}

function resolveDependency(fileName, request, names) {
  if (!request.startsWith(".")) return names.find((name) => name === request || name.startsWith(request + "."));
  const base = posixPath.normalize(posixPath.join(posixPath.dirname(fileName.replace(/\\/g, "/")), request));
  return names.find((name) => {
    const normalized = name.replace(/\\/g, "/");
    return normalized === base || normalized.replace(/\.[^.\/]+$/, "") === base || normalized.startsWith(base + "/index.");
  });
}

function createDigitalTwin(payload) {
  return advancedEvidence.createAdvancedTwin(payload, Array.isArray(payload.events) ? payload.events : []);
}
function createGraph(packages, events, reviews) {
  return advancedEvidence.createCausalGraph(packages, events, reviews);
}
function scorecard(events, reviews, verifications, integrity) {
  const successes = events.filter((event) => ["runtime.succeeded", "test.passed"].includes(event.type)).length;
  const failures = events.filter((event) => ["runtime.failed", "test.failed"].includes(event.type)).length;
  const executionTotal = successes + failures;
  const testRuns = events.filter((event) => event.type.startsWith("test.")).length;
  const codeChanges = events.filter((event) => event.type === "code.changed").length;
  const aiPrompts = events.filter((event) => event.type === "ai.prompted").length;
  const processKinds = new Set(events.map((event) => event.type.split(".")[0])).size;
  const latestVerification = verifications.at(-1);
  const latestSecurity = reviews.at(-1)?.agents?.find((agent) => agent.id === "security");
  const debuggingRecovery = failures === 0 ? (successes ? 82 : 0) : successes > 0 ? 90 : 25;
  const aiRatio = aiPrompts / Math.max(1, codeChanges + aiPrompts);
  return {
    finalCorrectness: executionTotal ? clamp((successes / executionTotal) * 100) : 0,
    problemSolvingProcess: clamp(processKinds * 12 + Math.min(events.length, 20)),
    debuggingAbility: debuggingRecovery,
    testQuality: clamp(testRuns * 24 + (events.some((event) => event.type === "test.passed") ? 20 : 0)),
    codeComprehension: latestVerification?.score || 0,
    securityAwareness: latestSecurity ? (latestSecurity.status === "passed" ? 92 : latestSecurity.status === "warning" ? 66 : 30) : 0,
    evidenceIntegrity: integrity.verified ? 100 : 0,
    aiDependence: aiRatio > 0.55 ? "High" : aiRatio > 0.2 ? "Moderate" : "Low",
  };
}

async function verifyPackage(projectId, packageId) {
  const [packages, events, reviews, verifications] = await Promise.all([
    listCollection("packages", projectId),
    listCollection("events", projectId),
    listCollection("reviews", projectId),
    listCollection("verifications", projectId),
  ]);
  const item = packages.find((candidate) => candidate.id === packageId);
  if (!item) throw new HttpError(404, "Evidence package not found");
  const attestationResults = item.attestations.map((attestation) => {
    if (attestation.status !== "verified" || attestation.subjectDigest !== item.changeDigest) return { kind: attestation.kind, verified: false };
    if (attestation.kind === "security") {
      const review = reviews.find((candidate) => candidate.id === attestation.eventId);
      return { kind: attestation.kind, verified: Boolean(review && review.patchDigest === item.changeDigest && review.verdict === "approved") };
    }
    if (attestation.kind === "understanding") {
      const verification = verifications.find((candidate) => candidate.id === attestation.eventId);
      return { kind: attestation.kind, verified: Boolean(verification && verification.codeDigest === item.changeDigest && verification.passed) };
    }
    if (!attestation.eventId) {
      const nonApplicable = attestation.kind === "compatibility"
        ? !item.files.some((name) => /route|controller|api/i.test(name))
        : attestation.kind === "migration"
          ? !item.files.some((name) => /migration|schema\.sql/i.test(name))
          : false;
      return { kind: attestation.kind, verified: nonApplicable };
    }
    const event = events.find((candidate) => candidate.id === attestation.eventId);
    const files = event?.payload?.files;
    return {
      kind: attestation.kind,
      verified: Boolean(event && files && typeof files === "object" && advancedEvidence.workspaceDigest(files) === item.changeDigest),
    };
  });
  const signatureVerified = advancedEvidence.verifyEvidencePackage(item);
  const attestationCoverage = clamp((attestationResults.filter((result) => result.verified).length / Math.max(1, attestationResults.length)) * 100);
  const exactArtifactVerified = ["source", "test", "runtime", "security"].every((kind) => attestationResults.find((result) => result.kind === kind)?.verified);
  return {
    packageId,
    changeDigest: item.changeDigest,
    signature: item.signature,
    signatureVerified,
    exactArtifactVerified,
    attestationCoverage,
    invalidAttestations: attestationResults.filter((result) => !result.verified).map((result) => result.kind),
    verified: signatureVerified && exactArtifactVerified && attestationCoverage === 100,
    verifiedAt: new Date().toISOString(),
  };
}

async function exportEvidence(projectId, privacyMode = "full") {
  const snapshot = await getSnapshot(projectId);
  const redacted = privacyMode === "redacted";
  const events = snapshot.events.map((event) => redacted && ["chat.message", "ai.prompted", "ai.responded"].includes(event.type)
    ? { ...event, payload: { redacted: true }, summary: event.type + " recorded (content redacted)" }
    : event);
  const report = {
    schema: "codeverse-evidence-export/v2",
    projectId,
    generatedAt: new Date().toISOString(),
    privacyMode: redacted ? "redacted" : "full",
    integrity: snapshot.integrity,
    events,
    packages: snapshot.packages,
    reviews: snapshot.reviews,
    verifications: snapshot.verifications,
    replay: snapshot.replay.map((session) => ({ ...session, frames: redacted ? session.frames.map((frame) => ({ ...frame, files: {} })) : session.frames })),
    arenas: snapshot.arenas,
    graph: snapshot.graph,
    scorecard: snapshot.scorecard,
  };
  return { report, digest: advancedEvidence.digest(report) };
}

async function verifyReplay(projectId, sessionId, payload, recorder = {}) {
  const events = await listCollection("events", projectId);
  const replay = advancedEvidence.buildReplaySessions(events).find((item) => item.sessionId === sessionId);
  if (!replay) throw new HttpError(404, "Replay session not found");
  const files = exactFiles(payload.files);
  const sourceDigest = advancedEvidence.workspaceDigest(files);
  const expectedFrame = [...replay.frames].reverse().find((frame) => frame.terminal);
  const actualOutputDigest = typeof payload.output === "string" ? advancedEvidence.digest(payload.output) : text(payload.outputDigest, 160);
  const manifestVerified = replay.manifest.sourceDigest === sourceDigest;
  const commandVerified = !expectedFrame?.terminal?.command || expectedFrame.terminal.command === text(payload.command, 1000);
  const exitCodeVerified = expectedFrame?.terminal?.exitCode === undefined || Number(payload.exitCode) === expectedFrame.terminal.exitCode;
  const outputVerified = !expectedFrame?.terminal?.outputDigest || actualOutputDigest === expectedFrame.terminal.outputDigest;
  const verified = replay.deterministic && manifestVerified && commandVerified && exitCodeVerified && outputVerified;
  const report = {
    sessionId,
    replayDigest: replay.replayDigest,
    manifestVerified,
    commandVerified,
    exitCodeVerified,
    outputVerified,
    deterministicInputsComplete: replay.deterministic,
    verified,
    expected: expectedFrame?.terminal || null,
    actual: { sourceDigest, command: text(payload.command, 1000), exitCode: Number(payload.exitCode), outputDigest: actualOutputDigest },
    verifiedAt: new Date().toISOString(),
  };
  await recordEvent(projectId, {
    type: "replay.executed",
    sessionId: text(payload.newSessionId, 160) || sessionId,
    actor: payload.actor,
    summary: verified ? "Deterministic replay matched the sealed execution." : "Replay diverged from the sealed execution.",
    source: "replay-engine",
    payload: { ...report, subjectDigest: sourceDigest, sourceEventId: expectedFrame?.eventId },
    causedBy: expectedFrame?.eventId,
  }, recorder);
  return report;
}

async function getSnapshot(projectId) {
  const [events, packages, reviews, verifications, arenas] = await Promise.all([
    listCollection("events", projectId), listCollection("packages", projectId),
    listCollection("reviews", projectId), listCollection("verifications", projectId),
    arenaService.listSessions(projectId),
  ]);
  events.sort((a, b) => a.sequence - b.sequence);
  const integrity = verifyIntegrity(events);
  return {
    projectId, events, packages, reviews, verifications,
    graph: createGraph(packages, events, reviews),
    scorecard: scorecard(events, reviews, verifications, integrity),
    integrity,
    replay: advancedEvidence.buildReplaySessions(events),
    arenas,
  };
}

module.exports = {
  createChallenge,
  createDigitalTwin,
  createPackage,
  getSnapshot,
  recordEvent,
  runReview,
  verifyIntegrity,
  verifyPackage,
  exportEvidence,
  verifyReplay,
  verifyUnderstanding,
  verifyEvidencePackage: advancedEvidence.verifyEvidencePackage,
  workspaceDigest: advancedEvidence.workspaceDigest,
};

