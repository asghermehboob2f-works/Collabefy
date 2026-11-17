import { NextRequest, NextResponse } from "next/server";
import { getCampaignBySlug, updateCampaign, updateCampaignStatus, deleteCampaign } from "@/lib/data";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // First try backend
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/${params.slug}`, { cache: "no-store" });
    if (backendRes.ok) {
      const json = await backendRes.json();
      return NextResponse.json({ data: json.data });
    }
  } catch {}

  const campaign = getCampaignBySlug(params.slug);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json({ data: campaign });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const campaign = getCampaignBySlug(params.slug);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    // 1. Forward to backend database if available
    try {
      const authHeader = request.headers.get("authorization");
      await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${campaign.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      });
    } catch {}

    // 2. Update local in-memory store
    if (body.status && Object.keys(body).length === 1) {
      updateCampaignStatus(campaign.id, body.status);
    } else {
      updateCampaign(campaign.id, body);
    }

    return NextResponse.json({ success: true, message: "Campaign updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const campaign = getCampaignBySlug(params.slug);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  try {
    // 1. Forward to backend database if available
    try {
      const authHeader = request.headers.get("authorization");
      await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${campaign.id}`, {
        method: "DELETE",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });
    } catch {}

    // 2. Remove from local store
    deleteCampaign(campaign.id);

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
