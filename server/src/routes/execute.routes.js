const express = require("express");
const executionController = require("../controllers/execution.controller");

const router = express.Router();

router.post("/", executionController.execute);

module.exports = router;

