require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const util = require('minecraft-server-util');
const nodemailer = require('nodemailer');

// 1. Redis Connection
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new Redis(redisUrl, {
    maxRetriesPerRequest: null
});

// 2. Nodemailer Transporter
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

// 3. Mongoose Models
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
    isApproved: Boolean,
}, { strict: false });
const Server = mongoose.models.Server || mongoose.model('Server', ServerSchema);

const UserSchema = new mongoose.Schema({ discordId: String, email: String }, { strict: false });
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

// 4. Checking Logic
async function pingServer(server) {
    const port = server.port || 25565;
    try {
        // Ping Java Server natively
        const response = await util.status(server.ip, port, {
            timeout: 5000,
            enableSRV: true 
        });
        return { online: true, players: response.players.online, maxPlayers: response.players.max };
    } catch (e) {
        // Fallback for Bedrock if Java ping fails
        try {
            const bedrockRes = await util.statusBedrock(server.ip, port, { timeout: 3000 });
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
        let newStatus = server.status || 'offline';
        let justWentOffline = false;
        let justCameOnline = false;

        if (online) {
            newFailCount = 0;
            if (newStatus === 'offline') justCameOnline = true;
            newStatus = 'online';
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
                    players: players,
                    players_max: maxPlayers,
                    last_checked: new Date(),
                    checkFailures: newFailCount,
                }
            });

            // Handle Notifications
            if (justWentOffline || justCameOnline) {
                const owner = await User.findOne({ _id: server.ownerId });
                if (owner) {
                    const userIdStr = owner.discordId || owner._id.toString();
                    if (justWentOffline) {
                        const msg = `Your server ${server.serverName} is offline. Restart it to be listed on ServerForge again.`;
                        await Notification.create({ userId: userIdStr, title: `Server Offline: ${server.serverName}`, message: msg, type: 'error' });
                        await sendDiscordNotification(owner.discordId, "🔴 Server Offline", msg, 16711680);
                        await sendEmailNotification(owner.email, "ServerForge Alert: Server Offline", msg);
                    } else if (justCameOnline) {
                        const msg = `Your server ${server.serverName} is back online and visible on ServerForge!`;
                        await Notification.create({ userId: userIdStr, title: `Server Recovered: ${server.serverName}`, message: msg, type: 'success' });
                        await sendDiscordNotification(owner.discordId, "🟢 Server Back Online", msg, 65280);
                        await sendEmailNotification(owner.email, "ServerForge Alert: Server Recovered", msg);
                    }
                }
            }
            console.log(`[Worker] Ping ${server.serverName} (${server.ip}): ${newStatus.toUpperCase()}`);
        } catch (dbErr) {
             console.error(`[Worker] Failed DB update for ${server.serverName}:`, dbErr.message);
        }
    });

    // Batch constraint
    await Promise.all(promises);
}

// 5. BullMQ Queue and Worker Setup
const serverCheckQueue = new Queue('server-check', { connection });

const serverCheckWorker = new Worker('server-check', async (job) => {
    console.log('[BullMQ] Running Server Check Job:', job.id);
    const BATCH_SIZE = 10;
    try {
        const servers = await Server.find({ isApproved: true });
        for (let i = 0; i < servers.length; i += BATCH_SIZE) {
            const batch = servers.slice(i, i + BATCH_SIZE);
            await processServerBatch(batch);
        }
    } catch (error) {
        console.error('[BullMQ] Job Error:', error);
    }
}, { connection });

serverCheckWorker.on('completed', job => {
    console.log(`[BullMQ] Job ${job.id} has completed!`);
});

serverCheckWorker.on('failed', (job, err) => {
    console.error(`[BullMQ] Job ${job.id} failed with error: ${err.message}`);
});

// Initialize MongoDB and Start Queue
async function start() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("[Worker] MONGODB_URI is strictly required!");
        process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('[Worker] Connected to MongoDB.');

    // Clear existing repeatable jobs to refresh intervals
    const repeatableJobs = await serverCheckQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
        await serverCheckQueue.removeRepeatableByKey(job.key);
    }

    // Schedule 30 second checks
    await serverCheckQueue.add('check-all-servers', {}, {
        repeat: {
            every: 30000 // 30 seconds
        }
    });
    console.log('[Worker] Scheduled BullMQ Job: Every 30 seconds.');
}

start();
