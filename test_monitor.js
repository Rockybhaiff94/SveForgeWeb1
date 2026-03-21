const util = require('minecraft-server-util');

async function pingServer(server) {
    const port = server.port || 25565;
    try {
        console.log(`[Test] Pinging ${server.ip}:${port} using Java protocol...`);
        const response = await util.status(server.ip, port, {
            timeout: 5000,
            enableSRV: true 
        });
        return { online: true, players: response.players.online, maxPlayers: response.players.max };
    } catch (e) {
        console.log(`[Test] Java ping failed (${e.message}), trying Bedrock...`);
        try {
            const bedrockRes = await util.statusBedrock(server.ip, port, { timeout: 5000 });
            return { online: true, players: bedrockRes.players.online, maxPlayers: bedrockRes.players.max };
        } catch (bedrockErr) {
            console.log(`[Test] Bedrock ping failed (${bedrockErr.message}).`);
            return { online: false };
        }
    }
}

async function runTest() {
    const mockServer = {
        _id: 'mock_id_123',
        serverName: 'Hypixel Test',
        ip: 'mc.hypixel.net',
        port: 25565,
        status: 'offline',
        checkFailures: 0
    };

    console.log('[Test] Initiating check cycle for mock server array.');
    const servers = [mockServer];

    const promises = servers.map(async (server) => {
        let { online, players, maxPlayers } = await pingServer(server);
        
        let newFailCount = server.checkFailures || 0;
        let newStatus = server.status ? server.status.toLowerCase() : 'offline';
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

        console.log('\n--- SIMULATED DATABASE UPDATE ---');
        console.log(`Target: ${server.ip}`);
        console.log(`Resulting Status: ${newStatus.toUpperCase()}`);
        console.log(`Players Online: ${players} / ${maxPlayers}`);
        console.log(`Failures: ${newFailCount}`);
        console.log(`Just went Offline Trigger?: ${justWentOffline}`);
        console.log(`Just came Online Trigger?: ${justCameOnline}`);
        console.log('---------------------------------\n');
    });

    await Promise.all(promises);
    console.log('[Test] Cycle complete.');
}

runTest();
