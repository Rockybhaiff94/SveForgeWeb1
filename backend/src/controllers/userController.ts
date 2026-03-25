import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { AuditService } from '../services/AuditService';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.status) filters.status = req.query.status;

    const users = await User.find(filters).select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await UserRepository.findById(req.params.id as string);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();
    
    await UserRepository.clearCache(req.params.id as string);

    await AuditService.logAction({
      action: 'UPDATE_ROLE',
      type: 'WARNING',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: user._id.toString(),
      targetType: 'User',
      ipAddress: req.ip,
      details: `Changed role from ${oldRole} to ${role}`
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    user.status = 'BANNED';
    user.tokenVersion += 1; // Instantly invalidates all active sessions
    await user.save();

    await UserRepository.clearCache(req.params.id as string);

    await AuditService.logAction({
      action: 'BAN_USER',
      type: 'ACTION',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: user._id.toString(),
      targetType: 'User',
      ipAddress: req.ip,
      details: 'User permanently banned and sessions invalidated'
    });

    res.status(200).json({ success: true, message: 'User banned' });
  } catch (err) {
    next(err);
  }
};

export const forceLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    user.tokenVersion += 1;
    await user.save();

    await UserRepository.clearCache(req.params.id as string);

    await AuditService.logAction({
      action: 'FORCE_LOGOUT',
      type: 'WARNING',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: user._id.toString(),
      targetType: 'User',
      ipAddress: req.ip,
      details: 'Admin triggered immediate session kill for this user'
    });

    res.status(200).json({ success: true, message: 'Sessions killed successfully' });
  } catch (err) {
    next(err);
  }
};
