/**
 * Standardized API Response Utilities
 * Guarantees uniform structure across all endpoints:
 *
 * Success format:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": {}
 * }
 *
 * Error format:
 * {
 *   "success": false,
 *   "message": "...",
 *   "errors": []
 * }
 */

export const sendSuccess = (res, message = 'Operation successful', data = null, statusCode = 200) => {
  const responseBody = {
    success: true,
    message
  };

  if (data !== null && data !== undefined) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
};

export const sendError = (res, message = 'An error occurred', errors = [], statusCode = 500) => {
  const formattedErrors = Array.isArray(errors)
    ? errors
    : typeof errors === 'string'
    ? [errors]
    : errors
    ? [errors]
    : [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors: formattedErrors
  });
};
