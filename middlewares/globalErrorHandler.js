const globalErrorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const success = false;

  if (isDev) {
    return res
      .status(statusCode)
      .json({ success, message, error: err, stack: err.stack });
  }

  if (err.isOperational) {
    return res.status(statusCode).json({ success, message });
  }

  // Unexpected errors
  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success,
    message: "Something went wrong",
  });
};

module.exports = globalErrorHandler;
