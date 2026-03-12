import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';
import { verifyToken } from '@/lib/auth-util';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await dbConnect();
        const session = await verifyToken();

        if (!session || !session.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Retrieve exactly the servers where ownerId matches the user's MongoDB `_id`
        const servers = await Server.find({ ownerId: session.userId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            servers,
        });

    } catch (error) {
        console.error('Fetch User Servers Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
