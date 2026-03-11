import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const dynamic = "force-dynamic";

export async function GET() {
    console.log('--- Discord Auth Started ---');

    try {
        const authUrl = new URL('https://discord.com/oauth2/authorize');
        authUrl.searchParams.set('client_id', config.discord.clientId!);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('redirect_uri', config.discord.redirectUri!);
        authUrl.searchParams.set('scope', 'identify email');

        console.log('Redirecting to:', authUrl.toString());
        return NextResponse.redirect(authUrl.toString());
    } catch (error: any) {
        console.error('Error constructing Auth URL:', error.message);
        return NextResponse.json({ error: "Failed to construct authorization URL" }, { status: 500 });
    }
}
