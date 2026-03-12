import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';
import { getSessionUser } from '@/lib/auth-util';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await dbConnect();
        const user = await getSessionUser();

        if (!user || (!user.discordId && !user.userId)) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // We assume ownerId in Server maps to the custom user session userId or discordId
        // From previous code, server saves `ownerId: session.userId`
        const servers = await Server.find({ ownerId: user.userId || user.discordId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            servers,
        });

    } catch (error) {
        console.error('Fetch User Servers Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
