import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifies the JWT from the cookies and returns the user object.
 */
export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string, discordId: string };

        await dbConnect();
        const user = await User.findById(decoded.userId).lean();

        if (!user) return null;

        // Convert _id to string for Next.js client component compatibility
        return {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt?.toISOString(),
        };
    } catch (error) {
        return null;
    }
}

/**
 * Simplified verification for API routes or server components that just need the ID.
 */
export async function verifyToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string, discordId: string };
        return decoded;
    } catch (error) {
        return null;
    }
}
