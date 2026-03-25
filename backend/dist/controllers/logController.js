"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLogs = exports.getLogs = void 0;
const AuditLog_1 = require("../models/AuditLog");
const getLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const filters = {};
        if (req.query.type)
            filters.type = req.query.type;
        if (req.query.targetId)
            filters.targetId = req.query.targetId;
        if (req.query.userId)
            filters.userId = req.query.userId;
        if (req.query.action)
            filters.action = req.query.action;
        const logs = await AuditLog_1.AuditLog.find(filters)
            .populate('userId', 'email username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await AuditLog_1.AuditLog.countDocuments(filters);
        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            logs
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getLogs = getLogs;
const exportLogs = async (req, res, next) => {
    try {
        // Basic CSV export logic would exist here, often delegated to a worker queue.
        // For now, we return JSON dump limited to past 1000 logs for safety.
        const logs = await AuditLog_1.AuditLog.find({}).sort({ createdAt: -1 }).limit(1000);
        // In production: send to BullMQ job queue to email large CSV to admin.
        res.status(200).json({ success: true, count: logs.length, logs });
    }
    catch (err) {
        next(err);
    }
};
exports.exportLogs = exportLogs;
