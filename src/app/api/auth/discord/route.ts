import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = "force-dynamic";

export async function GET() {
    console.log('--- Auth Discord Config ---');
    console.log('Client ID length:', config.discord.clientId?.length || 0);
    console.log('Redirect URI:', config.discord.redirectUri);

    if (!config.discord.clientId || !config.discord.redirectUri) {
        const missing = [];
        if (!config.discord.clientId) missing.push('DISCORD_CLIENT_ID');
        if (!config.discord.redirectUri) missing.push('DISCORD_REDIRECT_URI');
        
        console.error('Missing Discord configuration:', missing.join(', '));
        return NextResponse.json({ 
            error: `Missing configuration: ${missing.join(', ')}`,
            envKeys: Object.keys(process.env).filter(k => k.startsWith('DISCORD'))
        }, { status: 500 });
    }

    const authUrl = `https://discord.com/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.discord.redirectUri)}&scope=identify%20email`;

    return NextResponse.redirect(authUrl);
}
