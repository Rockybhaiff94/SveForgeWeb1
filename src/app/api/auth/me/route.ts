import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const user = await User.findById(payload.id).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Account suspended or banned' }, { status: 403 });
    }
    
    if (payload.tokenVersion !== undefined && user.tokenVersion !== payload.tokenVersion) {
      return NextResponse.json({ error: 'Session invalidated' }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
