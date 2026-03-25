import { Router } from 'express';
import { getFeatureFlags, updateFeatureFlag } from '../controllers/featureFlagController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

// Allow devs/admins to view and toggle
router.use(requireAuth);
router.get('/', requireRole('DEV'), getFeatureFlags);
router.put('/:key', requireRole('DEV'), updateFeatureFlag);

export default router;
