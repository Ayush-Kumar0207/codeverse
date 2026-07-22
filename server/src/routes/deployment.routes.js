const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(standardRouteLimiter);

router.use(authMiddleware);
const { handleDeploy } = require("../controllers/deployment.controller");

router.post("/", handleDeploy);

module.exports = router;
