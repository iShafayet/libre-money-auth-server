import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints
 * Limits: 5 attempts per IP per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    error: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
