import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export interface JwtPayload {
  id: string;
  role: string;
  tokenVersion: number;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Verify user exists and check tokenVersion for instant invalidation
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      res.status(401).json({ success: false, error: 'User associated with token no longer exists' });
      return;
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      res.status(401).json({ success: false, error: 'Session invalidated. Please log in again.' });
      return;
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      res.status(403).json({ success: false, error: `Account is ${user.status.toLowerCase()}` });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('Auth Middleware Error: Token Verification Failed');
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }
};
