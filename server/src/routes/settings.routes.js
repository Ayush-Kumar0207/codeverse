const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const settingsController = require("../controllers/settings.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(standardRouteLimiter);

// All settings routes require authentication
router.use(authMiddleware);

router.post("/sync", settingsController.sync);
router.get("/latest", settingsController.fetchLatest);
router.get("/history", settingsController.fetchHistory);

module.exports = router;
