"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportStatus = exports.getReports = void 0;
const Report_1 = require("../models/Report");
const AuditService_1 = require("../services/AuditService");
const getReports = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.status)
            filters.status = req.query.status;
        const reports = await Report_1.Report.find(filters)
            .populate('reporterId', 'username email')
            .populate('assignedTo', 'username')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reports.length, reports });
    }
    catch (err) {
        next(err);
    }
};
exports.getReports = getReports;
const updateReportStatus = async (req, res, next) => {
    try {
        const { status, resolutionNotes } = req.body;
        const report = await Report_1.Report.findById(req.params.id);
        if (!report) {
            res.status(404).json({ success: false, error: 'Report not found' });
            return;
        }
        report.status = status;
        if (resolutionNotes)
            report.resolutionNotes = resolutionNotes;
        // Automatically assign to the admin handling it
        if (status === 'INVESTIGATING' && !report.assignedTo) {
            report.assignedTo = req.user._id;
        }
        await report.save();
        await AuditService_1.AuditService.logAction({
            action: 'UPDATE_REPORT',
            type: 'INFO',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: report._id.toString(),
            targetType: 'Report',
            ipAddress: req.ip,
            details: `Report status updated to ${status}`
        });
        res.status(200).json({ success: true, report });
    }
    catch (err) {
        next(err);
    }
};
exports.updateReportStatus = updateReportStatus;
