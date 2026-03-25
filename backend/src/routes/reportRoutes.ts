import { Router } from 'express';
import { getReports, updateReportStatus } from '../controllers/reportController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole('MOD'), getReports);
router.patch('/:id/status', requireRole('MOD'), updateReportStatus);

export default router;
