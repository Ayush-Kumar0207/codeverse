const express = require("express");
const aiController = require("../controllers/ai.controller");

const router = express.Router();

router.post("/suggest", aiController.suggest);
router.post("/suggest/stream", aiController.suggestStream);

module.exports = router;

