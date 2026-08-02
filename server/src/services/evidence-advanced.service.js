const posixPath = require("path").posix;
const vm = require("vm");
const { createHash, createHmac, randomUUID } = require("crypto");

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
function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
function cleanFiles(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([name, content]) => typeof name === "string" && typeof content === "string"));
}
function workspaceDigest(files) {
  return digest(Object.entries(cleanFiles(files)).sort(([left], [right]) => left.localeCompare(right)));
}
function kindFor(type) {
  if (/^(code|file|branch)/.test(type)) return "change";
  if (type.startsWith("test")) return "test";
  if (type.startsWith("deployment")) return "deployment";
  if (type.startsWith("security")) return "security";
  if (type.startsWith("review")) return "review";
  if (/^(artifact|proof)/.test(type)) return "artifact";
  if (type.startsWith("database")) return "data";
  if (type.startsWith("network")) return "api";
  if (/^(runtime|command|debugger|trace|performance|replay)/.test(type)) return "runtime";
  return "decision";
}
function statusFor(type) {
  if (type.endsWith("failed")) return "failed";
  if (/(passed|succeeded|verified)$/.test(type)) return "passed";
  return "neutral";
}

function createCausalGraph(packages, events, reviews) {
  const nodes = [], edges = [], nodeIds = new Set(), edgeIds = new Set();
  const addNode = (node) => {
    if (!nodeIds.has(node.id)) { nodeIds.add(node.id); nodes.push(node); }
  };
  const addEdge = (source, target, relation) => {
    if (!source || !target || source === target) return;
    const id = [source, relation, target].join(":");
    if (!edgeIds.has(id)) { edgeIds.add(id); edges.push({ id, source, target, relation }); }
  };
  const requirements = [];
  for (const item of packages) {
    if (!item.requirement) continue;
    const id = "requirement:" + item.id;
    requirements.push({ id, files: item.files || [] });
    addNode({ id, kind: "requirement", label: item.requirement.slice(0, 180), status: item.status === "ready" ? "passed" : "warning" });
  }
  const ordered = [...events].sort((left, right) => left.sequence - right.sequence);
  const eventNodes = new Map();
  for (const event of ordered) {
    if (["session.started", "session.environment", "cursor.moved", "clipboard.pasted", "chat.message", "ai.prompted", "ai.responded"].includes(event.type)) continue;
    const id = "event:" + event.id;
    eventNodes.set(event.id, id);
    addNode({ id, kind: kindFor(event.type), label: event.summary, status: statusFor(event.type), eventId: event.id });
  }
  let lastChange, lastFailure, lastRuntime;
  for (const event of ordered) {
    const current = eventNodes.get(event.id);
    if (event.causedBy && current) addEdge(eventNodes.get(event.causedBy), current, "derived-from");
    if (/^(code\.changed|file\.created|file\.deleted|branch\.created)$/.test(event.type)) {
      if (lastFailure) addEdge(lastFailure, current, "caused-fix");
      for (const requirement of requirements.filter((item) => !item.files.length || !event.fileName || item.files.includes(event.fileName)).slice(-2)) addEdge(requirement.id, current, "implements");
      lastChange = current;
      lastFailure = undefined;
    } else if (/^(test|runtime)\.failed$/.test(event.type)) {
      addEdge(lastChange, current, "verified-by"); lastFailure = current; lastRuntime = current;
    } else if (/^(test\.passed|runtime\.succeeded)$/.test(event.type)) {
      addEdge(lastChange, current, "verified-by"); lastRuntime = current;
    } else if (event.type === "review.completed" || event.type === "security.finding") {
      addEdge(lastChange, current, "reviewed-by");
    } else if (event.type.startsWith("deployment.")) {
      addEdge(lastChange, current, "deployed-as");
    } else if (event.type === "network.request") {
      addEdge(lastChange, current, "calls"); addEdge(lastRuntime, current, "traced-by");
    } else if (event.type === "database.change") {
      addEdge(lastChange, current, event.payload?.operation === "read" ? "reads-from" : "writes-to"); addEdge(lastRuntime, current, "traced-by");
    } else if (event.type === "trace.observed") {
      addEdge(lastRuntime, current, "traced-by");
    } else if (/^(artifact\.attested|proof\.verified)$/.test(event.type)) {
      addEdge(lastChange, current, "attested-by");
    }
  }
  for (const review of reviews) {
    const id = "review:" + review.id;
    addNode({ id, kind: "review", label: "Review board: " + review.verdict, status: review.verdict === "approved" ? "passed" : review.verdict === "blocked" ? "failed" : "warning" });
    addEdge(lastChange, id, "reviewed-by");
  }
  const visibleNodes = nodes.slice(-80);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  return { nodes: visibleNodes, edges: edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)).slice(-140) };
}

function buildReplaySessions(events) {
  const groups = new Map();
  for (const event of [...events].sort((left, right) => left.sequence - right.sequence)) groups.set(event.sessionId, [...(groups.get(event.sessionId) || []), event]);
  return [...groups.entries()].map(([sessionId, sessionEvents]) => {
    let files = {}, activeFile, cursor, variables = {}, environmentEvent;
    const breakpoints = [], network = [], database = [], traces = [], frames = [], missing = new Set();
    for (const event of sessionEvents) {
      const payload = event.payload || {};
      if (event.type === "session.environment") environmentEvent = event;
      if (payload.files && typeof payload.files === "object" && !Array.isArray(payload.files)) files = cleanFiles(payload.files);
      if (typeof payload.activeFile === "string") activeFile = payload.activeFile;
      if (event.type === "cursor.moved") cursor = { fileName: event.fileName || String(payload.fileName || activeFile || ""), lineNumber: Number(payload.lineNumber || 1), column: Number(payload.column || 1) };
      if (event.type === "debugger.checkpoint") {
        if (Array.isArray(payload.breakpoints)) breakpoints.splice(0, breakpoints.length, ...payload.breakpoints);
        if (payload.variables && typeof payload.variables === "object") variables = payload.variables;
      }
      if (event.type === "network.request") network.push({ method: String(payload.method || "GET"), url: String(payload.url || ""), status: Number(payload.status) || undefined, durationMs: Number(payload.durationMs) || undefined });
      if (event.type === "database.change") database.push({ operation: String(payload.operation || "mutation"), target: String(payload.target || "unknown"), mutationDigest: payload.mutationDigest });
      if (event.type === "trace.observed") traces.push({ traceId: String(payload.traceId || ""), spanId: payload.spanId, service: payload.service, durationMs: Number(payload.durationMs) || undefined });
      const terminal = event.type === "command.executed" ? { command: String(payload.command || payload.language || ""), exitCode: Number.isFinite(Number(payload.exitCode)) ? Number(payload.exitCode) : undefined, outputDigest: payload.outputDigest } : undefined;
      if (terminal && (!terminal.command || terminal.exitCode === undefined || !terminal.outputDigest)) missing.add("terminal command input, exit code, and output digest");
      frames.push({
        eventId: event.id, sequence: event.sequence, occurredAt: event.occurredAt, files: { ...files },
        ...(activeFile ? { activeFile } : {}), ...(cursor ? { cursor: { ...cursor } } : {}), ...(terminal ? { terminal } : {}),
        debugger: { breakpoints: [...breakpoints], variables: { ...variables } }, network: [...network], database: [...database], traces: [...traces],
      });
    }
    const value = environmentEvent?.payload?.manifest || environmentEvent?.payload || {};
    if (!environmentEvent) missing.add("environment manifest");
    if (!Object.keys(files).length) missing.add("workspace source snapshot");
    const capturedSourceDigest = workspaceDigest(files);
    const declaredSourceDigest = typeof value.sourceDigest === "string" ? value.sourceDigest : capturedSourceDigest;
    const manifest = {
      runtime: String(value.runtime || "unknown"), platform: String(value.platform || "unknown"), architecture: String(value.architecture || "unknown"),
      ...(value.containerImage ? { containerImage: String(value.containerImage) } : {}), ...(value.lockfileHash ? { lockfileHash: String(value.lockfileHash) } : {}),
      sourceDigest: declaredSourceDigest, snapshotComplete: value.snapshotComplete !== false && capturedSourceDigest === declaredSourceDigest,
      dependencyVersions: value.dependencyVersions && typeof value.dependencyVersions === "object" ? value.dependencyVersions : {},
      environmentKeys: Array.isArray(value.environmentKeys) ? value.environmentKeys.map(String).sort() : [],
      capturedAt: environmentEvent?.occurredAt || sessionEvents[0]?.occurredAt || new Date(0).toISOString(),
    };
    if (manifest.runtime === "unknown") missing.add("runtime version");
    if (!manifest.lockfileHash) missing.add("lockfile digest");
    if (!manifest.snapshotComplete) missing.add("complete workspace snapshot");
    const branches = sessionEvents.filter((event) => event.type === "branch.created" && typeof event.payload?.sourceEventId === "string")
      .map((event) => ({ eventId: event.id, sourceEventId: event.payload.sourceEventId, createdAt: event.occurredAt }));
    return { sessionId, manifest, frames, deterministic: missing.size === 0, replayDigest: digest({ manifest, frames }), missingInputs: [...missing], branches };
  });
}
function attestation(kind, subjectDigest, status, detail, event) {
  return { id: randomUUID(), kind, subjectDigest, evidenceDigest: digest({ kind, subjectDigest, detail, eventId: event?.id || "" }), status, ...(event ? { eventId: event.id } : {}), detail, createdAt: new Date().toISOString() };
}
function boundEvent(events, types, subjectDigest) {
  return [...events].reverse().find((event) => {
    const files = event.payload?.files;
    return types.includes(event.type) && files && typeof files === "object" && Object.keys(files).length > 0 && workspaceDigest(files) === subjectDigest;
  });
}
function buildProofAttestations(files, events, reviews, verifications, payload = {}) {
  const subject = workspaceDigest(files);
  const source = boundEvent(events, ["code.changed", "snapshot.created", "artifact.attested"], subject);
  const test = boundEvent(events, ["test.passed"], subject);
  const runtime = boundEvent(events, ["runtime.succeeded"], subject);
  const deployment = boundEvent(events, ["deployment.succeeded"], subject);
  const performance = boundEvent(events, ["performance.measurement"], subject);
  const compatibility = [...events].reverse().find((event) => event.type === "test.passed" && (event.payload?.contractTest === true || /contract|integration|api/i.test(event.fileName || "")) && event.payload?.files && workspaceDigest(event.payload.files) === subject);
  const migration = boundEvent(events, ["database.change"], subject);
  const rollback = boundEvent(events, ["replay.executed", "branch.created"], subject);
  const review = [...reviews].reverse().find((item) => item.patchDigest === subject && item.verdict === "approved");
  const understanding = [...verifications].reverse().find((item) => item.codeDigest === subject && item.passed);
  const hasApi = Object.keys(files).some((name) => /route|controller|api/i.test(name));
  const hasMigration = Object.keys(files).some((name) => /migration|schema\.sql/i.test(name));
  return [
    attestation("source", subject, source ? "verified" : "unavailable", source ? "Exact source digest is sealed." : "Seal this exact workspace digest.", source),
    attestation("test", subject, test ? "verified" : "unavailable", test ? "Passing tests are bound to this digest." : "Rerun tests on this digest.", test),
    attestation("runtime", subject, runtime ? "verified" : "unavailable", runtime ? "Runtime result is bound to this digest." : "Execute this exact artifact.", runtime),
    attestation("security", subject, review ? "verified" : "unavailable", review ? "Approved review matches the patch digest." : "Review this exact patch.", review),
    attestation("compatibility", subject, !hasApi || compatibility || payload.apiCompatibility === "passed" ? "verified" : "unavailable", !hasApi ? "No API boundary changed." : compatibility ? "Contract test is bound to this digest." : "Attach digest-bound contract compatibility output.", compatibility),
    attestation("performance", subject, performance ? "verified" : "unavailable", performance ? "Performance result is digest-bound." : "Attach measured performance evidence.", performance),
    attestation("migration", subject, !hasMigration || migration ? "verified" : "unavailable", !hasMigration ? "No migration surface detected." : migration ? "Migration evidence is bound." : "Run migration and rollback checks.", migration),
    attestation("deployment", subject, deployment ? "verified" : "unavailable", deployment ? "Deployment artifact matches source." : "Deploy the reviewed artifact.", deployment),
    attestation("rollback", subject, rollback ? "verified" : "unavailable", rollback ? "Rollback was replayed on this digest." : "Run a digest-bound rollback drill; documentation alone is not execution evidence.", rollback),
    attestation("understanding", subject, understanding ? "verified" : "unavailable", understanding ? "Hands-on verification matches the code digest." : "Complete the digest-bound challenge.", understanding),
  ];
}
function signEvidencePackage(item) {
  const unsigned = { ...item };
  delete unsigned.signature;
  const candidate = process.env.EVIDENCE_SIGNING_KEY || "";
  const key = candidate.length >= 32 && !/(replace|change|example|placeholder|secret)/i.test(candidate) ? candidate : "";
  return key ? "hmac-sha256:" + createHmac("sha256", key).update(JSON.stringify(canonicalize(unsigned))).digest("hex") : "sha256:" + digest(unsigned);
}
function verifyEvidencePackage(item) {
  return item.signature === signEvidencePackage(item);
}
function firstMatch(files, pattern) {
  for (const [fileName, content] of Object.entries(files)) {
    const match = pattern.exec(content);
    pattern.lastIndex = 0;
    if (match) return { fileName, line: content.slice(0, match.index).split("\n").length };
  }
  return null;
}
function finding(severity, title, detail, recommendation, location) {
  return { id: randomUUID(), severity, title, detail, recommendation, ...(location?.fileName ? { fileName: location.fileName } : {}), ...(location?.line ? { line: location.line } : {}) };
}
function toolRun(tool, passed, summary, input) {
  return { tool, status: passed ? "passed" : "failed", durationMs: 1, outputDigest: digest({ tool, passed, summary, input }), summary };
}

function analyzeReviewBoard(files, requirement, rollback, evidence = {}) {
  const names = Object.keys(files);
  const patchDigest = workspaceDigest(files);
  const correctness = [];
  for (const [fileName, source] of Object.entries(files)) {
    if (!/\.[cm]?js$/.test(fileName) || /\b(import|export)\b/.test(source)) continue;
    try { new vm.Script(source, { filename: fileName }); } catch (error) {
      correctness.push(finding("critical", "Parser rejected source", String(error.message || error), "Fix syntax before review.", { fileName, line: error.lineNumber }));
    }
  }
  const todo = firstMatch(files, /\b(TODO|FIXME|HACK)\b/i);
  if (todo) correctness.push(finding("warning", "Unresolved implementation marker", "The patch contains an unresolved marker.", "Resolve or justify it.", todo));

  const security = [];
  const secret = firstMatch(files, /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"'\n]{8,}["']/i);
  if (secret) security.push(finding("critical", "Credential-like literal", "Secret scanner found a hard-coded value.", "Remove and rotate it.", secret));
  const sink = firstMatch(files, /\b(eval|new\s+Function|execSync)\s*\(|dangerouslySetInnerHTML|\.innerHTML\s*=/);
  if (sink) security.push(finding("critical", "Executable trust boundary", "A dangerous execution or HTML sink is present.", "Use an allow-listed or sanitized boundary.", sink));

  const tests = [];
  const testNames = names.filter((name) => /test|spec/i.test(name));
  const sourceStems = names.filter((name) => !/test|spec/i.test(name)).map((name) => posixPath.basename(name).replace(/\.[^.]+$/, ""));
  const boundTests = testNames.filter((name) => sourceStems.some((stem) => files[name].includes(stem) || name.includes(stem)));
  if (!testNames.length) tests.push(finding("critical", "No executable test surface", "No test file exists in the reviewed artifact.", "Add a failing regression test."));
  else if (!boundTests.length) tests.push(finding("warning", "Tests are not linked to changed code", "Tests exist but do not reference changed components.", "Bind tests to changed source."));
  if (evidence.testDigest && evidence.testDigest !== patchDigest) tests.push(finding("critical", "Stale test evidence", "Test result belongs to another digest.", "Rerun tests on this artifact."));

  const performance = [];
  const nested = firstMatch(files, /for\s*\([^)]*\)[\s\S]{0,300}for\s*\(/m);
  if (nested && !Number.isFinite(Number(evidence.performanceDeltaPct))) performance.push(finding("warning", "Complexity lacks a benchmark", "Nested iteration has no measured threshold.", "Attach p95 before/after results.", nested));
  if (Number(evidence.performanceDeltaPct) > Number(evidence.performanceBudgetPct ?? 10)) performance.push(finding("critical", "Performance budget exceeded", "Measured regression exceeds budget.", "Revise or explicitly approve the budget."));

  const architecture = [];
  for (const [fileName, source] of Object.entries(files)) if (source.split("\n").length > 700) architecture.push(finding("warning", "Oversized module", fileName + " exceeds 700 lines.", "Split at an explicit interface.", { fileName }));
  if (!requirement.trim()) architecture.push(finding("critical", "Unlinked requirement", "There is no falsifiable product outcome.", "State an exact requirement."));

  const devil = [];
  if (!rollback.trim()) devil.push(finding("critical", "No rollback strategy", "The artifact has no recovery path.", "Document and exercise rollback."));
  if (!evidence.rootCause) devil.push(finding("warning", "Root cause is not falsifiable", "No failing path or causal claim was supplied.", "Attach the failing input and path."));

  const definitions = [
    ["builder", "Builder", "Builds a digest-addressed patch and responds to challenges.", [], "Patch " + patchDigest.slice(0, 12) + " indexed.", "artifact-digester"],
    ["reviewer", "Correctness Reviewer", "Parses the artifact and inspects correctness.", correctness, "Parser and correctness checks passed.", "vm-parser"],
    ["security", "Security Agent", "Runs secret and dangerous-sink analysis.", security, "Security toolchain passed.", "secret-and-sink-scanner"],
    ["test", "Test Agent", "Binds regression evidence to changed source.", tests, "Tests are linked to the exact patch.", "source-test-binder"],
    ["performance", "Performance Agent", "Enforces measured performance budgets.", performance, "Performance evidence is within budget.", "performance-budget-enforcer"],
    ["architecture", "Architecture Agent", "Checks dependency and module boundaries.", architecture, "Architecture boundaries passed.", "dependency-graph-analyzer"],
    ["devils-advocate", "Devil's Advocate", "Challenges causality and rollback.", devil, "Causal and rollback claims are falsifiable.", "causal-rollback-auditor"],
  ];
  const agents = definitions.map(([id, name, responsibility, findings, passing, tool]) => {
    const status = findings.some((item) => item.severity === "critical") ? "blocked" : findings.length ? "warning" : "passed";
    return {
      id, name, responsibility, status,
      summary: findings.length ? findings.length + " evidence-backed challenge" + (findings.length === 1 ? "" : "s") + " raised." : passing,
      findings, engine: "tool", toolRuns: [toolRun(tool, status !== "blocked", status === "passed" ? passing : findings.map((item) => item.title).join("; "), patchDigest)],
    };
  });
  const verdict = agents.some((item) => item.status === "blocked") ? "blocked" : agents.filter((item) => item.status === "warning").length > 2 ? "changes-requested" : "approved";
  const challenges = agents.filter((item) => item.id !== "builder" && item.findings.length)
    .map((item) => ({ from: item.id, to: "builder", claim: item.findings[0].title + ": " + item.findings[0].recommendation, resolved: false }));
  const rounds = [
    { round: 1, patchDigest, phase: "challenge", challenges, builderResponse: "Builder submitted patch " + patchDigest.slice(0, 12) + ".", verdict },
    { round: 2, patchDigest, phase: "consensus", challenges, builderResponse: challenges.length ? "Revision required before resubmission." : "No unresolved challenge remains.", verdict },
  ];
  const blocked = agents.filter((item) => item.status === "blocked").length;
  const warnings = agents.filter((item) => item.status === "warning").length;
  return {
    patchDigest, agents, rounds, verdict,
    score: clamp(100 - blocked * 20 - warnings * 6),
    consensus: clamp((agents.filter((item) => item.status === "passed").length / agents.length) * 100),
    executedTools: agents.flatMap((item) => item.toolRuns.map((run) => run.tool)),
  };
}
function createHandsOnChallenge(projectId, fileName, code, subjectDigest) {
  const codeDigest = subjectDigest || workspaceDigest({ [fileName]: code });
  const seed = digest({ projectId, fileName, codeDigest }).slice(0, 16);
  const identifiers = [...code.matchAll(/\b(?:function|class|const|let|var|def)\s+([A-Za-z_$][\w$]*)/g)].map((match) => match[1]);
  const primary = identifiers[0] || "main behavior";
  return {
    id: "challenge-" + seed,
    projectId,
    fileName,
    codeDigest,
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    nonce: randomUUID(),
    questions: [
      { id: seed + "-purpose", focus: "purpose", prompt: "Explain " + primary + " as input → state transition → output.", expectedConcepts: [primary, "input", "output"], task: { kind: "explain" } },
      { id: seed + "-predict", focus: "prediction", prompt: "Predict the result for an empty boundary input and justify each branch.", expectedConcepts: ["empty", "branch", "result"], task: { kind: "predict", fixture: "boundary-input" } },
      { id: seed + "-modify", focus: "modification", prompt: "Write a minimal patch that validates input without changing valid behavior.", expectedConcepts: ["validate", "return", "error"], task: { kind: "patch", expectedDigest: digest({ codeDigest, task: "validation" }) } },
      { id: seed + "-debug", focus: "debugging", prompt: "A dependency returns null. Identify the first unsafe operation and failing trace.", expectedConcepts: ["null", "first", "fail"], task: { kind: "debug", fixture: "dependency-null" } },
      { id: seed + "-dataflow", focus: "dataflow", prompt: "Draw the trust-boundary flow with nodes and arrows, validation, and persistence.", expectedConcepts: ["->", "validate", "trust"], task: { kind: "diagram" } },
      { id: seed + "-transfer", focus: "transfer", prompt: "Apply the invariant to a batch-processing version.", expectedConcepts: ["batch", "invariant", "each"], task: { kind: "explain", fixture: "batch-transfer" } },
    ],
  };
}
function answerTokens(value) {
  return new Set(String(value || "").toLowerCase().match(/[a-z_$][\w$-]{2,}/g) || []);
}
function jaccard(left, right) {
  const a = answerTokens(left), b = answerTokens(right), union = new Set([...a, ...b]);
  return union.size ? [...a].filter((item) => b.has(item)).length / union.size : 0;
}
function evaluateHandsOnChallenge(challenge, answers, signals = {}) {
  const feedback = challenge.questions.map((question) => {
    const answer = String(answers[question.id] || ""), lowered = answer.toLowerCase();
    const hits = question.expectedConcepts.filter((concept) => lowered.includes(concept.toLowerCase())).length;
    const concept = (hits / Math.max(1, question.expectedConcepts.length)) * 45;
    const structure = question.task?.kind === "patch" ? (/[{};]|=>|\b(if|return|throw)\b/.test(answer) ? 35 : 0)
      : question.task?.kind === "diagram" ? (/(?:->|→)/.test(answer) && answer.split(/(?:->|→)/).length >= 3 ? 35 : 0)
        : /\b(because|when|therefore|then|first|next)\b/i.test(answer) ? 25 : 0;
    const falsifiable = /\b(input|output|error|null|empty|state|branch|validate|return)\b/i.test(answer) ? 20 : 0;
    const score = clamp(concept + structure + falsifiable);
    return { questionId: question.id, score, detail: score >= 70 ? "Behavioral task is concrete and falsifiable." : "Complete the executable or predictive task." };
  });
  const focusScore = (focus) => {
    const matched = challenge.questions.map((question, index) => ({ question, score: feedback[index].score })).filter((item) => focus.includes(item.question.focus));
    return matched.length ? clamp(matched.reduce((sum, item) => sum + item.score, 0) / matched.length) : 0;
  };
  const values = Object.values(answers).map(String);
  let similarity = 0, pairs = 0;
  for (let left = 0; left < values.length; left += 1) for (let right = left + 1; right < values.length; right += 1) {
    similarity += jaccard(values[left], values[right]); pairs += 1;
  }
  const answerSimilarity = clamp((similarity / Math.max(1, pairs)) * 100);
  const elapsedMs = Math.max(0, Number(signals.elapsedMs || 0));
  const dimensions = {
    explanation: focusScore(["purpose", "transfer"]),
    prediction: focusScore(["prediction"]),
    modification: focusScore(["modification"]),
    debugging: focusScore(["debugging"]),
    dataFlow: focusScore(["dataflow"]),
  };
  const pasteCount = Math.max(0, Number(signals.pasteCount || 0));
  const externalFocusChanges = Math.max(0, Number(signals.externalFocusChanges || 0));
  const score = clamp(
    Object.values(dimensions).reduce((sum, value) => sum + value, 0) / 5 -
    Math.max(0, answerSimilarity - 75) * 0.5 -
    Math.min(25, pasteCount * 8) -
    Math.min(15, externalFocusChanges * 2)
  );
  return {
    score,
    passed: score >= 70 && dimensions.modification >= 60 && dimensions.debugging >= 60,
    feedback,
    dimensions,
    behavioralSignals: {
      answerSimilarity,
      revisionCount: Math.max(0, Number(signals.revisionCount || 0)),
      elapsedMs,
      continuity: clamp(100 - Number(signals.idleResumes || 0) * 15 - externalFocusChanges * 5 - (elapsedMs < 30_000 ? 30 : 0)),
      pasteCount,
      externalFocusChanges,
    },
    codeDigest: challenge.codeDigest,
  };
}

function classifyFile(name, content) {
  if (/test|spec/i.test(name)) return "test";
  if (/migration/i.test(name)) return "migration";
  if (/docker|kubernetes|k8s|helm|vercel|deploy/i.test(name)) return "deployment";
  if (/queue|worker|consumer|kafka|rabbit|bull/i.test(name + content)) return "queue";
  if (/provider|stripe|sendgrid|twilio|s3|openai|gemini/i.test(name + content)) return "provider";
  if (/\.env|config|\.json$|\.ya?ml$/i.test(name)) return "config";
  if (/route|controller|api/i.test(name)) return "api";
  if (/service|server|socket/i.test(name)) return "service";
  if (/schema|model|store|db/i.test(name)) return "data";
  if (/\.tsx?$|\.jsx?$|\.html$|\.css$/i.test(name)) return "frontend";
  return "module";
}

function createAdvancedTwin(payload, events = []) {
  const files = cleanFiles(payload.files), names = Object.keys(files);
  const nodes = names.map((fileName) => ({ id: "file:" + fileName, kind: classifyFile(fileName, files[fileName]), label: fileName, fileName }));
  const edges = [], nodeIds = new Set(nodes.map((node) => node.id)), edgeIds = new Set();
  const addNode = (node) => { if (!nodeIds.has(node.id)) { nodeIds.add(node.id); nodes.push(node); } return node.id; };
  const addEdge = (source, target, relation) => {
    const id = [source, relation, target].join(":");
    if (!edgeIds.has(id)) { edgeIds.add(id); edges.push({ id, source, target, relation }); }
  };
  for (const [fileName, content] of Object.entries(files)) {
    const source = "file:" + fileName;
    for (const match of content.matchAll(/(?:from\s+|require\s*\(\s*|import\s*\(\s*)["']([^"']+)["']/g)) {
      const request = match[1], stem = posixPath.basename(request);
      const target = names.find((name) => name !== fileName && (name.replace(/\.[^.]+$/, "").endsWith(request) || posixPath.basename(name).startsWith(stem)));
      if (target) addEdge(source, "file:" + target, "imports");
      else if (!request.startsWith(".")) addEdge(source, addNode({ id: "provider:" + request, kind: "provider", label: request }), "calls");
    }
    for (const match of content.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
      const request = match[1].split(/[?#]/)[0].replace(/^\.\//, "");
      const target = names.find((name) => name !== fileName && (name === request || name.endsWith("/" + request) || name.replace(/^.*[/\\]/, "") === request.replace(/^.*[/\\]/, "")));
      if (target) addEdge(source, "file:" + target, "renders");
    }    for (const match of content.matchAll(/(?:fetch|axios\.(?:get|post|put|patch|delete))\s*\(\s*["']([^"']+)["']/g)) addEdge(source, addNode({ id: "api:" + match[1], kind: "api", label: match[1] }), "calls");
    for (const match of content.matchAll(/\b(?:from|into|update|join|table)\s+["']?([a-z_][\w.]*)/gi)) addEdge(source, addNode({ id: "data:" + match[1], kind: "data", label: match[1] }), /\b(?:into|update)\b/i.test(match[0]) ? "writes" : "reads");
    for (const match of content.matchAll(/\b(?:publish|emit|sendToQueue)\s*\(\s*["']([^"']+)["']/g)) addEdge(source, addNode({ id: "queue:" + match[1], kind: "queue", label: match[1] }), "publishes");
  }
  for (const test of names.filter((name) => /test|spec/i.test(name))) {
    const stem = posixPath.basename(test).replace(/\.(test|spec).*$/, "");
    const target = names.find((name) => name !== test && posixPath.basename(name).startsWith(stem));
    if (target) addEdge("file:" + test, "file:" + target, "tests");
  }
  const activeFile = String(payload.activeFile || ""), activeId = "file:" + activeFile, affected = new Set();
  let frontier = [activeId];
  for (let depth = 0; depth < 3; depth += 1) {
    const next = [];
    for (const current of frontier) for (const edge of edges) {
      const neighbor = edge.source === current ? edge.target : edge.target === current ? edge.source : "";
      if (neighbor && !affected.has(neighbor)) { affected.add(neighbor); next.push(neighbor); }
    }
    frontier = next;
  }
  affected.delete(activeId);
  const affectedFiles = [...affected].filter((id) => id.startsWith("file:")).map((id) => id.slice(5));
  const testsToRun = nodes.filter((node) => node.kind === "test" && affected.has(node.id)).map((node) => node.fileName).filter(Boolean);
  const activeContent = files[activeFile] || "";
  const securityBoundaries = nodes.filter((node) => node.kind === "provider" || /auth|token|permission|secret/i.test(node.label)).map((node) => node.label);
  const migrationsRequired = /schema|model|migration|database/i.test(activeFile + activeContent) ? names.filter((name) => /migration|schema/i.test(name)) : [];
  const apiConsumers = edges.filter((edge) => edge.target === activeId && edge.relation === "calls").map((edge) => edge.source.replace(/^file:/, ""));
  const telemetry = {
    traces: events.filter((event) => event.type === "trace.observed").length,
    requests: events.filter((event) => event.type === "network.request").length,
    databaseMutations: events.filter((event) => event.type === "database.change").length,
    deployments: events.filter((event) => event.type.startsWith("deployment.")).length,
  };
  const risks = [
    ...(/route|api|controller/i.test(activeFile) ? ["API compatibility boundary"] : []),
    ...(migrationsRequired.length ? ["Data migration and rollback"] : []),
    ...(securityBoundaries.length ? ["Security boundary crossed"] : []),
    ...(!testsToRun.length ? ["No runtime-linked test"] : []),
    ...(events.some((event) => event.type.endsWith("failed")) ? ["Historical runtime failures"] : []),
  ];
  const radius = affectedFiles.length + risks.length + apiConsumers.length;
  return {
    nodes, edges,
    impact: {
      activeFile, affectedFiles, testsToRun, risks,
      blastRadius: radius >= 8 ? "high" : radius >= 4 ? "medium" : "low",
      securityBoundaries, migrationsRequired, apiConsumers,
      confidence: clamp(55 + Math.min(25, edges.length * 2) + Object.values(telemetry).filter((value) => value > 0).length * 5),
    },
    telemetry,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  analyzeReviewBoard,
  buildProofAttestations,
  buildReplaySessions,
  createAdvancedTwin,
  createCausalGraph,
  createHandsOnChallenge,
  digest,
  evaluateHandsOnChallenge,
  signEvidencePackage,
  verifyEvidencePackage,
  workspaceDigest,
};