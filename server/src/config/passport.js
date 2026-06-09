require("./env");

const passport = require("passport");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// OAuth sign-in is handled by the auth controller so GitHub and Google can
// share the same token issuing path. Passport remains initialized for existing
// session middleware compatibility.
