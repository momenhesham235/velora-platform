import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '@config/env.config';
import { errorHandler, notFoundHandler } from '@middlewares/index';
import { logger } from '@core/logger';
import authRoutes from '@modules/auth/auth.routes';

/**
 * Express Application Setup
 * 
 * Initializes Express app with all global middlewares and routes
 * Separated from server.ts for better testability
 */

export const createApp = (): Application => {
  const app = express();

  // ============================================
  // GLOBAL MIDDLEWARES
  // ============================================

  // CORS Configuration
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true, // Allow cookies to be sent
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parser Middlewares
  app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

  // Cookie Parser
  app.use(cookieParser(env.COOKIE_SECRET));

  // Request Logging (Development only)
  if (env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path}`, {
        query: req.query,
        body: req.body,
      });
      next();
    });
  }

  // ============================================
  // HEALTH CHECK ROUTE
  // ============================================

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Velora API is running',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // ============================================
  // API ROUTES
  // ============================================

  // API base route
  app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to Velora API',
      version: '1.0.0',
      documentation: '/api/docs', // Future: API documentation
    });
  });

  // Feature routes
  app.use('/api/auth', authRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================

  // 404 Handler - Must be after all routes
  app.use(notFoundHandler);

  // Global Error Handler - Must be last
  app.use(errorHandler);

  return app;
};
