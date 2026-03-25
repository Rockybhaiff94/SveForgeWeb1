import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { AuditLog } from '../models/AuditLog';
import { getIO } from '../config/socket';
import { logger } from '../utils/logger';

export const startAuditWorker = () => {
  const worker = new Worker('audit-logs', async (job: Job) => {
    try {
      const payload = job.data;
      
      // Perform the database write asynchronously on a separate tick
      const log = new AuditLog(payload);
      await log.save();

      // Populate user info for realtime dashboard context if possible
      const populatedLog = await log.populate('userId', 'email username');

      // Instantly broadcast the action to any connected ADMIN+ staff via Socket.io
      try {
        const io = getIO();
        io.emit('new_log', populatedLog);
      } catch (e) {
        // Ignore emit skips if socket isn't mounted natively
      }

    } catch (error: any) {
      logger.error(`Worker Failed to create AuditLog: ${error.message}`);
      throw error; // Let BullMQ retry
    }
  }, { 
    connection: redis as any,
    concurrency: 5 // Process 5 logs concurrently per Node instance
  });

  worker.on('failed', (job, err) => {
    logger.error(`Audit worker job ${job?.id} failed with ${err.message}`);
  });

  logger.info('⚙️ BullMQ Audit Worker Initialized');
};
