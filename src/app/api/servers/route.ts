import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servers } from "@/lib/db/schema";
import { eq, and, desc, gte, sql, arrayContains, or } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        // Parsing parameters
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "12");
        const offset = (page - 1) * limit;

        const sortBy = url.searchParams.get("sortBy") || "trending";
        const gameType = url.searchParams.get("gameType") || "all";
        const region = url.searchParams.get("region") || "all";
        const onlineOnly = url.searchParams.get("onlineOnly") === "true";
        const minPlayers = parseInt(url.searchParams.get("minPlayers") || "0");
        const minRating = parseFloat(url.searchParams.get("minRating") || "0");
        const tagsParam = url.searchParams.get("tags");

        // Optional top-rated specific threshold
        const isTopRatedMode = sortBy === "rating";

        // Build conditions
        const conditions = [];

        // Base filter - only show approved servers
        conditions.push(eq(servers.isApproved, true));

        // Game Type Filter
        if (gameType && gameType !== "all") {
            conditions.push(eq(servers.gameType, gameType));
        }

        // Region Filter (assuming region is stored in tags or a dedicated column - we didn't add region to DB yet, so let's skip or assume it's a tag)
        if (region && region !== "all") {
            // Simplified region matching, pretending it's in tags
            // In a real app, region would be its own column.
            conditions.push(sql`${servers.tags} @> ARRAY[${region}]::text[]`);
        }

        // Rating Filter
        if (minRating > 0) {
            conditions.push(gte(servers.ratingAverage, minRating));
        }

        // Top Rated Elite condition
        if (isTopRatedMode) {
            conditions.push(gte(servers.totalRatings, 5)); // Minimum 5 ratings for top-rated charts
        }

        // Tags Filter
        if (tagsParam) {
            const tags = tagsParam.split(",").filter(Boolean);
            if (tags.length > 0) {
                conditions.push(sql`${servers.tags} @> ${tags}::text[]`);
            }
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Build Order By
        let orderByClause;
        switch (sortBy) {
            case "rating":
                orderByClause = [desc(servers.ratingAverage), desc(servers.totalRatings), desc(servers.votes)];
                break;
            case "votes":
                orderByClause = [desc(servers.votes), desc(servers.ratingAverage)];
                break;
            case "players":
                // Fallback to votes since we don't have players indexed yet
                orderByClause = [desc(servers.votes)];
                break;
            case "newest":
                orderByClause = [desc(servers.createdAt)];
                break;
            case "bumped":
                orderByClause = [desc(servers.lastBumpAt)];
                break;
            case "trending":
            default:
                // Precomputed trendingScore handles the weight calculation
                orderByClause = [desc(servers.trendingScore), desc(servers.votesLast7Days), desc(servers.votes)];
                break;
        }

        const data = await db.select().from(servers)
            .where(whereClause)
            .orderBy(...orderByClause)
            .limit(limit)
            .offset(offset);

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
