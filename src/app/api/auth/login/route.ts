import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const getBaseUrl = () => {
    if (process.env.SERVERFORGE_API) return process.env.SERVERFORGE_API;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/_/backend`;
    if (process.env.NEXT_PUBLIC_BASE_URL) return `${process.env.NEXT_PUBLIC_BASE_URL}/_/backend`;
    return 'http://localhost:8080';
};
const API_BASE_URL = getBaseUrl();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Forward credentials to real backend
    const backendRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1' // Include IP for backend logging
      })
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json({ error: data.error || 'Authentication failed' }, { status: backendRes.status });
    }

    // 2. The backend returned a JWT. We store it in an HTTP-only cookie.
    const token = data.token;
    if (!token) {
      return NextResponse.json({ error: 'Backend did not return a token' }, { status: 500 });
    }

    const cookieStore = await cookies();
    cookieStore.set('sf_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // 3. Return user data to frontend (without the raw token)
    return NextResponse.json({ success: true, user: data.user });

  } catch (err: any) {
    console.error('Login Proxy Error:', err);
    return NextResponse.json({ error: 'Internal Server Error (Gateway)' }, { status: 500 });
  }
}
