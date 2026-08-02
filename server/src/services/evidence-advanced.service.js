const { createHash, randomUUID } = require("crypto");
const signing = require("./evidence-signing.service");
const codeIntelligence = require("./evidence-code-intelligence.service");
const understandingExecution = require("./understanding-execution.service");

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
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      nodes.push(node);
    }
    return node.id;
  };
  const addEdge = (source, target, relation) => {
    if (!source || !target || source === target) return;
    const id = [source, relation, target].join(":");
    if (!edgeIds.has(id)) {
      edgeIds.add(id);
      edges.push({ id, source, target, relation });
    }
  };
  const requirements = packages.filter((item) => item.requirement).map((item) => ({
    packageId: item.id,
    id: addNode({ id: "requirement:" + item.id, kind: "requirement", label: item.requirement.slice(0, 180), status: item.status === "ready" ? "passed" : "warning" }),
    digest: item.changeDigest,
  }));
  const eventNodes = new Map();
  const eventById = new Map(events.map((event) => [event.id, event]));
  for (const event of [...events].sort((left, right) => left.sequence - right.sequence)) {
    if (["session.started", "session.environment", "cursor.moved", "clipboard.pasted", "chat.message", "ai.prompted", "ai.responded"].includes(event.type)) continue;
    eventNodes.set(event.id, addNode({ id: "event:" + event.id, kind: kindFor(event.type), label: event.summary, status: statusFor(event.type), eventId: event.id }));
  }
  const digestFor = (event) => {
    const payload = event.payload || {};
    if (typeof payload.subjectDigest === "string") return payload.subjectDigest;
    if (typeof payload.sourceDigest === "string") return payload.sourceDigest;
    if (typeof payload.changeDigest === "string") return payload.changeDigest;
    if (payload.files && typeof payload.files === "object" && Object.keys(payload.files).length) return workspaceDigest(payload.files);
    return "";
  };
  const changeTypes = new Set(["code.changed", "file.created", "file.deleted", "branch.created"]);
  const changesByDigest = new Map();
  for (const event of events) {
    if (!eventNodes.has(event.id) || !changeTypes.has(event.type)) continue;
    const value = digestFor(event);
    if (value) changesByDigest.set(value, [...(changesByDigest.get(value) || []), event]);
  }
  for (const event of events) {
    const current = eventNodes.get(event.id);
    if (!current) continue;
    const payload = event.payload || {};
    const eventDigest = digestFor(event);
    if (event.causedBy) {
      addEdge(eventNodes.get(event.causedBy), current, "derived-from");
      const cause = eventById.get(event.causedBy);
      if (changeTypes.has(event.type) && /^(test|runtime)\.failed$/.test(cause?.type || "")) addEdge(eventNodes.get(event.causedBy), current, "caused-fix");
    }
    for (const resolved of Array.isArray(payload.resolvesEventIds) ? payload.resolvesEventIds : []) addEdge(eventNodes.get(resolved), current, "caused-fix");
    const traceId = String(payload.traceId || "");
    if (traceId) {
      const traceNode = addNode({ id: "trace:" + traceId, kind: "runtime", label: "Trace " + traceId, status: "neutral" });
      addEdge(current, traceNode, "traced-by");
      if (payload.parentSpanId) {
        const parent = events.find((candidate) => candidate.payload?.traceId === traceId && candidate.payload?.spanId === payload.parentSpanId);
        addEdge(eventNodes.get(parent?.id), current, "traced-by");
      }
    }
    if (changeTypes.has(event.type)) {
      for (const requirement of requirements) {
        if ((eventDigest && requirement.digest === eventDigest) || payload.requirementId === requirement.packageId) addEdge(requirement.id, current, "implements");
      }
      continue;
    }
    const linkedChanges = changesByDigest.get(eventDigest) || [];
    if (/^(test\.|runtime\.|command\.)/.test(event.type)) for (const change of linkedChanges) addEdge(eventNodes.get(change.id), current, "verified-by");
    if (event.type === "review.completed" || event.type === "security.finding") for (const change of linkedChanges) addEdge(eventNodes.get(change.id), current, "reviewed-by");
    if (event.type.startsWith("deployment.")) for (const change of linkedChanges) addEdge(eventNodes.get(change.id), current, "deployed-as");
    if (/^(artifact\.attested|proof\.verified)$/.test(event.type)) for (const change of linkedChanges) addEdge(eventNodes.get(change.id), current, "attested-by");
    if (["network.request", "database.change", "trace.observed"].includes(event.type)) {
      for (const change of linkedChanges) addEdge(eventNodes.get(change.id), current, event.type === "network.request" ? "calls" : event.type === "database.change" ? (payload.operation === "read" ? "reads-from" : "writes-to") : "traced-by");
    }
  }
  for (const review of reviews) {
    const id = addNode({ id: "review:" + review.id, kind: "review", label: "Review board: " + review.verdict, status: review.verdict === "approved" ? "passed" : review.verdict === "blocked" ? "failed" : "warning" });
    for (const change of changesByDigest.get(review.patchDigest) || []) addEdge(eventNodes.get(change.id), id, "reviewed-by");
  }
  const visibleNodes = nodes.slice(-120);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  return { nodes: visibleNodes, edges: edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)).slice(-240) };
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
      const terminal = event.type === "command.executed" ? { command: String(payload.command || payload.language || ""), language: String(payload.language || ""), exitCode: Number.isFinite(Number(payload.exitCode)) ? Number(payload.exitCode) : undefined, outputDigest: payload.outputDigest } : undefined;
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
      environment: value.environment && typeof value.environment === "object" ? Object.fromEntries(Object.entries(value.environment).map(([key, item]) => [String(key), String(item)])) : {},
      capturedAt: environmentEvent?.occurredAt || sessionEvents[0]?.occurredAt || new Date(0).toISOString(),
    };
    if (manifest.runtime === "unknown") missing.add("runtime version");
    if (!manifest.lockfileHash) missing.add("lockfile digest");
    if (!manifest.snapshotComplete) missing.add("complete workspace snapshot");
    if (manifest.environmentKeys.some((key) => !Object.hasOwn(manifest.environment, key))) missing.add("sealed environment values");
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
    attestation("compatibility", subject, !hasApi || compatibility ? "verified" : "unavailable", !hasApi ? "No API boundary changed." : compatibility ? "Contract test is bound to this digest." : "Attach digest-bound contract compatibility output.", compatibility),
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
  return signing.sign(unsigned, "evidence").signature;
}
function verifyEvidencePackage(item) {
  const unsigned = { ...item };
  delete unsigned.signature;
  return signing.verify(unsigned, item.signature, {
    algorithm: item.signatureAlgorithm,
    issuer: item.signatureIssuer,
    keyId: item.signatureKeyId,
  }, "evidence");
}
function evidenceSigningIdentity() {
  const identity = signing.purposeConfig("evidence");
  return {
    algorithm: identity.algorithm,
    issuer: identity.issuer,
    keyId: identity.keyId,
  };
}
function createHandsOnChallenge(projectId, fileName, code, subjectDigest) {
  const codeDigest = subjectDigest || workspaceDigest({ [fileName]: code });
  const seed = digest({ projectId, fileName, codeDigest }).slice(0, 16);
  const primary = understandingExecution.sourceAnalysis(fileName, code).primary || "main behavior";
  return {
    id: "challenge-" + seed,
    projectId,
    fileName,
    codeDigest,
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    nonce: randomUUID(),
    questions: [
      { id: seed + "-purpose", focus: "purpose", prompt: "Explain " + primary + " as input → state transition → output.", expectedConcepts: [primary, "input", "output"], task: { kind: "explain" } },
      { id: seed + "-predict", focus: "prediction", prompt: "Predict the exact serialized result for the hidden empty-input execution and justify each branch.", expectedConcepts: ["empty", "branch", "result"], task: { kind: "predict", fixture: "boundary-input" } },
      { id: seed + "-modify", focus: "modification", prompt: "Return the complete replacement file with a minimal input-validation patch that preserves valid behavior.", expectedConcepts: ["validate", "return", "error"], task: { kind: "patch", expectedDigest: digest({ codeDigest, task: "validation" }) } },
      { id: seed + "-debug", focus: "debugging", prompt: "A dependency returns null. Identify the first unsafe operation and failing trace.", expectedConcepts: ["null", "first", "fail"], task: { kind: "debug", fixture: "dependency-null" } },
      { id: seed + "-dataflow", focus: "dataflow", prompt: "Draw the compiler-visible dataflow with parameter, calls, state, return, validation, and persistence nodes.", expectedConcepts: ["->", "validate", "trust"], task: { kind: "diagram" } },
      { id: seed + "-transfer", focus: "transfer", prompt: "Apply the invariant to a batch-processing version.", expectedConcepts: ["batch", "invariant", "each"], task: { kind: "explain", fixture: "batch-transfer" } },
    ],
  };
}
function createAdvancedTwin(payload, events = []) {
  return codeIntelligence.createDigitalTwin(payload, events);
}

module.exports = {
  buildProofAttestations,
  buildReplaySessions,
  createAdvancedTwin,
  createCausalGraph,
  createHandsOnChallenge,
  digest,
  evidenceSigningIdentity,
  signEvidencePackage,
  verifyEvidencePackage,
  workspaceDigest,
};