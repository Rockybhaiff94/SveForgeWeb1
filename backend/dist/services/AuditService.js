"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const logger_1 = require("../utils/logger");
const auditQueue_1 = require("../queues/auditQueue");
class AuditService {
    static async logAction(payload) {
        try {
            // Offload DB Write and Socket Emission to the Redis BullMQ Worker
            await auditQueue_1.auditQueue.add('log-action', payload, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Failed to push log to BullMQ: ${error.message}`);
        }
    }
}
exports.AuditService = AuditService;
