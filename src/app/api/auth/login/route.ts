import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { createLog, getClientIp } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      return NextResponse.json({ error: `Account is ${user.status.toLowerCase()}` }, { status: 403 });
    }
    
    // IP and User Agent tracking
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    // Update user login history
    if (!user.ips.includes(ip)) user.ips.push(ip);
    user.loginHistory.push({ ip, userAgent, date: new Date() });
    await user.save();

    const token = await signToken({ 
      id: user._id, 
      role: user.role, 
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
      status: user.status
    });
    
    const res = NextResponse.json({ success: true, user: { id: user._id, email: user.email, role: user.role, status: user.status } });

    await createLog({
      action: 'USER_LOGIN',
      type: 'INFO',
      userId: user._id,
      actorRole: user.role,
      targetId: user._id,
      targetType: 'User',
      ipAddress: ip,
      details: `User logged in from ${ip} via ${userAgent.substring(0, 30)}...`
    });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
