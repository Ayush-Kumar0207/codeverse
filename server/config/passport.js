const User = require("../models/User"); // ✅ Add this line

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/github/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // 🔍 Try to find user by GitHub username or GitHub ID
    let user = await User.findOne({ username: profile.username });

    if (!user) {
      // 👤 Create new user if not found
      user = new User({
        username: profile.username,
        email: profile.emails?.[0]?.value || "",
        githubId: profile.id,
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return done(err, null);
  }
}));