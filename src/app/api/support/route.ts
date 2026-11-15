import { NextRequest, NextResponse } from "next/server";
import { supportTicketSchema, checkRateLimit, rateLimitResponse } from "@/lib/security";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "client-ip";
  const limit = checkRateLimit(`support-${ip}`, 5, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.resetInMs);
  }

  try {
    const body = await request.json();
    const validated = supportTicketSchema.parse(body);

    const ticket = {
      id: `ticket-${Date.now()}`,
      ...validated,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Support ticket logged. Our team will contact you within 24 hours.",
      ticketId: ticket.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Validation Error", details: err.errors || err.message },
      { status: 400 }
    );
  }
}
