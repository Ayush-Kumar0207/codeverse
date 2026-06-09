const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/auth.service");
const HttpError = require("../utils/httpError");
const crypto = require("crypto");

function getApiBaseUrl(req) {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    `${req.protocol}://${req.get("host")}`
  ).replace(/\/$/, "");
}

function getClientBaseUrl() {
  return (
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function getRedirectUri(req, provider) {
  const configuredCallback =
    provider === "github"
      ? process.env.GITHUB_CALLBACK_URL
      : process.env.GOOGLE_CALLBACK_URL;

  if (configuredCallback) return configuredCallback;

  return `${getApiBaseUrl(req)}/api/auth/${provider}/callback`;
}

function rememberOAuthState(req, provider) {
  const state = crypto.randomBytes(24).toString("hex");
  req.session.oauthState = { provider, state };
  return state;
}

function validateOAuthState(req, provider) {
  const expected = req.session.oauthState;
  req.session.oauthState = null;

  if (!expected) return;
  if (expected.provider !== provider || expected.state !== req.query.state) {
    throw new HttpError(401, `${provider} authentication state did not match`);
  }
}

function encodeOAuthUser(user) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function redirectOAuthSuccess(res, provider, result) {
  const url = new URL("/oauth-success", getClientBaseUrl());
  url.searchParams.set("provider", provider);
  url.searchParams.set("token", result.token);
  url.searchParams.set("user", encodeOAuthUser(result.user));
  res.redirect(url.toString());
}

function redirectOAuthError(res, provider, message) {
  const url = new URL("/login", getClientBaseUrl());
  url.searchParams.set("oauth_error", message || `${provider} authentication failed`);
  res.redirect(url.toString());
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.error) {
    throw new HttpError(
      401,
      data.error_description || data.error || data.message || "OAuth provider request failed"
    );
  }

  return data;
}

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json(result);
});

const profile = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user.username);
  res.json(result);
});

const githubStart = asyncHandler(async (req, res) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    redirectOAuthError(res, "github", "GitHub sign-in is not configured on this server.");
    return;
  }

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", getRedirectUri(req, "github"));
  url.searchParams.set("scope", "user:email");
  url.searchParams.set("state", rememberOAuthState(req, "github"));
  res.redirect(url.toString());
});

const githubCallback = asyncHandler(async (req, res) => {
  if (req.query.error) {
    redirectOAuthError(res, "github", String(req.query.error_description || req.query.error));
    return;
  }

  validateOAuthState(req, "github");

  const code = String(req.query.code || "");
  if (!code) {
    redirectOAuthError(res, "github", "GitHub did not return an authorization code.");
    return;
  }

  const tokenData = await fetchJson("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getRedirectUri(req, "github"),
    }),
  });

  const accessToken = tokenData.access_token;
  const githubProfile = await fetchJson("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "CodeVerse",
    },
  });

  let email = githubProfile.email || "";
  if (!email) {
    const emails = await fetchJson("https://api.github.com/user/emails", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "CodeVerse",
      },
    });
    const primaryEmail = Array.isArray(emails)
      ? emails.find((item) => item.primary && item.verified) || emails.find((item) => item.verified) || emails[0]
      : null;
    email = primaryEmail?.email || "";
  }

  const result = await authService.processGithubUser({
    providerId: String(githubProfile.id),
    username: githubProfile.login,
    displayName: githubProfile.name,
    email,
  });

  redirectOAuthSuccess(res, "github", result);
});

const googleStart = asyncHandler(async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    redirectOAuthError(res, "google", "Google sign-in is not configured on this server.");
    return;
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", getRedirectUri(req, "google"));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("state", rememberOAuthState(req, "google"));
  res.redirect(url.toString());
});

const googleCallback = asyncHandler(async (req, res) => {
  if (req.query.error) {
    redirectOAuthError(res, "google", String(req.query.error_description || req.query.error));
    return;
  }

  validateOAuthState(req, "google");

  const code = String(req.query.code || "");
  if (!code) {
    redirectOAuthError(res, "google", "Google did not return an authorization code.");
    return;
  }

  const tokenData = await fetchJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(req, "google"),
    }),
  });

  const googleProfile = await fetchJson("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const result = await authService.processGoogleUser({
    providerId: String(googleProfile.sub),
    username: googleProfile.email ? String(googleProfile.email).split("@")[0] : googleProfile.name,
    displayName: googleProfile.name,
    email: googleProfile.email,
  });

  redirectOAuthSuccess(res, "google", result);
});

module.exports = {
  register,
  login,
  profile,
  githubStart,
  githubCallback,
  googleStart,
  googleCallback,
};

