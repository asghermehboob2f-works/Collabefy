import { NextResponse } from "next/server";
import { calculatePlatformStats, getCampaigns, sampleCreators } from "@/lib/data";

export async function GET() {
  const stats = calculatePlatformStats();
  const campaigns = getCampaigns();

  return NextResponse.json({
    metrics: {
      totalUsers: sampleCreators.length + 120,
      activeCreators: stats.activeCreators,
      totalCampaigns: stats.totalCampaignsLaunched,
      activeCampaigns: stats.ongoingCampaigns,
      totalSubmissions: 48,
      pendingVerification: 14,
      verifiedViews: stats.totalVerifiedViews,
      totalRewardsDistributed: stats.totalRewardsPaid,
      pendingPayouts: 3420.5,
    },
    lastUpdated: new Date().toISOString(),
  });
}
