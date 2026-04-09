const { supabase } = require("./db");
require("dotenv").config();

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/github/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // 🔍 Try to find user by GitHub username
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("username", profile.username)
      .single();

    if (findError && findError.code !== "PGRST116") { // PGRST116 is "No rows found"
       throw findError;
    }

    let user = existingUser;

    if (!user) {
      // 👤 Create new user if not found
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{
          username: profile.username,
          email: profile.emails?.[0]?.value || "",
          github_id: profile.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;
    }

    return done(null, user);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return done(err, null);
  }
}));