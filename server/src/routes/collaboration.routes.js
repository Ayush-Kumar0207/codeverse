const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const collaborationService = require("../services/collaboration.service");

const router = express.Router();

router.use(standardRouteLimiter);
router.use(authMiddleware);

router.get("/:roomId/project", asyncHandler(async (req, res) => {
  const result = await collaborationService.getAuthorizedProject({
    roomId: req.params.roomId,
    authUser: req.user,
    inviteToken: typeof req.query.invite === "string" ? req.query.invite : "",
    reconnectToken: typeof req.query.reconnect === "string" ? req.query.reconnect : "",
  });
  if (!result) return res.status(404).json({ error: "Collaboration project not found" });
  return res.json(result);
}));

module.exports = router;
