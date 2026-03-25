import Log from '@/models/Log';
import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';

interface LogOptions {
  action: string;
  type?: 'INFO' | 'WARNING' | 'ERROR' | 'ACTION';
  userId?: string;
  actorRole?: string;
  targetId?: string;
  targetType?: 'User' | 'Server' | 'System' | 'Report' | 'Config';
  serverId?: string;
  ipAddress?: string;
  details?: string;
  metadata?: any;
}

export async function createLog(options: LogOptions) {
  try {
    await connectDB();
    await Log.create(options);
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export function getClientIp(req: Request) {
  return req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
}
