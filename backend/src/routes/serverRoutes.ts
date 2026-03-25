import { Router } from 'express';
import { getServers, getServerById, createServer, updateServer, deleteServer, restartServer } from '../controllers/serverController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireRole, requirePermission } from '../middleware/rbacMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole('MOD'), getServers);
router.get('/:id', requireRole('MOD'), getServerById);

// Admin / specific permission routes
router.post('/', requireRole('ADMIN'), createServer);
router.patch('/:id', requireRole('ADMIN'), updateServer);
router.delete('/:id', requirePermission('can_delete_server'), deleteServer);
router.post('/:id/restart', requireRole('ADMIN'), restartServer);

export default router;
