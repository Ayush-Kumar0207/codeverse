const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

const ISSUER = "codeverse-collaboration";

function signCollaborationToken(payload, audience, expiresIn) {
  return jwt.sign(payload, jwtSecret, { audience, expiresIn, issuer: ISSUER });
}

function verifyCollaborationToken(token, audience) {
  if (!token || typeof token !== "string") return null;
  try {
    return jwt.verify(token, jwtSecret, { audience, issuer: ISSUER });
  } catch {
    return null;
  }
}

function issueInviteToken({ roomId, organizerUserId, role = "editor" }) {
  return signCollaborationToken(
    { kind: "room-invite", roomId, organizerUserId, role: role === "viewer" ? "viewer" : "editor" },
    "codeverse-room-invite",
    process.env.COLLABORATION_INVITE_TTL || "24h"
  );
}

function verifyInviteToken(token, roomId) {
  const claims = verifyCollaborationToken(token, "codeverse-room-invite");
  return claims?.kind === "room-invite" && claims.roomId === roomId ? claims : null;
}

function issueReconnectToken({ roomId, userId, role }) {
  return signCollaborationToken(
    { kind: "room-reconnect", roomId, userId, role },
    "codeverse-room-reconnect",
    process.env.COLLABORATION_RECONNECT_TTL || "7d"
  );
}

function verifyReconnectToken(token, roomId, userId) {
  const claims = verifyCollaborationToken(token, "codeverse-room-reconnect");
  return claims?.kind === "room-reconnect" && claims.roomId === roomId && claims.userId === userId
    ? claims
    : null;
}

module.exports = {
  issueInviteToken,
  issueReconnectToken,
  verifyInviteToken,
  verifyReconnectToken,
};
