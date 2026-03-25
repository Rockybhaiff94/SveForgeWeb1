"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const AuditService_1 = require("../services/AuditService");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    ip: zod_1.z.string().optional()
});
const login = async (req, res, next) => {
    try {
        const { email, password, ip } = loginSchema.parse(req.body);
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }
        if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
            res.status(403).json({ success: false, error: `Account is ${user.status}` });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }
        // Update login history
        user.lastLoginIp = ip || req.ip;
        user.lastLoginAt = new Date();
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, tokenVersion: user.tokenVersion }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
        await AuditService_1.AuditService.logAction({
            action: 'LOGIN',
            type: 'INFO',
            userId: user._id.toString(),
            actorRole: user.role,
            targetId: user._id.toString(),
            targetType: 'User',
            ipAddress: ip || req.ip,
            details: 'User successfully authenticated via API'
        });
        const userObj = user.toJSON();
        // @ts-ignore
        delete userObj.passwordHash;
        res.status(200).json({ success: true, token, user: userObj });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }
        res.status(200).json({ success: true, user: req.user });
    }
    catch (err) {
        next(err);
    }
};
exports.getMe = getMe;
const logout = async (req, res, next) => {
    try {
        if (req.user) {
            await AuditService_1.AuditService.logAction({
                action: 'LOGOUT',
                type: 'INFO',
                userId: req.user._id.toString(),
                actorRole: req.user.role,
                ipAddress: req.ip,
                details: 'User explicitly logged out'
            });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
