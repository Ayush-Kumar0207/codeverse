const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(authMiddleware);
const { handleDeploy } = require("../controllers/deployment.controller");

router.post("/", handleDeploy);

module.exports = router;
