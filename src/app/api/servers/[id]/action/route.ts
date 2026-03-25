import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Server from '@/models/Server';
import { createLog, getClientIp } from '@/lib/logger';
import { getUserFromReq } from '@/lib/auth';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const admin = await getUserFromReq(req as any);
    if (!admin || !['OWNER', 'ADMIN', 'MOD'].includes(admin.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, reason, newLimits } = await req.json();
    await connectDB();
    
    const targetServer = await Server.findById(params.id);
    if (!targetServer) return NextResponse.json({ error: 'Server not found' }, { status: 404 });

    const ip = getClientIp(req);
    let details = reason || `${action} executed by ${admin.email}`;
    
    switch (action) {
      case 'RESTART':
        targetServer.status = 'STARTING';
        break;
      case 'STOP':
        targetServer.status = 'STOPPING';
        break;
      case 'SIMULATE_DEPLOY':
        targetServer.status = 'STARTING';
        details = 'Simulated automated deployment';
        break;
      case 'UPDATE_LIMITS':
        if (admin.role === 'MOD') return NextResponse.json({ error: 'Mods cannot update limits' }, { status: 403 });
        if (newLimits?.ram) targetServer.ram = newLimits.ram;
        if (newLimits?.cpu) targetServer.cpu = newLimits.cpu;
        details = `Limits updated: RAM ${targetServer.ram}MB, CPU ${targetServer.cpu}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await targetServer.save();

    await createLog({
      action: `SERVER_${action}`,
      type: 'ACTION',
      userId: String(admin.id),
      actorRole: String(admin.role),
      targetId: targetServer._id,
      targetType: 'Server',
      ipAddress: ip,
      details,
      metadata: { originalStatus: targetServer.status }
    });

    return NextResponse.json({ success: true, server: targetServer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
