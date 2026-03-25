import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { NextResponse } from 'next/server';
import { verifyJwtEdge } from '@/lib/auth-edge';

// Add edge runtime config later if needed, but mongoose might not work on edge. 
// We are using node env for api routes connected to db.

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Since we are not strictly using edge for the api route logic handling DB, we still verify JWT from cookie
        
        const cookieHeader = req.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        if (!tokenMatch) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const payload = await verifyJwtEdge(tokenMatch[1]);
        if (!payload || !['OWNER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await UserModel.find().select('-password -accessToken').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
