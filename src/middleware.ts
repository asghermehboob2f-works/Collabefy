import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect admin routes.
 * Allows public access to /admin/login, but blocks all other /admin/* paths
 * unless a valid admin role cookie is present.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Allow login page without auth
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }
    // Check admin role cookie (demo implementation)
    const role = request.cookies.get('collabefy_role')?.value;
    if (role !== 'admin') {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

