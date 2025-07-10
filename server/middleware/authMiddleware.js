const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or malformed" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // ✅ Use central verifyToken from utils
    const decoded = verifyToken(token);
    req.user = decoded;

    next(); // ✅ Pass to next route
  } catch (err) {
    console.error("Token validation error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
