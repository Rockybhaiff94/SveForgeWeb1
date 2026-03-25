"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeatureFlag = exports.getFeatureFlags = void 0;
const FeatureFlag_1 = require("../models/FeatureFlag");
const AuditService_1 = require("../services/AuditService");
const getFeatureFlags = async (req, res, next) => {
    try {
        const flags = await FeatureFlag_1.FeatureFlag.find({}).sort({ key: 1 });
        res.status(200).json({ success: true, count: flags.length, flags });
    }
    catch (err) {
        next(err);
    }
};
exports.getFeatureFlags = getFeatureFlags;
const updateFeatureFlag = async (req, res, next) => {
    try {
        const { isEnabled } = req.body;
        let flag = await FeatureFlag_1.FeatureFlag.findOne({ key: req.params.key });
        if (!flag) {
            // Create if doesn't exist to allow easy dynamic flagging
            flag = new FeatureFlag_1.FeatureFlag({ key: req.params.key, isEnabled });
        }
        else {
            flag.isEnabled = isEnabled;
        }
        await flag.save();
        await AuditService_1.AuditService.logAction({
            action: 'TOGGLE_FEATURE',
            type: 'WARNING',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: flag.key,
            targetType: 'FeatureFlag',
            ipAddress: req.ip,
            details: `Feature '${flag.key}' was turned ${isEnabled ? 'ON' : 'OFF'}`
        });
        res.status(200).json({ success: true, flag });
    }
    catch (err) {
        next(err);
    }
};
exports.updateFeatureFlag = updateFeatureFlag;
