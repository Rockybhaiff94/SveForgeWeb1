import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Log from '@/models/Log';

export async function GET(req: Request) {
  try {
    await connectDB();
    const logs = await Log.find({})
      .populate('userId', 'name email')
      .populate('serverId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();
    const log = new Log(data);
    await log.save();
    return NextResponse.json({ log });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
