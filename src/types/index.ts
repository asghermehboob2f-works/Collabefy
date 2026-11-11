export type CampaignStatus =
  | "active"
  | "upcoming"
  | "paused"
  | "budget_exhausted"
  | "completed"
  | "cancelled"
  | "archived";

export type PlatformType = "tiktok" | "youtube_shorts" | "instagram_reels" | "x";

export type CampaignType =
  | "short_form_clipping"
  | "ugc"
  | "developer_tools"
  | "product_demo"
  | "brand_sponsorship"
  | "bounty";

export type RewardUnit =
  | "per_1000_views"
  | "per_view"
  | "fixed_bounty"
  | "per_approved_post";

export interface CampaignRule {
  id: string;
  category: "format" | "hashtag" | "eligibility" | "prohibited" | "verification" | "payout";
  title: string;
  detail: string;
}

export interface CampaignAsset {
  id: string;
  title: string;
  type: "vector_logo" | "b_roll" | "guidelines" | "audio_asset";
  sizeText: string;
  url: string;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  brandName: string;
  brandCategory: string;
  summary: string;
  description: string;
  campaignType: CampaignType;
  coverImage: string;
  brandLogo: string;
  status: CampaignStatus;
  currency: string;
  totalBudget: number;
  allocatedBudget: number;
  budgetVisibility: "public" | "private";
  rewardRate: number;
  rewardUnit: RewardUnit;
  rewardVisibility: "public" | "private";
  platforms: PlatformType[];
  applicationRequired: boolean;
  featured: boolean;
  featuredOrder?: number;
  startDate: string;
  endDate: string;
  timeZone: string;
  verifiedViews: number;
  approvedClips: number;
  activeCreators: number;
  discordInviteUrl: string;
  discordChannelName: string;
  externalAppUrl?: string;
  leaderboardEnabled: boolean;
  brief: {
    objective: string;
    targetAudience: string[];
    coreNarrative: string;
    talkingPoints: string[];
    assets: CampaignAsset[];
  };
  rules: CampaignRule[];
  updates?: CampaignUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  campaignId: string;
  rank: number;
  creatorName: string;
  handle: string;
  avatarUrl: string;
  verifiedViews: number;
  pendingViews: number;
  approvedPosts: number;
  rewardEarned: number;
  isVerified: boolean;
  lastUpdated: string;
}

export interface CreatorSocialAccount {
  id: string;
  platform: PlatformType;
  handle: string;
  profileUrl: string;
  followers?: number;
  status: "verified" | "unverified";
  verificationMethod?: "manual_link" | "oauth2";
  connectedAt: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  role: "creator" | "editor" | "admin";
  socialAccounts: CreatorSocialAccount[];
  portfolioLinks: string[];
  totalEarnings: number;
  totalVerifiedViews: number;
  isEmailVerified: boolean;
  isPublicProfile: boolean;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetEntity: "campaign" | "creator" | "leaderboard" | "settings";
  targetId: string;
  targetTitle: string;
  timestamp: string;
  details: string;
}

export interface PlatformStats {
  ongoingCampaigns: number;
  totalCampaignsLaunched: number;
  totalVerifiedViews: number;
  totalRewardsPaid: number;
  activeCreators: number;
  lastCalculatedAt: string;
}

