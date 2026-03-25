"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlag = void 0;
const mongoose_1 = require("mongoose");
const FeatureFlagSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    isEnabled: { type: Boolean, default: false },
    description: { type: String }
}, { timestamps: true });
exports.FeatureFlag = (0, mongoose_1.model)('FeatureFlag', FeatureFlagSchema);
