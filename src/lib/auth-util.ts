import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

const API_BASE_URL = process.env.SERVERFORGE_API || 'http://localhost:8080';

/**
 * Verifies the JWT from the cookies and returns the user object from the backend API.
 */
export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('sf_token')?.value;

    if (!token) return null;

    try {
        // Since we are in an enterprise decoupled architecture, 
        // the frontend should query the backend API for session data.
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 60 } // Cache for 60s
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.user || null;
    } catch (error) {
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
