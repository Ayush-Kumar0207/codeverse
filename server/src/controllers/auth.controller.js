const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/auth.service");
const HttpError = require("../utils/httpError");
const crypto = require("crypto");

function getRequestProtocol(req) {
  const forwardedProtocol = String(req.get("x-forwarded-proto") || "")
    .split(",")[0]
    .trim();

  if (forwardedProtocol) return forwardedProtocol;

  const protocol = req.protocol || "http";
  const host = String(req.get("host") || "");

  if (
    protocol === "http" &&
    host &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.0.0.1")
  ) {
    return "https";
  }

  return protocol;
}

function getApiBaseUrl(req) {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    `${getRequestProtocol(req)}://${req.get("host")}`
  ).replace(/\/$/, "");
}

function getConfiguredClientBaseUrl() {
  return (
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    ""
  ).replace(/\/$/, "");
}

function getUrlOrigin(value) {
  if (!value) return "";

  try {
    return new URL(value).origin.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function isLocalClientOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function isTrustedClientOrigin(origin) {
  if (!origin) return false;

  const configuredOrigin = getUrlOrigin(getConfiguredClientBaseUrl());
  if (configuredOrigin && origin === configuredOrigin) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function getCallbackPath(provider) {
  return `/api/auth/${provider}/callback`;
}

function isTrustedCallbackUrl(value, provider) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return isTrustedClientOrigin(url.origin) && url.pathname === getCallbackPath(provider);
  } catch {
    return false;
  }
}

function getRequestedCallbackUrl(req, provider) {
  const candidates = [req.query.redirect_uri, req.query.callback_url, req.get("x-oauth-callback-url")];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim().replace(/\/$/, "");
    if (isTrustedCallbackUrl(value, provider)) return value;
  }

  return "";
}

function getRequestedClientBaseUrl(req) {
  const candidates = [req.query.client_url, req.get("x-client-base-url")];

  for (const candidate of candidates) {
    const origin = getUrlOrigin(candidate);
    if (isTrustedClientOrigin(origin)) return origin;
  }

  return "";
}

function getRequestClientBaseUrl(req) {
  const candidates = [getRequestedClientBaseUrl(req), req.get("origin"), req.get("referer")];

  for (const candidate of candidates) {
    const origin = getUrlOrigin(candidate);
    if (isTrustedClientOrigin(origin)) return origin;
  }

  return "";
}

function getClientBaseUrl(req) {
  const configuredBaseUrl = getConfiguredClientBaseUrl();
  const requestBaseUrl = getRequestClientBaseUrl(req);

  if (configuredBaseUrl && !isLocalClientOrigin(configuredBaseUrl)) {
    return configuredBaseUrl;
  }

  return requestBaseUrl || configuredBaseUrl || "http://localhost:3000";
}

function getClientCallbackUrl(provider, clientBaseUrl) {
  if (!clientBaseUrl || isLocalClientOrigin(clientBaseUrl)) return "";
  if (!isTrustedClientOrigin(clientBaseUrl)) return "";
  return `${clientBaseUrl}${getCallbackPath(provider)}`;
}

function getRedirectUri(req, provider, options = {}) {
  const requestedCallbackUrl = getRequestedCallbackUrl(req, provider);
  if (requestedCallbackUrl) return requestedCallbackUrl;

  if (options.redirectUri && isTrustedCallbackUrl(options.redirectUri, provider)) {
    return options.redirectUri;
  }

  const clientCallbackUrl = getClientCallbackUrl(
    provider,
    options.clientBaseUrl || getRequestClientBaseUrl(req)
  );

  if (clientCallbackUrl) return clientCallbackUrl;

  const configuredCallback =
    provider === "github"
      ? process.env.GITHUB_CALLBACK_URL
      : process.env.GOOGLE_CALLBACK_URL;

  if (configuredCallback) return configuredCallback;

  return `${getApiBaseUrl(req)}${getCallbackPath(provider)}`;
}

function rememberOAuthState(req, provider, values = {}) {
  const state = crypto.randomBytes(24).toString("hex");
  req.session.oauthState = {
    provider,
    state,
    clientBaseUrl: values.clientBaseUrl || getClientBaseUrl(req),
    redirectUri: values.redirectUri || "",
  };
  return state;
}

function validateOAuthState(req, provider) {
  const expected = req.session.oauthState;
  req.session.oauthState = null;

  if (!expected) return;
  if (expected.provider !== provider || expected.state !== req.query.state) {
    throw new HttpError(401, `${provider} authentication state did not match`);
  }

  return expected;
}

function encodeOAuthUser(user) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function redirectOAuthSuccess(req, res, provider, result, clientBaseUrl) {
  const url = new URL("/oauth-success", clientBaseUrl || getClientBaseUrl(req));
  url.searchParams.set("provider", provider);
  url.searchParams.set("token", result.token);
  url.searchParams.set("user", encodeOAuthUser(result.user));
  res.redirect(url.toString());
}

function redirectOAuthError(req, res, provider, message, clientBaseUrl) {
  const url = new URL("/login", clientBaseUrl || getClientBaseUrl(req));
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
    redirectOAuthError(req, res, "github", "GitHub sign-in is not configured on this server.");
    return;
  }

  const clientBaseUrl = getClientBaseUrl(req);
  const redirectUri = getRedirectUri(req, "github", { clientBaseUrl });
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "user:email");
  url.searchParams.set("state", rememberOAuthState(req, "github", { clientBaseUrl, redirectUri }));
  res.redirect(url.toString());
});

const githubCallback = asyncHandler(async (req, res) => {
  const oauthState = validateOAuthState(req, "github");

  if (req.query.error) {
    redirectOAuthError(
      req,
      res,
      "github",
      String(req.query.error_description || req.query.error),
      oauthState?.clientBaseUrl
    );
    return;
  }

  const code = String(req.query.code || "");
  if (!code) {
    redirectOAuthError(req, res, "github", "GitHub did not return an authorization code.", oauthState?.clientBaseUrl);
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
      redirect_uri: getRedirectUri(req, "github", oauthState),
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

  redirectOAuthSuccess(req, res, "github", result, oauthState?.clientBaseUrl);
});

const googleStart = asyncHandler(async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    redirectOAuthError(req, res, "google", "Google sign-in is not configured on this server.");
    return;
  }

  const clientBaseUrl = getClientBaseUrl(req);
  const redirectUri = getRedirectUri(req, "google", { clientBaseUrl });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("state", rememberOAuthState(req, "google", { clientBaseUrl, redirectUri }));
  res.redirect(url.toString());
});

const googleCallback = asyncHandler(async (req, res) => {
  const oauthState = validateOAuthState(req, "google");

  if (req.query.error) {
    redirectOAuthError(
      req,
      res,
      "google",
      String(req.query.error_description || req.query.error),
      oauthState?.clientBaseUrl
    );
    return;
  }

  const code = String(req.query.code || "");
  if (!code) {
    redirectOAuthError(req, res, "google", "Google did not return an authorization code.", oauthState?.clientBaseUrl);
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
      redirect_uri: getRedirectUri(req, "google", oauthState),
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

  redirectOAuthSuccess(req, res, "google", result, oauthState?.clientBaseUrl);
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

