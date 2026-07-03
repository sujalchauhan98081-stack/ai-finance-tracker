// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Async error wrapper - wrap route handlers with this
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error formatter
export const formatValidationErrors = (errors) => {
  return errors.array().map((error) => ({
    field: error.param,
    message: error.msg,
  }));
};