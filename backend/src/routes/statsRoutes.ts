import { Router } from 'express';
import * as statsController from '../controllers/statsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', requireAuth, statsController.getDashboardStats);
router.get('/global', statsController.getGlobalStats);

export default router;
