import type {
  ArenaScorecard,
  ChangeEvidencePackage,
  EngineeringDigitalTwin,
  EngineeringEvent,
  EngineeringEventType,
  EvidenceActor,
  EvidenceGraphEdge,
  EvidenceGraphNode,
  EvidenceOSSnapshot,
  ReviewAgentResult,
  ReviewBoardRun,
  UnderstandingChallenge,
  UnderstandingVerification,
} from "@shared/types/evidence";

export type EvidenceEventInput = {
  type: EngineeringEventType;
  summary: string;
  source?: string;
  fileName?: string;
  payload?: Record<string, unknown>;
  actor?: EvidenceActor;
  causedBy?: string;
  occurredAt?: string;
};

function makeId(prefix: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  return prefix + "-" + id;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value as Record<string, unknown>).sort().reduce<Record<string, unknown>>((result, key) => {
    result[key] = canonical((value as Record<string, unknown>)[key]);
    return result;
  }, {});
}

const SHA256_ROUND_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotateRight(value: number, count: number) {
  return (value >>> count) | (value << (32 - count));
}

function sha256(input: string) {
  const bytes = typeof TextEncoder !== "undefined"
    ? Array.from(new TextEncoder().encode(input))
    : Array.from(unescape(encodeURIComponent(input)), (character) => character.charCodeAt(0));
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const high = Math.floor(bitLength / 0x100000000);
  const low = bitLength >>> 0;
  for (let shift = 24; shift >= 0; shift -= 8) bytes.push((high >>> shift) & 0xff);
  for (let shift = 24; shift >= 0; shift -= 8) bytes.push((low >>> shift) & 0xff);

  const state = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const words = new Array<number>(64);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const base = offset + index * 4;
      words[index] = ((bytes[base] << 24) | (bytes[base + 1] << 16) | (bytes[base + 2] << 8) | bytes[base + 3]) | 0;
    }
    for (let index = 16; index < 64; index += 1) {
      const left = words[index - 15];
      const right = words[index - 2];
      const sigma0 = rotateRight(left, 7) ^ rotateRight(left, 18) ^ (left >>> 3);
      const sigma1 = rotateRight(right, 17) ^ rotateRight(right, 19) ^ (right >>> 10);
      words[index] = (words[index - 16] + sigma0 + words[index - 7] + sigma1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = state;
    for (let index = 0; index < 64; index += 1) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temporary1 = (h + sum1 + choice + SHA256_ROUND_CONSTANTS[index] + words[index]) | 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sum0 + majority) | 0;
      h = g; g = f; f = e; e = (d + temporary1) | 0;
      d = c; c = b; b = a; a = (temporary1 + temporary2) | 0;
    }
    state[0] = (state[0] + a) | 0;
    state[1] = (state[1] + b) | 0;
    state[2] = (state[2] + c) | 0;
    state[3] = (state[3] + d) | 0;
    state[4] = (state[4] + e) | 0;
    state[5] = (state[5] + f) | 0;
    state[6] = (state[6] + g) | 0;
    state[7] = (state[7] + h) | 0;
  }
  return state.map((word) => (word >>> 0).toString(16).padStart(8, "0")).join("");
}

export function localDigest(value: unknown) {
  return sha256(JSON.stringify(canonical(value)));
}

export function localWorkspaceDigest(files: Record<string, string>) {
  return localDigest(Object.entries(files).sort(([left], [right]) => left.localeCompare(right)));
}

export function emptyEvidenceSnapshot(projectId: string): EvidenceOSSnapshot {
  return {
    projectId,
    events: [],
    packages: [],
    reviews: [],
    verifications: [],
    graph: { nodes: [], edges: [] },
    scorecard: {
      finalCorrectness: 0,
      problemSolvingProcess: 0,
      debuggingAbility: 0,
      testQuality: 0,
      codeComprehension: 0,
      securityAwareness: 0,
      evidenceIntegrity: 100,
      aiDependence: "Low",
    },
    integrity: { verified: true, checkedEvents: 0 },
    replay: [],
    arenas: [],
  };
}

function graphFor(snapshot: EvidenceOSSnapshot) {
  const nodes: EvidenceGraphNode[] = [];
  const edges: EvidenceGraphEdge[] = [];
  const ids = new Set<string>();
  const addNode = (node: EvidenceGraphNode) => {
    if (!ids.has(node.id)) {
      ids.add(node.id);
      nodes.push(node);
    }
  };
  const addEdge = (source: string | undefined, target: string | undefined, relation: EvidenceGraphEdge["relation"]) => {
    if (!source || !target || source === target) return;
    const id = [source, relation, target].join(":");
    if (!edges.some((edge) => edge.id === id)) edges.push({ id, source, target, relation });
  };
  const requirements = snapshot.packages.filter((item) => item.requirement).map((item) => {
    const id = "requirement:" + item.id;
    addNode({ id, kind: "requirement", label: item.requirement, status: item.status === "ready" ? "passed" : "warning" });
    return { id, digest: item.changeDigest };
  });
  const eventNodes = new Map<string, string>();
  snapshot.events
    .filter((event) => !["session.started", "session.environment", "cursor.moved", "clipboard.pasted", "chat.message", "ai.prompted", "ai.responded"].includes(event.type))
    .slice(-60)
    .forEach((event) => {
      const kind: EvidenceGraphNode["kind"] = /^(code|file|branch)/.test(event.type) ? "change"
        : event.type.startsWith("test") ? "test"
          : event.type.startsWith("deployment") ? "deployment"
            : event.type.startsWith("security") ? "security"
              : event.type.startsWith("review") ? "review"
                : event.type.startsWith("database") ? "data"
                  : event.type.startsWith("network") ? "api"
                    : /^(artifact|proof)/.test(event.type) ? "artifact"
                      : /^(runtime|command|debugger|trace|performance|replay)/.test(event.type) ? "runtime" : "decision";
      const id = "event:" + event.id;
      eventNodes.set(event.id, id);
      addNode({
        id,
        kind,
        label: event.summary,
        status: event.type.endsWith("failed") ? "failed" : /(passed|succeeded|verified)$/.test(event.type) ? "passed" : "neutral",
        eventId: event.id,
      });
    });
  const eventDigest = (event: EngineeringEvent) => {
    const payload = event.payload || {};
    if (typeof payload.subjectDigest === "string") return payload.subjectDigest;
    if (typeof payload.sourceDigest === "string") return payload.sourceDigest;
    if (typeof payload.changeDigest === "string") return payload.changeDigest;
    if (payload.files && typeof payload.files === "object" && !Array.isArray(payload.files)) {
      const files = Object.fromEntries(Object.entries(payload.files).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
      if (Object.keys(files).length) return localWorkspaceDigest(files);
    }
    return "";
  };
  const changeTypes = new Set<EngineeringEvent["type"]>(["code.changed", "file.created", "file.deleted", "branch.created"]);
  const changesByDigest = new Map<string, EngineeringEvent[]>();
  snapshot.events.forEach((event) => {
    if (!changeTypes.has(event.type)) return;
    const value = eventDigest(event);
    if (value) changesByDigest.set(value, [...(changesByDigest.get(value) || []), event]);
  });
  for (const event of snapshot.events) {
    const current = eventNodes.get(event.id);
    if (!current) continue;
    const payload = event.payload || {};
    if (event.causedBy) {
      addEdge(eventNodes.get(event.causedBy), current, "derived-from");
      const cause = snapshot.events.find((candidate) => candidate.id === event.causedBy);
      if (changeTypes.has(event.type) && /^(test|runtime)\.failed$/.test(cause?.type || "")) addEdge(eventNodes.get(event.causedBy), current, "caused-fix");
    }
    for (const resolved of Array.isArray(payload.resolvesEventIds) ? payload.resolvesEventIds : []) addEdge(eventNodes.get(String(resolved)), current, "caused-fix");
    const traceId = typeof payload.traceId === "string" ? payload.traceId : "";
    if (traceId) {
      const traceNode = "trace:" + traceId;
      addNode({ id: traceNode, kind: "runtime", label: "Trace " + traceId, status: "neutral" });
      addEdge(current, traceNode, "traced-by");
    }
    const digest = eventDigest(event);
    if (changeTypes.has(event.type)) {
      requirements.filter((item) => item.digest === digest)
        .forEach((item) => addEdge(item.id, current, "implements"));
      continue;
    }
    const changes = changesByDigest.get(digest) || [];
    const relation: EvidenceGraphEdge["relation"] | undefined = /^(test\.|runtime\.|command\.)/.test(event.type) ? "verified-by"
      : event.type === "review.completed" || event.type === "security.finding" ? "reviewed-by"
        : event.type.startsWith("deployment.") ? "deployed-as"
          : event.type === "network.request" ? "calls"
            : event.type === "database.change" ? payload.operation === "read" ? "reads-from" : "writes-to"
              : event.type === "artifact.attested" || event.type === "proof.verified" ? "attested-by" : undefined;
    if (relation) changes.forEach((change) => addEdge(eventNodes.get(change.id), current, relation));
  }  return { nodes, edges };
}

function replayFor(events: EngineeringEvent[]): EvidenceOSSnapshot["replay"] {
  const groups = new Map<string, EngineeringEvent[]>();
  [...events].sort((left, right) => left.sequence - right.sequence)
    .forEach((event) => groups.set(event.sessionId, [...(groups.get(event.sessionId) || []), event]));
  return [...groups.entries()].map(([sessionId, sessionEvents]) => {
    let files: Record<string, string> = {};
    let activeFile: string | undefined;
    let cursor: { fileName: string; lineNumber: number; column: number } | undefined;
    let variables: Record<string, unknown> = {};
    let environment: EngineeringEvent | undefined;
    const breakpoints: Array<{ fileName: string; line: number }> = [];
    const network: Array<{ method: string; url: string; status?: number; durationMs?: number }> = [];
    const database: Array<{ operation: string; target: string; mutationDigest?: string }> = [];
    const traces: Array<{ traceId: string; spanId?: string; service?: string; durationMs?: number }> = [];
    const frames: EvidenceOSSnapshot["replay"][number]["frames"] = [];
    const missing = new Set<string>();
    sessionEvents.forEach((event) => {
      const payload = event.payload || {};
      if (event.type === "session.environment") environment = event;
      if (payload.files && typeof payload.files === "object" && !Array.isArray(payload.files)) {
        files = Object.fromEntries(Object.entries(payload.files).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
      }
      if (typeof payload.activeFile === "string") activeFile = payload.activeFile;
      if (event.type === "cursor.moved") cursor = {
        fileName: event.fileName || String(payload.fileName || activeFile || ""),
        lineNumber: Number(payload.lineNumber || 1),
        column: Number(payload.column || 1),
      };
      if (event.type === "debugger.checkpoint") {
        if (Array.isArray(payload.breakpoints)) {
          breakpoints.splice(0, breakpoints.length, ...payload.breakpoints.filter((item): item is { fileName: string; line: number } =>
            Boolean(item && typeof item === "object" && typeof (item as { fileName?: unknown }).fileName === "string" && Number.isFinite(Number((item as { line?: unknown }).line)))
          ).map((item) => ({ fileName: item.fileName, line: Number(item.line) })));
        }
        if (payload.variables && typeof payload.variables === "object" && !Array.isArray(payload.variables)) variables = payload.variables as Record<string, unknown>;
      }
      if (event.type === "network.request") network.push({
        method: String(payload.method || "GET"),
        url: String(payload.url || ""),
        ...(Number.isFinite(Number(payload.status)) ? { status: Number(payload.status) } : {}),
        ...(Number.isFinite(Number(payload.durationMs)) ? { durationMs: Number(payload.durationMs) } : {}),
      });
      if (event.type === "database.change") database.push({
        operation: String(payload.operation || "mutation"),
        target: String(payload.target || "unknown"),
        ...(typeof payload.mutationDigest === "string" ? { mutationDigest: payload.mutationDigest } : {}),
      });
      if (event.type === "trace.observed") traces.push({
        traceId: String(payload.traceId || ""),
        ...(typeof payload.spanId === "string" ? { spanId: payload.spanId } : {}),
        ...(typeof payload.service === "string" ? { service: payload.service } : {}),
        ...(Number.isFinite(Number(payload.durationMs)) ? { durationMs: Number(payload.durationMs) } : {}),
      });
      const terminal = event.type === "command.executed" ? {
        command: String(payload.command || payload.language || ""),
        ...(typeof payload.language === "string" ? { language: payload.language } : {}),
        ...(Number.isFinite(Number(payload.exitCode)) ? { exitCode: Number(payload.exitCode) } : {}),
        ...(typeof payload.outputDigest === "string" ? { outputDigest: payload.outputDigest } : {}),
      } : undefined;
      if (terminal && (!terminal.command || terminal.exitCode === undefined || !terminal.outputDigest)) missing.add("terminal command input, exit code, and output digest");
      frames.push({
        eventId: event.id,
        sequence: event.sequence,
        occurredAt: event.occurredAt,
        files: { ...files },
        ...(activeFile ? { activeFile } : {}),
        ...(cursor ? { cursor: { ...cursor } } : {}),
        ...(terminal ? { terminal } : {}),
        debugger: { breakpoints: [...breakpoints], variables: { ...variables } },
        network: [...network],
        database: [...database],
        traces: [...traces],
      });
    });
    if (!environment) missing.add("environment manifest");
    if (!Object.keys(files).length) missing.add("workspace source snapshot");
    const value = (environment?.payload.manifest || environment?.payload || {}) as Record<string, unknown>;
    const capturedSourceDigest = localWorkspaceDigest(files);
    const declaredSourceDigest = typeof value.sourceDigest === "string" ? value.sourceDigest : capturedSourceDigest;
    const manifest = {
      runtime: String(value.runtime || "unknown"),
      platform: String(value.platform || "unknown"),
      architecture: String(value.architecture || "unknown"),
      ...(value.containerImage ? { containerImage: String(value.containerImage) } : {}),
      ...(value.lockfileHash ? { lockfileHash: String(value.lockfileHash) } : {}),
      sourceDigest: declaredSourceDigest,
      snapshotComplete: value.snapshotComplete !== false && capturedSourceDigest === declaredSourceDigest,
      dependencyVersions: typeof value.dependencyVersions === "object" && value.dependencyVersions ? value.dependencyVersions as Record<string, string> : {},
      environmentKeys: Array.isArray(value.environmentKeys) ? value.environmentKeys.map(String).sort() : [],
      environment: value.environment && typeof value.environment === "object" ? Object.fromEntries(Object.entries(value.environment).map(([key, item]) => [String(key), String(item)])) : {},
      capturedAt: environment?.occurredAt || sessionEvents[0]?.occurredAt || new Date(0).toISOString(),
    };
    if (manifest.runtime === "unknown") missing.add("runtime version");
    if (!manifest.lockfileHash) missing.add("lockfile digest");
    if (!manifest.snapshotComplete) missing.add("complete workspace snapshot");
    if (manifest.environmentKeys.some((key) => !Object.hasOwn(manifest.environment, key))) missing.add("sealed environment values");
    return {
      sessionId,
      manifest,
      frames,
      deterministic: missing.size === 0,
      replayDigest: localDigest({ manifest, frames }),
      missingInputs: [...missing],
      branches: sessionEvents.filter((event) => event.type === "branch.created" && typeof event.payload.sourceEventId === "string")
        .map((event) => ({ eventId: event.id, sourceEventId: String(event.payload.sourceEventId), createdAt: event.occurredAt })),
    };
  });
}
function scorecardFor(snapshot: EvidenceOSSnapshot): ArenaScorecard {
  const events = snapshot.events;
  const successes = events.filter((event) => ["runtime.succeeded", "test.passed"].includes(event.type)).length;
  const failures = events.filter((event) => ["runtime.failed", "test.failed"].includes(event.type)).length;
  const tests = events.filter((event) => event.type.startsWith("test.")).length;
  const changes = events.filter((event) => event.type === "code.changed").length;
  const prompts = events.filter((event) => event.type === "ai.prompted").length;
  const kinds = new Set(events.map((event) => event.type.split(".")[0])).size;
  const verification = snapshot.verifications.at(-1);
  const security = snapshot.reviews.at(-1)?.agents.find((agent) => agent.id === "security");
  const aiRatio = prompts / Math.max(1, prompts + changes);
  const acceptance = [...snapshot.arenas].reverse().find((session) => session.acceptance?.verified)?.acceptance;
  return {
    finalCorrectness: acceptance?.score || 0,
    problemSolvingProcess: clamp(kinds * 12 + Math.min(20, events.length)),
    debuggingAbility: failures ? (successes ? 90 : 25) : successes ? 82 : 0,
    testQuality: clamp(tests * 24 + (events.some((event) => event.type === "test.passed") ? 20 : 0)),
    codeComprehension: verification?.executionEvidence ? verification.score : 0,
    securityAwareness: snapshot.reviews.at(-1)?.isolation?.independentProcesses ? (security?.status === "passed" ? 92 : security?.status === "warning" ? 66 : 30) : 0,
    evidenceIntegrity: snapshot.integrity.verified ? 100 : 0,
    aiDependence: aiRatio > 0.55 ? "High" : aiRatio > 0.2 ? "Moderate" : "Low",
  };
}

function localEventHashInput(event: Omit<EngineeringEvent, "integrityHash"> | EngineeringEvent) {
  return {
    projectId: event.projectId,
    sessionId: event.sessionId,
    sequence: event.sequence,
    type: event.type,
    actor: event.actor,
    summary: event.summary,
    source: event.source,
    fileName: event.fileName || "",
    payload: event.payload,
    causedBy: event.causedBy || "",
    occurredAt: event.occurredAt,
    previousHash: event.previousHash,
  };
}

export function deriveEvidenceSnapshot(snapshot: EvidenceOSSnapshot): EvidenceOSSnapshot {
  const next = {
    ...snapshot,
    events: [...snapshot.events].sort((left, right) => left.sequence - right.sequence),
  };
  next.graph = graphFor(next);
  next.scorecard = scorecardFor(next);
  next.replay = replayFor(next.events);
  next.arenas = snapshot.arenas || [];
  let previousHash = "GENESIS";
  let integrityVerified = true;
  let checkedEvents = 0;
  for (const event of next.events) {
    if (event.previousHash !== previousHash || event.integrityHash !== localDigest(localEventHashInput(event))) {
      integrityVerified = false;
      break;
    }
    previousHash = event.integrityHash;
    checkedEvents += 1;
  }
  next.integrity = { verified: integrityVerified, checkedEvents };
  return next;
}

export function rebaseLocalEvidenceTail(events: EngineeringEvent[], startIndex: number) {
  const rebased = [...events];
  for (let index = Math.max(0, startIndex); index < rebased.length; index += 1) {
    const previous = rebased[index - 1];
    const unsigned: Omit<EngineeringEvent, "integrityHash"> = {
      ...rebased[index],
      sequence: (previous?.sequence || 0) + 1,
      previousHash: previous?.integrityHash || "GENESIS",
    };
    rebased[index] = { ...unsigned, integrityHash: localDigest(localEventHashInput(unsigned)) };
  }
  return rebased;
}

export function appendLocalEvidenceEvent(
  snapshot: EvidenceOSSnapshot,
  sessionId: string,
  currentUser: string,
  input: EvidenceEventInput
) {
  const previous = snapshot.events.at(-1);
  const unsigned: Omit<EngineeringEvent, "integrityHash"> = {
    id: makeId("event"),
    projectId: snapshot.projectId,
    sessionId,
    sequence: (previous?.sequence || 0) + 1,
    type: input.type,
    actor: input.actor || { name: currentUser, kind: "human" },
    summary: input.summary,
    source: input.source || "workspace",
    ...(input.fileName ? { fileName: input.fileName } : {}),
    payload: input.payload || {},
    ...(input.causedBy ? { causedBy: input.causedBy } : {}),
    occurredAt: input.occurredAt || new Date().toISOString(),
    previousHash: previous?.integrityHash || "GENESIS",
  };
  const event: EngineeringEvent = { ...unsigned, integrityHash: localDigest(localEventHashInput(unsigned)) };
  return { event, snapshot: deriveEvidenceSnapshot({ ...snapshot, events: [...snapshot.events, event] }) };
}

function localAgent(
  id: ReviewAgentResult["id"],
  name: string,
  responsibility: string,
  status: ReviewAgentResult["status"],
  summary: string
): ReviewAgentResult {
  return {
    id,
    name,
    responsibility,
    status,
    summary,
    findings: [],
    engine: "tool",
    toolRuns: [],
  };
}

export function createLocalReview(
  projectId: string,
  files: Record<string, string>,
  requirement: string,
  rollback: string
): ReviewBoardRun {
  void rollback;
  const patchDigest = localWorkspaceDigest(files);
  const roles: Array<[ReviewAgentResult["id"], string, string]> = [
    ["builder", "Builder", "Produces challenge-driven revisions in the server sandbox."],
    ["reviewer", "Correctness Reviewer", "Runs compiler-backed correctness analysis."],
    ["security", "Security Agent", "Runs isolated security-boundary analysis."],
    ["test", "Test Agent", "Compiler-links regression tests to changed source."],
    ["performance", "Performance Agent", "Enforces artifact-bound performance budgets."],
    ["architecture", "Architecture Agent", "Builds compiler-resolved module dependencies."],
    ["devils-advocate", "Devil's Advocate", "Challenges causal and rollback claims."],
  ];
  const summary = "This review role is ready, but the server-backed check has not run yet.";
  const agents = roles.map(([id, name, responsibility]) => localAgent(id, name, responsibility, "warning", summary));
  const challenges = agents.map((agent) => ({
    from: agent.id,
    to: "builder" as const,
    claim: "Run the isolated server role before treating this artifact as reviewed.",
    resolved: false,
  }));
  return {
    id: makeId("review-preview"),
    executionStatus: "preview",
    projectId,
    requirement,
    verdict: "changes-requested",
    score: 0,
    agents,
    createdAt: new Date().toISOString(),
    initialPatchDigest: patchDigest,
    patchDigest,
    revisedFiles: files,
    builderActions: [],
    rounds: [{ round: 1, patchDigest, phase: "challenge", challenges, builderResponse: "Server synchronization is required for revision and consensus.", verdict: "changes-requested" }],
    consensus: 0,
    executedTools: agents.flatMap((agent) => agent.toolRuns?.map((run) => run.tool) || []),
    isolation: { requiredInProduction: "docker", roleCount: 7, independentProcesses: 0 },
  };
}
export function createLocalPackage(
  projectId: string,
  files: Record<string, string>,
  actor: EvidenceActor,
  input: { title: string; requirement: string; rationale: string; rollback: string },
  snapshot: EvidenceOSSnapshot
): ChangeEvidencePackage {
  const changeDigest = localWorkspaceDigest(files);
  const matching = (types: EngineeringEventType[]) => [...snapshot.events].reverse().find((event) => {
    if (!types.includes(event.type)) return false;
    const bound = event.payload.subjectDigest || event.payload.sourceDigest || event.payload.changeDigest || event.payload.artifactDigest;
    return bound === changeDigest || (event.payload.files && localWorkspaceDigest(event.payload.files as Record<string, string>) === changeDigest);
  });
  const hasApi = Object.keys(files).some((name) => /route|controller|api/i.test(name));
  const hasMigration = Object.keys(files).some((name) => /migration|schema\.sql/i.test(name));
  const compatibility = [...snapshot.events].reverse().find((event) =>
    event.type === "test.passed" && /contract|integration|api/i.test(event.fileName || "") &&
    event.payload.files && localWorkspaceDigest(event.payload.files as Record<string, string>) === changeDigest
  );
  const statuses = {
    source: Boolean(matching(["code.changed", "snapshot.created", "artifact.attested"])),
    test: Boolean(matching(["test.passed"])),
    runtime: Boolean(matching(["runtime.succeeded"])),
    security: false,
    compatibility: !hasApi || Boolean(compatibility),
    performance: Boolean(matching(["performance.measurement"])),
    migration: !hasMigration || Boolean(matching(["database.change"])),
    deployment: Boolean(matching(["deployment.succeeded"])),
    rollback: Boolean(matching(["replay.executed", "branch.created"])),
    understanding: false,
  };
  const now = new Date().toISOString();
  const makeAttestation = (
    kind: ChangeEvidencePackage["attestations"][number]["kind"],
    verified: boolean,
    detail: string
  ): ChangeEvidencePackage["attestations"][number] => ({
    id: makeId("attestation"),
    kind,
    subjectDigest: changeDigest,
    evidenceDigest: localDigest({ kind, changeDigest, verified, detail }),
    status: verified ? "verified" : "unavailable",
    detail,
    createdAt: now,
  });
  const attestations: ChangeEvidencePackage["attestations"] = [
    makeAttestation("source", statuses.source, statuses.source ? "Exact local source digest is sealed." : "Seal the exact workspace snapshot."),
    makeAttestation("test", statuses.test, statuses.test ? "Passing tests match this digest." : "Rerun tests on this exact digest."),
    makeAttestation("runtime", statuses.runtime, statuses.runtime ? "Runtime output matches this digest." : "Execute the exact reviewed artifact."),
    makeAttestation("security", statuses.security, statuses.security ? "Review board approved this patch digest." : "Review this exact patch."),
    makeAttestation("compatibility", statuses.compatibility, statuses.compatibility ? "API compatibility is unchanged or contract-tested on this digest." : "Run a digest-bound API contract test."),
    makeAttestation("performance", statuses.performance, statuses.performance ? "Measured performance is bound to this digest." : "Attach measured performance evidence."),
    makeAttestation("migration", statuses.migration, statuses.migration ? "No migration surface changed or a digest-bound mutation was recorded." : "Run migration and rollback checks."),
    makeAttestation("deployment", statuses.deployment, statuses.deployment ? "Deployment evidence matches this digest." : "Deploy the exact reviewed artifact."),
    makeAttestation("rollback", statuses.rollback, statuses.rollback ? "Rollback was replayed on this digest." : "Run a rollback drill; documentation alone is not execution evidence."),
    makeAttestation("understanding", statuses.understanding, statuses.understanding ? "Behavioral verification matches this digest." : "Complete the hands-on challenge."),
  ];
  const checks: ChangeEvidencePackage["checks"] = [
    { id: "requirement", label: "Requirement linked", status: input.requirement ? "passed" : "missing", detail: input.requirement || "Link a requirement." },
    { id: "rationale", label: "Root cause and rationale", status: input.rationale ? "passed" : "missing", detail: input.rationale || "State the root cause." },
    { id: "rollback", label: "Rollback documented", status: input.rollback ? "passed" : "missing", detail: input.rollback || "Document rollback." },
    ...attestations.map((item) => ({
      id: "attestation-" + item.kind,
      label: item.kind.charAt(0).toUpperCase() + item.kind.slice(1) + " attested",
      status: item.status === "verified" ? "passed" as const : "warning" as const,
      detail: item.detail,
    })),
  ];
  const score = clamp((checks.reduce((sum, item) => sum + (item.status === "passed" ? 1 : item.status === "warning" ? 0.35 : 0), 0) / checks.length) * 100);
  const exactArtifactVerified = statuses.source && statuses.test && statuses.runtime && statuses.security;
  const unsigned = {
    id: makeId("package"),
    projectId,
    title: input.title || "Workspace change",
    requirement: input.requirement,
    rationale: input.rationale,
    rollback: input.rollback,
    files: Object.keys(files),
    checks,
    score,
    status: "needs-evidence" as const,
    createdAt: now,
    createdBy: actor,
    changeDigest,
    manifestDigest: localDigest(snapshot.replay.at(-1)?.manifest || { changeDigest }),
    attestations,
    exactArtifactVerified,
  };
  return { ...unsigned, signature: "unverified-local:" + localDigest(unsigned) };
}
function codeConcepts(code: string) {
  const identifiers = [...code.matchAll(/\b(?:function|class|const|let|var|def)\s+([A-Za-z_$][\w$]*)/g)]
    .map((match) => match[1].toLowerCase())
    .slice(0, 3);
  return identifiers.length ? identifiers : ["input", "output", "state"];
}

export function createLocalChallenge(
  projectId: string,
  fileName: string,
  code: string,
  workspaceDigest = localWorkspaceDigest({ [fileName]: code })
): UnderstandingChallenge {
  const concepts = codeConcepts(code);
  const id = "challenge-" + localDigest({ projectId, fileName, code, workspaceDigest }).slice(0, 16);
  return {
    id,
    projectId,
    fileName,
    codeDigest: workspaceDigest,
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    nonce: makeId("nonce"),
    questions: [
      { id: id + "-purpose", focus: "purpose", prompt: "Explain this file as input → state transition → output.", expectedConcepts: [concepts[0], "input", "output"], task: { kind: "explain" } },
      { id: id + "-predict", focus: "prediction", prompt: "Predict the result for an empty boundary input and justify each branch.", expectedConcepts: ["empty", "branch", "result"], task: { kind: "predict", fixture: "boundary-input" } },
      { id: id + "-modify", focus: "modification", prompt: "Write a minimal validation patch without changing valid behavior.", expectedConcepts: ["validate", "return", "error"], task: { kind: "patch", expectedDigest: localDigest({ workspaceDigest, task: "validation" }) } },
      { id: id + "-debug", focus: "debugging", prompt: "A dependency returns null. Identify the first unsafe operation and failing trace.", expectedConcepts: ["null", "first", "fail"], task: { kind: "debug", fixture: "dependency-null" } },
      { id: id + "-dataflow", focus: "dataflow", prompt: "Draw the trust-boundary flow with arrows, validation, and persistence.", expectedConcepts: ["->", "validate", "trust"], task: { kind: "diagram" } },
      { id: id + "-transfer", focus: "transfer", prompt: "Apply the same invariant to a batch-processing implementation.", expectedConcepts: ["batch", "invariant", "each"], task: { kind: "explain", fixture: "batch-transfer" } },
    ],
  };
}

export function verifyLocalUnderstanding(
  challenge: UnderstandingChallenge,
  answers: Record<string, string>,
  signals: { elapsedMs?: number; revisionCount?: number; idleResumes?: number; pasteCount?: number; externalFocusChanges?: number } = {}
): UnderstandingVerification {
  const feedback = challenge.questions.map((question) => {
    const answer = (answers[question.id] || "").toLowerCase();
    const hits = question.expectedConcepts.filter((concept) => answer.includes(concept.toLowerCase())).length;
    const conceptScore = (hits / Math.max(1, question.expectedConcepts.length)) * 45;
    const structureScore = question.task?.kind === "patch"
      ? (/[{};]|=>|\b(if|return|throw)\b/.test(answer) ? 35 : 0)
      : question.task?.kind === "diagram"
        ? (/(?:->|→)/.test(answer) && answer.split(/(?:->|→)/).length >= 3 ? 35 : 0)
        : /\b(because|when|therefore|then|first|next)\b/.test(answer) ? 25 : 0;
    const score = clamp(conceptScore + structureScore + (/\b(input|output|error|null|empty|state|branch|validate|return)\b/.test(answer) ? 20 : 0));
    return { questionId: question.id, score, detail: "Unverified local preview; executable compiler and runtime probes require the server." };
  });
  const focusScore = (focus: UnderstandingChallenge["questions"][number]["focus"][]) => {
    const selected = challenge.questions.map((question, index) => ({ question, score: feedback[index].score })).filter((item) => focus.includes(item.question.focus));
    return selected.length ? clamp(selected.reduce((sum, item) => sum + item.score, 0) / selected.length) : 0;
  };
  const dimensions = {
    explanation: focusScore(["purpose", "transfer"]),
    prediction: focusScore(["prediction"]),
    modification: focusScore(["modification"]),
    debugging: focusScore(["debugging"]),
    dataFlow: focusScore(["dataflow"]),
  };
  const elapsedMs = Math.max(0, Number(signals.elapsedMs || 0));
  const pasteCount = Math.max(0, Number(signals.pasteCount || 0));
  const externalFocusChanges = Math.max(0, Number(signals.externalFocusChanges || 0));
  const score = clamp(
    Object.values(dimensions).reduce((sum, value) => sum + value, 0) / 5 -
    Math.min(25, pasteCount * 8) -
    Math.min(15, externalFocusChanges * 2)
  );
  return {
    id: makeId("verification"),
    projectId: challenge.projectId,
    challengeId: challenge.id,
    fileName: challenge.fileName,
    score,
    passed: false,
    feedback,
    createdAt: new Date().toISOString(),
    dimensions,
    behavioralSignals: {
      answerSimilarity: 0,
      revisionCount: Number(signals.revisionCount || 0),
      elapsedMs,
      continuity: clamp(100 - Number(signals.idleResumes || 0) * 15 - externalFocusChanges * 5 - (elapsedMs < 30_000 ? 30 : 0)),
      pasteCount,
      externalFocusChanges,
    },
    codeDigest: challenge.codeDigest,
  };
}
export function createLocalTwin(
  files: Record<string, string>,
  activeFile: string,
  events: EngineeringEvent[] = []
): EngineeringDigitalTwin {
  const names = Object.keys(files);
  const nodes: EngineeringDigitalTwin["nodes"] = names.map((fileName) => {
    const extension = fileName.split(".").at(-1)?.toLowerCase();
    return {
      id: "file:" + fileName,
      kind: ["html", "css", "scss", "svg"].includes(extension || "") ? "frontend" : "module",
      label: fileName,
      fileName,
    };
  });
  const edges: EngineeringDigitalTwin["edges"] = [];
  for (const fileName of names) {
    if (fileName.split(".").at(-1)?.toLowerCase() !== "html") continue;
    for (const match of files[fileName].matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
      let request = match[1].split(/[?#]/)[0];
      while (request.startsWith("./")) request = request.slice(2);
      const target = names.find((name) => name === request || name.endsWith("/" + request));
      if (!target) continue;
      edges.push({
        id: ["file:" + fileName, "renders", "file:" + target].join(":"),
        source: "file:" + fileName,
        target: "file:" + target,
        relation: "renders",
        evidence: "html-parser",
      });
    }
  }
  const activeId = "file:" + activeFile;
  const affected = new Set<string>();
  for (const edge of edges) {
    if (edge.source === activeId) affected.add(edge.target);
    if (edge.target === activeId) affected.add(edge.source);
  }
  const affectedFiles = [...affected].filter((id) => id.startsWith("file:")).map((id) => id.slice(5));
  const telemetry = {
    traces: events.filter((event) => event.type === "trace.observed").length,
    requests: events.filter((event) => event.type === "network.request").length,
    databaseMutations: events.filter((event) => event.type === "database.change").length,
    deployments: events.filter((event) => event.type.startsWith("deployment.")).length,
  };
  return {
    nodes,
    edges,
    impact: {
      activeFile,
      affectedFiles,
      testsToRun: [],
      risks: ["Authoritative compiler, coverage, and runtime impact analysis requires server synchronization."],
      blastRadius: "low",
      securityBoundaries: [],
      migrationsRequired: [],
      apiConsumers: [],
      confidence: 20,
    },
    telemetry,
    analysis: {
      engine: "unverified-local-preview",
      compilerDiagnostics: 0,
      runtimeCorrelations: 0,
      coverageFiles: [],
      symbolFiles: 0,
    },
    generatedAt: new Date().toISOString(),
  };
}
export function createDemoEvidenceSnapshot(
  projectId: string,
  files: Record<string, string>,
  currentUser: string
) {
  let snapshot = emptyEvidenceSnapshot(projectId);
  const sessionId = "demo-evidence-session";
  const now = Date.now();
  const sourceDigest = localWorkspaceDigest(files);
  const boundPayload = { files, activeFile: "script.js", sourceDigest, subjectDigest: sourceDigest };
  const inputs: EvidenceEventInput[] = [
    { type: "session.started", summary: "Assessment session started in a reproducible workspace.", source: "session", occurredAt: new Date(now - 12 * 60_000).toISOString() },
    { type: "session.environment", summary: "Exact demo runtime and workspace manifest captured.", source: "session-recorder", payload: { files, activeFile: "script.js", manifest: { runtime: "CodeVerse demo browser", platform: "web", architecture: "browser-sandbox", lockfileHash: localDigest("demo-lockfile"), sourceDigest, snapshotComplete: true, dependencyVersions: {}, environmentKeys: [], environment: {} } }, occurredAt: new Date(now - 11 * 60_000).toISOString() },
    { type: "decision.recorded", summary: "Keep score parsing separate from summary calculation.", source: "decision-log", occurredAt: new Date(now - 10 * 60_000).toISOString() },
    { type: "runtime.failed", summary: "Empty input produced an invalid maximum.", source: "runner", fileName: "script.js", payload: boundPayload, occurredAt: new Date(now - 9 * 60_000).toISOString() },
    { type: "ai.prompted", summary: "Asked AI to identify the failing edge case.", source: "ai-assistant", actor: { name: currentUser, kind: "human" }, occurredAt: new Date(now - 8 * 60_000).toISOString() },
    { type: "code.changed", summary: "Added the empty-score guard.", source: "editor", fileName: "script.js", payload: boundPayload, occurredAt: new Date(now - 7 * 60_000).toISOString() },
    { type: "command.executed", summary: "Executed score regression suite.", source: "runner", fileName: "script.test.js", payload: { ...boundPayload, command: "run script.test.js", exitCode: 0, outputDigest: localDigest("tests passed") }, occurredAt: new Date(now - 6 * 60_000).toISOString() },
    { type: "test.passed", summary: "Score summary regression checks passed.", source: "runner", fileName: "script.test.js", payload: boundPayload, occurredAt: new Date(now - 5 * 60_000).toISOString() },
    { type: "runtime.succeeded", summary: "Score summary runtime completed successfully.", source: "runner", fileName: "script.js", payload: boundPayload, occurredAt: new Date(now - 4 * 60_000).toISOString() },
    { type: "performance.measurement", summary: "Measured score summary execution within budget.", source: "runner", fileName: "script.js", payload: { ...boundPayload, durationMs: 8 }, occurredAt: new Date(now - 3 * 60_000).toISOString() },
    { type: "replay.executed", summary: "Rollback rehearsal restored the exact workspace.", source: "replay-engine", payload: boundPayload, occurredAt: new Date(now - 2 * 60_000).toISOString() },
    { type: "deployment.succeeded", summary: "Verified build published to the preview route.", source: "deployment", payload: boundPayload, occurredAt: new Date(now - 60_000).toISOString() },
  ];
  inputs.forEach((input) => {
    snapshot = appendLocalEvidenceEvent(snapshot, sessionId, currentUser, input).snapshot;
  });
  const review = createLocalReview(projectId, files, "Summarize a list of scores safely.", "Restore the previous script.js snapshot.");

  const challenge = createLocalChallenge(projectId, "script.js", files["script.js"] || "", sourceDigest);
  const verification: UnderstandingVerification = {
    id: "demo-verification",
    projectId,
    challengeId: challenge.id,
    fileName: "script.js",
    score: 86,
    passed: false,
    feedback: challenge.questions.map((question) => ({ questionId: question.id, score: 0, detail: "Unverified local preview; executable server probes have not run." })),
    createdAt: new Date(now - 30_000).toISOString(),
    dimensions: { explanation: 88, prediction: 84, modification: 86, debugging: 87, dataFlow: 85 },
    behavioralSignals: { answerSimilarity: 12, revisionCount: 3, elapsedMs: 274000, continuity: 94, pasteCount: 0, externalFocusChanges: 0 },
    codeDigest: challenge.codeDigest,
  };
  snapshot = deriveEvidenceSnapshot({ ...snapshot, reviews: [review], verifications: [verification] });
  const evidencePackage = createLocalPackage(
    projectId,
    files,
    { name: currentUser, kind: "human" },
    {
      title: "Make score summaries total",
      requirement: "Summarize numeric score input and handle an empty list without invalid values.",
      rationale: "A pure parser and summary function make failure cases independently testable.",
      rollback: "Restore the previous script.js snapshot from the replay ledger.",
    },
    snapshot
  );
  return deriveEvidenceSnapshot({ ...snapshot, packages: [evidencePackage] });
}

