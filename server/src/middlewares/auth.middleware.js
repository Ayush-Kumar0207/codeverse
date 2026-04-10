const { verifyToken } = require("../utils/jwt");
const HttpError = require("../utils/httpError");

/**
 * Middleware to authenticate users using JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication failed: No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new HttpError(401, "Authentication failed: Invalid token");
    }

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (error) {
    next(new HttpError(401, error.message || "Authentication failed"));
  }
};

module.exports = authMiddleware;


