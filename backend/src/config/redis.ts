import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  logger.info('✅ Redis Connected');
});

redis.on('error', (err) => {
  logger.error(`❌ Redis Error: ${err.message}`);
});
