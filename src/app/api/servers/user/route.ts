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

        // Retrieve servers where ownerId matches EITHER the MongoDB _id OR the Discord ID
        const servers = await Server.find({ 
            $or: [
                { ownerId: session.userId },
                { ownerId: session.discordId }
            ]
        }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            servers,
            debug: { userId: session.userId, discordId: session.discordId } // useful if we need to see it in terminal
        });

    } catch (error) {
        console.error('Fetch User Servers Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
