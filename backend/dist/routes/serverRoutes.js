"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serverController_1 = require("../controllers/serverController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get('/', (0, rbacMiddleware_1.requireRole)('MOD'), serverController_1.getServers);
router.get('/:id', (0, rbacMiddleware_1.requireRole)('MOD'), serverController_1.getServerById);
// Admin / specific permission routes
router.post('/', (0, rbacMiddleware_1.requireRole)('ADMIN'), serverController_1.createServer);
router.patch('/:id', (0, rbacMiddleware_1.requireRole)('ADMIN'), serverController_1.updateServer);
router.delete('/:id', (0, rbacMiddleware_1.requirePermission)('can_delete_server'), serverController_1.deleteServer);
router.post('/:id/restart', (0, rbacMiddleware_1.requireRole)('ADMIN'), serverController_1.restartServer);
exports.default = router;
