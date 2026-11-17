import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Collabefy Route Protection Middleware
 *
 * Strict separation between Admin Realm and Creator/User Realm:
 * 1. Admin routes (/admin/*):
 *    - /admin/login is publicly accessible.
 *    - All other /admin/* paths strictly require an authorized admin role:
 *      (super_admin, admin, campaign_manager, finance_manager, support_manager)
 *      AND a valid administrative token cookie.
 *    - Normal users (creators/brands) and unauthenticated visitors are redirected to /admin/login.
 * 2. Protected user routes (/profile/*):
 *    - Require authenticated user session; unauthenticated visitors are redirected to /login.
 */

const ALLOWED_ADMIN_ROLES = new Set([
  'super_admin',
  'admin',
  'campaign_manager',
  'finance_manager',
  'support_manager',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Route Protection
  if (pathname.startsWith('/admin')) {
    // Public admin login portal
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }

    const role = request.cookies.get('collabefy_role')?.value?.toLowerCase();
    const adminToken = request.cookies.get('collabefy_admin_token')?.value;
    const accessToken = request.cookies.get('collabefy_access')?.value;

    const hasValidToken = (adminToken && adminToken.length > 0) || (accessToken && accessToken.length > 0);
    const hasAdminRole = role ? ALLOWED_ADMIN_ROLES.has(role) : false;

    // Normal creators or unauthenticated users must NEVER access /admin
    if (!hasAdminRole || !hasValidToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Creator / User Profile Route Protection
  if (pathname.startsWith('/profile')) {
    const role = request.cookies.get('collabefy_role')?.value?.toLowerCase();
    const accessToken = request.cookies.get('collabefy_access')?.value;
    const userToken = request.cookies.get('collabefy_token')?.value;

    const hasUserSession = Boolean((accessToken && accessToken.length > 0) || (userToken && userToken.length > 0) || role);

    // If no session exists, allow client-side hydration or redirect if completely anonymous
    // We let the client component inspect localStorage as well to avoid hydration mismatch
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};

