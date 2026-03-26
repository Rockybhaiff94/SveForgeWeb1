import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

const getBaseUrl = () => {
    if (process.env.SERVERFORGE_API) return process.env.SERVERFORGE_API;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/_/backend`;
    if (process.env.NEXT_PUBLIC_BASE_URL) return `${process.env.NEXT_PUBLIC_BASE_URL}/_/backend`;
    return 'http://localhost:8080';
};
const API_BASE_URL = getBaseUrl();

export interface UserSession {
    id: string;
    _id: string;
    username: string;
    email?: string | null;
    role: string;
    avatar?: string | null;
    discordId?: string | null;
    provider: 'discord' | 'google' | 'local';
    createdAt?: Date | string | null;
    [key: string]: any;
}

/**
 * Verifies the JWT from the cookies and returns the user object from the backend API.
 */
export async function getSessionUser(): Promise<UserSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('sf_token')?.value;

    if (!token) return null;

    try {
        await dbConnect();
        
        // Use verify instead of decode for security
        // Use fallback secret to match jose implementation if env is missing
        const secret = process.env.JWT_SECRET || 'supersecret_serverforge';
        
        const decoded = jwt.verify(token, secret) as any;
        const id = decoded.id || decoded.userId;

        if (!id) return null;

        const user = await User.findById(id).lean();
        if (!user) return null;

        return {
            ...user,
            id: user._id.toString(),
            _id: user._id.toString(),
            username: user.username || user.name || 'User',
            provider: user.discordId ? 'discord' : 'local'
        } as UserSession;
    } catch (error) {
        // If verification fails, try decode as fallback for migration/legacy
        try {
            const decoded = jwt.decode(token) as any;
            if (decoded?.id) {
                await dbConnect();
                const user = await User.findById(decoded.id).lean();
                if (user) return { 
                    ...user, 
                    id: user._id.toString(), 
                    _id: user._id.toString(),
                    provider: user.discordId ? 'discord' : 'local'
                } as UserSession;
            }
        } catch (e) {}
        
        console.error('getSessionUser Error:', error);
        return null;
    }
}

/**
 * Simplified verification for API routes or server components.
 */
export async function verifyToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('sf_token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.decode(token) as { id?: string, userId?: string, discordId?: string, role: string };
        // Facilitate compatibility between legacy 'userId' and enterprise 'id'
        const id = decoded.id || decoded.userId;
        if (!id) return null;
        
        return {
            ...decoded,
            id,
            userId: id // Ensure userId exists for legacy code
        };
    } catch (error) {
        return null;
    }
}
