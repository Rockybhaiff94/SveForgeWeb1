"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../models/User");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class UserRepository {
    static CACHE_TTL = 300; // 5 minutes
    static async findById(id) {
        const cacheKey = `user:${id}`;
        try {
            const cached = await redis_1.redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (e) {
            logger_1.logger.warn(`Redis cache error: ${e.message}`);
        }
        const user = await User_1.User.findById(id).select('-passwordHash');
        if (user) {
            try {
                await redis_1.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(user));
            }
            catch (e) { }
        }
        return user;
    }
    static async findByEmailWithPassword(email) {
        // We don't cache records with passwords
        return User_1.User.findOne({ email });
    }
    static async clearCache(id) {
        try {
            await redis_1.redis.del(`user:${id}`);
        }
        catch (e) { }
    }
}
exports.UserRepository = UserRepository;
