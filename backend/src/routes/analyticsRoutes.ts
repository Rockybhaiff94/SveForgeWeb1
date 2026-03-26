import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/users', analyticsController.getUsersAnalytics);
router.get('/servers', analyticsController.getServersAnalytics);
router.get('/revenue', analyticsController.getRevenueAnalytics);
router.get('/system', analyticsController.getSystemAnalytics);

export default router;
