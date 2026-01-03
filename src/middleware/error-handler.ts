import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: err.message || 'Invalid request.',
    } as ErrorResponse);
    return;
  }

  // Generic server error
  res.status(500).json({
    error: 'An internal server error occurred. Please try again later.',
  } as ErrorResponse);
}
