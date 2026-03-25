"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ['OWNER', 'ADMIN', 'DEV', 'MOD', 'USER'], default: 'USER' },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'SHADOW_BANNED'], default: 'ACTIVE' },
    tokenVersion: { type: Number, default: 0 },
    permissions: {
        can_ban_user: { type: Boolean, default: false },
        can_delete_server: { type: Boolean, default: false },
        can_view_logs: { type: Boolean, default: false },
        can_bypass_ratelimits: { type: Boolean, default: false },
    },
    lastLoginIp: { type: String },
    lastLoginAt: { type: Date }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
