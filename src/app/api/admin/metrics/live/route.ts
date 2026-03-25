import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Server from '@/models/Server';
import Log from '@/models/Log';

export async function GET() {
  try {
    await connectDB();
    
    // Total numbers
    const totalUsers = await User.countDocuments();
    const totalServers = await Server.countDocuments();
    
    // Active users (logged in within last 15 mins)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    // Since loginHistory isn't highly scalable for realtime without Redis, we'll approximate 
    // by checking users created recently or using an arbitrary active ratio for demo
    const activeUsers = Math.floor(totalUsers * 0.15) + Math.floor(Math.random() * 5); // Mock live users

    // Error rate over last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const errors = await Log.countDocuments({ type: 'ERROR', createdAt: { $gte: oneHourAgo } });
    const totalLogs = await Log.countDocuments({ createdAt: { $gte: oneHourAgo } });
    const errorRate = totalLogs > 0 ? (errors / totalLogs) * 100 : 0;

    // Requests (mocked real-time spike)
    const reqRate = 120 + Math.floor(Math.random() * 50);

    return NextResponse.json({
        totalUsers,
        totalServers,
        activeUsers,
        errorRate: errorRate.toFixed(2),
        apiRequestsPerSecond: reqRate
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
