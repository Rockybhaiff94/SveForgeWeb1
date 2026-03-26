import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const getBaseUrl = () => {
    if (process.env.SERVERFORGE_API) return process.env.SERVERFORGE_API;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/_/backend`;
    if (process.env.NEXT_PUBLIC_BASE_URL) return `${process.env.NEXT_PUBLIC_BASE_URL}/_/backend`;
    return 'http://localhost:8080';
};
const API_BASE_URL = getBaseUrl();

/**
 * Forwards an incoming Next.js Request to the external backend API.
 * Automatically attaches the JWT 'sf_token' as a Bearer header.
 */
export async function proxyRequest(req: Request, targetPath: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('sf_token')?.value;

  const url = `${API_BASE_URL}${targetPath}`;
  
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('connection');
  headers.delete('content-length');
  
  // Replace Cookie header with only what the backend might need (or none at all)
  headers.delete('cookie');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual', 
  };

  // Only attach body for permitted methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      // Clone so we don't exhaust the original request stream
      const clone = req.clone();
      init.body = await clone.arrayBuffer(); 
    } catch (e) {
      // Ignore body read errors
    }
  }

  try {
    const backendResponse = await fetch(url, init);
    
    // Pass back the backend response safely
    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete('content-encoding');

    return new NextResponse(backendResponse.body as any, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('[PROXY ERROR] Failed to connect to backend:', error.message);
    return NextResponse.json(
      { error: 'Bad Gateway: Backend unreachable' }, 
      { status: 502 }
    );
  }
}
