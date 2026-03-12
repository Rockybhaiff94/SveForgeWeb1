import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';
const util = require('minecraft-server-util');

export const dynamic = 'force-dynamic'; // CRON jobs must evaluate dynamically
export const maxDuration = 300; // Allow 5 mins maximum execution time for many servers

export async function GET(req: Request) {
    try {
        // Optional security: Ensure this is called by a cron service via authorization header
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
             return new NextResponse('Unauthorized', { status: 401 });
        }

        await dbConnect();

        const servers = await Server.find({});
        console.log(`Starting status check for ${servers.length} servers...`);

        const results = { online: 0, offline: 0, updated: 0 };
        const updatePromises = [];

        for (const server of servers) {
            // Push as promises to resolve concurrently (batching could be added here for scale)
            updatePromises.push((async () => {
                let isOnline = false;
                let playerCount = 0;

                try {
                    // Default to Java edition status ping, timeout after 3s
                    const status = await util.status(server.ip, server.port || 25565, { timeout: 3000 });
                    isOnline = true;
                    playerCount = status.players.online;
                    results.online++;
                } catch (error) {
                    // Fallback to bedrock if java fails, or just mark offline depending on gameType
                    // This can be expanded based on gameType in the future
                    isOnline = false;
                    results.offline++;
                }

                // Only update if changed to save DB writes
                if (server.status !== (isOnline ? 'online' : 'offline') || server.players !== playerCount) {
                    server.status = isOnline ? 'online' : 'offline';
                    server.players = playerCount;
                    await server.save();
                    results.updated++;
                }
            })());
        }

        // Wait for all server pings and DB updates to complete
        await Promise.allSettled(updatePromises);
        
        console.log(`Status check complete. Online: ${results.online}, Offline: ${results.offline}, Updated DB Records: ${results.updated}`);

        return NextResponse.json({
            success: true,
            message: 'Status check complete',
            results
        });

    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ success: false, error: 'Status check failed', details: error.message }, { status: 500 });
    }
}
