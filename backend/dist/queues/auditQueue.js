"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
// Create a queue mapped to our existing ioredis connection
exports.auditQueue = new bullmq_1.Queue('audit-logs', {
    connection: redis_1.redis
});
