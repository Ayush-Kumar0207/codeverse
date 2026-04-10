const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "codeverse_secret_fallback_123";

/**
 * Generates a JWT for a user
 * @param {Object} payload - User data to encode
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verifies a JWT
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
