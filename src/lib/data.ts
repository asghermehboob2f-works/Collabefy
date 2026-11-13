import { Campaign, LeaderboardEntry, CreatorProfile, AdminAuditLog, PlatformStats } from "@/types";

export const initialCampaigns: Campaign[] = [
  {
    id: "camp-01",
    title: "Cursor AI — Next-Gen Code Editor Launch",
    slug: "cursor-ai-launch",
    brandName: "Cursor",
    brandCategory: "Developer Tools & AI",
    summary: "Showcase Cursor Composer and AI pair-programming features in real coding workflows.",
    description:
      "Cursor is the AI-first code editor built for engineer velocity. This campaign invites developers and tech creators to demonstrate solving real bugs, refactoring systems, and building interactive web features in seconds using Cursor Composer.",
    campaignType: "developer_tools",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "USD",
    totalBudget: 30000,
    allocatedBudget: 14200,
    budgetVisibility: "public",
    rewardRate: 22.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["tiktok", "youtube_shorts", "instagram_reels"],
    applicationRequired: false,
    featured: true,
    featuredOrder: 1,
    startDate: "2026-11-01T00:00:00Z",
    endDate: "2026-11-20T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 645400,
    approvedClips: 38,
    activeCreators: 19,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-cursor-ai",
    leaderboardEnabled: true,
    brief: {
      objective: "Demonstrate developer speed with Cursor Composer and real-world multi-file editing.",
      targetAudience: ["Full-stack developers", "Frontend engineers", "Student coders", "Tech creators"],
      coreNarrative:
        "Walk through solving a non-trivial code issue or building an interactive feature in seconds using Cursor Composer. Show the actual diff and result without fake edits.",
      talkingPoints: [
        "Natural language prompt to full diff in 2 seconds",
        "Context awareness across entire codebase (@Files, @Docs)",
        "Zero setup friction — imports all VS Code extensions directly",
      ],
      assets: [
        {
          id: "asset-1",
          title: "Cursor Vector Logo & Icons (.SVG)",
          type: "vector_logo",
          sizeText: "1.4 MB",
          url: "#",
        },
        {
          id: "asset-2",
          title: "Official 4K B-Roll & Screen Captures (.MP4)",
          type: "b_roll",
          sizeText: "840 MB",
          url: "#",
        },
        {
          id: "asset-3",
          title: "Brand Voice & Visual Guidelines (.PDF)",
          type: "guidelines",
          sizeText: "2.1 MB",
          url: "#",
        },
      ],
    },
    rules: [
      {
        id: "r1",
        category: "format",
        title: "Accepted Video Formats",
        detail: "9:16 vertical video only (TikTok, YouTube Shorts, Instagram Reels). Length between 30s and 90s.",
      },
      {
        id: "r2",
        category: "hashtag",
        title: "Required Mentions & Tags",
        detail: "Must include #CursorAI #CodeWithAI in description and pin the official link in comments.",
      },
      {
        id: "r3",
        category: "eligibility",
        title: "Account Eligibility",
        detail: "Creator account must have at least 5,000 followers and primarily cover technology or coding.",
      },
      {
        id: "r4",
        category: "prohibited",
        title: "Prohibited Content",
        detail: "No synthetic/AI-only voiceovers without creator presence; no unedited raw screen captures; no misleading claims.",
      },
      {
        id: "r5",
        category: "verification",
        title: "View Verification & Fraud Audit",
        detail: "Views audited 48 hours post-publication via Collabefy Bot. Bot traffic and non-organic spikes are filtered out.",
      },
      {
        id: "r6",
        category: "payout",
        title: "Payout Schedule",
        detail: "Weekly automated payouts issued every Friday via Stripe Connect or USDC upon verification.",
      },
    ],
    updates: [
      {
        id: "up-1",
        title: "Additional $10,000 Pool Allocation for YouTube Shorts",
        body: "Due to high viewer engagement on YouTube Shorts, an additional $10,000 budget has been added to the pool.",
        date: "2026-11-09T14:30:00Z",
      },
      {
        id: "up-2",
        title: "Campaign Launched",
        body: "Cursor AI launch campaign officially opened with $20,000 initial reward pool.",
        date: "2026-11-01T00:00:00Z",
      },
    ],
    createdAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-09T14:30:00Z",
  },
  {
    id: "camp-02",
    title: "Arc Browser — Windows Release Blitz",
    slug: "arc-browser-windows",
    brandName: "The Browser Company",
    brandCategory: "Productivity & Software",
    summary: "Showcase the fluid Spaces, Split Tabs, and Command Bar of Arc Browser on Windows.",
    description:
      "Arc for Windows has officially launched. We want creators to share how Arc transforms their daily desktop experience, comparing it to standard browsers and highlighting Spaces and Split View.",
    campaignType: "product_demo",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "USD",
    totalBudget: 35000,
    allocatedBudget: 28400,
    budgetVisibility: "public",
    rewardRate: 18.5,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["youtube_shorts", "instagram_reels", "tiktok"],
    applicationRequired: false,
    featured: true,
    featuredOrder: 2,
    startDate: "2026-11-03T00:00:00Z",
    endDate: "2026-11-18T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 1535000,
    approvedClips: 52,
    activeCreators: 28,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-arc-windows",
    leaderboardEnabled: true,
    brief: {
      objective: "Drive Windows desktop users to download Arc and try Spaces.",
      targetAudience: ["Productivity enthusiasts", "Students", "Designers", "Remote workers"],
      coreNarrative:
        "Contrast the chaos of 50 Chrome tabs with the calm organization of Arc Spaces and Pinned Tabs on Windows.",
      talkingPoints: [
        "Spaces: work, study, and personal lives completely separated",
        "Split view without fiddling with multiple windows",
        "Clean sidebar that collapses when you need focus",
      ],
      assets: [
        {
          id: "asset-arc-1",
          title: "Arc Branding Kit & UI Badges (.ZIP)",
          type: "vector_logo",
          sizeText: "3.2 MB",
          url: "#",
        },
      ],
    },
    rules: [
      {
        id: "r-arc-1",
        category: "format",
        title: "Vertical Aspect Ratio",
        detail: "9:16 vertical video only, crisp 1080p minimum resolution.",
      },
      {
        id: "r-arc-2",
        category: "hashtag",
        title: "Official Tagging",
        detail: "Use #ArcBrowser #ArcForWindows and tag @arcbrowser in caption.",
      },
    ],
    createdAt: "2026-11-03T00:00:00Z",
    updatedAt: "2026-11-10T12:00:00Z",
  },
  {
    id: "camp-03",
    title: "Perplexity — Deep Research Challenge",
    slug: "perplexity-deep-research",
    brandName: "Perplexity AI",
    brandCategory: "AI & Search",
    summary: "Compare standard web search against Perplexity Pro search with cited sources for complex questions.",
    description:
      "Perplexity is revolutionizing how we find answers. Create side-by-side comparison clips demonstrating how Perplexity provides direct cited syntheses vs scrolling through pages of ads on traditional engines.",
    campaignType: "ugc",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "USD",
    totalBudget: 20000,
    allocatedBudget: 8900,
    budgetVisibility: "public",
    rewardRate: 26.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["tiktok", "instagram_reels"],
    applicationRequired: false,
    featured: true,
    featuredOrder: 3,
    startDate: "2026-11-05T00:00:00Z",
    endDate: "2026-11-25T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 342300,
    approvedClips: 24,
    activeCreators: 16,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-perplexity",
    leaderboardEnabled: true,
    brief: {
      objective: "Highlight the depth and accuracy of Perplexity Pro search with instant cited sources.",
      targetAudience: ["Researchers", "College students", "Curious knowledge workers"],
      coreNarrative:
        "Ask a difficult question (e.g. comparing complex technical architectures or market histories) and show Perplexity solving it in seconds.",
      talkingPoints: [
        "Direct answer with hyperlinked citations",
        "Pro toggle for multi-step reasoning",
        "Save collections and share pages",
      ],
      assets: [],
    },
    rules: [
      {
        id: "r-prx-1",
        category: "hashtag",
        title: "Required Hashtags",
        detail: "Include #PerplexityAI #SearchSmarter in caption.",
      },
    ],
    createdAt: "2026-11-05T00:00:00Z",
    updatedAt: "2026-11-08T09:00:00Z",
  },
  {
    id: "camp-04",
    title: "Supabase — Vector & AI Hackathon Blitz",
    slug: "supabase-vector-sprint",
    brandName: "Supabase",
    brandCategory: "Cloud Infrastructure & Backend",
    summary: "Showcase building AI search and vector embeddings in PostgreSQL with pgvector in under 60 seconds.",
    description:
      "Supabase Vector allows developers to store, index, and query embeddings alongside their relational data. Create snappy quick-start tutorials demonstrating pgvector in action.",
    campaignType: "developer_tools",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "USD",
    totalBudget: 25000,
    allocatedBudget: 11200,
    budgetVisibility: "public",
    rewardRate: 24.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["youtube_shorts", "tiktok"],
    applicationRequired: true,
    featured: false,
    startDate: "2026-11-02T00:00:00Z",
    endDate: "2026-11-22T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 466000,
    approvedClips: 29,
    activeCreators: 15,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-supabase-vector",
    leaderboardEnabled: true,
    brief: {
      objective: "Demonstrate ease of vector search with Supabase and Postgres.",
      targetAudience: ["Fullstack devs", "Next.js builders", "AI founders"],
      coreNarrative: "Show how fast you can turn normal Postgres into semantic vector search.",
      talkingPoints: ["Native pgvector in Postgres", "Supabase Client SDK", "Instant RAG pipeline"],
      assets: [],
    },
    rules: [],
    createdAt: "2026-11-02T00:00:00Z",
    updatedAt: "2026-11-06T11:00:00Z",
  },
  {
    id: "camp-05",
    title: "Raycast — Developer Extensions Showcase",
    slug: "raycast-pro-extensions",
    brandName: "Raycast",
    brandCategory: "Desktop & Utilities",
    summary: "Demonstrate your custom Raycast extension or daily shortcuts that save 2+ hours daily.",
    description:
      "Raycast is the extendable launcher for Mac and Windows. Show off your favorite store extensions or highlight creating your own custom command in TypeScript.",
    campaignType: "product_demo",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "USD",
    totalBudget: 18000,
    allocatedBudget: 9400,
    budgetVisibility: "public",
    rewardRate: 20.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["tiktok", "youtube_shorts", "instagram_reels"],
    applicationRequired: false,
    featured: false,
    startDate: "2026-11-04T00:00:00Z",
    endDate: "2026-11-24T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 470000,
    approvedClips: 31,
    activeCreators: 21,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-raycast",
    leaderboardEnabled: true,
    brief: {
      objective: "Highlight the power of Raycast Store Extensions and customized workflow hotkeys.",
      targetAudience: ["Mac & Windows power users", "Engineers", "Designers"],
      coreNarrative: "Stop touching your mouse. Everything in 2 keystrokes with Raycast.",
      talkingPoints: ["Open-source extension store", "Quick AI prompts", "Window management & clipboard history"],
      assets: [],
    },
    rules: [],
    createdAt: "2026-11-04T00:00:00Z",
    updatedAt: "2026-11-07T10:00:00Z",
  },
  {
    id: "camp-06",
    title: "Linear — Mobile App 2.0 Launch",
    slug: "linear-mobile-launch",
    brandName: "Linear",
    brandCategory: "Project Management",
    summary: "Highlight the new ultra-fast Linear Mobile experience designed for product teams on the go.",
    description:
      "Linear Mobile brings the fluid, keyboard-driven precision of Linear to iOS and Android. Creators show triage, issue creation, and project status updates on mobile.",
    campaignType: "short_form_clipping",
    coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "upcoming",
    currency: "USD",
    totalBudget: 25000,
    allocatedBudget: 0,
    budgetVisibility: "public",
    rewardRate: 25.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["youtube_shorts", "tiktok"],
    applicationRequired: true,
    featured: false,
    startDate: "2026-11-20T00:00:00Z",
    endDate: "2026-12-10T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 0,
    approvedClips: 0,
    activeCreators: 0,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-linear-mobile",
    leaderboardEnabled: true,
    brief: {
      objective: "Showcase Linear Mobile's speed and gestures.",
      targetAudience: ["Product Managers", "Founders", "Engineers"],
      coreNarrative: "Linear in your pocket with zero compromise on craftsmanship.",
      talkingPoints: ["Offline sync", "Fluid gestures", "Instant notifications"],
      assets: [],
    },
    rules: [],
    createdAt: "2026-11-08T00:00:00Z",
    updatedAt: "2026-11-08T00:00:00Z",
  },
  {
    id: "camp-07",
    title: "Resend — React Email Architecture",
    slug: "resend-react-email",
    brandName: "Resend",
    brandCategory: "Developer Tools",
    summary: "Build transactional emails using modern React and Tailwind with Resend.",
    description:
      "Resend is the email platform for developers. Show how easily you can build clean, responsive HTML emails with React Email and send them via the Resend API.",
    campaignType: "developer_tools",
    coverImage: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "completed",
    currency: "USD",
    totalBudget: 20000,
    allocatedBudget: 20000,
    budgetVisibility: "public",
    rewardRate: 21.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["youtube_shorts", "tiktok"],
    applicationRequired: false,
    featured: false,
    startDate: "2026-10-10T00:00:00Z",
    endDate: "2026-10-31T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 952000,
    approvedClips: 44,
    activeCreators: 26,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-resend",
    leaderboardEnabled: true,
    brief: {
      objective: "Demonstrate developer delight when coding emails with React.",
      targetAudience: ["Next.js & React devs"],
      coreNarrative: "Stop writing table-based HTML from 1999. Use React Email.",
      talkingPoints: ["Component based", "TypeScript support", "Resend API sends in 100ms"],
      assets: [],
    },
    rules: [],
    createdAt: "2026-10-05T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
  },
];

export const initialLeaderboards: Record<string, LeaderboardEntry[]> = {
  "camp-01": [
    {
      id: "lb-1",
      campaignId: "camp-01",
      rank: 1,
      creatorName: "Alex Rivers",
      handle: "@alex_builds",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 148200,
      pendingViews: 12400,
      approvedPosts: 3,
      rewardEarned: 3260.4,
      isVerified: true,
      lastUpdated: "2026-11-11T12:00:00Z",
    },
    {
      id: "lb-2",
      campaignId: "camp-01",
      rank: 2,
      creatorName: "Maya Lin",
      handle: "@codewithmaya",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 112400,
      pendingViews: 8100,
      approvedPosts: 2,
      rewardEarned: 2472.8,
      isVerified: true,
      lastUpdated: "2026-11-11T11:30:00Z",
    },
    {
      id: "lb-3",
      campaignId: "camp-01",
      rank: 3,
      creatorName: "Kevin Vance",
      handle: "@dev_kevin",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 94800,
      pendingViews: 4500,
      approvedPosts: 2,
      rewardEarned: 2085.6,
      isVerified: true,
      lastUpdated: "2026-11-11T10:15:00Z",
    },
    {
      id: "lb-4",
      campaignId: "camp-01",
      rank: 4,
      creatorName: "Samira Patel",
      handle: "@tech_sam",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 68100,
      pendingViews: 3200,
      approvedPosts: 1,
      rewardEarned: 1498.2,
      isVerified: true,
      lastUpdated: "2026-11-11T09:40:00Z",
    },
    {
      id: "lb-5",
      campaignId: "camp-01",
      rank: 5,
      creatorName: "Chloe Evans",
      handle: "@syntax_queen",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 52900,
      pendingViews: 2100,
      approvedPosts: 1,
      rewardEarned: 1163.8,
      isVerified: true,
      lastUpdated: "2026-11-11T08:20:00Z",
    },
  ],
};

export const sampleCreators: CreatorProfile[] = [
  {
    id: "usr-01",
    name: "Alex Rivers",
    username: "alex_builds",
    email: "alex@creator.dev",
    bio: "Fullstack engineer building products in public. Sharing developer tools and workflows to 85k+ devs.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role: "creator",
    socialAccounts: [
      {
        id: "sa-1",
        platform: "tiktok",
        handle: "@alex_builds",
        profileUrl: "https://tiktok.com/@alex_builds",
        followers: 48500,
        status: "verified",
        verificationMethod: "oauth2",
        connectedAt: "2026-09-12T00:00:00Z",
      },
      {
        id: "sa-2",
        platform: "youtube_shorts",
        handle: "@alexriversdev",
        profileUrl: "https://youtube.com/@alexriversdev",
        followers: 32400,
        status: "verified",
        verificationMethod: "oauth2",
        connectedAt: "2026-09-15T00:00:00Z",
      },
      {
        id: "sa-3",
        platform: "x",
        handle: "@alex_rivers",
        profileUrl: "https://x.com/alex_rivers",
        followers: 12100,
        status: "unverified",
        verificationMethod: "manual_link",
        connectedAt: "2026-10-01T00:00:00Z",
      },
    ],
    portfolioLinks: ["https://alexrivers.dev", "https://github.com/alexrivers"],
    totalEarnings: 8420.5,
    totalVerifiedViews: 382400,
    isEmailVerified: true,
    isPublicProfile: true,
    createdAt: "2026-08-01T00:00:00Z",
  },
];

export const sampleAuditLogs: AdminAuditLog[] = [
  {
    id: "log-1",
    adminId: "admin-1",
    adminName: "Elena Rostova (Lead Ops)",
    action: "Updated Campaign Budget",
    targetEntity: "campaign",
    targetId: "camp-01",
    targetTitle: "Cursor AI — Next-Gen Code Editor Launch",
    timestamp: "2026-11-09T14:30:00Z",
    details: "Increased total pool allocation from $20,000 to $30,000 to cover viral YouTube Shorts volume.",
  },
  {
    id: "log-2",
    adminId: "admin-1",
    adminName: "Elena Rostova (Lead Ops)",
    action: "Verified Leaderboard Batch #14",
    targetEntity: "leaderboard",
    targetId: "camp-01",
    targetTitle: "Cursor AI — Next-Gen Code Editor Launch",
    timestamp: "2026-11-11T12:00:00Z",
    details: "Approved 148,200 views for @alex_builds after 48h fraud audit check passed.",
  },
  {
    id: "log-3",
    adminId: "admin-2",
    adminName: "Marcus Vance (Campaign Admin)",
    action: "Published New Campaign",
    targetEntity: "campaign",
    targetId: "camp-06",
    targetTitle: "Linear — Mobile App 2.0 Launch",
    timestamp: "2026-11-08T00:00:00Z",
    details: "Scheduled campaign launch for Nov 20 with $25,000 starting pool.",
  },
];

// In-memory data store for live sessions
let campaignsStore: Campaign[] = [...initialCampaigns];
let leaderboardsStore: Record<string, LeaderboardEntry[]> = { ...initialLeaderboards };
let auditLogsStore: AdminAuditLog[] = [...sampleAuditLogs];

export function getCampaigns(options?: {
  status?: string;
  platform?: string;
  campaignType?: string;
  search?: string;
  sortBy?: "newest" | "highest_rate" | "ending_soon";
}): Campaign[] {
  let results = [...campaignsStore];

  if (options?.status && options.status !== "all") {
    results = results.filter((c) => c.status === options.status);
  }

  if (options?.platform && options.platform !== "all") {
    results = results.filter((c) => c.platforms.includes(options.platform as any));
  }

  if (options?.campaignType && options.campaignType !== "all") {
    results = results.filter((c) => c.campaignType === options.campaignType);
  }

  if (options?.search && options.search.trim() !== "") {
    const q = options.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.brandName.toLowerCase().includes(q) ||
        c.brandCategory.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
    );
  }

  if (options?.sortBy) {
    if (options.sortBy === "highest_rate") {
      results.sort((a, b) => b.rewardRate - a.rewardRate);
    } else if (options.sortBy === "ending_soon") {
      results.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  return results;
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaignsStore.find((c) => c.slug === slug);
}

export function getFeaturedCampaigns(): Campaign[] {
  return campaignsStore
    .filter((c) => c.featured && c.status === "active")
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));
}

// Calculate platform stats purely from stored database records as required by §0 rule 4 and §6.3
export function calculatePlatformStats(): PlatformStats {
  const ongoing = campaignsStore.filter((c) => c.status === "active").length;
  const totalLaunched = campaignsStore.length;
  const totalVerifiedViews = campaignsStore.reduce((acc, c) => acc + (c.verifiedViews || 0), 0);
  const totalRewardsPaid = campaignsStore.reduce((acc, c) => acc + (c.allocatedBudget || 0), 0);
  const totalCreators = campaignsStore.reduce((acc, c) => acc + (c.activeCreators || 0), 0);

  return {
    ongoingCampaigns: ongoing,
    totalCampaignsLaunched: totalLaunched,
    totalVerifiedViews: totalVerifiedViews,
    totalRewardsPaid: totalRewardsPaid,
    activeCreators: totalCreators,
    lastCalculatedAt: new Date().toISOString(),
  };
}

export function getLeaderboard(campaignId: string): LeaderboardEntry[] {
  return leaderboardsStore[campaignId] || [];
}

export function getAllLeaderboards(): LeaderboardEntry[] {
  return Object.values(leaderboardsStore).flat().sort((a, b) => b.verifiedViews - a.verifiedViews);
}

export function getAuditLogs(): AdminAuditLog[] {
  return [...auditLogsStore].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function createCampaign(newCamp: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Campaign {
  const campaign: Campaign = {
    ...newCamp,
    id: `camp-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  campaignsStore.unshift(campaign);

  // Add audit log
  auditLogsStore.unshift({
    id: `log-${Date.now()}`,
    adminId: "admin-current",
    adminName: "Authorized Administrator",
    action: "Created Campaign",
    targetEntity: "campaign",
    targetId: campaign.id,
    targetTitle: campaign.title,
    timestamp: new Date().toISOString(),
    details: `Created campaign ${campaign.title} with rate $${campaign.rewardRate} and budget $${campaign.totalBudget}.`,
  });

  return campaign;
}

export function updateCampaignStatus(id: string, status: Campaign["status"]): boolean {
  const c = campaignsStore.find((x) => x.id === id);
  if (!c) return false;
  c.status = status;
  c.updatedAt = new Date().toISOString();

  auditLogsStore.unshift({
    id: `log-${Date.now()}`,
    adminId: "admin-current",
    adminName: "Authorized Administrator",
    action: `Updated Status to ${status}`,
    targetEntity: "campaign",
    targetId: c.id,
    targetTitle: c.title,
    timestamp: new Date().toISOString(),
    details: `Status changed to ${status}.`,
  });

  return true;
}

