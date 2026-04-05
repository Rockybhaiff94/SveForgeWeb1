import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = parseInt(session.user.id);
    
    const userAccounts = await db.query.accounts.findMany({
      where: eq(accounts.userId, userId),
      columns: {
        provider: true,
        createdAt: true,
      }
    });

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        password: true
      }
    });

    const hasPassword = !!dbUser?.password;

    return NextResponse.json({ accounts: userAccounts, hasPassword });
  } catch (error) {
    console.error("GET Accounts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { provider } = await req.json();
    const userId = parseInt(session.user.id);

    // Check password existence before unlinking
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        password: true
      }
    });

    if (!dbUser?.password) {
      return NextResponse.json({ error: "Cannot unlink account without a set password. Please set a password first." }, { status: 400 });
    }

    // Find the specific account for this user and provider
    const accountToDelete = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, userId),
        eq(accounts.provider, provider)
      )
    });

    if (accountToDelete) {
      await db.delete(accounts)
        .where(eq(accounts.id, accountToDelete.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Account Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
