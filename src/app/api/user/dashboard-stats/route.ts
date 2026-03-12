import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';
import Analytics from '@/models/Analytics';

export const revalidate = 0; // Don't cache personalized dashboard data

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = session.user.id;

        // Fetch all servers owned by this user
        const servers = await Server.find({ ownerId: userId });
        const serverIds = servers.map(s => s._id.toString());
        
        const totalServers = servers.length;
        const activeServers = servers.filter(s => s.status === 'online').length;
        const totalVotes = servers.reduce((acc, curr) => acc + (curr.votes || 0), 0);

        // Fetch total views (analytics events of type 'server_click' or 'visit' for their servers)
        const totalViews = await Analytics.countDocuments({
            serverId: { $in: serverIds },
            eventType: { $in: ['server_click', 'visit'] }
        });

        return NextResponse.json({
            success: true,
            data: {
                totalServers,
                activeServers,
                totalVotes,
                totalViews
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch dashboard statistics' }, { status: 500 });
    }
}
