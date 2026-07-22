const express = require("express");
const executionController = require("../controllers/execution.controller");
const { executionLimiter } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.post("/", executionLimiter, executionController.execute);

module.exports = router;

