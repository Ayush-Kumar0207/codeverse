const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const evidenceController = require("../controllers/evidence.controller");

const router = express.Router();

router.use(standardRouteLimiter);
router.use(authMiddleware);

router.get("/:projectId", evidenceController.overview);
router.post("/:projectId/events", evidenceController.recordEvent);
router.post("/:projectId/packages", evidenceController.createPackage);
router.post("/:projectId/reviews", evidenceController.runReview);
router.post("/:projectId/challenges", evidenceController.createChallenge);
router.post("/:projectId/verifications", evidenceController.verifyUnderstanding);
router.post("/:projectId/twin", evidenceController.createDigitalTwin);

module.exports = router;

