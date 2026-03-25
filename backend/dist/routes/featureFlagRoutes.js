"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const featureFlagController_1 = require("../controllers/featureFlagController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const router = (0, express_1.Router)();
// Allow devs/admins to view and toggle
router.use(authMiddleware_1.requireAuth);
router.get('/', (0, rbacMiddleware_1.requireRole)('DEV'), featureFlagController_1.getFeatureFlags);
router.put('/:key', (0, rbacMiddleware_1.requireRole)('DEV'), featureFlagController_1.updateFeatureFlag);
exports.default = router;
