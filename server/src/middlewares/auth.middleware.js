const { verifyToken } = require("../utils/jwt");
const { readCookie } = require("../utils/authCookie");
const HttpError = require("../utils/httpError");

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

function authMiddleware(req, _res, next) {
  try {
    const token = readCookie(req) || bearerToken(req);
    if (!token) throw new HttpError(401, "Authentication failed: No session provided");

    const decoded = verifyToken(token);
    if (!decoded) throw new HttpError(401, "Authentication failed: Invalid session");

    req.user = decoded;
    next();
  } catch (error) {
    next(new HttpError(401, error.message || "Authentication failed"));
  }
}

module.exports = authMiddleware;
