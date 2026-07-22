const crypto = require("crypto");

const MINIMUM_SECRET_LENGTH = 32;

function resolveSecret(name) {
  const configured = String(process.env[name] || "").trim();

  const isPlaceholder = /^replace-with-/i.test(configured);

  if (configured.length >= MINIMUM_SECRET_LENGTH && !isPlaceholder) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be configured with at least ${MINIMUM_SECRET_LENGTH} characters in production.`);
  }

  return crypto.randomBytes(48).toString("base64url");
}

const sessionSecret = resolveSecret("SESSION_SECRET");
const jwtSecret = resolveSecret("JWT_SECRET");

module.exports = {
  MINIMUM_SECRET_LENGTH,
  jwtSecret,
  resolveSecret,
  sessionSecret,
};
