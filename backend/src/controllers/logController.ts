import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';

export const getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.targetId) filters.targetId = req.query.targetId;
    if (req.query.userId) filters.userId = req.query.userId;
    if (req.query.action) filters.action = req.query.action;

    const logs = await AuditLog.find(filters)
      .populate('userId', 'email username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(filters);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      logs
    });
  } catch (err) {
    next(err);
  }
};

export const exportLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Basic CSV export logic would exist here, often delegated to a worker queue.
    // For now, we return JSON dump limited to past 1000 logs for safety.
    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(1000);
    
    // In production: send to BullMQ job queue to email large CSV to admin.
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};
