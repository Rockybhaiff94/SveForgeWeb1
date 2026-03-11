import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = "force-dynamic";

export async function GET() {
    console.log('--- Auth Discord Config ---');
    console.log('Config keys:', Object.keys(config.discord));
    console.log('Client ID length:', config.discord.clientId?.length || 0);
    console.log('Redirect URI length:', config.discord.redirectUri?.length || 0);
    console.log('Redirect URI value:', config.discord.redirectUri);

    if (!config.discord.clientId || !config.discord.redirectUri) {
        const missing = [];
        if (!config.discord.clientId) missing.push('DISCORD_CLIENT_ID');
        if (!config.discord.redirectUri) missing.push('AUTH_DISCORD_REDIRECT_URL');
        
        console.error('Missing Discord configuration:', missing.join(', '));
        return NextResponse.json({ 
            error: `Missing configuration: ${missing.join(', ')}`,
            envKeys: Object.keys(process.env).filter(k => k.includes('DISCORD'))
        }, { status: 500 });
    }

    const authUrl = `https://discord.com/oauth2/authorize?client_id=${config.discord.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.discord.redirectUri)}&scope=identify%20email`;

    return NextResponse.redirect(authUrl);
}
