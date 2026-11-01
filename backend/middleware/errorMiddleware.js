import { sendError } from '../utils/apiResponse.js';
import env from '../config/env.js';

/**
 * Catch-all 404 handler for undefined API routes
 */
export const notFound = (req, res, next) => {
  const message = `Route not found: [${req.method}] ${req.originalUrl}`;
  return sendError(res, message, ['The requested resource does not exist on this server.'], 404);
};

/**
 * Centralized Global Error Handler
 * Sanitizes errors, formats them consistently, and never leaks internal secrets or stack traces
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  // Format validation or custom error details
  let errors = [];
  if (err.errors) {
    if (Array.isArray(err.errors)) {
      errors = err.errors;
    } else if (typeof err.errors === 'object') {
      errors = Object.values(err.errors).map((e) => e.message || String(e));
    }
  } else {
    errors = [message];
  }

  // Log in development for debugging
  if (env.isDevelopment) {
    console.error(`💥 [Error] ${req.method} ${req.url} - ${message}`);
  }

  return sendError(res, message, errors, statusCode);
};
