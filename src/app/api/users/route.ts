import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromReq } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // Note: Request here is the web API Request, but in Next 14 Route Handlers, 
    // we can parse cookies from headers or use next/headers
    // But getUserFromReq expects NextRequest. Wait, we can just use req directly if we cast.
    // Instead we will rely on middleware to protect it.
    await connectDB();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, role, status } = await req.json();
    await connectDB();
    const user = await User.findByIdAndUpdate(id, { role, status }, { new: true }).select('-password');
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connectDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
