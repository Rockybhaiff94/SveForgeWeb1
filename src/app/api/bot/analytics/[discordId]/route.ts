import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ discordId: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.SERVERFORGE_API_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { discordId } = await params;

    const accountData = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.provider, 'discord'),
        eq(accounts.providerAccountId, discordId)
      ),
      with: {
        user: {
          with: {
            servers: true
          }
        }
      }
    });

    if (!accountData || !accountData.user) {
      return NextResponse.json({ error: "User not found or not linked" }, { status: 404 });
    }

    const userServers = accountData.user.servers;

    const totalVotes = userServers.reduce((acc, s) => acc + s.votes, 0);
    const totalViews = userServers.reduce((acc, s) => acc + s.totalViews, 0);
    const totalRatings = userServers.reduce((acc, s) => acc + s.totalRatings, 0);
    
    // Average rating
    const avgScore = userServers.length > 0 
      ? (userServers.reduce((acc, s) => acc + s.ratingAverage, 0) / userServers.length) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalServers: userServers.length,
        totalVotes,
        totalViews,
        totalRatings,
        averageRating: parseFloat(avgScore.toFixed(2))
      }
    });
  } catch (error) {
    console.error("[API/Bot/Analytics]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
