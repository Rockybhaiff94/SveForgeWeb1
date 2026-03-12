import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-util';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';
import Vote from '@/models/Vote';
import Analytics from '@/models/Analytics';

export async function POST(
    req: NextRequest,
    context: any // Bypassing Strict Next15+ Promise context constraints temporarily to resolve build failure
) {
    try {
        const params = await context.params;
        const session = await verifyToken();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized. Please log in to vote.' }, { status: 401 });
        }

        await dbConnect();
        
        // Find server by slug or ID depending on how the frontend routes it; assuming serverName => slug mapping for now or finding by ID if passed. Let's assume params.slug is the exact serverName or ID
        const server = await Server.findOne({
             $or: [ { _id: params.slug.length === 24 ? params.slug : null }, { serverName: { $regex: new RegExp('^' + params.slug.replace(/-/g, ' ') + '$', 'i') } } ]
        });

        if (!server) {
            return NextResponse.json({ success: false, error: 'Server not found' }, { status: 404 });
        }

        const userId = session.userId;
        const serverId = server._id.toString();

        // Check if user has voted for this server in the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const recentVote = await Vote.findOne({
            userId,
            serverId,
            votedAt: { $gte: twentyFourHoursAgo }
        });

        if (recentVote) {
            const timeRemaining = Math.ceil((recentVote.votedAt.getTime() + (24 * 60 * 60 * 1000) - Date.now()) / (1000 * 60 * 60));
            return NextResponse.json({ 
                success: false, 
                error: `You have already voted for this server recently. Try again in ${timeRemaining} hours.` 
            }, { status: 429 });
        }

        // Proceed with vote transaction
        // 1. Create Vote record
        await Vote.create({
            userId,
            serverId,
            votedAt: new Date()
        });

        // 2. Increment Server Vote Count
        server.votes += 1;
        server.votesLast7Days += 1;
        await server.save();

        // 3. Log Analytics Event
        await Analytics.create({
            eventType: 'vote',
            serverId,
            userId,
            timestamp: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Vote successful! Thank you.',
            newVoteCount: server.votes
        });

    } catch (error: any) {
        console.error('Vote processing error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process vote' }, { status: 500 });
    }
}
