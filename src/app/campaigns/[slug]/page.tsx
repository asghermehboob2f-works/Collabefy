import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCampaignBySlug, getLeaderboard, initialCampaigns } from "@/lib/data";
import { CampaignDetailView } from "@/components/CampaignDetailView";
import { normalizeCampaign } from "@/lib/utils";
import { Campaign } from "@/types";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

async function getLiveCampaign(slug: string): Promise<Campaign | null> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${backendUrl}/api/v1/campaigns/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        return normalizeCampaign(json.data);
      }
    }

    // Crucial for synchronization: If the database returned 404 (deleted, draft, or unlisted),
    // NEVER resurrect from in-memory initialCampaigns! Return null so notFound() triggers.
    if (res.status === 404) {
      return null;
    }
  } catch (err) {
    // Only if backend network was completely unreachable (e.g. offline during build step)
    console.warn("[BACKEND_OFFLINE_FALLBACK] checking static data for:", slug);
    const local = getCampaignBySlug(slug);
    if (local) {
      return normalizeCampaign(local);
    }
  }

  return null;
}

export function generateStaticParams() {
  return initialCampaigns.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const campaign = await getLiveCampaign(params.slug);
  if (!campaign) {
    return {
      title: "Campaign Not Found — Collabefy",
    };
  }

  return {
    title: `${campaign.title} — Collabefy Campaigns`,
    description: campaign.summary,
    openGraph: {
      title: campaign.title,
      description: campaign.summary,
      images: [campaign.coverImage],
    },
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await getLiveCampaign(params.slug);

  if (!campaign) {
    notFound();
  }

  // Retrieve leaderboard for campaign if available
  const leaderboard = getLeaderboard(campaign.id) || [];

  return <CampaignDetailView campaign={campaign} leaderboard={leaderboard} />;
}
