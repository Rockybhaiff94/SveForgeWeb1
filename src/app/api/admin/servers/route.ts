import dbConnect from '@/lib/mongodb';
import ServerModel from '@/models/Server';
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

        const servers = await ServerModel.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, servers });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
