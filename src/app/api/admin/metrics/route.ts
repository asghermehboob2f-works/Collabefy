import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/security';
import { calculatePlatformStats } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Auth guard — check admin role cookie
  const role = request.cookies.get('collabefy_role')?.value;
  const token = request.cookies.get('collabefy_admin_token')?.value;
  if (role !== 'admin' || !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: 30 req/min per IP
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed, resetInMs } = checkRateLimit(`admin:metrics:${ip}`, 30, 60_000);
  if (!allowed) return rateLimitResponse(resetInMs);

  const stats = calculatePlatformStats();
  return NextResponse.json({ stats, generatedAt: new Date().toISOString() }, { status: 200 });
}
