import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Server from '@/models/Server';

export async function GET() {
  try {
    await connectDB();
    const totalUsers = await User.countDocuments();
    const totalServers = await Server.countDocuments();
    
    // Placeholder system health
    const cpuUsage = Math.floor(Math.random() * 40) + 10;
    const ramUsage = Math.floor(Math.random() * 60) + 20;

    return NextResponse.json({
      totalUsers,
      totalServers,
      systemHealth: {
        cpu: cpuUsage,
        ram: ramUsage
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
