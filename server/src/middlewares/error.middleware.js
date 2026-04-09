function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    console.error("Unhandled server error:", err);
  }

  res.status(statusCode).json({
    error: message,
    message: err.details,
    statusCode,
  });
}

module.exports = errorMiddleware;

