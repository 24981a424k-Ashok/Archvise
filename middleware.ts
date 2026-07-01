import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('archvise_session');

  // List of protected routes prefixes
  const protectedRoutes = ['/dashboard', '/audit', '/design', '/projects', '/settings', '/billing', '/github'];
  
  // List of auth pages (sign-in, sign-up) where we redirect logged-in users to /dashboard
  const authRoutes = ['/sign-in', '/sign-up'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !hasSession) {
    // Redirect to sign-in page if not logged in using Edge-compatible cloned URL
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/sign-in';
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && hasSession) {
    // Redirect to dashboard if already logged in using Edge-compatible cloned URL
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets like icon.png or login_bg.png
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|login_bg.png).*)',
  ],
};
