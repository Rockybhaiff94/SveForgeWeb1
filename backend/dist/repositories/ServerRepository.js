"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRepository = void 0;
const Server_1 = require("../models/Server");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class ServerRepository {
    static CACHE_TTL = 120; // 2 minutes
    static async findById(id) {
        const cacheKey = `server:${id}`;
        try {
            const cached = await redis_1.redis.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (e) {
            logger_1.logger.warn(`Redis cache error: ${e.message}`);
        }
        const server = await Server_1.Server.findById(id).populate('ownerId', 'username email');
        if (server) {
            try {
                await redis_1.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(server));
            }
            catch (e) { }
        }
        return server;
    }
    static async clearCache(id) {
        try {
            await redis_1.redis.del(`server:${id}`);
        }
        catch (e) { }
    }
}
exports.ServerRepository = ServerRepository;
