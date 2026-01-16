import { Request, Response, NextFunction } from 'express';
import { PreAuthenticateRequest, LaunchPromoSignupRequest, TelemetryPayload } from '../types';

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

export function validateTelemetryRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { username, currency, email } = req.body as TelemetryPayload;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    res.status(400).json({
      error: 'Invalid request. Username and currency are required.',
    });
    return;
  }

  if (!currency) {
    res.status(400).json({
      error: 'Invalid request. Username and currency are required.',
    });
    return;
  }

  // Validate currency: either string or object with name and sign
  if (typeof currency === 'string') {
    if (currency.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request. Currency cannot be empty.',
      });
      return;
    }
  } else if (typeof currency === 'object' && currency !== null) {
    if (!currency.name || typeof currency.name !== 'string' || currency.name.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request. Currency object must have a valid name property.',
      });
      return;
    }
    if (!currency.sign || typeof currency.sign !== 'string' || currency.sign.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request. Currency object must have a valid sign property.',
      });
      return;
    }
  } else {
    res.status(400).json({
      error: 'Invalid request. Currency must be a string or an object with name and sign properties.',
    });
    return;
  }

  // Validate email if provided
  if (email !== undefined && email !== null) {
    if (typeof email !== 'string' || email.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request. Email must be a valid string if provided.',
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
    // Sanitize email (trim and lowercase)
    req.body.email = email.trim().toLowerCase();
  }

  // Sanitize username (trim whitespace)
  req.body.username = username.trim();

  // Sanitize currency
  if (typeof currency === 'string') {
    req.body.currency = currency.trim();
  } else {
    req.body.currency = {
      name: currency.name.trim(),
      sign: currency.sign.trim(),
    };
  }

  next();
}
