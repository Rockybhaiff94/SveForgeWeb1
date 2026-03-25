import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtEdge } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const url = request.nextUrl;
    
    const isDashboardPath = url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/profile') ||
        url.pathname.startsWith('/submit');
    const isAdminPath = url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login');

    if (isDashboardPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAdminPath && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (token) {
        const payload = await verifyJwtEdge(token);
        if (!payload) {
            // Invalid token
            let response;
            if (isAdminPath) {
                response = NextResponse.redirect(new URL('/admin/login', request.url));
            } else {
                response = NextResponse.redirect(new URL('/login', request.url));
            }
            response.cookies.delete('token');
            return response;
        }

        // RBAC logic for /admin routes
        if (isAdminPath) {
            const role = payload.role;
            const hasAdminAccess = ['OWNER', 'ADMIN', 'DEV', 'MOD'].includes(role || '');
            if (!hasAdminAccess) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
            
            // Further granular permissions could be added here
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile", "/dashboard/:path*", "/submit", "/admin/:path*"],
};
