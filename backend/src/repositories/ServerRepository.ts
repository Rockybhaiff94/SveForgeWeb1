import { Server, IServer } from '../models/Server';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class ServerRepository {
  private static CACHE_TTL = 120; // 2 minutes

  static async findById(id: string): Promise<IServer | null> {
    const cacheKey = `server:${id}`;
    
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as IServer;
      }
    } catch (e: any) {
      logger.warn(`Redis cache error: ${e.message}`);
    }

    const server = await Server.findById(id).populate('ownerId', 'username email');
    if (server) {
      try {
        await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(server));
      } catch (e) {}
    }
    return server;
  }

  static async clearCache(id: string) {
    try {
      await redis.del(`server:${id}`);
    } catch (e) {}
  }
}
