import { NextRequest, NextResponse } from "next/server";
import { getCampaignBySlug, updateCampaignStatus } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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
    if (body.status) {
      updateCampaignStatus(campaign.id, body.status);
    }

    return NextResponse.json({ success: true, message: "Campaign updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
