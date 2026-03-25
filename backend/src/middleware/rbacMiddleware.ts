import { Request, Response, NextFunction } from 'express';

const roleHierarchy = {
  OWNER: 4,
  ADMIN: 3,
  DEV: 2,
  MOD: 1,
  USER: 0
};

export const requireRole = (minimumRole: keyof typeof roleHierarchy) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const userRoleValue = roleHierarchy[req.user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleValue = roleHierarchy[minimumRole];

    if (userRoleValue < requiredRoleValue) {
      res.status(403).json({ success: false, error: 'Insufficient role hierarchy to perform this action' });
      return;
    }

    next();
  };
};

export const requirePermission = (permissionKey: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    // Owner inherently bypasses all permission checks
    if (req.user.role === 'OWNER') {
      next();
      return;
    }

    // @ts-ignore
    const hasPermission = req.user.permissions?.[permissionKey];

    if (!hasPermission) {
      res.status(403).json({ success: false, error: `Missing required permission: ${permissionKey}` });
      return;
    }

    next();
  };
};
