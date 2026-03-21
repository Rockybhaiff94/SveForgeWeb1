require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Mongoose Models for Standalone Worker
const ServerSchema = new mongoose.Schema({
    serverName: String,
    ip: String,
    port: Number,
    ownerId: String,
    status: String,
    players: Number,
    players_max: Number,
    last_checked: Date,
    checkFailures: Number,
    successfulChecks: Number,
    uptimeChecks: Number,
    lastOnline: Date,
    isApproved: Boolean,
}, { strict: false });
const Server = mongoose.models.Server || mongoose.model('Server', ServerSchema);

const UserSchema = new mongoose.Schema({ discordId: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const NotificationSchema = new mongoose.Schema({
    userId: String,
    title: String,
    message: String,
    type: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { strict: false });
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

const BATCH_SIZE = 5;
const DELAY_BETWEEN_BATCHES_MS = 1000;
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendDiscordNotification(discordId, title, description, color) {
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
        console.error("[Worker] Failed to send Discord Webhook", e.message);
    }
}

async function processBatch(servers) {
    const promises = servers.map(async (server) => {
        let isOnline = false;
        let playersOnline = 0;
        let playersMax = 0;
        let pingerStatus = 'offline';

        try {
            const address = server.port !== 25565 && server.port ? `${server.ip}:${server.port}` : server.ip;
            const pingRes = await fetch(`https://api.mcsrvstat.us/3/${address}`, {
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
        } catch (err) {
            console.error(`[Worker] Error pinging ${server.serverName}:`, err.message);
        }

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
            if (newStatus === 'offline') justCameOnline = true;
            newStatus = pingerStatus;
        } else {
            newFailures += 1;
            if (newFailures >= 3 && newStatus !== 'offline') {
                newStatus = 'offline';
                justWentOffline = true;
            }
        }

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

            if (justWentOffline || justCameOnline) {
                const owner = await User.findOne({ _id: server.ownerId });
                if (owner) {
                    const userIdStr = owner.discordId || owner._id.toString();
                    if (justWentOffline) {
                        await Notification.create({
                            userId: userIdStr,
                            title: `Server Offline: ${server.serverName}`,
                            message: `Your server ${server.serverName} failed 3 consecutive health checks and is hidden from search.`,
                            type: 'error'
                        });
                        await sendDiscordNotification(owner.discordId, "🔴 Server Offline", `Your server **${server.serverName}** has failed multiple health checks.`, 16711680);
                    } else if (justCameOnline) {
                        await Notification.create({
                            userId: userIdStr,
                            title: `Server Reconnected: ${server.serverName}`,
                            message: `Your server ${server.serverName} is back online and globally visible!`,
                            type: 'success'
                        });
                        await sendDiscordNotification(owner.discordId, "🟢 Server Back Online", `Your server **${server.serverName}** is back online!`, 65280);
                    }
                }
            }
            console.log(`[Worker] Updated ${server.serverName} -> ${newStatus}`);
        } catch (dbErr) {
             console.error(`[Worker] Failed to update MongoDB for ${server.serverName}:`, dbErr.message);
        }
    });

    await Promise.allSettled(promises);
}

async function runMonitorCycle() {
    console.log('[Worker] Starting Server Check Cycle at', new Date().toISOString());
    try {
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
        console.log('[Worker] Cycle Completed Successfully.');
    } catch (error) {
        console.error('[Worker] Critical Error in cycle:', error);
    }
}

async function startWorker() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("[Worker] ERROR: MONGODB_URI is not set in environment variables!");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('[Worker] Connected to MongoDB Data Cluster.');
        
        // Run immediately on boot
        runMonitorCycle();

        // Schedule recurrent cycles
        setInterval(runMonitorCycle, CHECK_INTERVAL_MS);
        console.log(`[Worker] Scheduled to run every ${CHECK_INTERVAL_MS / 1000 / 60} minutes.`);
    } catch (err) {
        console.error('[Worker] Failed to connect to DB', err);
        process.exit(1);
    }
}

startWorker();
