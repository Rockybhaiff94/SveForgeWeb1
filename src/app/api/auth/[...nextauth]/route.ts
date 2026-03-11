import { NextResponse } from 'next/server';

// NextAuth has been removed and replaced with manual Discord OAuth.
// This stub prevents 404 errors from any remaining references.
export async function GET() {
    return NextResponse.json({ error: 'NextAuth is no longer active. Use /api/auth/discord to login.' }, { status: 410 });
}

export async function POST() {
    return NextResponse.json({ error: 'NextAuth is no longer active. Use /api/auth/discord to login.' }, { status: 410 });
}
