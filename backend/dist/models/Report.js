"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
    reporterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    targetId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ['User', 'Server', 'Message'], required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'], default: 'PENDING', index: true },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    moderationScore: { type: Number, default: 0 },
    resolutionNotes: { type: String }
}, { timestamps: true });
exports.Report = (0, mongoose_1.model)('Report', ReportSchema);
