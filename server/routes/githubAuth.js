const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// Step 1: Redirect user to GitHub OAuth
router.get("/github", (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=user`;
  res.redirect(redirectUrl);
});

// Step 2: GitHub redirects back with ?code
router.get("/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    // Fetch user profile from GitHub
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userRes.data;

    // Check if user exists or create new
    let user = await User.findOne({ username: githubUser.login });

    if (!user) {
      user = new User({
        username: githubUser.login,
        email: githubUser.email,
        preferences: {},
        history: [],
        reminders: [],
        doctor_links: [],
      });

      await user.save();
    }

    // Issue JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect to frontend with token & user
    const redirectWithToken = `http://localhost:3000/login?token=${token}&user=${encodeURIComponent(
      JSON.stringify(user)
    )}`;

    res.redirect(redirectWithToken);
  } catch (err) {
    console.error("GitHub OAuth Error:", err.message);
    res.status(500).send("GitHub Authentication Failed");
  }
});

module.exports = router;