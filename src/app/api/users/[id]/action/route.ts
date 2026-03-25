import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { createLog, getClientIp } from '@/lib/logger';
import { getUserFromReq } from '@/lib/auth';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const admin = await getUserFromReq(req as any);
    if (!admin || !['OWNER', 'ADMIN', 'MOD'].includes(admin.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, newRole, reason } = await req.json();
    await connectDB();
    
    const targetUser = await User.findById(params.id);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Protect OWNER from being modified by others
    if (targetUser.role === 'OWNER' && admin.role !== 'OWNER') {
      return NextResponse.json({ error: 'Cannot modify system owner' }, { status: 403 });
    }

    const ip = getClientIp(req);
    let details = reason || `${action} executed by ${admin.email}`;

    switch (action) {
      case 'BAN':
        targetUser.status = 'BANNED';
        targetUser.tokenVersion += 1; // force logout
        break;
      case 'SUSPEND':
        targetUser.status = 'SUSPENDED';
        targetUser.tokenVersion += 1;
        break;
      case 'SHADOW_BAN':
        targetUser.status = 'SHADOW_BANNED';
        break;
      case 'UNBAN':
        targetUser.status = 'ACTIVE';
        break;
      case 'FORCE_LOGOUT':
        targetUser.tokenVersion += 1;
        break;
      case 'CHANGE_ROLE':
        if (admin.role !== 'OWNER' && newRole === 'OWNER') {
            return NextResponse.json({ error: 'Only owner can grant OWNER role' }, { status: 403 });
        }
        targetUser.role = newRole;
        details = `Role changed to ${newRole}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await targetUser.save();

    await createLog({
      action: `USER_${action}`,
      type: 'ACTION',
      userId: String(admin.id),
      actorRole: String(admin.role),
      targetId: targetUser._id,
      targetType: 'User',
      ipAddress: ip,
      details,
      metadata: { targetEmail: targetUser.email, originalRole: targetUser.role }
    });

    return NextResponse.json({ success: true, user: targetUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
