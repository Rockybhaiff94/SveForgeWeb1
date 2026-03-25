import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectDB } from './config/db';
import { getIO, initSocket } from './config/socket';
import { startAuditWorker } from './workers/auditWorker';

const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Initialize WebSockets attached to the raw HTTP server
    initSocket(server);

    // 3. Mount Background Queue Workers
    startAuditWorker();

    // 4. Start listening
    server.listen(env.PORT, () => {
      logger.info(`🚀 ServerForge Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
