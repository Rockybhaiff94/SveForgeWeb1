import { Request, Response, NextFunction } from 'express';
import { FeatureFlag } from '../models/FeatureFlag';
import { AuditService } from '../services/AuditService';

export const getFeatureFlags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const flags = await FeatureFlag.find({}).sort({ key: 1 });
    res.status(200).json({ success: true, count: flags.length, flags });
  } catch (err) {
    next(err);
  }
};

export const updateFeatureFlag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isEnabled } = req.body;
    let flag = await FeatureFlag.findOne({ key: req.params.key });

    if (!flag) {
      // Create if doesn't exist to allow easy dynamic flagging
      flag = new FeatureFlag({ key: req.params.key, isEnabled });
    } else {
      flag.isEnabled = isEnabled;
    }

    await flag.save();

    await AuditService.logAction({
      action: 'TOGGLE_FEATURE',
      type: 'WARNING',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: flag.key,
      targetType: 'FeatureFlag',
      ipAddress: req.ip,
      details: `Feature '${flag.key}' was turned ${isEnabled ? 'ON' : 'OFF'}`
    });

    res.status(200).json({ success: true, flag });
  } catch (err) {
    next(err);
  }
};
