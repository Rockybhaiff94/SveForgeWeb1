"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.requireRole = void 0;
const roleHierarchy = {
    OWNER: 4,
    ADMIN: 3,
    DEV: 2,
    MOD: 1,
    USER: 0
};
const requireRole = (minimumRole) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }
        const userRoleValue = roleHierarchy[req.user.role] || 0;
        const requiredRoleValue = roleHierarchy[minimumRole];
        if (userRoleValue < requiredRoleValue) {
            res.status(403).json({ success: false, error: 'Insufficient role hierarchy to perform this action' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requirePermission = (permissionKey) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }
        // Owner inherently bypasses all permission checks
        if (req.user.role === 'OWNER') {
            next();
            return;
        }
        // @ts-ignore
        const hasPermission = req.user.permissions?.[permissionKey];
        if (!hasPermission) {
            res.status(403).json({ success: false, error: `Missing required permission: ${permissionKey}` });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
