import { Request, Response, NextFunction } from 'express';
import { Report } from '../models/Report';
import { AuditService } from '../services/AuditService';

export const getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;

    const reports = await Report.find(filters)
      .populate('reporterId', 'username email')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err) {
    next(err);
  }
};

export const updateReportStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, resolutionNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404).json({ success: false, error: 'Report not found' });
      return;
    }

    report.status = status;
    if (resolutionNotes) report.resolutionNotes = resolutionNotes;
    
    // Automatically assign to the admin handling it
    if (status === 'INVESTIGATING' && !report.assignedTo) {
      report.assignedTo = req.user!._id as any;
    }

    await report.save();

    await AuditService.logAction({
      action: 'UPDATE_REPORT',
      type: 'INFO',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: report._id.toString(),
      targetType: 'Report',
      ipAddress: req.ip,
      details: `Report status updated to ${status}`
    });

    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};
