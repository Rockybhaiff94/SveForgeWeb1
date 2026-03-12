import dbConnect from './mongodb';
import Server from '@/models/Server';

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const BATCH_SIZE = 5;
const DELAY_BETWEEN_BATCHES_MS = 2000;

// Prevent multiple setIntervals in development mode with HMR, by storing a symbol on the global object
const globalMonitorStart = Symbol.for("global_monitor_start");

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function processBatch(servers: any[]) {
    const promises = servers.map(async (server) => {
        let isOnline = false;
        let playersOnline = 0;
        let playersMax = 0;
        let serverStatus = 'offline';

        try {
            const address = server.port !== 25565 && server.port ? `${server.ip}:${server.port}` : server.ip;
            const pingRes = await fetch(`https://api.mcsrvstat.us/3/${address}`, {
                next: { revalidate: 0 } // never cache the fetch response from next
            });
            
            if (!pingRes.ok) {
                throw new Error('Ping API request failed.');
            }

            const pingData = await pingRes.json();
            
            if (pingData.online === true) {
                isOnline = true;
                playersOnline = pingData.players?.online || 0;
                playersMax = pingData.players?.max || 0;

                if (playersMax > 0 && playersOnline >= playersMax) {
                    serverStatus = 'full';
                } else {
                    serverStatus = 'online';
                }
            } else {
                 isOnline = false;
                 serverStatus = 'offline';
                 playersOnline = 0;
                 playersMax = 0;
            }
        } catch (err: any) {
             console.error(`[Monitor Worker] Error pinging ${server.serverName}:`, err.message);
             // Leave as offline
             isOnline = false;
             serverStatus = 'offline';
             playersOnline = 0;
             playersMax = 0;
        }

        // Update DB
        try {
            await Server.updateOne({ _id: server._id }, {
                $set: {
                    status: serverStatus,
                    players: playersOnline,
                    players_max: playersMax,
                    last_checked: new Date()
                }
            });
            console.log(`[Monitor Worker] Status updated: ${server.serverName} -> ${serverStatus} (${playersOnline}/${playersMax})`);
        } catch (dbErr: any) {
            console.error(`[Monitor Worker] Failed to update MongoDB for ${server.serverName}:`, dbErr.message);
        }
    });

    await Promise.allSettled(promises);
}

export async function checkServers() {
    console.log('[Monitor Worker] Starting Automatic Server Ping Cycle...');
    try {
        await dbConnect();
        
        // Note: For production use, you may also want to monitor non-Minecraft games 
        // using different logic, but this fulfills the current Minecraft ping spec.
        const serversOptions = { isApproved: true, gameType: 'Minecraft' };
        const totalServers = await Server.countDocuments(serversOptions);
        console.log(`[Monitor Worker] Found ${totalServers} servers to process this cycle.`);

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
        
        // Process remaining servers in the final batch
        if (batch.length > 0) {
            await processBatch(batch);
        }

        console.log('[Monitor Worker] Ping Cycle Complete.');

    } catch (error) {
        console.error('[Monitor Worker] Critical Error during ping cycle:', error);
    }
}

export function startMonitoring() {
    const globalAny: any = global;

    if (globalAny[globalMonitorStart]) {
        return; // Already started
    }
    
    globalAny[globalMonitorStart] = true;
    
    // Boot the first check 5 seconds after Database connects, then repeat every 5 mins
    setTimeout(() => {
        checkServers();
        setInterval(checkServers, INTERVAL_MS);
    }, 5000);
    
    console.log('[Monitor Worker] Continuous Background Monitor Initialized (Polling every 5 minutes).');
}
