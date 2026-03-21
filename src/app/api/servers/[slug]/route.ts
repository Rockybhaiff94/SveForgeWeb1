import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Server from "@/models/Server";
import { verifyToken } from "@/lib/auth-util";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await context.params;
        await dbConnect();
        const server = await Server.findById(slug);
        if (!server) return NextResponse.json({ error: "Server not found" }, { status: 404 });
        return NextResponse.json({ success: true, server });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await context.params;
        await dbConnect();
        const session = await verifyToken();
        if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });

        const server = await Server.findOne({ _id: slug, ownerId: session.userId });
        if (!server) return NextResponse.json({ error: "Forbidden or Server not found" }, { status: 403 });

        const body = await req.json();
        
        if (body.description !== undefined) server.description = body.description;
        if (body.tags !== undefined) {
             let formattedTags = [];
             if (typeof body.tags === 'string') {
                 formattedTags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
             } else if (Array.isArray(body.tags)) {
                 formattedTags = body.tags;
             }
             server.tags = formattedTags;
        }
        if (body.bannerImage !== undefined) server.bannerImage = body.bannerImage;
        if (body.logoImage !== undefined) server.logoImage = body.logoImage;
        if (body.discordURL !== undefined) server.discordURL = body.discordURL;
        if (body.websiteURL !== undefined) server.websiteURL = body.websiteURL;
        if (body.name) server.serverName = body.name;
        if (body.serverIP) server.ip = body.serverIP;
        if (body.port) server.port = body.port;
        if (body.gameType) server.gameType = body.gameType;

        // If IP/Port was changed, reset verification state to force the worker to recheck it
        if (body.serverIP || body.port) {
            server.checkFailures = 0;
            // Worker handles marking it online/offline intrinsically next cycle
        }

        await server.save();
        return NextResponse.json({ success: true, message: "Server updated successfully", server });
    } catch (e: any) {
        console.error("PUT Server Error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
