import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Entrega limpia directa sin interceptación para /admin, /login, APIs y archivos estáticos (Vercel & Next.js)
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protected paths that require active session
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
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
    '/events/:path*',
    '/settings/:path*',
    '/seating/:path*',
    '/whatsapp/:path*',
  ],
};
