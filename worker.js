require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const util = require('minecraft-server-util');
const nodemailer = require('nodemailer');

// 1. Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendEmailNotification(email, subject, text) {
    if (!email || !process.env.SMTP_USER) return;
    try {
        await transporter.sendMail({
            from: `"ServerForge Alerts" <${process.env.SMTP_USER}>`,
            to: email,
            subject,
            text
        });
    } catch (e) {
        console.error("[Worker] Failed to send email:", e.message);
    }
}

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

// 2. Mongoose Models (Strictly aligning to DB schema needed for both old and new)
// Note: Adapting field names so it works transparently with the existing Next.js frontend schema where possible,
// but fulfilling the prompt requirements.
const ServerSchema = new mongoose.Schema({
    serverName: String,
    ip: String,
    port: Number,
    ownerId: String,
    
    // Requested fields mapping to Next.js schema equivalents
    status: { type: String, default: 'offline' }, // 'ONLINE' or 'OFFLINE' in prompts, 'online' or 'offline' in Nextjs
    players: { type: Number, default: 0 }, // maps to playersOnline
    players_max: { type: Number, default: 0 }, // maps to maxPlayers
    checkFailures: { type: Number, default: 0 }, // maps to failCount
    last_checked: { type: Date, default: null }, // maps to lastCheckedAt
    isApproved: { type: Boolean, default: false },
}, { strict: false });
const Server = mongoose.models.Server || mongoose.model('Server', ServerSchema);

const UserSchema = new mongoose.Schema({ discordId: String, email: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// 3. Pinging Logic
async function pingServer(server) {
    const port = server.port || 25565;
    try {
        // Native Java Ping
        const response = await util.status(server.ip, port, {
            timeout: 5000,
            enableSRV: true 
        });
        return { online: true, players: response.players.online, maxPlayers: response.players.max };
    } catch (e) {
        try {
            // Native Bedrock Ping fallback
            const bedrockRes = await util.statusBedrock(server.ip, port, { timeout: 5000 });
            return { online: true, players: bedrockRes.players.online, maxPlayers: bedrockRes.players.max };
        } catch (bedrockErr) {
            return { online: false };
        }
    }
}

async function processServerBatch(servers) {
    const promises = servers.map(async (server) => {
        let { online, players, maxPlayers } = await pingServer(server);
        
        let newFailCount = server.checkFailures || 0;
        let newStatus = server.status ? server.status.toLowerCase() : 'offline';
        let justWentOffline = false;
        let justCameOnline = false;

        if (online) {
            newFailCount = 0;
            if (newStatus === 'offline') justCameOnline = true;
            newStatus = 'online'; // We use lowercase for next.js compatibility but API will return ONLINE
        } else {
            newFailCount += 1;
            if (newFailCount >= 3 && newStatus !== 'offline') {
                newStatus = 'offline';
                justWentOffline = true;
            }
            players = 0;
            maxPlayers = 0;
        }

        try {
            await Server.updateOne({ _id: server._id }, {
                $set: {
                    status: newStatus,
                    players,
                    players_max: maxPlayers,
                    last_checked: new Date(),
                    checkFailures: newFailCount,
                }
            });

            // Handle Notifications
            if (justWentOffline || justCameOnline) {
                const owner = await User.findOne({ _id: server.ownerId });
                if (owner) {
                    if (justWentOffline) {
                        const msg = `Your server ${server.serverName || server.ip} is offline. Restart it to be listed again.`;
                        await sendDiscordNotification(owner.discordId, "🔴 Server Offline", msg, 16711680);
                        await sendEmailNotification(owner.email, "Server Offline", msg);
                    } else if (justCameOnline) {
                        const msg = `Your server ${server.serverName || server.ip} is back online and visible.`;
                        await sendDiscordNotification(owner.discordId, "🟢 Server Back Online", msg, 65280);
                        await sendEmailNotification(owner.email, "Server Recovered", msg);
                    }
                }
            }
            console.log(`[Worker] Ping ${server.serverName || server.ip}: ${newStatus.toUpperCase()} (Failures: ${newFailCount})`);
        } catch (dbErr) {
             console.error(`[Worker] DB target failed: ${dbErr.message}`);
        }
    });

    await Promise.all(promises);
}

// 4. Main Interval Loop
let isRunning = false;

async function runWorkerLoop() {
    if (isRunning) return;
    isRunning = true;
    console.log('[Worker] Starting Server Check Cycle...');

    try {
        // Fetch only approved servers so we don't spam random IP addresses
        const servers = await Server.find({ isApproved: true });
        
        const BATCH_SIZE = 10;
        for (let i = 0; i < servers.length; i += BATCH_SIZE) {
            const batch = servers.slice(i, i + BATCH_SIZE);
            await processServerBatch(batch);
        }
        console.log(`[Worker] Finished Cycle. Checked ${servers.length} servers.`);
    } catch (err) {
        console.error('[Worker] Error during cycle:', err);
    } finally {
        isRunning = false;
    }
}

async function start() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("[Worker] MONGODB_URI is strictly required!");
        process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('[Worker] Connected to MongoDB without Redis/BullMQ.');

    // Run immediately, then every 2 minutes
    await runWorkerLoop();
    setInterval(runWorkerLoop, 120 * 1000);
    console.log('[Worker] Scheduled setInterval: Every 2 minutes.');
}

start();
