"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const requireAuth = async (req, res, next) => {
    try {
        let token = '';
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        // Verify user exists and check tokenVersion for instant invalidation
        const user = await User_1.User.findById(decoded.id).select('-passwordHash');
        if (!user) {
            res.status(401).json({ success: false, error: 'User associated with token no longer exists' });
            return;
        }
        if (user.tokenVersion !== decoded.tokenVersion) {
            res.status(401).json({ success: false, error: 'Session invalidated. Please log in again.' });
            return;
        }
        if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
            res.status(403).json({ success: false, error: `Account is ${user.status.toLowerCase()}` });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.logger.warn('Auth Middleware Error: Token Verification Failed');
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
        return;
    }
};
exports.requireAuth = requireAuth;
