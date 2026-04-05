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

    if (!discordId) {
      return NextResponse.json({ error: "Discord ID missing" }, { status: 400 });
    }

    const accountData = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.provider, 'discord'),
        eq(accounts.providerAccountId, discordId)
      ),
      with: {
        user: true
      }
    });

    if (!accountData || !accountData.user) {
      return NextResponse.json({ error: "User not found or not linked" }, { status: 404 });
    }

    const user = accountData.user;

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("[API/Bot/User]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
