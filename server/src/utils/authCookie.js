const crypto = require("crypto");
const { jwtSecret } = require("../config/secrets");

const AUTH_COOKIE_NAME = "codeverse.auth";
const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const ENCRYPTION_KEY = crypto.createHash("sha256").update(jwtSecret, "utf8").digest();

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

function sealAuthToken(token) {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function unsealAuthToken(value) {
  try {
    const payload = Buffer.from(String(value || ""), "base64url");
    if (payload.length <= IV_BYTES + TAG_BYTES) return "";
    const iv = payload.subarray(0, IV_BYTES);
    const tag = payload.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
    const encrypted = payload.subarray(IV_BYTES + TAG_BYTES);
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, sealAuthToken(token), cookieOptions());
}

function clearAuthCookie(res) {
  const { maxAge: _maxAge, ...options } = cookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
}

module.exports = {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  readCookie,
  sealAuthToken,
  setAuthCookie,
  unsealAuthToken,
};
