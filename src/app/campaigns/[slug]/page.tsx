import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCampaignBySlug, getLeaderboard, initialCampaigns } from "@/lib/data";
import { CampaignDetailView } from "@/components/CampaignDetailView";

export function generateStaticParams() {
  return initialCampaigns.map((c) => ({
    slug: c.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const campaign = getCampaignBySlug(params.slug);
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

export default function CampaignDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = getCampaignBySlug(params.slug);

  if (!campaign) {
    notFound();
  }

  const leaderboard = getLeaderboard(campaign.id);

  return <CampaignDetailView campaign={campaign} leaderboard={leaderboard} />;
}
