import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = "force-dynamic";

export async function GET() {
    console.log('--- Discord Auth Started ---');
    console.log('Redirect URI from config:', config.discord.redirectUri);

    if (!config.discord.redirectUri) {
        console.error('CRITICAL: config.discord.redirectUri is undefined!');
        return NextResponse.json({ error: "Configuration Error: Redirect URI is missing" }, { status: 500 });
    }

    const encodedRedirectUri = encodeURIComponent(config.discord.redirectUri);
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=${encodedRedirectUri}&scope=identify%20email`;

    console.log('Full Auth URL:', authUrl);

    return NextResponse.redirect(authUrl);
}
