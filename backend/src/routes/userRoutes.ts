import { Router } from 'express';
import { getUsers, getUserById, updateUserRole, banUser, forceLogout } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireRole, requirePermission } from '../middleware/rbacMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole('MOD'), getUsers);
router.get('/:id', requireRole('MOD'), getUserById);

// Admin / specific permission routes
router.patch('/:id/role', requireRole('ADMIN'), updateUserRole);
router.post('/:id/ban', requirePermission('can_ban_user'), banUser);
router.post('/:id/logout', requireRole('ADMIN'), forceLogout);

export default router;
