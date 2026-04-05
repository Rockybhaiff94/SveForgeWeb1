import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servers } from "@/lib/db/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        // Parsing parameters
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "12");
        const skip = (page - 1) * limit;

        const sortBy = url.searchParams.get("sortBy") || "trending";
        const gameType = url.searchParams.get("gameType") || "all";
        const minRating = parseFloat(url.searchParams.get("minRating") || "0");
        const tagsParam = url.searchParams.get("tags");

        // Build filters
        const filters = [eq(servers.isApproved, true)];

        if (gameType && gameType !== "all") {
            filters.push(eq(servers.gameType, gameType));
        }

        if (minRating > 0) {
            filters.push(gte(servers.ratingAverage, Math.floor(minRating)));
        }

        // Tags Filter (Array type in schema)
        if (tagsParam) {
            const tags = tagsParam.split(",").filter(Boolean);
            tags.forEach(tag => {
                filters.push(sql`${servers.tags} @> ARRAY[${tag}]::text[]`);
            });
        }

        // Build Order By
        let order;
        switch (sortBy) {
            case "rating":
                order = [desc(servers.ratingAverage), desc(servers.totalRatings)];
                break;
            case "votes":
                order = [desc(servers.votes), desc(servers.ratingAverage)];
                break;
            case "newest":
                order = [desc(servers.createdAt)];
                break;
            case "bumped":
                order = [desc(servers.lastBumpAt)];
                break;
            case "trending":
            default:
                order = [desc(servers.trendingScore), desc(servers.votesLast7Days)];
                break;
        }

        const data = await db.select()
            .from(servers)
            .where(and(...filters))
            .orderBy(...(Array.isArray(order) ? order : [order]))
            .limit(limit)
            .offset(skip);

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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { 
            name, 
            gameType, 
            serverIP, 
            port, 
            description, 
            tags, 
            bannerImage, 
            logoImage, 
            discordURL, 
            websiteURL 
        } = body;

        // Basic validation
        if (!name || !gameType || !serverIP || !description) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Create slug
        const slug = name.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        // Check if slug or IP exists
        const existing = await db.query.servers.findFirst({
            where: sql`${servers.slug} = ${slug} OR ${servers.serverIP} = ${serverIP}`
        });

        if (existing) {
            return NextResponse.json({ message: "Server name or IP already registered" }, { status: 400 });
        }

        // Insert server
        const [newServer] = await db.insert(servers).values({
            name,
            slug,
            gameType,
            serverIP,
            port: port ? parseInt(port) : null,
            description,
            tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
            bannerImage,
            logoImage,
            discordURL,
            websiteURL,
            ownerId: parseInt(session.user.id),
            isApproved: false, // Needs manual approval
        }).returning();

        return NextResponse.json({ 
            message: "Server submitted successfully!", 
            server: newServer 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating server:", error);
        return NextResponse.json({ 
            message: error instanceof Error ? error.message : "Internal server error" 
        }, { status: 500 });
    }
}
