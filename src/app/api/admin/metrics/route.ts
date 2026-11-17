import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/security';
import { calculatePlatformStats } from '@/lib/data';

export const dynamic = 'force-dynamic';

const ALLOWED_ADMIN_ROLES = ["super_admin", "admin", "campaign_manager", "finance_manager", "support_manager"];
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function GET(request: NextRequest) {
  // Auth guard — check admin role cookie
  const role = request.cookies.get('collabefy_role')?.value?.toLowerCase();
  const token = request.cookies.get('collabefy_admin_token')?.value || request.cookies.get('collabefy_access')?.value;
  if (!role || !ALLOWED_ADMIN_ROLES.includes(role) || !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: 30 req/min per IP
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed, resetInMs } = checkRateLimit(`admin:metrics:${ip}`, 30, 60_000);
  if (!allowed) return rateLimitResponse(resetInMs);

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/analytics/overview`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return NextResponse.json({ stats: json.data?.metrics, generatedAt: new Date().toISOString() }, { status: 200 });
    }
  } catch (err) {
    console.warn("Failed to fetch live metrics from backend:", err);
  }

  const stats = calculatePlatformStats();
  return NextResponse.json({ stats, generatedAt: new Date().toISOString() }, { status: 200 });
}
