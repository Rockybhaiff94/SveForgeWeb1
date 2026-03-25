import dbConnect from '@/lib/mongodb';
import LogModel from '@/models/Log';
import { NextResponse } from 'next/server';
import { verifyJwtEdge } from '@/lib/auth-edge';

export async function GET(req: Request) {
    try {
        await dbConnect();
        
        const cookieHeader = req.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        if (!tokenMatch) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const payload = await verifyJwtEdge(tokenMatch[1]);
        if (!payload || !['OWNER', 'ADMIN', 'DEV'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const logs = await LogModel.find().populate('userId', 'username email _id').sort({ createdAt: -1 }).limit(100);
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
