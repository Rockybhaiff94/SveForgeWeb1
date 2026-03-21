require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Mongoose Models
const ServerSchema = new mongoose.Schema({
    serverName: String,
    ip: String,
    port: Number,
    ownerId: String,
    status: { type: String, default: 'offline' }, // 'online', 'offline', 'full'
    players: { type: Number, default: 0 },
    players_max: { type: Number, default: 0 },
    checkFailures: { type: Number, default: 0 },
    last_checked: { type: Date, default: null },
    isApproved: { type: Boolean, default: false },
}, { strict: false });
const Server = mongoose.models.Server || mongoose.model('Server', ServerSchema);

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET /api/servers -> return ONLY ONLINE servers
app.get('/api/servers', async (req, res) => {
    try {
        const servers = await Server.find({ 
            isApproved: true, 
            status: { $in: ['online', 'full'] } 
        }).sort({ players: -1 });
        
        // Return full objects to maintain compatibility with existing frontend
        res.json({ success: true, servers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. GET /api/owner/:ownerId -> return ALL servers
app.get('/api/owner/:ownerId', async (req, res) => {
    try {
        const servers = await Server.find({ ownerId: req.params.ownerId });
        
        // Return full objects to maintain compatibility
        res.json({ success: true, servers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. POST /api/servers/add -> add a server
app.post('/api/servers/add', async (req, res) => {
    try {
        const { ip, port, ownerId, serverName } = req.body;
        if (!ip || !ownerId) {
            return res.status(400).json({ success: false, error: 'IP and ownerId are required' });
        }

        const newServer = new Server({
            serverName: serverName || ip,
            ip,
            port: port || 25565,
            ownerId,
            status: 'offline',
            players: 0,
            players_max: 0,
            checkFailures: 0,
            isApproved: true, // Auto-approve for this new API requirement, or manage externally
            last_checked: new Date()
        });

        await newServer.save();
        res.json({ success: true, server: newServer });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Server IP already exists' });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

// 4. POST /api/servers/recheck -> manually trigger server check
app.post('/api/servers/recheck', async (req, res) => {
    try {
        const { ip } = req.body;
        if (!ip) return res.status(400).json({ success: false, error: 'IP is required' });

        const server = await Server.findOne({ ip });
        if (!server) return res.status(404).json({ success: false, error: 'Server not found' });

        // Trigger check by passing to util or resetting failCount to force immediate run next cycle
        server.checkFailures = 0;
        await server.save();

        res.json({ success: true, message: 'Server slated for immediate recheck in the next worker cycle.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

async function start() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("[API] MONGODB_URI is strictly required!");
        process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('[API] Connected to MongoDB.');

    const PORT = process.env.API_PORT || 4000;
    app.listen(PORT, () => {
        console.log(`[API] Server monitoring API running on http://localhost:${PORT}`);
    });
}

start();
