import { createApp } from './app';
import { env } from '@config/env.config';
import { db } from '@infrastructure/database/mongodb';
import { logger } from '@core/logger';

/**
 * Server Entry Point
 * 
 * Handles server lifecycle:
 * - Database connection
 * - Server startup
 * - Graceful shutdown
 */

const startServer = async (): Promise<void> => {
  try {
    // ============================================
    // DATABASE CONNECTION
    // ============================================
    logger.info('Connecting to database...');
    await db.connect();

    // ============================================
    // START EXPRESS SERVER
    // ============================================
    const app = createApp();
    const server = app.listen(env.PORT, () => {
      logger.info(`
╔════════════════════════════════════════╗
║                                        ║
║   🚀 Velora Server Started             ║
║                                        ║
║   Environment: ${env.NODE_ENV.padEnd(24)}║
║   Port: ${env.PORT.toString().padEnd(31)}║
║   URL: http://localhost:${env.PORT.toString().padEnd(16)}║
║                                        ║
╚════════════════════════════════════════╝
      `);
    });

    // ============================================
    // GRACEFUL SHUTDOWN
    // ============================================
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close database connection
          await db.disconnect();
          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
