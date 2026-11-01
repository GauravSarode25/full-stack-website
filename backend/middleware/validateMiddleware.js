import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

/**
 * Express-Validator Result Middleware
 * Intercepts validation errors and formats consistent response
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param || 'unknown',
      message: err.msg
    }));
    return sendError(res, 'Validation failed', formattedErrors, 400);
  }
  next();
};

export default handleValidationErrors;
