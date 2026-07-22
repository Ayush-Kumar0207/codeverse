const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

const generateToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
