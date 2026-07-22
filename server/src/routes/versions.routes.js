const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const versionController = require("../controllers/version.controller");

const router = express.Router();

router.use(standardRouteLimiter);

router.use(authMiddleware);

router.post("/save", versionController.save);
router.get("/:userId/:fileName", versionController.list);

module.exports = router;

