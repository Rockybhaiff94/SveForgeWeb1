import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Server from '@/models/Server';

// Force this route to be evaluated on every request, never cached statically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    // 1. Authenticate the request via Vercel's Cron Secret Header
    // If testing locally, bypass this using an authorization bearer, or comment out temporarily
    const authHeader = request.headers.get('authorization');
    // Note: Vercel sends `Bearer <CRON_SECRET>` automatically
    // It is safe to allow testing via postman with a query param in local dev only:
    if (process.env.NODE_ENV === 'production') {
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
             return new Response('Unauthorized - Invalid Cron Secret', {
                 status: 401,
             });
        }
    }

    try {
        await dbConnect();

        // 2. Fetch all Approved Minecraft Servers
        // We do not want to ping generic servers since mcsrvstat is strictly MC
        const servers = await Server.find({ gameType: 'Minecraft', isApproved: true });

        const results = {
            total: servers.length,
            success: 0,
            failed: 0,
        };

        // 3. Process sequentially (or in small batches) to avoid hammering the DB or the API
        // For production with thousands of servers, Promise.all/bulkWrite is recommended
        for (const server of servers) {
             try {
                 const address = server.port && server.port !== 25565 ? `${server.ip}:${server.port}` : server.ip;
                 const pingRes = await fetch(`https://api.mcsrvstat.us/3/${address}`, {
                     next: { revalidate: 0 } 
                 });

                 if (!pingRes.ok) {
                     throw new Error(`Ping HTTP error! status: ${pingRes.status}`);
                 }

                 const pingData = await pingRes.json();
                 
                 let newStatus = 'offline';
                 let newPlayersOnline = 0;
                 let newPlayersMax = server.players_max || 0; // retain old max players if ping fails

                 if (pingData.online) {
                     newPlayersOnline = pingData.players?.online || 0;
                     newPlayersMax = pingData.players?.max || 0;
                     
                     if (newPlayersMax > 0 && newPlayersOnline >= newPlayersMax) {
                         newStatus = 'full';
                     } else {
                         newStatus = 'online';
                     }
                 } else if (pingData.error) {
                     // Hostname invalid or DNS failure -> Offline
                     newStatus = 'offline';
                 }

                 // Update Database
                 server.status = newStatus;
                 server.players = newPlayersOnline;
                 server.players_max = newPlayersMax;
                 server.last_checked = new Date();

                 await server.save();
                 results.success++;

             } catch (pingError) {
                 // Fallback if the external ping API crashes for standard MC servers
                 console.error(`Status Cron Check Failed for ${server.serverName} (${server.ip}):`, pingError);
                 
                 // Mark offline in DB if we definitively fail to reach it
                 server.status = 'offline';
                 server.players = 0;
                 server.last_checked = new Date();
                 await server.save();
                 
                 results.failed++;
             }
        }

        return NextResponse.json({
            message: 'Cron job executed successfully.',
            results
        });

    } catch (error) {
        console.error('Critical Cron Job Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
