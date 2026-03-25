import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('sf_token');
  
  // Optionally ping the backend /auth/logout if the backend tracks sessions
  const API_BASE_URL = process.env.SERVERFORGE_API || 'http://localhost:8080';
  fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }).catch(() => {});

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('sf_token');
  
  const { origin } = new URL(req.url);
  return NextResponse.redirect(new URL('/login', origin));
}
