import type { ArenaLeaderboardEntry, ArenaScenario, ArenaScenarioTemplateInput, ArenaSession } from "@shared/types/evidence";
import { localDigest } from "./evidence-local";

const rubric: ArenaScenario["rubric"] = [
  { id: "correctness", label: "Correctness and recovery", weight: 28, evidenceTypes: ["test.passed", "runtime.succeeded"] },
  { id: "diagnosis", label: "Diagnosis speed and causal reasoning", weight: 18, evidenceTypes: ["runtime.failed", "debugger.checkpoint", "decision.recorded"] },
  { id: "security", label: "Security and containment", weight: 14, evidenceTypes: ["security.finding", "review.completed"] },
  { id: "testing", label: "Failure-oriented test quality", weight: 14, evidenceTypes: ["test.failed", "test.passed"] },
  { id: "communication", label: "Communication and decisions", weight: 10, evidenceTypes: ["chat.message", "decision.recorded"] },
  { id: "architecture", label: "Architecture and blast-radius control", weight: 8, evidenceTypes: ["trace.observed", "network.request", "database.change"] },
  { id: "recovery", label: "Rollback and recovery strategy", weight: 8, evidenceTypes: ["snapshot.created", "branch.created", "replay.executed"] },
];

function scenario(
  id: string,
  title: string,
  kind: ArenaScenario["kind"],
  difficulty: ArenaScenario["difficulty"],
  briefing: string,
  timeLimitMinutes: number,
  allowedAI: ArenaScenario["allowedAI"],
  fileName: string,
  source: string
): ArenaScenario {
  return {
    id,
    title,
    kind,
    difficulty,
    briefing,
    timeLimitMinutes,
    allowedAI,
    injectedFaults: [{ id: id + "-fault", description: "Hidden fault; diagnose it from recorded evidence.", hidden: true, files: { [fileName]: source } }],
    rubric,
    starterFiles: {
      "INCIDENT.md": "# " + title + "\n\n" + briefing + "\n\nRecord diagnosis, containment, recovery, and verification.",
      [fileName]: source,
      [fileName.replace(/\.[^.]+$/, ".test.js")]: "// Add a failing reproduction first, then a passing recovery test.\n",
    },
  };
}

export const localArenaScenarios: ArenaScenario[] = [
  scenario("prod-outage", "Restore a production outage", "outage", "advanced", "Requests fail after configuration rollout. Diagnose the first causal event, contain impact, restore service, and prove recovery.", 45, "limited", "service.js", "const port = Number(process.env.PORT);\nmodule.exports = () => { if (!port) throw new Error('service unavailable'); return port; };\n"),
  scenario("memory-leak", "Diagnose a memory leak", "memory-leak", "expert", "Heap use grows during sustained traffic. Identify retained state and prove the fix under load.", 60, "full-with-disclosure", "cache.js", "const cache = [];\nexports.remember = value => { cache.push(value); return cache.length; };\n"),
  scenario("concurrency-race", "Resolve a concurrency defect", "concurrency", "expert", "Concurrent withdrawals violate an invariant. Reproduce the race and preserve atomicity.", 60, "limited", "ledger.js", "let balance = 100;\nexports.withdraw = async amount => { const next = balance - amount; await Promise.resolve(); balance = next; return balance; };\n"),
  scenario("dependency-compromise", "Contain a dependency compromise", "dependency-compromise", "expert", "A transitive package may exfiltrate environment data. Remove reachability and prove a clean build.", 50, "none", "package.json", "{\n  \"dependencies\": { \"analytics-helper\": \"0.0.1\" }\n}\n"),
  scenario("database-recovery", "Restore a corrupted database", "database-recovery", "expert", "A migration corrupted active records. Restore consistent state and rehearse rollback.", 70, "limited", "migration.sql", "UPDATE accounts SET balance = balance * -1;\n"),
  scenario("malicious-ai-patch", "Review a malicious AI patch", "malicious-patch", "advanced", "An authentication patch passes superficial tests. Find the exploit and submit a defensible replacement.", 45, "full-with-disclosure", "auth.js", "exports.authorize = request => request.headers['x-user'] || 'admin';\n"),
  scenario("api-latency", "Reduce API tail latency", "api-latency", "advanced", "The catalog endpoint breaches its p95 budget. Trace the bottleneck and protect correctness.", 50, "limited", "catalog.js", "exports.list = async db => { const rows = await db.all(); for (const row of rows) row.owner = await db.owner(row.id); return rows; };\n"),
  scenario("vulnerable-api", "Secure a vulnerable API", "vulnerable-api", "advanced", "A public endpoint crosses an unvalidated trust boundary. Demonstrate exploitability and prove compatibility.", 45, "none", "route.js", "exports.load = (db, request) => db.query('SELECT * FROM users WHERE id=' + request.query.id);\n"),
];

function id() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export function createLocalArenaTemplate(input: ArenaScenarioTemplateInput): ArenaScenario {
  return {
    id: "org-" + input.organizationId.replace(/\W+/g, "-").toLowerCase() + "-" + id().slice(0, 8),
    organizationId: input.organizationId,
    title: input.title,
    briefing: input.briefing,
    kind: input.kind,
    difficulty: input.difficulty,
    timeLimitMinutes: Math.max(10, Math.min(240, input.timeLimitMinutes)),
    allowedAI: input.allowedAI,
    injectedFaults: input.injectedFaults || [],
    rubric: input.rubric || rubric,
    starterFiles: input.starterFiles,
    createdBy: "Local evaluator",
    createdAt: new Date().toISOString(),
  };
}

export function startLocalArena(projectId: string, scenarioId: string, candidate: string, privacyMode: "full" | "redacted", lobby = false, availableScenarios: ArenaScenario[] = localArenaScenarios) {
  const selected = availableScenarios.find((item) => item.id === scenarioId) || availableScenarios[0];
  const startedAt = new Date();
  const workspace = selected.injectedFaults.reduce((files, fault) => ({ ...files, ...fault.files }), { ...selected.starterFiles });
  const session: ArenaSession = {
    id: id(),
    projectId,
    scenarioId: selected.id,
    status: lobby ? "lobby" : "running",
    participants: [{ id: id(), name: candidate || "Candidate", role: "candidate" }],
    startedAt: lobby ? undefined : startedAt.toISOString(),
    deadlineAt: lobby ? undefined : new Date(startedAt.getTime() + selected.timeLimitMinutes * 60_000).toISOString(),
    lobbyCode: lobby ? id().slice(0, 8).toUpperCase() : undefined,
    actions: [],
    environmentLocked: true,
    workspace,
    allowedAI: selected.allowedAI,
    policyViolations: [],
    consent: { recorded: true, recordedAt: startedAt.toISOString(), privacyMode },
    privacyMode,
  };
  return {
    session,
    files: workspace,
    privacyMode,
  };
}

export function buildLocalArenaPreview(session: ArenaSession, privacyMode: "full" | "redacted" = "full") {
  const submittedAt = new Date().toISOString();
  const report = {
    sessionId: session.id,
    scenarioId: session.scenarioId,
    status: "unverified-local-preview",
    submittedAt,
  };
  const submitted: ArenaSession = {
    ...session,
    status: "submitted",
    submittedAt,
    privacyMode,
    acceptance: { passed: 0, total: 0, score: 0, verified: false, results: [] },
    signedReport: {
      digest: localDigest(report),
      signature: "unverified-local:" + localDigest(report),
      generatedAt: submittedAt,
      consentRecorded: true,
      privacyMode,
      report,
    },
  };
  return { session: submitted, weightedScore: 0 };
}

export function localLeaderboard(sessions: ArenaSession[]): ArenaLeaderboardEntry[] {
  return sessions.filter((session) => session.status === "graded").map((session) => ({
    sessionId: session.id,
    scenarioId: session.scenarioId,
    participant: session.signedReport?.privacyMode === "redacted" ? "Anonymous candidate" : session.participants[0]?.name || "Team",
    score: session.weightedScore || Math.round(Object.values(session.rubricScores || {}).reduce((sum, value) => sum + value, 0) / Math.max(1, Object.keys(session.rubricScores || {}).length)),
    elapsedMs: Math.max(0, Date.parse(session.submittedAt || "") - Date.parse(session.startedAt || "")),
    rank: 0,
    integrityVerified: session.score?.evidenceIntegrity === 100,
  })).sort((left, right) => right.score - left.score).map((entry, index) => ({ ...entry, rank: index + 1 }));
}