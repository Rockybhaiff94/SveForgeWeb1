import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Server from "@/models/Server";

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
