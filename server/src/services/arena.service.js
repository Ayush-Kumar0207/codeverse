const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const HttpError = require("../utils/httpError");
const { supabase } = require("../config/db");
const { digest } = require("./evidence-advanced.service");
const signing = require("./evidence-signing.service");
const { evaluateArenaSubmission } = require("./arena-acceptance.service");

const DATA_FILE = path.join(__dirname, "../../.data/arenas.json");
let writeQueue = Promise.resolve();
let customScenarios = [];
try {
  const existing = JSON.parse(fsSync.readFileSync(DATA_FILE, "utf8"));
  customScenarios = Array.isArray(existing.templates) ? existing.templates : [];
} catch {
  customScenarios = [];
}

const baseRubric = [
  { id: "correctness", label: "Correctness and recovery", weight: 28, evidenceTypes: ["test.passed", "runtime.succeeded"] },
  { id: "diagnosis", label: "Diagnosis speed and causal reasoning", weight: 18, evidenceTypes: ["runtime.failed", "debugger.checkpoint", "decision.recorded"] },
  { id: "security", label: "Security and containment", weight: 14, evidenceTypes: ["security.finding", "review.completed"] },
  { id: "testing", label: "Failure-oriented test quality", weight: 14, evidenceTypes: ["test.failed", "test.passed"] },
  { id: "communication", label: "Communication and decisions", weight: 10, evidenceTypes: ["chat.message", "decision.recorded"] },
  { id: "architecture", label: "Architecture and blast-radius control", weight: 8, evidenceTypes: ["trace.observed", "network.request", "database.change"] },
  { id: "recovery", label: "Rollback and recovery strategy", weight: 8, evidenceTypes: ["snapshot.created", "branch.created", "replay.executed"] },
];

function makeScenario(id, title, kind, difficulty, briefing, timeLimitMinutes, allowedAI, fileName, source, faultDescription) {
  return {
    id, title, kind, difficulty, briefing, timeLimitMinutes, allowedAI,
    injectedFaults: [{ id: id + "-fault", description: faultDescription, hidden: true, files: { [fileName]: source } }],
    rubric: baseRubric,
    starterFiles: {
      "INCIDENT.md": "# " + title + "\n\n" + briefing + "\n\nRecord diagnosis, containment, recovery, and verification evidence.",
      [fileName]: source,
      [fileName.replace(/\.[^.]+$/, ".test.js")]: "// Add a failing reproduction first, then a passing recovery test.\n",
    },
  };
}

const SCENARIOS = [
  makeScenario("prod-outage", "Restore a production outage", "outage", "advanced", "Requests are failing after a configuration rollout. Diagnose the first causal event, contain impact, restore service, and prove recovery.", 45, "limited", "service.js", "const port = Number(process.env.PORT);\nmodule.exports = () => { if (!port) throw new Error('service unavailable'); return port; };\n", "A missing runtime port value crashes every request path."),
  makeScenario("memory-leak", "Diagnose a memory leak", "memory-leak", "expert", "Heap use grows during sustained traffic. Identify retained state, fix it without breaking caching, and provide before/after evidence.", 60, "full-with-disclosure", "cache.js", "const cache = [];\nexports.remember = value => { cache.push(value); return cache.length; };\n", "An unbounded process-global array retains every request value."),
  makeScenario("concurrency-race", "Resolve a concurrency defect", "concurrency", "expert", "Concurrent withdrawals can violate the account invariant. Reproduce the race, preserve atomicity, and document the lock boundary.", 60, "limited", "ledger.js", "let balance = 100;\nexports.withdraw = async amount => { const next = balance - amount; await Promise.resolve(); balance = next; return balance; };\n", "Read-modify-write spans an await without atomic protection."),
  makeScenario("dependency-compromise", "Contain a dependency compromise", "dependency-compromise", "expert", "A transitive package is suspected of exfiltrating environment data. Identify reachability, remove exposure, rotate affected trust, and prove a clean build.", 50, "none", "package.json", "{\n  \"dependencies\": { \"analytics-helper\": \"0.0.1\" }\n}\n", "The assessment dependency represents a compromised transitive package."),
  makeScenario("database-recovery", "Restore a corrupted database", "database-recovery", "expert", "A migration corrupted active records. Determine mutation scope, restore consistent state, validate constraints, and rehearse rollback.", 70, "limited", "migration.sql", "UPDATE accounts SET balance = balance * -1;\n", "The migration inverts all account balances without a transaction or predicate."),
  makeScenario("malicious-ai-patch", "Review a malicious AI patch", "malicious-patch", "advanced", "An AI-generated authentication patch passes superficial tests. Find the exploit path, reject unsafe evidence, and submit a defensible replacement.", 45, "full-with-disclosure", "auth.js", "exports.authorize = request => request.headers['x-user'] || 'admin';\n", "The patch defaults an unauthenticated caller to administrator."),
  makeScenario("api-latency", "Reduce API tail latency", "api-latency", "advanced", "The catalog endpoint breaches its p95 budget under load. Trace the bottleneck, reduce latency, and protect correctness with performance evidence.", 50, "limited", "catalog.js", "exports.list = async db => { const rows = await db.all(); for (const row of rows) row.owner = await db.owner(row.id); return rows; };\n", "The endpoint performs an N+1 database query loop."),
  makeScenario("vulnerable-api", "Secure a vulnerable API", "vulnerable-api", "advanced", "A public endpoint crosses an unvalidated trust boundary. Demonstrate exploitability, enforce authorization and validation, then prove compatibility.", 45, "none", "route.js", "exports.load = (db, request) => db.query('SELECT * FROM users WHERE id=' + request.query.id);\n", "The route concatenates untrusted input into a database query."),
];

function toRow(session) {
  return {
    id: session.id,
    project_id: session.projectId,
    scenario_id: session.scenarioId,
    organization_id: session.organizationId || null,
    status: session.status,
    participants: session.participants || [],
    actions: session.actions || [],
    workspace: session.workspace || {},
    policy: {
      allowedAI: session.allowedAI,
      violations: session.policyViolations || [],
      reviewerNotes: session.reviewerNotes || [],
      privacyMode: session.privacyMode || session.consent?.privacyMode || "full",
      lobbyCode: session.lobbyCode || null,
      environmentLocked: session.environmentLocked !== false,
    },
    rubric_scores: session.rubricScores || {},
    score: session.score || null,
    weighted_score: session.weightedScore ?? null,
    signed_report: session.signedReport || null,
    acceptance: session.acceptance || null,
    consent: session.consent || {},
    started_at: session.startedAt || null,
    deadline_at: session.deadlineAt || null,
    submitted_at: session.submittedAt || null,
  };
}
function fromRow(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    scenarioId: row.scenario_id,
    organizationId: row.organization_id || undefined,
    status: row.status,
    participants: row.participants || [],
    actions: row.actions || [],
    workspace: row.workspace || {},
    allowedAI: row.policy?.allowedAI || "limited",
    policyViolations: row.policy?.violations || [],
    reviewerNotes: row.policy?.reviewerNotes || [],
    privacyMode: row.policy?.privacyMode || row.consent?.privacyMode || "full",
    lobbyCode: row.policy?.lobbyCode || undefined,
    environmentLocked: row.policy?.environmentLocked !== false,
    rubricScores: row.rubric_scores || {},
    score: row.score || undefined,
    weightedScore: row.weighted_score ?? undefined,
    signedReport: row.signed_report || undefined,
    acceptance: row.acceptance || undefined,
    consent: row.consent || {},
    startedAt: row.started_at || undefined,
    deadlineAt: row.deadline_at || undefined,
    submittedAt: row.submitted_at || undefined,
  };
}
async function syncSession(session) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from("arena_sessions").upsert([toRow(session)], { onConflict: "id" });
    if (error) throw error;
  } catch (error) {
    console.warn("Arena Supabase write fell back to local storage:", error.message);
  }
}
async function syncScenario(scenario) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from("arena_scenario_templates").upsert([{
      id: scenario.id,
      organization_id: scenario.organizationId,
      title: scenario.title,
      kind: scenario.kind,
      difficulty: scenario.difficulty,
      briefing: scenario.briefing,
      time_limit_minutes: scenario.timeLimitMinutes,
      allowed_ai: scenario.allowedAI,
      injected_faults: scenario.injectedFaults,
      rubric: scenario.rubric,
      starter_files: scenario.starterFiles,
      acceptance_tests: scenario.acceptanceTests || [],
      created_by: scenario.createdBy,
      created_at: scenario.createdAt,
    }], { onConflict: "id" });
    if (error) throw error;
  } catch (error) {
    console.warn("Arena scenario Supabase write fell back to local storage:", error.message);
  }
}
function scenarioFromRow(row) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    title: row.title,
    kind: row.kind,
    difficulty: row.difficulty,
    briefing: row.briefing,
    timeLimitMinutes: row.time_limit_minutes,
    allowedAI: row.allowed_ai,
    injectedFaults: row.injected_faults || [],
    rubric: row.rubric || baseRubric,
    starterFiles: row.starter_files || {},
    acceptanceTests: row.acceptance_tests || [],
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
async function hydrateScenarios() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from("arena_scenario_templates").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    const merged = new Map(customScenarios.map((scenario) => [scenario.id, scenario]));
    for (const row of data || []) merged.set(row.id, scenarioFromRow(row));
    customScenarios = [...merged.values()];
  } catch (error) {
    console.warn("Arena scenario Supabase read fell back to local storage:", error.message);
  }
}

function cleanText(value, limit = 1000) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}
function arenaFiles(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "Arena files must be an object");
  const entries = Object.entries(value);
  if (entries.length > 40 || entries.some(([name, content]) =>
    !name || name.length > 240 || typeof content !== "string" || content.length > 70000
  )) throw new HttpError(413, "Arena workspace exceeds file count, name, or per-file limits");
  return Object.fromEntries(entries);
}
function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
async function readStore() {
  try {
    const parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      templates: Array.isArray(parsed.templates) ? parsed.templates : customScenarios,
    };
  } catch (error) {
    if (error.code === "ENOENT") return { sessions: [], templates: customScenarios };
    throw error;
  }
}
async function writeStore(store) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2) + "\n", "utf8");
  });
  return writeQueue;
}
function publicScenario(scenario, includeHidden = false) {
  const { acceptanceTests, ...visible } = scenario;
  return {
    ...visible,
    acceptanceTestCount: Array.isArray(acceptanceTests) ? acceptanceTests.length : 1,
    injectedFaults: scenario.injectedFaults.map((fault) => includeHidden ? fault : {
      id: fault.id,
      hidden: fault.hidden,
      description: fault.hidden ? "Hidden fault; diagnose it from evidence." : fault.description,
      files: {},
    }),
  };
}
async function listScenarios(options = {}) {
  await hydrateScenarios();
  return [...SCENARIOS, ...customScenarios].map((item) => publicScenario(item, Boolean(options.includeHidden)));
}
function scenarioById(id) {
  const scenario = [...SCENARIOS, ...customScenarios].find((item) => item.id === id);
  if (!scenario) throw new HttpError(404, "Arena scenario not found");
  return scenario;
}
async function createScenarioTemplate(payload, user = {}) {
  const title = cleanText(payload.title, 160);
  const briefing = cleanText(payload.briefing, 2000);
  const organizationId = cleanText(payload.organizationId, 160);
  if (!title || !briefing || !organizationId) throw new HttpError(400, "Organization, title, and briefing are required");
  const starterFiles = arenaFiles(payload.starterFiles || {});
  if (!Object.keys(starterFiles).length) throw new HttpError(400, "At least one starter file is required");
  const requestedRubric = (Array.isArray(payload.rubric) && payload.rubric.length ? payload.rubric : baseRubric).slice(0, 12).map((item, index) => ({
    id: cleanText(item.id, 80) || "criterion-" + (index + 1),
    label: cleanText(item.label, 180) || "Assessment criterion " + (index + 1),
    weight: Number(item.weight || 0),
    evidenceTypes: Array.isArray(item.evidenceTypes) ? item.evidenceTypes.slice(0, 20).map((type) => cleanText(type, 80)).filter(Boolean) : [],
  }));
  const acceptanceTests = Array.isArray(payload.acceptanceTests) ? payload.acceptanceTests.slice(0, 12).map((item, index) => ({
    id: cleanText(item.id, 120) || "acceptance-" + (index + 1),
    code: cleanText(item.code, 70000),
    timeoutMs: Math.max(1000, Math.min(30000, Number(item.timeoutMs || 10000))),
    weight: Math.max(1, Math.min(10, Number(item.weight || 1))),
    trials: Math.max(1, Math.min(5, Number(item.trials || 1))),
  })).filter((item) => item.code) : [];
  if (!acceptanceTests.length) throw new HttpError(400, "Custom Arena scenarios require at least one hidden executable acceptance test");
  const totalWeight = requestedRubric.reduce((sum, item) => sum + item.weight, 0);
  if (!requestedRubric.length || requestedRubric.some((item) => !Number.isFinite(item.weight) || item.weight <= 0 || !item.evidenceTypes.length) || Math.abs(totalWeight - 100) > 0.001) {
    throw new HttpError(400, "Arena rubric needs positive weights totaling 100 and at least one evidence type per criterion");
  }
  const scenario = {
    id: "org-" + organizationId.replace(/\W+/g, "-").toLowerCase() + "-" + randomUUID().slice(0, 8),
    title,
    kind: ["outage", "memory-leak", "concurrency", "dependency-compromise", "database-recovery", "malicious-patch", "api-latency", "vulnerable-api"].includes(payload.kind) ? payload.kind : "outage",
    difficulty: ["intermediate", "advanced", "expert"].includes(payload.difficulty) ? payload.difficulty : "advanced",
    briefing,
    timeLimitMinutes: Math.max(10, Math.min(240, Number(payload.timeLimitMinutes || 45))),
    allowedAI: ["none", "limited", "full-with-disclosure"].includes(payload.allowedAI) ? payload.allowedAI : "limited",
    injectedFaults: Array.isArray(payload.injectedFaults) ? payload.injectedFaults.slice(0, 8).map((fault) => ({
      id: cleanText(fault.id, 120) || randomUUID(),
      description: cleanText(fault.description, 1000) || "Organization-defined hidden fault",
      hidden: fault.hidden !== false,
      files: arenaFiles(fault.files || {}),
    })) : [],
    rubric: requestedRubric,
    starterFiles,
    acceptanceTests,
    organizationId,
    createdBy: cleanText(user.username || user.email, 120) || "Evaluator",
    createdAt: new Date().toISOString(),
  };
  customScenarios.push(scenario);
  const store = await readStore();
  store.templates = customScenarios;
  await writeStore(store);
  await syncScenario(scenario);
  return publicScenario(scenario, true);
}

function sessionWorkspace(scenario) {
  return scenario.injectedFaults.reduce((files, fault) => ({ ...files, ...fault.files }), { ...scenario.starterFiles });
}
async function listSessions(projectId) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("arena_sessions").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []).map(fromRow);
    } catch (error) {
      console.warn("Arena Supabase read fell back to local storage:", error.message);
    }
  }
  const store = await readStore();
  return store.sessions.filter((item) => item.projectId === projectId);
}
async function startSession(projectId, payload, user = {}) {
  await hydrateScenarios();
  const scenario = scenarioById(cleanText(payload.scenarioId, 120));
  if (payload.consentRecorded !== true) throw new HttpError(400, "Candidate consent is required before evidence recording");
  const now = new Date();
  const lobby = payload.lobby === true;
  const participants = Array.isArray(payload.participants) && payload.participants.length
    ? payload.participants.slice(0, 12).map((item) => ({
        id: cleanText(item.id, 120) || randomUUID(),
        name: cleanText(item.name, 120) || "Participant",
        role: ["candidate", "team-member", "evaluator"].includes(item.role) ? item.role : "candidate",
      }))
    : [{ id: cleanText(user.id || user.sub, 120) || randomUUID(), name: cleanText(user.username || user.email, 120) || "Candidate", role: "candidate" }];
  const session = {
    id: randomUUID(),
    projectId,
    scenarioId: scenario.id,
    organizationId: cleanText(payload.organizationId, 160) || undefined,
    status: lobby ? "lobby" : "running",
    participants,
    startedAt: lobby ? undefined : now.toISOString(),
    deadlineAt: lobby ? undefined : new Date(now.getTime() + scenario.timeLimitMinutes * 60_000).toISOString(),
    lobbyCode: lobby ? randomUUID().slice(0, 8).toUpperCase() : undefined,
    submittedAt: undefined,
    actions: [],
    workspace: sessionWorkspace(scenario),
    environmentLocked: true,
    allowedAI: scenario.allowedAI,
    privacyMode: payload.privacyMode === "redacted" ? "redacted" : "full",
    policyViolations: [],
    reviewerNotes: [],
    consent: { recorded: true, recordedAt: now.toISOString(), privacyMode: payload.privacyMode === "redacted" ? "redacted" : "full" },
  };
  const store = await readStore();
  store.sessions.push(session);
  await writeStore(store);
  await syncSession(session);
  return session;
}
async function mutateSession(sessionId, mutate) {
  const store = await readStore();
  const index = store.sessions.findIndex((item) => item.id === sessionId);
  if (index >= 0) {
    const next = await mutate({ ...store.sessions[index] });
    store.sessions[index] = next;
    await writeStore(store);
    await syncSession(next);
    return next;
  }
  if (supabase) {
    try {
      const { data, error } = await supabase.from("arena_sessions").select("*").eq("id", sessionId).limit(1);
      if (error) throw error;
      if (data?.[0]) {
        const next = await mutate(fromRow(data[0]));
        await syncSession(next);
        return next;
      }
    } catch (error) {
      console.warn("Arena Supabase mutation lookup failed:", error.message);
    }
  }
  throw new HttpError(404, "Arena session not found");
}
async function joinLobby(projectId, sessionId, payload, user = {}) {
  return mutateSession(sessionId, async (session) => {
    if (session.projectId !== projectId || session.status !== "lobby") throw new HttpError(409, "Arena lobby is not joinable");
    const participant = {
      id: cleanText(user.id || user.sub, 120) || randomUUID(),
      name: cleanText(payload.name || user.username || user.email, 120) || "Team member",
      role: payload.role === "evaluator" ? "evaluator" : "team-member",
    };
    if (!session.participants.some((item) => item.id === participant.id)) session.participants.push(participant);
    return session;
  });
}
async function joinLobbyByCode(projectId, payload, user = {}) {
  const code = cleanText(payload.lobbyCode, 24).toUpperCase();
  if (!code) throw new HttpError(400, "Lobby code is required");
  const sessions = await listSessions(projectId);
  const target = sessions.find((session) => session.status === "lobby" && String(session.lobbyCode || "").toUpperCase() === code);
  if (!target) throw new HttpError(404, "Joinable arena lobby not found");
  const localStore = await readStore();
  if (localStore.sessions.some((session) => session.id === target.id)) return joinLobby(projectId, target.id, payload, user);
  const participant = {
    id: cleanText(user.id || user.sub, 120) || randomUUID(),
    name: cleanText(payload.name || user.username || user.email, 120) || "Team member",
    role: payload.role === "evaluator" ? "evaluator" : "team-member",
  };
  if (!target.participants.some((item) => item.id === participant.id)) target.participants.push(participant);
  await syncSession(target);
  return target;
}

async function matchmake(projectId, payload, user = {}) {
  const scenarioId = cleanText(payload.scenarioId, 120);
  await hydrateScenarios();
  scenarioById(scenarioId);
  const sessions = await listSessions(projectId);
  const lobby = sessions.find((session) => session.status === "lobby" && session.scenarioId === scenarioId && session.participants.length < 4);
  if (lobby?.lobbyCode) return { session: await joinLobbyByCode(projectId, { ...payload, lobbyCode: lobby.lobbyCode }, user), matched: true };
  return {
    session: await startSession(projectId, { ...payload, scenarioId, consentRecorded: true, lobby: true }, user),
    matched: false,
  };
}

async function beginLobby(projectId, sessionId) {
  return mutateSession(sessionId, async (session) => {
    if (session.projectId !== projectId || session.status !== "lobby") throw new HttpError(409, "Arena lobby cannot start");
    const scenario = scenarioById(session.scenarioId);
    const now = new Date();
    session.status = "running";
    session.startedAt = now.toISOString();
    session.deadlineAt = new Date(now.getTime() + scenario.timeLimitMinutes * 60_000).toISOString();
    return session;
  });
}

async function recordAction(projectId, sessionId, payload) {
  return mutateSession(sessionId, async (session) => {
    if (session.projectId !== projectId) throw new HttpError(404, "Arena session not found");
    if (session.status !== "running") throw new HttpError(409, "Arena session is not running");
    if (Date.parse(session.deadlineAt) < Date.now()) {
      session.status = "expired";
      return session;
    }
    const type = cleanText(payload.type, 80);
    if (!type) throw new HttpError(400, "Action type is required");
    if (type === "ai.prompted" && session.allowedAI === "none") session.policyViolations.push({ id: randomUUID(), type: "disallowed-ai", occurredAt: new Date().toISOString() });
    session.actions.push({
      id: randomUUID(),
      type,
      summary: cleanText(payload.summary, 600) || type,
      occurredAt: payload.occurredAt && Number.isFinite(Date.parse(payload.occurredAt)) ? new Date(payload.occurredAt).toISOString() : new Date().toISOString(),
      evidenceEventId: cleanText(payload.evidenceEventId, 160) || undefined,
    });
    return session;
  });
}
function rubricScore(rubric, actions, evidenceEvents) {
  const types = new Set([...actions, ...evidenceEvents].map((item) => item.type));
  const covered = rubric.evidenceTypes.filter((type) => types.has(type)).length;
  return clamp((covered / Math.max(1, rubric.evidenceTypes.length)) * 100);
}
function finalScorecard(rubricScores, actions, evidenceEvents, integrity, policyViolations, acceptance) {
  const combined = [...actions, ...evidenceEvents];
  const ai = combined.filter((item) => item.type === "ai.prompted").length;
  const changes = combined.filter((item) => item.type === "code.changed").length;
  const penalty = policyViolations.length * 15;
  return {
    finalCorrectness: clamp(Number(acceptance?.score || 0)),
    problemSolvingProcess: clamp((rubricScores.diagnosis || 0) * 0.7 + (rubricScores.communication || 0) * 0.3 - penalty),
    debuggingAbility: clamp((rubricScores.diagnosis || 0) * 0.55 + (rubricScores.recovery || 0) * 0.45),
    testQuality: rubricScores.testing || 0,
    codeComprehension: rubricScores.communication || 0,
    securityAwareness: rubricScores.security || 0,
    evidenceIntegrity: integrity?.verified === false ? 0 : 100,
    aiDependence: ai / Math.max(1, ai + changes) > 0.55 ? "High" : ai ? "Moderate" : "Low",
  };
}
function signReport(report) {
  return signing.sign(report, "arena");
}
async function submitSession(projectId, sessionId, payload, evidenceSnapshot) {
  await hydrateScenarios();
  const sourceSession = (await listSessions(projectId)).find((item) => item.id === sessionId);
  if (!sourceSession) throw new HttpError(404, "Arena session not found");
  const scenario = scenarioById(sourceSession.scenarioId);
  try {
    signing.purposeConfig("arena");
  } catch (error) {
    throw new HttpError(503, "Arena report signing is not configured: " + error.message);
  }
  return mutateSession(sessionId, async (session) => {
    if (session.projectId !== projectId) throw new HttpError(404, "Arena session not found");
    if (!["running", "expired"].includes(session.status)) throw new HttpError(409, "Arena session cannot be submitted");
    const evidenceEvents = Array.isArray(evidenceSnapshot?.events) ? evidenceSnapshot.events.filter((item) => Date.parse(item.occurredAt) >= Date.parse(session.startedAt)) : [];
    const submittedFiles = arenaFiles(payload.files || {});
    if (!Object.keys(submittedFiles).length) throw new HttpError(400, "The candidate workspace is required for hidden acceptance testing");
    if (Object.keys(submittedFiles).some((name) => name.replace(/\\/g, "/").startsWith(".evidence/"))) throw new HttpError(400, "The reserved hidden-test namespace cannot be submitted");
    let acceptance;
    try {
      acceptance = await evaluateArenaSubmission(scenario, submittedFiles);
    } catch (error) {
      throw new HttpError(503, "Hidden Arena acceptance execution failed: " + error.message);
    }
    const aiPrompts = evidenceEvents.filter((item) => item.type === "ai.prompted");
    const disclosedAI = evidenceEvents.some((item) => item.type === "chat.message" && /\b(ai|assistant|model)\b.*\b(used|disclos|help)/i.test(String(item.payload?.message || item.summary || "")));
    if (session.allowedAI === "none" && aiPrompts.length && !session.policyViolations.some((item) => item.type === "disallowed-ai")) {
      session.policyViolations.push({ id: randomUUID(), type: "disallowed-ai", count: aiPrompts.length, occurredAt: aiPrompts[0].occurredAt });
    }
    if (session.allowedAI === "limited" && aiPrompts.length > 3 && !session.policyViolations.some((item) => item.type === "ai-limit-exceeded")) {
      session.policyViolations.push({ id: randomUUID(), type: "ai-limit-exceeded", count: aiPrompts.length, occurredAt: aiPrompts[3].occurredAt });
    }
    if (session.allowedAI === "full-with-disclosure" && aiPrompts.length && !disclosedAI && !session.policyViolations.some((item) => item.type === "ai-use-undisclosed")) {
      session.policyViolations.push({ id: randomUUID(), type: "ai-use-undisclosed", count: aiPrompts.length, occurredAt: aiPrompts[0].occurredAt });
    }
    const rubricScores = Object.fromEntries(scenario.rubric.map((rubric) => [rubric.id, rubricScore(rubric, session.actions, evidenceEvents)]));
    if (Object.hasOwn(rubricScores, "correctness")) rubricScores.correctness = acceptance.score;
    const weightedScore = clamp(scenario.rubric.reduce((sum, rubric) => sum + rubricScores[rubric.id] * rubric.weight / 100, 0) - session.policyViolations.length * 12);
    const score = finalScorecard(rubricScores, session.actions, evidenceEvents, evidenceSnapshot?.integrity, session.policyViolations, acceptance);
    const submittedAt = new Date().toISOString();
    const reportBody = {
      sessionId: session.id,
      scenarioId: scenario.id,
      projectId,
      participantIds: session.participants.map((item) => item.id),
      startedAt: session.startedAt,
      submittedAt,
      weightedScore,
      rubricScores,
      score,
      integrity: evidenceSnapshot?.integrity || { verified: true, checkedEvents: 0 },
      evidenceDigest: digest(evidenceEvents),
      policyViolations: session.policyViolations,
      acceptance,
      submittedWorkspaceDigest: digest(submittedFiles),
      reviewerNotes: Array.isArray(payload.reviewerNotes) ? payload.reviewerNotes.map((item) => cleanText(item, 1000)).filter(Boolean) : [],
      consentRecorded: session.consent.recorded,
      privacyMode: session.consent.privacyMode,
    };
    session.status = "graded";
    session.submittedAt = submittedAt;
    session.score = score;
    session.weightedScore = weightedScore;
    session.rubricScores = rubricScores;
    session.reviewerNotes = reportBody.reviewerNotes;
    session.workspace = submittedFiles;
    session.acceptance = acceptance;
    const attestation = signReport(reportBody);
    session.signedReport = {
      digest: digest(reportBody),
      signature: attestation.signature,
      signatureAlgorithm: attestation.algorithm,
      signatureIssuer: attestation.issuer,
      signatureKeyId: attestation.keyId,
      generatedAt: submittedAt,
      consentRecorded: session.consent.recorded,
      privacyMode: session.consent.privacyMode,
      report: reportBody,
    };
    return session;
  });
}
async function verifySignedReport(projectId, sessionId) {
  const sessions = await listSessions(projectId);
  const session = sessions.find((item) => item.id === sessionId);
  if (!session?.signedReport?.report) throw new HttpError(404, "Signed arena report not found");
  const digestVerified = digest(session.signedReport.report) === session.signedReport.digest;
  const signatureVerified = signing.verify(session.signedReport.report, session.signedReport.signature, {
    algorithm: session.signedReport.signatureAlgorithm,
    issuer: session.signedReport.signatureIssuer,
    keyId: session.signedReport.signatureKeyId,
  }, "arena");
  return {
    sessionId,
    reportDigest: session.signedReport.digest,
    digestVerified,
    signatureVerified,
    verified: digestVerified && signatureVerified,
    verifiedAt: new Date().toISOString(),
  };
}

async function leaderboard(scenarioId) {
  let sessions;
  if (supabase) {
    try {
      let query = supabase.from("arena_sessions").select("*").eq("status", "graded");
      if (scenarioId) query = query.eq("scenario_id", scenarioId);
      const { data, error } = await query.order("weighted_score", { ascending: false });
      if (error) throw error;
      sessions = (data || []).map(fromRow);
    } catch (error) {
      console.warn("Arena leaderboard Supabase read fell back to local storage:", error.message);
    }
  }
  if (!sessions) {
    const store = await readStore();
    sessions = store.sessions.filter((item) => item.status === "graded" && (!scenarioId || item.scenarioId === scenarioId));
  }
  return sessions
    .sort((left, right) => right.weightedScore - left.weightedScore || Date.parse(left.submittedAt) - Date.parse(right.submittedAt))
    .map((session, index) => ({
      sessionId: session.id,
      scenarioId: session.scenarioId,
      participant: session.consent?.privacyMode === "redacted" ? "Anonymous candidate" : session.participants.find((item) => item.role === "candidate")?.name || "Team",
      score: session.weightedScore,
      elapsedMs: Math.max(0, Date.parse(session.submittedAt) - Date.parse(session.startedAt)),
      rank: index + 1,
      integrityVerified: session.score?.evidenceIntegrity === 100,
    }));
}

module.exports = {
  beginLobby,
  createScenarioTemplate,
  joinLobby,
  joinLobbyByCode,
  leaderboard,
  matchmake,
  listScenarios,
  listSessions,
  recordAction,
  startSession,
  submitSession,
  verifySignedReport,
};