import { Request, Response, NextFunction } from 'express';
import { PreAuthenticateRequest } from '../types';

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
