import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.error('Error:', err);
  } else {
    // In production, only log error message, not full stack trace
    console.error('Error:', err.message);
  }

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
