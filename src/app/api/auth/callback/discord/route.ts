import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config';
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

    const { clientId, clientSecret, redirectUri } = config.discord;
    const { secret: JWT_SECRET } = config.jwt;

    console.log('--- Credential Verification ---');
    console.log('Client ID:', clientId ? `${clientId.slice(0, 4)}...${clientId.slice(-4)}` : 'MISSING');
    console.log('Client Secret:', clientSecret ? `${clientSecret.slice(0, 4)}...${clientSecret.slice(-4)}` : 'MISSING');
    console.log('Redirect URI:', redirectUri || 'MISSING');
    console.log('-------------------------------');

    try {
        console.log('Exchanging code for token...');
        // 1. Exchange code for Discord access token using fetch
        const tokenParams = new URLSearchParams({
            client_id: clientId!,
            client_secret: clientSecret!,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri!,
        });

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: tokenParams,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            console.error('Discord Token Exchange Failed:', tokenData);
            // Additional debug info
            console.log('Token Request Context:', {
                status: tokenRes.status,
                statusText: tokenRes.statusText,
                url: 'https://discord.com/api/oauth2/token'
            });
            const errorDetail = tokenData.error || 'unknown_discord_error';
            return NextResponse.redirect(new URL(`/login?error=auth_failed&details=${errorDetail}`, req.url));
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
            // Defensive: ensure role is uppercase if it came from a lowercase source
            if (user.role) user.role = user.role.toUpperCase() as any;
            await user.save();
        } else {
            console.log('Creating new user...');
            user = await User.create({
                discordId: discordUser.id,
                username: discordUser.username,
                avatar: avatarUrl,
                email: discordUser.email,
                accessToken: access_token,
                role: 'USER', // Explicitly uppercase
                name: discordUser.global_name || discordUser.username, // Fallback for 'name'
                password: Math.random().toString(36).slice(-10), // Random fallback for 'password'
            });
        }

        // 4. Sign a JWT with Enterprise Standard
        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role || 'USER',
                // For compatibility if needed by other legacy routes
                userId: user._id.toString()
            },
            JWT_SECRET!,
            { expiresIn: '7d' }
        );

        console.log('JWT Signed successfully');

        // 5. Build redirect and set the enterprise session cookie
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
        const response = NextResponse.redirect(new URL('/dashboard', baseUrl));

        response.cookies.set('sf_token', token, {
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
        const errorMsg = encodeURIComponent(error.message || 'unknown_error');
        return NextResponse.redirect(new URL(`/login?error=auth_failed&details=${errorMsg}`, req.url));
    }
}
