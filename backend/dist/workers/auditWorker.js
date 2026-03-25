"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAuditWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const AuditLog_1 = require("../models/AuditLog");
const socket_1 = require("../config/socket");
const logger_1 = require("../utils/logger");
const startAuditWorker = () => {
    const worker = new bullmq_1.Worker('audit-logs', async (job) => {
        try {
            const payload = job.data;
            // Perform the database write asynchronously on a separate tick
            const log = new AuditLog_1.AuditLog(payload);
            await log.save();
            // Populate user info for realtime dashboard context if possible
            const populatedLog = await log.populate('userId', 'email username');
            // Instantly broadcast the action to any connected ADMIN+ staff via Socket.io
            try {
                const io = (0, socket_1.getIO)();
                io.emit('new_log', populatedLog);
            }
            catch (e) {
                // Ignore emit skips if socket isn't mounted natively
            }
        }
        catch (error) {
            logger_1.logger.error(`Worker Failed to create AuditLog: ${error.message}`);
            throw error; // Let BullMQ retry
        }
    }, {
        connection: redis_1.redis,
        concurrency: 5 // Process 5 logs concurrently per Node instance
    });
    worker.on('failed', (job, err) => {
        logger_1.logger.error(`Audit worker job ${job?.id} failed with ${err.message}`);
    });
    logger_1.logger.info('⚙️ BullMQ Audit Worker Initialized');
};
exports.startAuditWorker = startAuditWorker;
