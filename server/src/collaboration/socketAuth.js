const { readCookie, unsealAuthToken } = require("../utils/authCookie");
const { verifyToken } = require("../utils/jwt");

function bearerToken(socket) {
  const handshakeToken = socket.handshake?.auth?.token;
  if (typeof handshakeToken === "string" && handshakeToken.trim()) return handshakeToken.trim();
  const header = String(socket.handshake?.headers?.authorization || "");
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

function authenticateSocket(socket, next) {
  try {
    const sealedCookie = readCookie(socket.request);
    const token = unsealAuthToken(sealedCookie) || bearerToken(socket);
    socket.data.authUser = token ? verifyToken(token) : null;
    next();
  } catch (error) {
    next(new Error(error?.message || "Socket authentication failed"));
  }
}

module.exports = authenticateSocket;
