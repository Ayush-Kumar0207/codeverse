const express = require("express");
const aiController = require("../controllers/ai.controller");
const { aiLimiter } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.use(aiLimiter);

router.post("/suggest", aiController.suggest);
router.post("/suggest/stream", aiController.suggestStream);

module.exports = router;

