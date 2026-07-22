const { rateLimit } = require("express-rate-limit");

function createLimiter({ windowMs, limit, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: message },
  });
}

const apiLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 240,
  message: "Too many API requests. Please wait a moment and try again.",
});

const standardRouteLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 180,
  message: "Route rate limit reached. Please wait a moment and try again.",
});

const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  message: "Too many authentication attempts. Please try again later.",
});

const executionLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 20,
  message: "Execution rate limit reached. Please wait before running more code.",
});

const aiLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 30,
  message: "AI request rate limit reached. Please wait before trying again.",
});

module.exports = {
  aiLimiter,
  apiLimiter,
  authLimiter,
  executionLimiter,
  standardRouteLimiter,
};
