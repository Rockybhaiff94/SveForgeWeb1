import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Server from '@/models/Server';
import mongoose from 'mongoose';

// Ensure fresh data but tell Next.js it's safe to cache this aggressively for 60 seconds
export const revalidate = 60;

export async function GET() {
    try {
        await dbConnect();

        // Run aggregations in parallel for performance
        const [
            totalUsers,
            totalServers,
            onlineServers,
            votesAggregation
        ] = await Promise.all([
            User.countDocuments(),
            Server.countDocuments(),
            Server.countDocuments({ status: 'online' }),
            Server.aggregate([
                { $group: { _id: null, totalVotes: { $sum: "$votes" } } }
            ])
        ]);

        const totalVotes = votesAggregation.length > 0 ? votesAggregation[0].totalVotes : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                totalServers,
                onlineServers,
                totalVotes,
            }
        });
    } catch (error) {
        console.error('Error fetching global stats:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
