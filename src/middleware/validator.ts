import { Request, Response, NextFunction } from 'express';
import { PreAuthenticateRequest, LaunchPromoSignupRequest } from '../types';

export function validatePreAuthenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { username, password } = req.body as PreAuthenticateRequest;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    res.status(400).json({
      error: 'Invalid request. Username and password are required.',
    });
    return;
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    res.status(400).json({
      error: 'Invalid request. Username and password are required.',
    });
    return;
  }

  // Sanitize username (trim whitespace)
  req.body.username = username.trim();

  next();
}

export function validateLaunchPromoSignupRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { email, fullname } = req.body as LaunchPromoSignupRequest;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    res.status(400).json({
      error: 'Invalid request. Email and fullname are required.',
    });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({
      error: 'Invalid request. Please provide a valid email address.',
    });
    return;
  }

  if (!fullname || typeof fullname !== 'string' || fullname.trim().length === 0) {
    res.status(400).json({
      error: 'Invalid request. Email and fullname are required.',
    });
    return;
  }

  // Sanitize inputs (trim whitespace)
  req.body.email = email.trim().toLowerCase();
  req.body.fullname = fullname.trim();

  next();
}
