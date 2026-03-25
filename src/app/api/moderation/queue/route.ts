import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Report from '@/models/Report';
import { createLog, getClientIp } from '@/lib/logger';
import { getUserFromReq } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const admin = await getUserFromReq(req as any);
    if (!admin || !['OWNER', 'ADMIN', 'MOD'].includes(admin.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const reports = await Report.find({})
      .populate('reporterId', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
      
    return NextResponse.json({ reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getUserFromReq(req as any);
    if (!admin || !['OWNER', 'ADMIN', 'MOD'].includes(admin.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, reportId, resolutionNotes } = await req.json();
    await connectDB();
    
    const report = await Report.findById(reportId);
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    const ip = getClientIp(req);
    
    if (action === 'CLAIM') {
      report.assignedTo = admin.id;
      report.status = 'INVESTIGATING';
    } else if (action === 'RESOLVE') {
      report.status = 'RESOLVED';
      report.resolutionNotes = resolutionNotes;
    } else if (action === 'DISMISS') {
      report.status = 'DISMISSED';
      report.resolutionNotes = resolutionNotes;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await report.save();

    await createLog({
      action: `REPORT_${action}`,
      type: 'ACTION',
      userId: String(admin.id),
      actorRole: String(admin.role),
      targetId: report._id,
      targetType: 'Report',
      ipAddress: ip,
      details: `Report ${reportId} ${action.toLowerCase()}d. ${resolutionNotes || ''}`
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
