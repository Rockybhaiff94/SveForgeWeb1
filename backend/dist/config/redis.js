"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
exports.redis = new ioredis_1.default(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
});
exports.redis.on('connect', () => {
    logger_1.logger.info('✅ Redis Connected');
});
exports.redis.on('error', (err) => {
    logger_1.logger.error(`❌ Redis Error: ${err.message}`);
});
