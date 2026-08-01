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
  };
}

function graphFor(snapshot: EvidenceOSSnapshot) {
  const nodes: EvidenceGraphNode[] = [];
  const edges: EvidenceGraphEdge[] = [];
  snapshot.packages.slice(-3).forEach((item) => {
    if (item.requirement) {
      nodes.push({
        id: "requirement:" + item.id,
        kind: "requirement",
        label: item.requirement,
        status: item.score >= 75 ? "passed" : "warning",
      });
    }
  });
  snapshot.events
    .filter((event) => !["session.started", "ai.prompted", "ai.responded"].includes(event.type))
    .slice(-16)
    .forEach((event) => {
      const kind: EvidenceGraphNode["kind"] = event.type.startsWith("code") || event.type.startsWith("file") || event.type.startsWith("branch")
        ? "change"
        : event.type.startsWith("test")
          ? "test"
          : ["runtime", "command", "debugger", "trace", "network", "database", "performance"].some((prefix) => event.type.startsWith(prefix))
            ? "runtime"
            : event.type.startsWith("deployment")
              ? "deployment"
              : event.type.startsWith("security")
                ? "security"
                : event.type.startsWith("review")
                ? "review"
                : "decision";
      nodes.push({
        id: "event:" + event.id,
        kind,
        label: event.summary,
        status: event.type.endsWith("failed") ? "failed" : event.type.endsWith("passed") || event.type.endsWith("succeeded") ? "passed" : "neutral",
        eventId: event.id,
      });
    });
  const latestSecurity = snapshot.reviews.at(-1)?.agents.find((agent) => agent.id === "security");
  if (latestSecurity) {
    nodes.push({
      id: "security:" + snapshot.reviews.at(-1)?.id,
      kind: "security",
      label: latestSecurity.summary,
      status: latestSecurity.status === "passed" ? "passed" : latestSecurity.status === "blocked" ? "failed" : "warning",
    });
  }
  for (let index = 1; index < nodes.length; index += 1) {
    edges.push({
      id: "edge:" + index,
      source: nodes[index - 1].id,
      target: nodes[index].id,
      relation: "supports",
    });
  }
  return { nodes, edges };
}

function scorecardFor(snapshot: EvidenceOSSnapshot): ArenaScorecard {
  const events = snapshot.events;
  const successes = events.filter((event) => ["runtime.succeeded", "test.passed"].includes(event.type)).length;
  const failures = events.filter((event) => ["runtime.failed", "test.failed"].includes(event.type)).length;
  const executions = successes + failures;
  const tests = events.filter((event) => event.type.startsWith("test.")).length;
  const changes = events.filter((event) => event.type === "code.changed").length;
  const prompts = events.filter((event) => event.type === "ai.prompted").length;
  const kinds = new Set(events.map((event) => event.type.split(".")[0])).size;
  const verification = snapshot.verifications.at(-1);
  const security = snapshot.reviews.at(-1)?.agents.find((agent) => agent.id === "security");
  const aiRatio = prompts / Math.max(1, prompts + changes);
  return {
    finalCorrectness: executions ? clamp((successes / executions) * 100) : 0,
    problemSolvingProcess: clamp(kinds * 12 + Math.min(20, events.length)),
    debuggingAbility: failures ? (successes ? 90 : 25) : successes ? 82 : 0,
    testQuality: clamp(tests * 24 + (events.some((event) => event.type === "test.passed") ? 20 : 0)),
    codeComprehension: verification?.score || 0,
    securityAwareness: security ? (security.status === "passed" ? 92 : security.status === "warning" ? 66 : 30) : 0,
    evidenceIntegrity: snapshot.integrity.verified ? 100 : 0,
    aiDependence: aiRatio > 0.55 ? "High" : aiRatio > 0.2 ? "Moderate" : "Low",
  };
}

export function deriveEvidenceSnapshot(snapshot: EvidenceOSSnapshot): EvidenceOSSnapshot {
  const next = {
    ...snapshot,
    events: [...snapshot.events].sort((left, right) => left.sequence - right.sequence),
  };
  next.graph = graphFor(next);
  next.scorecard = scorecardFor(next);
  const integrityVerified = snapshot.integrity.verified !== false;
  next.integrity = { ...snapshot.integrity, verified: integrityVerified, checkedEvents: integrityVerified ? next.events.length : snapshot.integrity.checkedEvents };
  return next;
}

export function appendLocalEvidenceEvent(
  snapshot: EvidenceOSSnapshot,
  sessionId: string,
  currentUser: string,
  input: EvidenceEventInput
) {
  const previous = snapshot.events.at(-1);
  const event: EngineeringEvent = {
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
    integrityHash: makeId("proof"),
  };
  return { event, snapshot: deriveEvidenceSnapshot({ ...snapshot, events: [...snapshot.events, event] }) };
}

function localAgent(
  id: ReviewAgentResult["id"],
  name: string,
  responsibility: string,
  status: ReviewAgentResult["status"],
  summary: string
): ReviewAgentResult {
  return { id, name, responsibility, status, summary, findings: [] };
}

export function createLocalReview(
  projectId: string,
  files: Record<string, string>,
  requirement: string,
  rollback: string
): ReviewBoardRun {
  const names = Object.keys(files);
  const content = Object.values(files).join("\n");
  const hasTests = names.some((name) => /test|spec/i.test(name));
  const secret = /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"'\n]{8,}["']/i.test(content);
  const performanceRisk = /for\s*\([^)]*\)[\s\S]{0,220}for\s*\(/m.test(content);
  const agents: ReviewAgentResult[] = [
    localAgent("builder", "Builder", "Explains the intended implementation path.", "passed", names.length + " files indexed for review."),
    localAgent("reviewer", "Correctness Reviewer", "Searches for correctness failures.", /TODO|FIXME|catch\s*\([^)]*\)\s*{\s*}/.test(content) ? "warning" : "passed", "Correctness heuristics completed."),
    localAgent("security", "Security Agent", "Searches for exploit paths.", secret ? "blocked" : "passed", secret ? "Credential-like literal requires removal." : "No high-signal security hazards detected."),
    localAgent("test", "Test Agent", "Demands failure-oriented tests.", hasTests ? "passed" : "warning", hasTests ? "A test surface is present." : "Add a regression test to the proof package."),
    localAgent("performance", "Performance Agent", "Checks likely regressions.", performanceRisk ? "warning" : "passed", performanceRisk ? "Confirm the nested iteration input bound." : "No high-signal performance regression detected."),
    localAgent("architecture", "Architecture Agent", "Checks boundaries and coupling.", requirement ? "passed" : "warning", requirement ? "The change is linked to a requirement." : "Link the change to a requirement."),
    localAgent("devils-advocate", "Devil's Advocate", "Challenges reversibility and assumptions.", rollback ? "passed" : "warning", rollback ? "A rollback path is documented." : "Document a rollback path."),
  ];
  const blocked = agents.filter((agent) => agent.status === "blocked").length;
  const warnings = agents.filter((agent) => agent.status === "warning").length;
  return {
    id: makeId("review"),
    projectId,
    requirement,
    verdict: blocked ? "blocked" : warnings > 2 ? "changes-requested" : "approved",
    score: clamp(100 - blocked * 22 - warnings * 7),
    agents,
    createdAt: new Date().toISOString(),
  };
}

export function createLocalPackage(
  projectId: string,
  files: Record<string, string>,
  actor: EvidenceActor,
  input: { title: string; requirement: string; rationale: string; rollback: string },
  snapshot: EvidenceOSSnapshot
): ChangeEvidencePackage {
  const hasTests = Object.keys(files).some((name) => /test|spec/i.test(name));
  const hasRun = snapshot.events.some((event) => ["runtime.succeeded", "test.passed"].includes(event.type));
  const reviewed = snapshot.reviews.at(-1)?.verdict === "approved";
  const understood = snapshot.verifications.at(-1)?.passed;
  const checks: ChangeEvidencePackage["checks"] = [
    { id: "requirement", label: "Requirement linked", status: input.requirement ? "passed" : "missing", detail: input.requirement || "Link a requirement." },
    { id: "tests", label: "Tests added", status: hasTests ? "passed" : "missing", detail: hasTests ? "Test file detected." : "Add a failure-oriented test." },
    { id: "runtime", label: "Execution verified", status: hasRun ? "passed" : "warning", detail: hasRun ? "Successful execution recorded." : "Run the affected path." },
    { id: "security", label: "Security reviewed", status: reviewed ? "passed" : "warning", detail: reviewed ? "Review board approved." : "Run adversarial review." },
    { id: "understanding", label: "Developer explanation", status: understood ? "passed" : "missing", detail: understood ? "Understanding verified." : "Complete verification." },
    { id: "rollback", label: "Rollback strategy", status: input.rollback ? "passed" : "missing", detail: input.rollback || "Document rollback." },
  ];
  const score = clamp((checks.reduce((sum, item) => sum + (item.status === "passed" ? 1 : item.status === "warning" ? 0.5 : 0), 0) / checks.length) * 100);
  return {
    id: makeId("package"),
    projectId,
    title: input.title || "Workspace change",
    requirement: input.requirement,
    rationale: input.rationale,
    rollback: input.rollback,
    files: Object.keys(files),
    checks,
    score,
    status: score >= 75 && !checks.some((item) => item.status === "missing") ? "ready" : "needs-evidence",
    createdAt: new Date().toISOString(),
    createdBy: actor,
  };
}

function codeConcepts(code: string) {
  const identifiers = [...code.matchAll(/\b(?:function|class|const|let|var|def)\s+([A-Za-z_$][\w$]*)/g)]
    .map((match) => match[1].toLowerCase())
    .slice(0, 3);
  return identifiers.length ? identifiers : ["input", "output", "state"];
}

export function createLocalChallenge(projectId: string, fileName: string, code: string): UnderstandingChallenge {
  const concepts = codeConcepts(code);
  const id = "challenge-" + fileName.replace(/\W/g, "-") + "-" + code.length;
  return {
    id,
    projectId,
    fileName,
    questions: [
      { id: id + "-purpose", focus: "purpose", prompt: "Explain this file's responsibility and the data it transforms.", expectedConcepts: [concepts[0], "input", "output"] },
      { id: id + "-invariant", focus: "invariant", prompt: "Which invariant does its main condition or guard protect?", expectedConcepts: [concepts[1] || concepts[0], "valid", "state"] },
      { id: id + "-failure", focus: "failure", prompt: "Describe the most important failure or edge case.", expectedConcepts: ["error", "empty", "fail"] },
      { id: id + "-security", focus: "security", prompt: "Identify one trust boundary or security concern.", expectedConcepts: ["input", "validate", "trust", "sanitize", "permission"] },
    ],
  };
}

export function verifyLocalUnderstanding(
  challenge: UnderstandingChallenge,
  answers: Record<string, string>
): UnderstandingVerification {
  const feedback = challenge.questions.map((question) => {
    const answer = (answers[question.id] || "").toLowerCase();
    const hits = question.expectedConcepts.filter((concept) => answer.includes(concept.toLowerCase())).length;
    const lengthPoints = answer.length >= 90 ? 45 : answer.length >= 45 ? 32 : answer.length >= 20 ? 18 : 0;
    const score = clamp(lengthPoints + Math.min(55, hits * 22));
    return { questionId: question.id, score, detail: score >= 70 ? "Explanation is grounded in behavior." : "Add an execution path, invariant, or failure consequence." };
  });
  const score = clamp(feedback.reduce((sum, item) => sum + item.score, 0) / feedback.length);
  return {
    id: makeId("verification"),
    projectId: challenge.projectId,
    challengeId: challenge.id,
    fileName: challenge.fileName,
    score,
    passed: score >= 70,
    feedback,
    createdAt: new Date().toISOString(),
  };
}

function classifyFile(fileName: string): EngineeringDigitalTwin["nodes"][number]["kind"] {
  if (/test|spec/i.test(fileName)) return "test";
  if (/config|\.json$|\.ya?ml$/i.test(fileName)) return "config";
  if (/route|controller|api/i.test(fileName)) return "api";
  if (/service|server|socket/i.test(fileName)) return "service";
  if (/schema|migration|model|store|db/i.test(fileName)) return "data";
  if (/\.tsx?$|\.jsx?$|\.html$|\.css$/i.test(fileName)) return "frontend";
  return "module";
}

export function createLocalTwin(
  files: Record<string, string>,
  activeFile: string
): EngineeringDigitalTwin {
  const names = Object.keys(files);
  const nodes: EngineeringDigitalTwin["nodes"] = names.map((fileName) => ({
    id: "file:" + fileName,
    kind: classifyFile(fileName),
    label: fileName,
    fileName,
  }));
  const edges: EngineeringDigitalTwin["edges"] = [];
  names.forEach((fileName) => {
    const content = files[fileName];
    names.forEach((candidate) => {
      if (candidate === fileName) return;
      const stem = candidate.replace(/\.[^.]+$/, "").replace(/^.*[/\\]/, "");
      if (content.includes(stem) || content.includes(candidate)) {
        edges.push({ id: fileName + ":" + candidate, source: "file:" + fileName, target: "file:" + candidate, relation: /test|spec/i.test(fileName) ? "tests" : "imports" });
      }
    });
  });
  const activeId = "file:" + activeFile;
  const affectedFiles = [...new Set(edges.flatMap((edge) => edge.source === activeId ? [edge.target] : edge.target === activeId ? [edge.source] : []))]
    .map((id) => id.slice(5));
  const testsToRun = names.filter((name) => /test|spec/i.test(name) && (name.includes(activeFile.replace(/\.[^.]+$/, "")) || affectedFiles.some((affected) => name.includes(affected.replace(/\.[^.]+$/, "")))));
  const risks = [
    ...(/api|route|controller/i.test(activeFile) ? ["API compatibility boundary"] : []),
    ...(/auth|token|permission|secret/i.test(activeFile + (files[activeFile] || "")) ? ["Security boundary"] : []),
    ...(!testsToRun.length ? ["No directly linked test"] : []),
  ];
  return {
    nodes,
    edges,
    impact: {
      activeFile,
      affectedFiles,
      testsToRun,
      risks,
      blastRadius: affectedFiles.length + risks.length >= 5 ? "high" : affectedFiles.length + risks.length >= 3 ? "medium" : "low",
    },
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
  const inputs: EvidenceEventInput[] = [
    { type: "session.started", summary: "Assessment session started in a reproducible workspace.", source: "session", occurredAt: new Date(now - 8 * 60_000).toISOString() },
    { type: "decision.recorded", summary: "Keep score parsing separate from summary calculation.", source: "decision-log", occurredAt: new Date(now - 7 * 60_000).toISOString() },
    { type: "code.changed", summary: "Implemented numeric input parsing.", source: "editor", fileName: "script.js", payload: { files, activeFile: "script.js" }, occurredAt: new Date(now - 6 * 60_000).toISOString() },
    { type: "runtime.failed", summary: "Empty input produced an invalid maximum.", source: "runner", fileName: "script.js", occurredAt: new Date(now - 5 * 60_000).toISOString() },
    { type: "ai.prompted", summary: "Asked AI to identify the failing edge case.", source: "ai-assistant", actor: { name: currentUser, kind: "human" }, occurredAt: new Date(now - 4 * 60_000).toISOString() },
    { type: "code.changed", summary: "Added the empty-score guard.", source: "editor", fileName: "script.js", payload: { files, activeFile: "script.js" }, occurredAt: new Date(now - 3 * 60_000).toISOString() },
    { type: "test.passed", summary: "Score summary regression checks passed.", source: "runner", fileName: "script.js", occurredAt: new Date(now - 2 * 60_000).toISOString() },
    { type: "deployment.succeeded", summary: "Verified build published to the preview route.", source: "deployment", occurredAt: new Date(now - 60_000).toISOString() },
  ];
  inputs.forEach((input) => {
    snapshot = appendLocalEvidenceEvent(snapshot, sessionId, currentUser, input).snapshot;
  });
  const review = createLocalReview(projectId, files, "Summarize a list of scores safely.", "Restore the previous script.js snapshot.");
  review.agents = review.agents.map((agent) => agent.id === "test" ? { ...agent, status: "passed", summary: "Recorded regression execution covers the empty-input failure." } : agent);
  review.verdict = "approved";
  review.score = 93;
  const challenge = createLocalChallenge(projectId, "script.js", files["script.js"] || "");
  const verification: UnderstandingVerification = {
    id: "demo-verification",
    projectId,
    challengeId: challenge.id,
    fileName: "script.js",
    score: 86,
    passed: true,
    feedback: challenge.questions.map((question) => ({ questionId: question.id, score: 86, detail: "Explanation is grounded in runtime behavior." })),
    createdAt: new Date(now - 30_000).toISOString(),
  };
  snapshot = deriveEvidenceSnapshot({ ...snapshot, reviews: [review], verifications: [verification] });
  const evidencePackage = createLocalPackage(
    projectId,
    { ...files, "script.test.js": "empty input and numeric score regression evidence" },
    { name: currentUser, kind: "human" },
    {
      title: "Make score summaries total",
      requirement: "Summarize numeric score input and handle an empty list without invalid values.",
      rationale: "A pure parser and summary function make failure cases independently testable.",
      rollback: "Restore the previous script.js snapshot from the replay ledger.",
    },
    snapshot
  );
  evidencePackage.score = 92;
  evidencePackage.status = "ready";
  evidencePackage.checks = evidencePackage.checks.map((item) => ({ ...item, status: "passed" }));
  return deriveEvidenceSnapshot({ ...snapshot, packages: [evidencePackage] });
}

