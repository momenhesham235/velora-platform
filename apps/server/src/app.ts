import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from '@config/env.config';
import {
  errorHandler,
  notFoundHandler,
  requestIdMiddleware,
  applySecurityMiddleware,
  redactBody,
} from '@middlewares/index';
import { logger } from '@core/logger';
import authRoutes from '@modules/auth/auth.routes';
import workspaceRoutes from '@modules/workspaces/workspace.routes';
import projectRoutes from '@modules/projects/project.routes';
import taskRoutes from '@modules/tasks/task.routes';
import notificationRoutes from '@modules/notifications/notification.routes';
import activityRoutes from '@modules/audit/activity.routes';
import { swaggerSpec, swaggerUiOptions } from '@infrastructure/swagger';

export const createApp = (): Application => {
  const app = express();

  app.use(requestIdMiddleware);
  applySecurityMiddleware(app);

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Workspace-Id',
        'X-Request-Id',
      ],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  if (env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
      logger.debug(`${req.method} ${req.path}`, {
        requestId: req.requestId,
        query: req.query,
        body: redactBody(req.body),
      });
      next();
    });
  }

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Velora API is running',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      requestId: req.requestId,
    });
  });

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );

  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.get('/api', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to Velora API',
      version: '1.0.0',
      documentation: '/api/docs',
    });
  });

  // Versioned API routes
  const v1 = express.Router();
  v1.use('/auth', authRoutes);
  v1.use('/workspaces', workspaceRoutes);
  v1.use('/workspaces/:workspaceId/projects', projectRoutes);
  v1.use('/workspaces/:workspaceId/tasks', taskRoutes);
  v1.use('/notifications', notificationRoutes);
  v1.use('/workspaces/:workspaceId/activity', activityRoutes);

  app.use('/api/v1', v1);
  // Backward compatibility
  app.use('/api', v1);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
