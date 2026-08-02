const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const evidenceController = require("../controllers/evidence.controller");

const router = express.Router();

router.use(standardRouteLimiter);
router.use(authMiddleware);

router.get("/arena/scenarios", evidenceController.arenaScenarios);
router.post("/arena/scenarios", evidenceController.createArenaScenario);
router.get("/arena/leaderboard", evidenceController.arenaLeaderboard);
router.get("/:projectId/arena/sessions", evidenceController.arenaSessions);
router.post("/:projectId/arena/sessions", evidenceController.startArena);
router.post("/:projectId/arena/sessions/:sessionId/join", evidenceController.joinArenaLobby);
router.post("/:projectId/arena/lobbies/join", evidenceController.joinArenaLobbyByCode);
router.post("/:projectId/arena/matchmake", evidenceController.matchmakeArena);
router.post("/:projectId/arena/sessions/:sessionId/begin", evidenceController.beginArenaLobby);
router.post("/:projectId/arena/sessions/:sessionId/actions", evidenceController.recordArenaAction);
router.post("/:projectId/arena/sessions/:sessionId/submit", evidenceController.submitArena);
router.get("/:projectId/arena/sessions/:sessionId/report/verify", evidenceController.verifyArenaReport);

router.get("/:projectId", evidenceController.overview);
router.post("/:projectId/events", evidenceController.recordEvent);
router.post("/:projectId/packages", evidenceController.createPackage);
router.get("/:projectId/packages/:packageId/verify", evidenceController.verifyPackage);
router.get("/:projectId/export", evidenceController.exportEvidence);
router.post("/:projectId/reviews", evidenceController.runReview);
router.post("/:projectId/challenges", evidenceController.createChallenge);
router.post("/:projectId/verifications", evidenceController.verifyUnderstanding);
router.post("/:projectId/twin", evidenceController.createDigitalTwin);
router.post("/:projectId/replays/:sessionId/verify", evidenceController.verifyReplay);

module.exports = router;

