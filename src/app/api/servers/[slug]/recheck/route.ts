import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Server from "@/models/Server";
import { verifyToken } from "@/lib/auth-util";

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    try {
        const { slug: serverId } = await context.params;
        await dbConnect();

        const session = await verifyToken();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const server = await Server.findOne({ _id: serverId, ownerId: session.userId });
        if (!server) {
            return NextResponse.json({ success: false, error: "Server not found or unauthorized" }, { status: 404 });
        }

        // Do an immediate ping
        const address = server.port !== 25565 && server.port ? `${server.ip}:${server.port}` : server.ip;
        const pingRes = await fetch(`https://api.mcsrvstat.us/3/${address}`, {
            next: { revalidate: 0 },
            signal: AbortSignal.timeout(8000)
        });
        
        let isOnline = false;
        let playersOnline = 0;
        let playersMax = 0;
        let newStatus = 'offline';

        if (pingRes.ok) {
            const pingData = await pingRes.json();
            if (pingData.online === true) {
                isOnline = true;
                playersOnline = pingData.players?.online || 0;
                playersMax = pingData.players?.max || 0;
                newStatus = (playersMax > 0 && playersOnline >= playersMax) ? 'full' : 'online';
            }
        }

        server.last_checked = new Date();
        server.players = playersOnline;
        server.players_max = playersMax;
        
        if (isOnline) {
            server.status = newStatus;
            server.checkFailures = 0;
            server.lastOnline = new Date();
        } else {
            // Immediately mark it offline if they manually check and it's down
            server.status = 'offline';
        }

        await server.save();

        return NextResponse.json({
            success: true,
            status: server.status,
            players: server.players,
            message: server.status !== 'offline' ? "Server verified as Online." : "Server is Offline."
        });

    } catch (e: any) {
        console.error("Manual recheck error:", e);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
