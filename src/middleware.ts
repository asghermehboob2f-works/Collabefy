import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect admin routes.
 * Allows public access to /admin/login.
 * All other /admin/* paths require either:
 *   - cookie collabefy_role === "admin", OR
 *   - cookie collabefy_admin_token being present and non-empty
 * Unauthenticated requests are redirected to /admin/login?redirect=<original-url>
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Always allow the login page through
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }

    const role = request.cookies.get('collabefy_role')?.value;
    const adminToken = request.cookies.get('collabefy_admin_token')?.value;

    const isAuthenticated = role === 'admin' || (adminToken !== undefined && adminToken.length > 0);

    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
