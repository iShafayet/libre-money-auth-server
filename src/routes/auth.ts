import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { PreAuthenticateRequest, PreAuthenticateResponse, ErrorResponse } from '../types';
import { validatePreAuthenticateRequest } from '../middleware/validator';
import { authRateLimiter } from '../middleware/rate-limiter';
import { logger } from '../utils/logger';

const router = Router();
const authService = new AuthService();

router.post(
  '/pre-authenticate',
  authRateLimiter,
  validatePreAuthenticateRequest,
  async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body as PreAuthenticateRequest;
    logger.debug('[AUTH] Pre-authentication request received for username:', credentials.username);
    logger.debug('[AUTH] Request IP:', req.ip || req.socket.remoteAddress);
    logger.debug('[AUTH] Request headers:', {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
    });

    try {
      logger.debug('[AUTH] Starting pre-authentication process for username:', credentials.username);
      const response = await authService.preAuthenticate(credentials);

      logger.debug('[AUTH] Pre-authentication successful for username:', credentials.username);
      logger.debug('[AUTH] Response:', {
        username: response.username,
        serverUrl: response.serverUrl,
        domain: response.domain,
      });

      res.status(200).json(response as PreAuthenticateResponse);
    } catch (error: any) {
      // Handle specific error types
      if (error.statusCode === 403) {
        logger.debug('[AUTH] Pre-authentication failed - Account inactive for username:', credentials.username);
        res.status(403).json({
          error: error.message,
        } as ErrorResponse);
        return;
      }

      // Generic pre-authentication error (401)
      if (error.message === 'Invalid username or password.') {
        logger.debug('[AUTH] Pre-authentication failed - Invalid credentials for username:', credentials.username);
        res.status(401).json({
          error: error.message,
        } as ErrorResponse);
        return;
      }

      // Unable to log in error (500)
      if (error.message === 'Unable to log in.') {
        logger.debug('[AUTH] Pre-authentication failed - Unable to log in for username:', credentials.username);
        logger.debug('[AUTH] Error details:', {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        });
        res.status(500).json({
          error: error.message,
        } as ErrorResponse);
        return;
      }

      // Log unexpected errors
      console.error('[AUTH] Unexpected pre-authentication error for username:', credentials.username);
      console.error('[AUTH] Error:', error);
      logger.debug('[AUTH] Error stack:', error.stack);

      // Generic server error
      res.status(500).json({
        error: 'An internal server error occurred. Please try again later.',
      } as ErrorResponse);
    }
  }
);

export default router;
