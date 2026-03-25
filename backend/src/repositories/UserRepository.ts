import { User, IUser } from '../models/User';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class UserRepository {
  private static CACHE_TTL = 300; // 5 minutes

  static async findById(id: string): Promise<IUser | null> {
    const cacheKey = `user:${id}`;
    
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as IUser;
      }
    } catch (e: any) {
      logger.warn(`Redis cache error: ${e.message}`);
    }

    const user = await User.findById(id).select('-passwordHash');
    if (user) {
      try {
        await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(user));
      } catch (e) {}
    }
    return user;
  }

  static async findByEmailWithPassword(email: string): Promise<IUser | null> {
    // We don't cache records with passwords
    return User.findOne({ email });
  }

  static async clearCache(id: string) {
    try {
      await redis.del(`user:${id}`);
    } catch (e) {}
  }
}
