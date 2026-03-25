import { AuditLog } from '../models/AuditLog';
import { getIO } from '../config/socket';
import { logger } from '../utils/logger';

import { auditQueue } from '../queues/auditQueue';

interface LogPayload {
  action: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'ACTION';
  userId: string;
  actorRole: string;
  targetId?: string;
  targetType?: string;
  ipAddress?: string;
  details?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  static async logAction(payload: LogPayload) {
    try {
      // Offload DB Write and Socket Emission to the Redis BullMQ Worker
      await auditQueue.add('log-action', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
    } catch (error: any) {
      logger.error(`Failed to push log to BullMQ: ${error.message}`);
    }
  }
}
