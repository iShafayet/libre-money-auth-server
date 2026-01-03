import cors from 'cors';
import express, { Express } from 'express';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import authRoutes from './routes/auth';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10kb' })); // Limit request body size to prevent DoS
  app.use(
    cors({
      origin: env.cors.origin === '*' ? true : env.cors.origin,
      credentials: true,
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Pre-authentication routes
  app.use('/', authRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
