const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const codeController = require("../controllers/code.controller");

const router = express.Router();

router.use(standardRouteLimiter);

router.use(authMiddleware);

router.post("/save", codeController.saveCode);
router.get("/versions", codeController.getVersions);
router.get("/user/:userId", codeController.getUserCodes);

module.exports = router;

