/**
 * Next.js Middleware — route-level auth protection.
 *
 * Runs on the Edge runtime before every matched request.
 * - Protected routes: redirect to /auth/login if no access token.
 * - Auth routes:      redirect to /dashboard if already authenticated.
 */
import { NextResponse, type NextRequest } from 'next/server';

const ACCESS_TOKEN_KEY  = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY  ?? 'access_token';
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? 'refresh_token';

const PROTECTED_PREFIXES = ['/dashboard', '/users', '/profile'];
const AUTH_ROUTES        = ['/auth/login', '/auth/register'];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken  = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  const hasSession = Boolean(accessToken || refreshToken);

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtected(pathname) && !hasSession) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect root → /dashboard or /auth/login
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(hasSession ? '/dashboard' : '/auth/login', request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static assets and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
