class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // If it's a 4xx code (e.g., 404), it's a 'fail'. If 5xx, it's an 'error'
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // We mark this as true so our global error handler knows this is an error WE threw intentionally
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
