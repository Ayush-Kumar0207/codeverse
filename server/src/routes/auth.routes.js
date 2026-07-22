const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authMiddleware, authController.profile);
router.get("/github", authLimiter, authController.githubStart);
router.get("/github/callback", authController.githubCallback);
router.get("/google", authLimiter, authController.googleStart);
router.get("/google/callback", authController.googleCallback);

module.exports = router;

