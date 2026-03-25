"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const AuditLogSchema = new mongoose_1.Schema({
    action: { type: String, required: true, index: true },
    type: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'ACTION'], default: 'INFO', index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actorRole: { type: String },
    targetId: { type: String, index: true },
    targetType: { type: String },
    ipAddress: { type: String, index: true },
    details: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed }
}, { timestamps: { createdAt: true, updatedAt: false } });
// Background cleanup index (TTL 90 days for example)
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
exports.AuditLog = (0, mongoose_1.model)('AuditLog', AuditLogSchema);
