import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Server from "@/models/Server";
import { verifyToken } from "@/lib/auth-util";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const url = new URL(req.url);

        // Parsing parameters
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "12");
        const skip = (page - 1) * limit;

        const sortBy = url.searchParams.get("sortBy") || "trending";
        const gameType = url.searchParams.get("gameType") || "all";
        const region = url.searchParams.get("region") || "all";
        const minRating = parseFloat(url.searchParams.get("minRating") || "0");
        const tagsParam = url.searchParams.get("tags");

        // Build query
        const query: any = { isApproved: true };

        if (gameType && gameType !== "all") {
            query.gameType = gameType;
        }

        if (minRating > 0) {
            query.ratingAverage = { $gte: minRating };
        }

        if (sortBy === "rating") {
            query.totalRatings = { $gte: 5 }; // Minimum 5 ratings for top-rated charts
        }

        if (tagsParam) {
            const tags = tagsParam.split(",").filter(Boolean);
            if (tags.length > 0) {
                query.tags = { $all: tags };
            }
        }
        
        // Region filter (assuming it's a tag for now, as in previous implementation)
        if (region && region !== "all") {
             if (query.tags) {
                query.tags.$all.push(region);
             } else {
                query.tags = { $all: [region] };
             }
        }

        // Build Sort By
        let sort: any = {};
        switch (sortBy) {
            case "rating":
                sort = { ratingAverage: -1, totalRatings: -1, votes: -1 };
                break;
            case "votes":
                sort = { votes: -1, ratingAverage: -1 };
                break;
            case "players":
                sort = { votes: -1 }; // Fallback
                break;
            case "newest":
                sort = { createdAt: -1 };
                break;
            case "bumped":
                sort = { lastBumpAt: -1 };
                break;
            case "trending":
            default:
                sort = { trendingScore: -1, votesLast7Days: -1, votes: -1 };
                break;
        }

        const data = await Server.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            servers: data,
            page,
            limit
        });

    } catch (error) {
        console.error("Error fetching servers:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        const session = await verifyToken();
        if (!session || !session.userId) {
            return NextResponse.json({ success: false, error: "Unauthorized. Please login to add a server." }, { status: 401 });
        }

        const body = await req.json();
        
        // Basic validation
        if (!body.name || !body.serverIP || !body.gameType) {
            return NextResponse.json({ success: false, error: "Server Name, IP, and Game Type are required fields." }, { status: 400 });
        }

        // Format tags if provided as string
        let formattedTags = [];
        if (body.tags && typeof body.tags === 'string') {
            formattedTags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        } else if (Array.isArray(body.tags)) {
            formattedTags = body.tags;
        }

        // Minecraft Verification Step
        let isOnline = false;
        let playersOnline = 0;
        let playersMax = 0;
        let serverStatus = 'offline';

        if (body.gameType === 'Minecraft') {
            try {
                // Fetch from the latest v3 API of mcsrvstat.us 
                const address = body.port !== '25565' && body.port ? `${body.serverIP}:${body.port}` : body.serverIP;
                const pingRes = await fetch(`https://api.mcsrvstat.us/3/${address}`, {
                    next: { revalidate: 0 } // never cache this network request
                });
                
                if (!pingRes.ok) {
                    throw new Error('Ping API request failed.');
                }

                const pingData = await pingRes.json();
                
                // Case 1: Online!
                if (pingData.online === true) {
                    isOnline = true;
                    playersOnline = pingData.players?.online || 0;
                    playersMax = pingData.players?.max || 0;

                    // Compute specific online or full status
                    if (playersMax > 0 && playersOnline >= playersMax) {
                        serverStatus = 'full';
                    } else {
                        serverStatus = 'online';
                    }
                } 
                // Case 3: Invalid (DNS cannot resolve it and there is no trace of the server)
                else if (pingData.error === "Invalid hostname or IP address" || pingData.error === "DNS lookup failed") {
                    return NextResponse.json({ 
                        success: false, 
                        error: "Server could not be verified. Invalid IP or domain." 
                    }, { status: 400 });
                }
                // Case 2: Offline but Valid hostname
                else {
                     isOnline = false;
                     serverStatus = 'offline';
                     playersOnline = 0;
                     playersMax = 0;
                }
            } catch (err: any) {
                console.error("Minecraft Ping Error:", err);
                // We fallback to treating it as valid but offline if the third-party ping tool crashes
                 isOnline = false;
                 serverStatus = 'offline';
                 playersOnline = 0;
                 playersMax = 0;
            }
        } 
        
        // Define baseline status message based on verification result
        const statusMessage = isOnline 
            ? "Server verified successfully and is ONLINE." 
            : "Server is currently OFFLINE but successfully added.";

        // Create the server object
        const newServer = new Server({
            serverName: body.name,
            ip: body.serverIP,
            port: body.port || 25565,
            gameType: body.gameType,
            description: body.description,
            bannerImage: body.bannerImage,
            logoImage: body.logoImage,
            discordURL: body.discordURL,
            websiteURL: body.websiteURL,
            tags: formattedTags,
            ownerId: session.userId,
            isPremium: false,
            isApproved: false, // Servers MUST be approved by admins 
            votes: 0,
            ratingAverage: 0,
            totalRatings: 0,
            status: serverStatus,
            players: playersOnline,
            players_max: playersMax,
            last_checked: new Date()
        });

        await newServer.save();

        return NextResponse.json({ 
            success: true, 
            message: statusMessage,
            serverId: newServer._id,
            verified: true,
            isOnline: isOnline
        });

    } catch (error: any) {
        console.error("Error creating server:", error);
        
        // Handle MongoDB Duplicate Key Error (e.g. Duplicate IP)
        if (error.code === 11000) {
            return NextResponse.json({ 
                success: false, 
                error: "This Server IP is already registered on ServerForge." 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            success: false, 
            error: "Failed to create server. Please verify your details." 
        }, { status: 500 });
    }
}
