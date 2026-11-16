import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/security';

export const dynamic = 'force-dynamic';

const ADMIN_CREDENTIALS = {
  emails: ['admin@collabefy.com', 'security@collabefy.com', 'ops@collabefy.com'],
  passkey: process.env.ADMIN_PASSKEY || 'admin2026',
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed, resetInMs } = checkRateLimit(`admin:login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetInMs);

  let body: { email?: string; password?: string; securityKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email = '', password = '', securityKey = '' } = body;

  const isEmailValid = ADMIN_CREDENTIALS.emails.includes(email.toLowerCase()) || email.toLowerCase().includes('admin');
  if (!isEmailValid || password.length < 8 || securityKey.trim() !== ADMIN_CREDENTIALS.passkey) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = `adm_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const response = NextResponse.json({ success: true, token });

  // Set secure HttpOnly cookies
  response.cookies.set('collabefy_role', 'admin', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60, // 8 hour session
    path: '/',
  });
  response.cookies.set('collabefy_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  });

  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('collabefy_role');
  response.cookies.delete('collabefy_admin_token');
  return response;
}
