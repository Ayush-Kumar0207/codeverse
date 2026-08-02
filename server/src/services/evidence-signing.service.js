const { createHash, createHmac, timingSafeEqual } = require("crypto");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = canonicalize(value[key]);
    return result;
  }, {});
}
function validKey(value) {
  const candidate = String(value || "");
  if (candidate.length < 32 || /(replace|change|example|placeholder|secret)/i.test(candidate)) return false;
  const frequencies = [...candidate].reduce((counts, character) => counts.set(character, (counts.get(character) || 0) + 1), new Map());
  const entropy = [...frequencies.values()].reduce((total, count) => {
    const probability = count / candidate.length;
    return total - probability * Math.log2(probability);
  }, 0);
  return entropy >= 3;
}
function purposeConfig(purpose) {
  const arena = purpose === "arena";
  const key = arena ? process.env.ARENA_SIGNING_KEY : process.env.EVIDENCE_SIGNING_KEY;
  const issuer = String((arena ? process.env.ARENA_SIGNING_ISSUER : process.env.EVIDENCE_SIGNING_ISSUER) || "").trim();
  if (!validKey(key)) throw new Error((arena ? "ARENA_SIGNING_KEY" : "EVIDENCE_SIGNING_KEY") + " must be an independent high-entropy, non-placeholder value of at least 32 characters");
  const otherKey = arena ? process.env.EVIDENCE_SIGNING_KEY : process.env.ARENA_SIGNING_KEY;
  if (validKey(otherKey) && key === otherKey) throw new Error("Evidence and Arena signing keys must be independent");
  if (!issuer || /(replace|example|placeholder)/i.test(issuer)) {
    throw new Error((arena ? "ARENA_SIGNING_ISSUER" : "EVIDENCE_SIGNING_ISSUER") + " must identify the issuing organization");
  }
  const configuredId = String((arena ? process.env.ARENA_SIGNING_KEY_ID : process.env.EVIDENCE_SIGNING_KEY_ID) || "").trim();
  const keyId = configuredId || createHash("sha256").update(key).digest("hex").slice(0, 16);
  if (!/^[a-z0-9._-]{3,80}$/i.test(keyId)) throw new Error("Signing key IDs may contain only letters, numbers, dot, underscore, and hyphen");
  return { key, keyId, issuer, algorithm: "hmac-sha256" };
}
function bodyFor(payload, identity) {
  return JSON.stringify(canonicalize({
    algorithm: identity.algorithm,
    issuer: identity.issuer,
    keyId: identity.keyId,
    payload,
  }));
}
function sign(payload, purpose = "evidence") {
  const identity = purposeConfig(purpose);
  const value = createHmac("sha256", identity.key).update(bodyFor(payload, identity)).digest("hex");
  return {
    signature: identity.algorithm + ":" + identity.keyId + ":" + value,
    algorithm: identity.algorithm,
    keyId: identity.keyId,
    issuer: identity.issuer,
  };
}
function verify(payload, signature, identity, purpose = "evidence") {
  let configured;
  try {
    configured = purposeConfig(purpose);
  } catch {
    return false;
  }
  if (!identity || identity.algorithm !== configured.algorithm || identity.keyId !== configured.keyId || identity.issuer !== configured.issuer) return false;
  const expected = sign(payload, purpose).signature;
  const left = Buffer.from(String(signature || ""));
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
function isConfigured(purpose = "evidence") {
  try {
    purposeConfig(purpose);
    return true;
  } catch {
    return false;
  }
}
module.exports = { canonicalize, isConfigured, purposeConfig, sign, verify };
