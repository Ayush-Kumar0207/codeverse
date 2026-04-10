const express = require("express");
const router = express.Router();
const { handleDeploy } = require("../controllers/deployment.controller");

router.post("/", handleDeploy);

module.exports = router;
