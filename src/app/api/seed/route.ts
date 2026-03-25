import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Server from '@/models/Server';
import Log from '@/models/Log';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Allow only if explicitly enabled in production to prevent accidental resets
      if (process.env.ALLOW_SEED !== 'true') {
        return NextResponse.json({ error: 'Seeding disabled in production' }, { status: 403 });
      }
    }

    await connectDB();

    // Clear existing
    await User.deleteMany({});
    await Server.deleteMany({});
    await Log.deleteMany({});

    // Create Owner
    const hashedPwd = await bcrypt.hash('admin123', 10);
    const owner = await User.create({
      email: 'admin@serverforge.net',
      password: hashedPwd,
      name: 'System Admin',
      role: 'OWNER',
      status: 'ACTIVE'
    });

    // Create Dummy Users
    const user1 = await User.create({
      email: 'user1@example.com',
      password: hashedPwd,
      name: 'John Doe',
      role: 'USER'
    });

    const mod = await User.create({
      email: 'mod@serverforge.net',
      password: hashedPwd,
      name: 'Jane Smith',
      role: 'MOD'
    });

    // Create Servers
    const server1 = await Server.create({
      name: 'Survival Server 1',
      ownerId: user1._id,
      status: 'ONLINE',
      ram: 4096,
      cpu: 2
    });

    const server2 = await Server.create({
      name: 'Lobby Server',
      ownerId: owner._id,
      status: 'OFFLINE',
      ram: 2048,
      cpu: 1
    });

    // Create Logs
    await Log.create({
      action: 'SERVER_START',
      type: 'INFO',
      userId: user1._id,
      serverId: server1._id,
      details: 'Started Survival Server 1 successfully.'
    });

    await Log.create({
      action: 'USER_LOGIN',
      type: 'INFO',
      userId: owner._id,
      details: 'Admin authenticated from Edge Node.'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully. You can login with admin@serverforge.net / admin123' 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
