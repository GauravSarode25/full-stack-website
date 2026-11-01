import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/apiResponse.js';

/**
 * General API Rate Limiter
 * 300 requests per 15-minute window per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many requests from this IP, please try again in 15 minutes.',
      ['Rate limit exceeded'],
      429
    );
  }
});

/**
 * Strict Auth Limiter (Brute-Force Protection)
 * 25 attempts per 15-minute window per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many login attempts. Please wait 15 minutes before trying again.',
      ['Authentication rate limit exceeded'],
      429
    );
  }
});

/**
 * Public Form Submission Limiter (Spam Protection)
 * 30 submissions per 15-minute window per IP
 */
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many submissions. Please slow down and try again shortly.',
      ['Submission rate limit exceeded'],
      429
    );
  }
});
