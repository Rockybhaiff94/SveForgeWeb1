import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = "force-dynamic";

export async function GET() {
    console.log('--- Discord Auth Started ---');

    const authUrl = `https://discord.com/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.discord.redirectUri!)}&scope=identify%20email`;

    return NextResponse.redirect(authUrl);
}
