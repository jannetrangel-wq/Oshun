import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected paths that require active session
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/seating') ||
    pathname.startsWith('/whatsapp');

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie =
    request.cookies.get('oshun_session')?.value ||
    request.cookies.get('oshun_active_user')?.value;

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie));

    // If accessing /admin, require SUPER_ADMIN or ADMIN role
    if (pathname.startsWith('/admin')) {
      if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    return NextResponse.next();
  } catch {
    // Corrupted cookie: redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/events/:path*',
    '/settings/:path*',
    '/seating/:path*',
    '/whatsapp/:path*',
  ],
};
