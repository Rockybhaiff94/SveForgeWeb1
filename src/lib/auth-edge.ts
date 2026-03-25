import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');

export async function verifyJwtEdge(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const p = payload as any;
        const id = p.id || p.userId;
        return { ...p, id, userId: id };
    } catch (error) {
        return null;
    }
}

export async function signJwtEdge(payload: any, expiresIn: string = '1d') {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(JWT_SECRET);
}
