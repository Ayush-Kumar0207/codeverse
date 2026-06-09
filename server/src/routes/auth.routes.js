const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.profile);
router.get("/github", authController.githubStart);
router.get("/github/callback", authController.githubCallback);
router.get("/google", authController.googleStart);
router.get("/google/callback", authController.googleCallback);

module.exports = router;

