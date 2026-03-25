import { Queue } from 'bullmq';
import { redis } from '../config/redis';

// Create a queue mapped to our existing ioredis connection
export const auditQueue = new Queue('audit-logs', { 
  connection: redis as any
});
