import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sf_token')?.value || req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Check RBAC for /admin
    if (pathname.startsWith('/admin')) {
      const role = payload.role as string;
      if (role !== 'OWNER' && role !== 'ADMIN' && role !== 'DEV' && role !== 'MOD') {
         return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
