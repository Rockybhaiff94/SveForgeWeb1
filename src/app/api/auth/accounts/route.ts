import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userAccounts = await db.query.accounts.findMany({
            where: eq(accounts.userId, parseInt(session.user.id)),
            columns: {
                provider: true,
                createdAt: true,
            }
        });

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, parseInt(session.user.id)),
            columns: {
                password: true
            }
        });

        const hasPassword = !!dbUser?.password;

        return NextResponse.json({ accounts: userAccounts, hasPassword });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { provider } = await req.json();

        // Check password existence before unlinking
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, parseInt(session.user.id)),
            columns: {
                password: true
            }
        });

        if (!dbUser?.password) {
            return NextResponse.json({ error: "Cannot unlink account without a set password. Please set a password first." }, { status: 400 });
        }

        await db.delete(accounts)
            .where(
                and(
                    eq(accounts.userId, parseInt(session.user.id)),
                    eq(accounts.provider, provider)
                )
            );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
