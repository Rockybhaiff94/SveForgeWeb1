"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get('/', (0, rbacMiddleware_1.requireRole)('MOD'), userController_1.getUsers);
router.get('/:id', (0, rbacMiddleware_1.requireRole)('MOD'), userController_1.getUserById);
// Admin / specific permission routes
router.patch('/:id/role', (0, rbacMiddleware_1.requireRole)('ADMIN'), userController_1.updateUserRole);
router.post('/:id/ban', (0, rbacMiddleware_1.requirePermission)('can_ban_user'), userController_1.banUser);
router.post('/:id/logout', (0, rbacMiddleware_1.requireRole)('ADMIN'), userController_1.forceLogout);
exports.default = router;
