import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Server from "@/models/Server";
import User from "@/models/User";
import Notification from "@/models/Notification";

const BATCH_SIZE = 5;
const DELAY_BETWEEN_BATCHES_MS = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sendDiscordNotification(discordId: string, title: string, description: string, color: number) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl || !discordId) return;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `<@${discordId}>`,
                embeds: [{
                    title,
                    description,
                    color,
                    timestamp: new Date().toISOString()
                }]
            })
        });
    } catch (e) {
        console.error("Failed to send Discord Webhook", e);
    }
}

async function processBatch(servers: any[]) {
    const promises = servers.map(async (server) => {
        let isOnline = false;
        let playersOnline = 0;
        let playersMax = 0;
        let pingerStatus = 'offline';

        try {
            const address = server.port !== 25565 && server.port ? `${server.ip}:${server.port}` : server.ip;
            const pingRes = await fetch(`https://api.mcsrvstat.us/3/${address}`, {
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(8000)
            });
            
            if (pingRes.ok) {
                const pingData = await pingRes.json();
                if (pingData.online === true) {
                    isOnline = true;
                    playersOnline = pingData.players?.online || 0;
                    playersMax = pingData.players?.max || 0;
                    pingerStatus = (playersMax > 0 && playersOnline >= playersMax) ? 'full' : 'online';
                }
            }
        } catch (err: any) {
            console.error(`Error pinging ${server.serverName}:`, err.message);
        }

        // Evaluate Status logic
        let newFailures = server.checkFailures || 0;
        let newStatus = server.status || 'offline';
        let newSuccessfulChecks = server.successfulChecks || 0;
        let newUptimeChecks = (server.uptimeChecks || 0) + 1;
        let newLastOnline = server.lastOnline;
        let justWentOffline = false;
        let justCameOnline = false;

        if (isOnline) {
            newFailures = 0;
            newSuccessfulChecks += 1;
            newLastOnline = new Date();
            // If it was offline, it came back online
            if (newStatus === 'offline') {
                justCameOnline = true;
            }
            newStatus = pingerStatus; // online or full
        } else {
            newFailures += 1;
            // Mark offline if failed 3 times
            if (newFailures >= 3 && newStatus !== 'offline') {
                newStatus = 'offline';
                justWentOffline = true;
            }
        }

        // Update DB
        try {
            await Server.updateOne({ _id: server._id }, {
                $set: {
                    status: newStatus,
                    players: playersOnline,
                    players_max: playersMax,
                    last_checked: new Date(),
                    checkFailures: newFailures,
                    successfulChecks: newSuccessfulChecks,
                    uptimeChecks: newUptimeChecks,
                    lastOnline: newLastOnline
                }
            });

            // Notifications
            if (justWentOffline || justCameOnline) {
                const owner = await User.findOne({ _id: server.ownerId });
                if (owner) {
                    if (justWentOffline) {
                        await Notification.create({
                            userId: owner.discordId || owner._id.toString(),
                            title: `Server Offline: ${server.serverName}`,
                            message: `Your server ${server.serverName} failed 3 consecutive health checks and has been hidden from global search.`,
                            type: 'error'
                        });
                        await sendDiscordNotification(
                            owner.discordId, 
                            "🔴 Server Offline", 
                            `Your server **${server.serverName}** has failed multiple health checks and is now hidden from global lists. Please restart it.`,
                            16711680 // red
                        );
                    } else if (justCameOnline) {
                        await Notification.create({
                            userId: owner.discordId || owner._id.toString(),
                            title: `Server Reconnected: ${server.serverName}`,
                            message: `Your server ${server.serverName} is back online and is visible in global search again!`,
                            type: 'success'
                        });
                        await sendDiscordNotification(
                            owner.discordId, 
                            "🟢 Server Back Online", 
                            `Your server **${server.serverName}** is back online and has been publicly listed again!`,
                            65280 // green
                        );
                    }
                }
            }
        } catch (dbErr: any) {
             console.error(`Failed to update MongoDB for ${server.serverName}:`, dbErr.message);
        }
    });

    await Promise.allSettled(promises);
}

export async function GET(req: NextRequest) {
    // Only allow vercel cron or local requests
    const authHeader = req.headers.get('authorization');
    if (
        process.env.NODE_ENV !== 'development' &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        
        const serversOptions = { isApproved: true };
        const cursor = Server.find(serversOptions).cursor();
        let batch = [];

        for await (const server of cursor) {
            batch.push(server);
            if (batch.length >= BATCH_SIZE) {
                await processBatch(batch);
                batch = [];
                await delay(DELAY_BETWEEN_BATCHES_MS);
            }
        }
        
        if (batch.length > 0) {
            await processBatch(batch);
        }

        return NextResponse.json({ success: true, message: 'Monitor run finished.' });
    } catch (error: any) {
        console.error('Critical Error in cron:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
