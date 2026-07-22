const HttpError = require("../utils/httpError");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function createRequestSecurityMiddleware(isAllowedOrigin) {
  return function requestSecurity(req, _res, next) {
    if (SAFE_METHODS.has(req.method)) {
      next();
      return;
    }

    const origin = req.get("origin");
    const fetchSite = req.get("sec-fetch-site");
    const clientMarker = req.get("x-codeverse-client");

    if (origin && !isAllowedOrigin(origin)) {
      next(new HttpError(403, "Request origin is not trusted."));
      return;
    }

    if (fetchSite === "cross-site" && !origin) {
      next(new HttpError(403, "Cross-site request metadata is invalid."));
      return;
    }

    if (origin && clientMarker !== "web-v1") {
      next(new HttpError(403, "Missing CodeVerse request verification header."));
      return;
    }

    next();
  };
}

module.exports = createRequestSecurityMiddleware;
