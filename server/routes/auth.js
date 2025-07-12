const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { generateToken } = require("../utils/jwt"); // Utility for token
require("../config/passport"); // Load GitHub strategy

const router = express.Router();

// 🔐 POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 🔐 POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({ username: user.username, _id: user._id });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// 🔐 GET /api/auth/profile (protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select("-password");
    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// 🐙 GITHUB OAUTH FLOW
// 🔗 Step 1: Redirect to GitHub login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// 🔁 Step 2: GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const githubUser = req.user;

      // Check if user already exists
      let user = await User.findOne({ githubId: githubUser.githubId });

      // If not, create new user
      if (!user) {
        user = new User({
          username: githubUser.username,
          email: githubUser.email || `${githubUser.githubId}@github.com`,
          githubId: githubUser.githubId,
          avatar: githubUser.avatar,
        });
        await user.save();
      }

      // Issue JWT
      const token = generateToken({ username: user.username, _id: user._id });

      // Redirect back to frontend with token
      res.redirect(`${process.env.NEXT_PUBLIC_API_BASE_URL}/github-success?token=${token}`);
    } catch (err) {
      console.error("GitHub OAuth error:", err.message);
      res.redirect("/login");
    }
  }
);

module.exports = router;