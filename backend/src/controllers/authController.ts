import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User, IUser } from '../models/User';
import { env } from '../config/env';
import { AuditService } from '../services/AuditService';

interface AuthenticatedRequest extends Request {
  user: IUser;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  ip: z.string().optional()
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, ip } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      res.status(403).json({ success: false, error: `Account is ${user.status}` });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Update login history
    user.lastLoginIp = ip || req.ip;
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await AuditService.logAction({
      action: 'LOGIN',
      type: 'INFO',
      userId: user._id.toString(),
      actorRole: user.role,
      targetId: user._id.toString(),
      targetType: 'User',
      ipAddress: ip || req.ip,
      details: 'User successfully authenticated via API'
    });

    const userObj = user.toJSON();
    // @ts-ignore
    delete userObj.passwordHash;

    res.status(200).json({ success: true, token, user: userObj });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) {
      await AuditService.logAction({
        action: 'LOGOUT',
        type: 'INFO',
        userId: req.user._id.toString(),
        actorRole: req.user.role,
        ipAddress: req.ip,
        details: 'User explicitly logged out'
      });
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
