"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceLogout = exports.banUser = exports.updateUserRole = exports.getUserById = exports.getUsers = void 0;
const User_1 = require("../models/User");
const UserRepository_1 = require("../repositories/UserRepository");
const AuditService_1 = require("../services/AuditService");
const getUsers = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.role)
            filters.role = req.query.role;
        if (req.query.status)
            filters.status = req.query.status;
        const users = await User_1.User.find(filters).select('-passwordHash').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    }
    catch (err) {
        next(err);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        const user = await UserRepository_1.UserRepository.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserById = getUserById;
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        const oldRole = user.role;
        user.role = role;
        await user.save();
        await UserRepository_1.UserRepository.clearCache(req.params.id);
        await AuditService_1.AuditService.logAction({
            action: 'UPDATE_ROLE',
            type: 'WARNING',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: user._id.toString(),
            targetType: 'User',
            ipAddress: req.ip,
            details: `Changed role from ${oldRole} to ${role}`
        });
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
};
exports.updateUserRole = updateUserRole;
const banUser = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        user.status = 'BANNED';
        user.tokenVersion += 1; // Instantly invalidates all active sessions
        await user.save();
        await UserRepository_1.UserRepository.clearCache(req.params.id);
        await AuditService_1.AuditService.logAction({
            action: 'BAN_USER',
            type: 'ACTION',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: user._id.toString(),
            targetType: 'User',
            ipAddress: req.ip,
            details: 'User permanently banned and sessions invalidated'
        });
        res.status(200).json({ success: true, message: 'User banned' });
    }
    catch (err) {
        next(err);
    }
};
exports.banUser = banUser;
const forceLogout = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        user.tokenVersion += 1;
        await user.save();
        await UserRepository_1.UserRepository.clearCache(req.params.id);
        await AuditService_1.AuditService.logAction({
            action: 'FORCE_LOGOUT',
            type: 'WARNING',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: user._id.toString(),
            targetType: 'User',
            ipAddress: req.ip,
            details: 'Admin triggered immediate session kill for this user'
        });
        res.status(200).json({ success: true, message: 'Sessions killed successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.forceLogout = forceLogout;
