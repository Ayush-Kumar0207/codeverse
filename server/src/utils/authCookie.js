const AUTH_COOKIE_NAME = "codeverse.auth";
const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: "/",
    sameSite: production ? "none" : "lax",
    secure: production,
  };
}

function readCookie(req, name = AUTH_COOKIE_NAME) {
  const header = String(req.headers.cookie || "");
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return "";
    }
  }
  return "";
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions());
}

function clearAuthCookie(res) {
  const { maxAge: _maxAge, ...options } = cookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
}

module.exports = {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  readCookie,
  setAuthCookie,
};
