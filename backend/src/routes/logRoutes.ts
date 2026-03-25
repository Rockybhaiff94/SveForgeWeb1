import { Router } from 'express';
import { getLogs, exportLogs } from '../controllers/logController';
import { requireAuth } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';

const router = Router();

router.use(requireAuth);
router.use(requirePermission('can_view_logs'));

router.get('/', getLogs);
router.get('/export', exportLogs);

export default router;
