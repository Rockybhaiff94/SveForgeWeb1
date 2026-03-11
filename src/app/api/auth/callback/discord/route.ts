import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    console.log('--- Discord Callback Started ---');
    if (!code) {
        console.error('No code provided in redirect');
        return NextResponse.redirect(new URL('/login?error=no_code', req.url));
    }

    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI || !JWT_SECRET) {
        console.error('Missing required environment variables:', {
            hasClientId: !!DISCORD_CLIENT_ID,
            hasClientSecret: !!DISCORD_CLIENT_SECRET,
            hasRedirectUri: !!DISCORD_REDIRECT_URI,
            hasJwtSecret: !!JWT_SECRET
        });
        return NextResponse.redirect(new URL('/login?error=config_error', req.url));
    }

    try {
        console.log('Exchanging code for token...');
        // 1. Exchange code for Discord access token using fetch
        const tokenParams = new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: DISCORD_REDIRECT_URI,
        });

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: tokenParams,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            console.error('Discord Token Exchange Failed:', tokenData);
            return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
        }

        const { access_token } = tokenData;

        console.log('Fetching user data from Discord...');
        // 2. Fetch user data from Discord
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const discordUser = await userRes.json();

        if (!userRes.ok) {
            console.error('Discord User Fetch Failed:', discordUser);
            return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
        }

        console.log('Discord User Identified:', discordUser.username);

        // 3. Connect to MongoDB and upsert the user
        await dbConnect();

        let user = await User.findOne({ discordId: discordUser.id });

        const avatarUrl = discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${Number(discordUser.discriminator || 0) % 5}.png`;

        if (user) {
            console.log('Updating existing user...');
            user.username = discordUser.username;
            user.avatar = avatarUrl;
            user.email = discordUser.email || user.email;
            user.accessToken = access_token;
            await user.save();
        } else {
            console.log('Creating new user...');
            user = await User.create({
                discordId: discordUser.id,
                username: discordUser.username,
                avatar: avatarUrl,
                email: discordUser.email,
                accessToken: access_token,
            });
        }

        // 4. Sign a JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                discordId: user.discordId,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('JWT Signed successfully');

        // 5. Build redirect and set the session cookie
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
        const response = NextResponse.redirect(new URL('/dashboard', baseUrl));

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        console.log('Cookie set, redirecting to dashboard');
        console.log('--- Discord Callback Success ---');
        return response;
    } catch (error: any) {
        console.error('Unexpected Discord OAuth Error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
    }
}
