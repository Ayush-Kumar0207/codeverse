const asyncHandler = require("../middlewares/asyncHandler");
const evidenceService = require("../services/evidence.service");
const arenaService = require("../services/arena.service");

const overview = asyncHandler(async (req, res) => {
  res.json(await evidenceService.getSnapshot(req.params.projectId));
});

const recordEvent = asyncHandler(async (req, res) => {
  const event = await evidenceService.recordEvent(req.params.projectId, req.body, req.user);
  res.status(201).json({ event });
});

const createPackage = asyncHandler(async (req, res) => {
  const evidencePackage = await evidenceService.createPackage(req.params.projectId, req.body, req.user);
  res.status(201).json({ package: evidencePackage });
});

const runReview = asyncHandler(async (req, res) => {
  const review = await evidenceService.runReview(req.params.projectId, req.body);
  res.status(201).json({ review });
});

const createChallenge = asyncHandler(async (req, res) => {
  const challenge = evidenceService.createChallenge(req.params.projectId, req.body);
  res.json({ challenge });
});

const verifyUnderstanding = asyncHandler(async (req, res) => {
  const verification = await evidenceService.verifyUnderstanding(req.params.projectId, req.body);
  res.status(201).json({ verification });
});

const createDigitalTwin = asyncHandler(async (req, res) => {
  const twin = evidenceService.createDigitalTwin(req.body);
  res.json({ twin });
});

const verifyPackage = asyncHandler(async (req, res) => {
  res.json({ verification: await evidenceService.verifyPackage(req.params.projectId, req.params.packageId) });
});

const exportEvidence = asyncHandler(async (req, res) => {
  res.json(await evidenceService.exportEvidence(req.params.projectId, req.query.privacy));
});

const verifyReplay = asyncHandler(async (req, res) => {
  const report = await evidenceService.verifyReplay(req.params.projectId, req.params.sessionId, req.body, req.user);
  res.json({ report });
});

const arenaScenarios = asyncHandler(async (req, res) => {
  res.json({ scenarios: await arenaService.listScenarios({ includeHidden: req.user?.role === "evaluator" || req.user?.role === "admin" }) });
});

const createArenaScenario = asyncHandler(async (req, res) => {
  res.status(201).json({ scenario: await arenaService.createScenarioTemplate(req.body, req.user) });
});

const arenaSessions = asyncHandler(async (req, res) => {
  res.json({ sessions: await arenaService.listSessions(req.params.projectId) });
});

const startArena = asyncHandler(async (req, res) => {
  const session = await arenaService.startSession(req.params.projectId, req.body, req.user);
  await evidenceService.recordEvent(req.params.projectId, {
    type: session.status === "lobby" ? "arena.action" : "arena.started",
    sessionId: session.id,
    actor: { name: req.user?.username || "Candidate", kind: "human" },
    summary: session.status === "lobby" ? "Team arena lobby created." : "Arena scenario " + session.scenarioId + " started.",
    source: "engineering-arena",
    payload: { arenaSessionId: session.id, scenarioId: session.scenarioId, deadlineAt: session.deadlineAt, lobbyCode: session.lobbyCode },
  }, req.user);
  res.status(201).json({ session });
});

const joinArenaLobby = asyncHandler(async (req, res) => {
  res.json({ session: await arenaService.joinLobby(req.params.projectId, req.params.sessionId, req.body, req.user) });
});

const joinArenaLobbyByCode = asyncHandler(async (req, res) => {
  const session = await arenaService.joinLobbyByCode(req.params.projectId, req.body, req.user);
  res.json({ session });
});

const matchmakeArena = asyncHandler(async (req, res) => {
  const result = await arenaService.matchmake(req.params.projectId, req.body, req.user);
  await evidenceService.recordEvent(req.params.projectId, {
    type: "arena.action",
    sessionId: result.session.id,
    actor: { name: req.user?.username || "Candidate", kind: "human" },
    summary: result.matched ? "Candidate matched into an arena team." : "Matchmaking created a new arena lobby.",
    source: "engineering-arena",
    payload: { arenaSessionId: result.session.id, scenarioId: result.session.scenarioId, lobbyCode: result.session.lobbyCode, matched: result.matched },
  }, req.user);
  res.status(result.matched ? 200 : 201).json(result);
});

const beginArenaLobby = asyncHandler(async (req, res) => {
  const session = await arenaService.beginLobby(req.params.projectId, req.params.sessionId);
  await evidenceService.recordEvent(req.params.projectId, {
    type: "arena.started",
    sessionId: session.id,
    actor: { name: req.user?.username || "Organizer", kind: "human" },
    summary: "Team arena scenario " + session.scenarioId + " started.",
    source: "engineering-arena",
    payload: { arenaSessionId: session.id, scenarioId: session.scenarioId, deadlineAt: session.deadlineAt, participants: session.participants.length },
  }, req.user);
  res.json({ session });
});

const recordArenaAction = asyncHandler(async (req, res) => {
  const session = await arenaService.recordAction(req.params.projectId, req.params.sessionId, req.body);
  const event = await evidenceService.recordEvent(req.params.projectId, {
    type: "arena.action",
    sessionId: session.id,
    actor: { name: req.user?.username || "Candidate", kind: "human" },
    summary: req.body.summary || req.body.type || "Arena action",
    source: "engineering-arena",
    payload: { arenaSessionId: session.id, actionType: req.body.type, evidenceEventId: req.body.evidenceEventId },
  }, req.user);
  res.status(201).json({ session, event });
});

const submitArena = asyncHandler(async (req, res) => {
  const evidenceSnapshot = await evidenceService.getSnapshot(req.params.projectId);
  const session = await arenaService.submitSession(req.params.projectId, req.params.sessionId, req.body, evidenceSnapshot);
  await evidenceService.recordEvent(req.params.projectId, {
    type: "arena.completed",
    sessionId: session.id,
    actor: { name: req.user?.username || "Candidate", kind: "human" },
    summary: "Arena scenario completed with score " + session.weightedScore + ".",
    source: "engineering-arena",
    payload: { arenaSessionId: session.id, weightedScore: session.weightedScore, reportDigest: session.signedReport?.digest },
  }, req.user);
  res.json({ session });
});

const verifyArenaReport = asyncHandler(async (req, res) => {
  res.json({ verification: await arenaService.verifySignedReport(req.params.projectId, req.params.sessionId) });
});

const arenaLeaderboard = asyncHandler(async (req, res) => {
  res.json({ leaderboard: await arenaService.leaderboard(req.query.scenarioId) });
});

module.exports = {
  overview,
  recordEvent,
  createPackage,
  runReview,
  createChallenge,
  verifyUnderstanding,
  createDigitalTwin,
  verifyPackage,
  exportEvidence,
  verifyReplay,
  arenaScenarios,
  createArenaScenario,
  arenaSessions,
  startArena,
  joinArenaLobby,
  joinArenaLobbyByCode,
  matchmakeArena,
  beginArenaLobby,
  recordArenaAction,
  submitArena,
  verifyArenaReport,
  arenaLeaderboard,
};

