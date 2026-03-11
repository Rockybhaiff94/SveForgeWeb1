import { NextResponse } from 'next/server';

export async function GET() {
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

    console.log('--- Initial Discord Redirect ---');
    console.log('Client ID:', DISCORD_CLIENT_ID);
    console.log('Redirect URI:', DISCORD_REDIRECT_URI);

    if (!DISCORD_CLIENT_ID) {
        console.error('Missing DISCORD_CLIENT_ID');
        return NextResponse.json({ error: 'Missing DISCORD_CLIENT_ID' }, { status: 500 });
    }
    if (!DISCORD_REDIRECT_URI) {
        console.error('Missing DISCORD_REDIRECT_URI');
        return NextResponse.json({ error: 'Missing DISCORD_REDIRECT_URI' }, { status: 500 });
    }

    const authUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&scope=identify%20email`;

    return NextResponse.redirect(authUrl);
}
