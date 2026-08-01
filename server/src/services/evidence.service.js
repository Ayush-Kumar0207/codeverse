const fs = require("fs/promises");
const path = require("path");
const posixPath = require("path").posix;
const { createHash, randomUUID } = require("crypto");
const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");

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
  "deployment.failed",
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
      created_at: item.createdAt,
    };
  }
  if (collection === "reviews") {
    return {
      id: item.id, project_id: item.projectId, requirement: item.requirement,
      verdict: item.verdict, score: item.score, agents: item.agents,
      created_at: item.createdAt,
    };
  }
  return {
    id: item.id, project_id: item.projectId, challenge_id: item.challengeId,
    file_name: item.fileName, score: item.score, passed: item.passed,
    feedback: item.feedback, created_at: item.createdAt,
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
      createdAt: row.created_at,
    };
  }
  if (collection === "reviews") {
    return {
      id: row.id, projectId: row.project_id, requirement: row.requirement,
      verdict: row.verdict, score: Number(row.score), agents: row.agents || [],
      createdAt: row.created_at,
    };
  }
  return {
    id: row.id, projectId: row.project_id, challengeId: row.challenge_id,
    fileName: row.file_name, score: Number(row.score), passed: Boolean(row.passed),
    feedback: row.feedback || [], createdAt: row.created_at,
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
  const files = cleanFiles(payload.files);
  const events = await listCollection("events", projectId);
  const reviews = await listCollection("reviews", projectId);
  const verifications = await listCollection("verifications", projectId);
  const fileNames = Object.keys(files);
  const hasTests = fileNames.some((name) => /(^|[/_.-])(test|spec)s?([/_.-]|$)/i.test(name));
  const lastReview = reviews.at(-1);
  const lastVerification = verifications.at(-1);
  const hasSuccessfulRun = events.some((event) => ["runtime.succeeded", "test.passed"].includes(event.type));
  const content = Object.values(files).join("\n");
  const secretLeak = /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"'\n]{8,}["']/i.test(content);
  const requirement = text(payload.requirement, 1600);
  const rollback = text(payload.rollback, 1600);
  const checks = [
    check("requirement", "Requirement linked", requirement ? "passed" : "missing", requirement || "Link the change to an explicit requirement."),
    check("tests", "Tests added", hasTests ? "passed" : "missing", hasTests ? "Test files are part of the change." : "No test file is included."),
    check("runtime", "Execution verified", hasSuccessfulRun ? "passed" : "warning", hasSuccessfulRun ? "A successful run is recorded in the ledger." : "Run the affected path and attach the result."),
    check("security", "Secret leakage scan", secretLeak ? "missing" : "passed", secretLeak ? "A credential-like literal needs review." : "No credential-like literals detected."),
    check("review", "Adversarial review", lastReview?.verdict === "approved" ? "passed" : lastReview ? "warning" : "missing", lastReview ? "Latest review verdict: " + lastReview.verdict + "." : "Run the engineering review board."),
    check("performance", "Performance impact", lastReview?.agents?.find((agent) => agent.id === "performance")?.status === "passed" ? "passed" : "warning", "Performance agent result is attached when available."),
    check("understanding", "Developer explanation", lastVerification?.passed ? "passed" : "missing", lastVerification?.passed ? "Understanding verification passed." : "Complete an understanding check."),
    check("rollback", "Rollback strategy", rollback ? "passed" : "missing", rollback || "Document how to safely reverse the change."),
  ];
  const points = checks.reduce((sum, item) => sum + (item.status === "passed" ? 1 : item.status === "warning" ? 0.5 : 0), 0);
  const score = clamp((points / checks.length) * 100);
  const item = {
    id: randomUUID(), projectId, title: text(payload.title, 240) || "Workspace change",
    requirement, rationale: text(payload.rationale, 2400), rollback,
    files: fileNames, checks, score, status: score >= 75 && !checks.some((item) => item.status === "missing") ? "ready" : "needs-evidence",
    createdAt: new Date().toISOString(), createdBy: cleanActor(payload.createdBy, text(recorder.username, 120) || "CodeVerse user"),
  };
  await persist("packages", item);
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

async function runReview(projectId, payload) {
  const files = cleanFiles(payload.files);
  if (!Object.keys(files).length) throw new HttpError(400, "Files are required for review");
  const names = Object.keys(files);
  const allCode = Object.values(files).join("\n");
  const reviewerFindings = [];
  const todo = firstMatch(files, /\b(TODO|FIXME|HACK)\b/i);
  if (todo) reviewerFindings.push(finding("warning", "Unresolved implementation marker", "The patch still contains TODO, FIXME, or HACK markers.", "Resolve the marker or explain it in the evidence package.", todo.fileName, todo.line));
  const emptyCatch = firstMatch(files, /catch\s*(?:\([^)]*\))?\s*{\s*}/m);
  if (emptyCatch) reviewerFindings.push(finding("warning", "Silent failure path", "An empty catch block can hide the root cause.", "Record or handle the failure explicitly.", emptyCatch.fileName, emptyCatch.line));

  const securityFindings = [];
  const secret = firstMatch(files, /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"'\n]{8,}["']/i);
  if (secret) securityFindings.push(finding("critical", "Credential-like literal", "A secret-like value appears to be hard coded.", "Move the value to a protected runtime secret and rotate any exposed credential.", secret.fileName, secret.line));
  const injection = firstMatch(files, /\b(eval|new\s+Function)\s*\(/);
  if (injection) securityFindings.push(finding("critical", "Dynamic code execution", "Dynamic evaluation creates an injection boundary.", "Replace it with an explicit parser or allow-listed dispatch.", injection.fileName, injection.line));
  const rawHtml = firstMatch(files, /dangerouslySetInnerHTML|\.innerHTML\s*=/);
  if (rawHtml) securityFindings.push(finding("warning", "Raw HTML boundary", "Untrusted HTML could reach the document.", "Sanitize input and document the trust boundary.", rawHtml.fileName, rawHtml.line));

  const testFindings = [];
  const hasTest = names.some((name) => /(^|[/_.-])(test|spec)s?([/_.-]|$)/i.test(name));
  if (!hasTest) testFindings.push(finding("warning", "No failure-oriented tests", "The reviewed workspace contains no recognizable test file.", "Add a failing regression test and a passing proof for the change."));

  const performanceFindings = [];
  const nestedLoop = firstMatch(files, /for\s*\([^)]*\)[\s\S]{0,240}for\s*\(/m);
  if (nestedLoop) performanceFindings.push(finding("warning", "Potential quadratic path", "Nested iteration was detected in a short execution path.", "Confirm input bounds or add a performance threshold.", nestedLoop.fileName, nestedLoop.line));
  const syncIo = firstMatch(files, /\b(readFileSync|writeFileSync|execSync)\s*\(/);
  if (syncIo) performanceFindings.push(finding("warning", "Blocking I/O", "Synchronous I/O can stall a shared server process.", "Use an asynchronous operation on request paths.", syncIo.fileName, syncIo.line));

  const architectureFindings = [];
  for (const [fileName, content] of Object.entries(files)) {
    const lines = content.split("\n").length;
    if (lines > 700) architectureFindings.push(finding("warning", "Large module boundary", fileName + " contains " + lines + " lines.", "Split responsibilities at an explicit interface.", fileName));
  }
  if (!text(payload.requirement, 1600)) architectureFindings.push(finding("warning", "Unlinked requirement", "The change has no stated requirement.", "State the user or system outcome this patch must satisfy."));

  const devilFindings = [];
  if (!text(payload.rollback, 1600)) devilFindings.push(finding("warning", "No rollback path", "The change cannot yet be reversed from its evidence.", "Document a safe rollback or feature-flag strategy."));
  if (allCode.length > 120000) devilFindings.push(finding("warning", "Review scope is too broad", "The submitted surface is too large for a focused proof package.", "Split the work into independently verifiable changes."));

  const agents = [
    agent("builder", "Builder", "Explains the implementation and its intended execution path.", [], names.length + " files indexed and ready for challenge."),
    agent("reviewer", "Correctness Reviewer", "Searches for correctness and maintainability failures.", reviewerFindings, "No obvious correctness traps detected."),
    agent("security", "Security Agent", "Searches for exploit paths and trust-boundary violations.", securityFindings, "No high-signal security hazards detected."),
    agent("test", "Test Agent", "Demands failure-oriented regression evidence.", testFindings, "A test surface is present."),
    agent("performance", "Performance Agent", "Detects blocking work and likely regressions.", performanceFindings, "No high-signal performance regression detected."),
    agent("architecture", "Architecture Agent", "Checks boundaries, scope, and coupling.", architectureFindings, "Module boundaries fit the reviewed scope."),
    agent("devils-advocate", "Devil's Advocate", "Challenges assumptions, reversibility, and review scope.", devilFindings, "The approach is bounded and reversible."),
  ];
  const blocked = agents.filter((item) => item.status === "blocked").length;
  const warnings = agents.filter((item) => item.status === "warning").length;
  const score = clamp(100 - blocked * 22 - warnings * 7);
  const review = {
    id: randomUUID(), projectId, requirement: text(payload.requirement, 1600),
    verdict: blocked ? "blocked" : warnings > 2 ? "changes-requested" : "approved",
    score, agents, createdAt: new Date().toISOString(),
  };
  await persist("reviews", review);
  await recordEvent(projectId, {
    type: "review.completed", sessionId: text(payload.sessionId, 160),
    actor: { name: "AI review board", kind: "ai" },
    summary: "Adversarial review completed with verdict " + review.verdict + ".",
    source: "review-board", payload: { reviewId: review.id, verdict: review.verdict, score },
  });
  return review;
}

function codeConcepts(code) {
  const identifiers = [...code.matchAll(/\b(?:function|class|const|let|var|def)\s+([A-Za-z_$][\w$]*)/g)].map((match) => match[1]);
  const words = identifiers.slice(0, 4).map((item) => item.toLowerCase());
  return words.length ? words : ["input", "output", "state"];
}

function createChallenge(projectId, payload) {
  const fileName = text(payload.fileName, 240) || "active file";
  const code = text(payload.code, 70000);
  const concepts = codeConcepts(code);
  const hasCondition = /\b(if|switch|guard|assert)\b/.test(code);
  const hasAsync = /\b(async|await|promise|fetch)\b/i.test(code);
  const seed = digest({ projectId, fileName, code }).slice(0, 16);
  return {
    id: "challenge-" + seed, projectId, fileName,
    questions: [
      { id: seed + "-purpose", focus: "purpose", prompt: "Explain the responsibility of " + fileName + " and the data it transforms.", expectedConcepts: [concepts[0], "input", "output"] },
      { id: seed + "-invariant", focus: "invariant", prompt: hasCondition ? "Which invariant does the main condition or guard protect?" : "Name one invariant this implementation must preserve.", expectedConcepts: [concepts[1] || concepts[0], "valid", "state"] },
      { id: seed + "-failure", focus: "failure", prompt: hasAsync ? "What happens when the asynchronous dependency fails?" : "Describe the most important failure or edge case.", expectedConcepts: ["error", "empty", "fail"] },
      { id: seed + "-security", focus: "security", prompt: "Identify one trust boundary or security concern in this file.", expectedConcepts: ["input", "validate", "trust", "sanitize", "permission"] },
    ],
  };
}

async function verifyUnderstanding(projectId, payload) {
  const challenge = createChallenge(projectId, payload);
  if (payload.challengeId && payload.challengeId !== challenge.id) throw new HttpError(409, "The file changed; generate a fresh understanding challenge");
  const answers = safeObject(payload.answers);
  const feedback = challenge.questions.map((question) => {
    const answer = text(answers[question.id], 2400).toLowerCase();
    const conceptHits = question.expectedConcepts.filter((concept) => answer.includes(concept.toLowerCase())).length;
    const lengthPoints = answer.length >= 90 ? 45 : answer.length >= 45 ? 32 : answer.length >= 20 ? 18 : 0;
    const conceptPoints = Math.min(55, conceptHits * 22);
    const score = clamp(lengthPoints + conceptPoints);
    return {
      questionId: question.id, score,
      detail: score >= 70 ? "Explanation connects behavior to a concrete engineering concept." : "Add a concrete execution path, invariant, or failure consequence.",
    };
  });
  const score = clamp(feedback.reduce((sum, item) => sum + item.score, 0) / feedback.length);
  const verification = {
    id: randomUUID(), projectId, challengeId: challenge.id, fileName: challenge.fileName,
    score, passed: score >= 70, feedback, createdAt: new Date().toISOString(),
  };
  await persist("verifications", verification);
  await recordEvent(projectId, {
    type: "understanding.verified", sessionId: text(payload.sessionId, 160),
    actor: payload.actor, summary: "Understanding verification scored " + score + "%.",
    source: "understanding-verifier", fileName: challenge.fileName,
    payload: { verificationId: verification.id, score, passed: verification.passed },
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
  const files = cleanFiles(payload.files);
  const names = Object.keys(files);
  const nodes = names.map((fileName) => ({ id: "file:" + fileName, kind: classifyFile(fileName), label: fileName, fileName }));
  const edges = [];
  const addEdge = (source, target, relation) => {
    const id = source + ":" + relation + ":" + target;
    if (!edges.some((edge) => edge.id === id)) edges.push({ id, source, target, relation });
  };
  for (const [fileName, content] of Object.entries(files)) {
    const importPattern = /(?:from\s+|require\s*\(\s*|import\s*\(\s*)["']([^"']+)["']/g;
    for (const match of content.matchAll(importPattern)) {
      const target = resolveDependency(fileName, match[1], names);
      if (target) addEdge("file:" + fileName, "file:" + target, "imports");
    }
    const assetPattern = /(?:src|href)=["']\.\/?([^"'?#]+)["']/g;
    for (const match of content.matchAll(assetPattern)) {
      const target = resolveDependency(fileName, "./" + match[1], names);
      if (target) addEdge("file:" + fileName, "file:" + target, "renders");
    }
    const apiPattern = /(?:fetch|axios\.(?:get|post|put|delete))\s*\(\s*["']([^"']+)["']/g;
    for (const match of content.matchAll(apiPattern)) {
      const endpointId = "api:" + match[1];
      if (!nodes.some((node) => node.id === endpointId)) nodes.push({ id: endpointId, kind: "api", label: match[1] });
      addEdge("file:" + fileName, endpointId, "calls");
    }
  }
  for (const name of names.filter((candidate) => /test|spec/i.test(candidate))) {
    const stem = posixPath.basename(name).replace(/\.(test|spec)|\.[^.]+$/g, "");
    const target = names.find((candidate) => candidate !== name && posixPath.basename(candidate).startsWith(stem));
    if (target) addEdge("file:" + name, "file:" + target, "tests");
  }
  const activeFile = text(payload.activeFile, 240);
  const activeId = "file:" + activeFile;
  const neighborIds = new Set();
  for (const edge of edges) {
    if (edge.source === activeId) neighborIds.add(edge.target);
    if (edge.target === activeId) neighborIds.add(edge.source);
  }
  const affectedFiles = [...neighborIds].filter((id) => id.startsWith("file:")).map((id) => id.slice(5));
  const stem = posixPath.basename(activeFile).replace(/\.[^.]+$/, "");
  const testsToRun = names.filter((name) => /test|spec/i.test(name) && (name.includes(stem) || affectedFiles.some((affected) => name.includes(posixPath.basename(affected).replace(/\.[^.]+$/, "")))));
  const activeContent = files[activeFile] || "";
  const risks = [];
  if (/route|api|controller/i.test(activeFile)) risks.push("API compatibility boundary");
  if (/schema|migration|db/i.test(activeFile)) risks.push("Data migration and rollback");
  if (/auth|token|permission|secret/i.test(activeFile + activeContent)) risks.push("Security boundary");
  if (!testsToRun.length) risks.push("No directly linked test");
  const radius = affectedFiles.length + risks.length;
  return {
    nodes, edges,
    impact: {
      activeFile, affectedFiles, testsToRun, risks,
      blastRadius: radius >= 6 ? "high" : radius >= 3 ? "medium" : "low",
    },
  };
}

function createGraph(packages, events, reviews) {
  const nodes = [];
  const edges = [];
  for (const item of packages.slice(-4)) {
    if (!item.requirement) continue;
    nodes.push({ id: "requirement:" + item.id, kind: "requirement", label: item.requirement.slice(0, 80), status: item.score >= 75 ? "passed" : "warning" });
  }
  const relevant = events.filter((event) => !["session.started", "ai.responded", "ai.prompted"].includes(event.type)).slice(-18);
  const kindFor = (type) => type.startsWith("code") || type.startsWith("file") || type.startsWith("branch") ? "change"
    : type.startsWith("test") ? "test"
      : ["runtime", "command", "debugger", "trace", "network", "database", "performance"].some((prefix) => type.startsWith(prefix)) ? "runtime"
        : type.startsWith("deployment") ? "deployment"
          : type.startsWith("security") ? "security"
            : type.startsWith("review") ? "review"
            : "decision";
  const statusFor = (type) => type.endsWith("failed") ? "failed" : type.endsWith("passed") || type.endsWith("succeeded") ? "passed" : "neutral";
  for (const event of relevant) {
    nodes.push({ id: "event:" + event.id, kind: kindFor(event.type), label: event.summary, status: statusFor(event.type), eventId: event.id });
  }
  for (const review of reviews.slice(-3)) {
    for (const result of review.agents.filter((item) => item.id === "security")) {
      nodes.push({ id: "security:" + review.id, kind: "security", label: result.summary, status: result.status === "passed" ? "passed" : result.status === "blocked" ? "failed" : "warning" });
    }
  }
  const ordered = nodes;
  for (let index = 1; index < ordered.length; index += 1) {
    edges.push({ id: "graph:" + index, source: ordered[index - 1].id, target: ordered[index].id, relation: "supports" });
  }
  return { nodes, edges };
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

async function getSnapshot(projectId) {
  const [events, packages, reviews, verifications] = await Promise.all([
    listCollection("events", projectId), listCollection("packages", projectId),
    listCollection("reviews", projectId), listCollection("verifications", projectId),
  ]);
  events.sort((a, b) => a.sequence - b.sequence);
  const integrity = verifyIntegrity(events);
  return {
    projectId, events, packages, reviews, verifications,
    graph: createGraph(packages, events, reviews),
    scorecard: scorecard(events, reviews, verifications, integrity),
    integrity,
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
  verifyUnderstanding,
};

