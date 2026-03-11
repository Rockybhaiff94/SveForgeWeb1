import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-util';

export async function GET() {
    try {
        const user = await getSessionUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return only the requested fields
        return NextResponse.json({
            username: user.username,
            discordId: user.discordId,
            avatar: user.avatar, // In my implementation, this is already the full URL from the callback route
            email: user.email,
            createdAt: user.createdAt,
            role: user.role
        });
    } catch (error) {
        console.error('Profile API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
