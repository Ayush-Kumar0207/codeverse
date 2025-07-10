const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Generate a JWT token for a given payload
 * @param {Object} payload - Data to include in the token (e.g., { username: "john" })
 * @param {String} expiresIn - Token expiry time (e.g., "2h", "7d")
 * @returns {String} JWT token
 */
function generateToken(payload, expiresIn = "2h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload if valid
 * @throws Will throw an error if token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Decode a token without verifying (⚠️ use only if you're sure it's safe)
 * @param {String} token
 * @returns {Object} Decoded payload
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
