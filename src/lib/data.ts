import { Campaign, LeaderboardEntry, CreatorProfile, AdminAuditLog, PlatformStats } from "@/types";

export const initialCampaigns: Campaign[] = [
  {
    id: "camp-weeknd",
    title: "The Weeknd",
    slug: "the-weeknd",
    brandName: "promote.fun",
    brandCategory: "Music & Entertainment",
    summary: 'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.',
    description:
      'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.\n\nRead the campaign rules before posting.',
    campaignType: "ugc",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "INR",
    totalBudget: 692153, // $7,777 converted at ₹89/$1
    allocatedBudget: 692153,
    budgetVisibility: "public",
    rewardRate: 178, // $2.00 converted at ₹89/$1
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["instagram", "tiktok"],
    applicationRequired: false,
    featured: true,
    featuredOrder: 1,
    startDate: "2026-11-13T00:00:00Z",
    endDate: "2026-12-15T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 4300000,
    payableViews: 3900000,
    approvedClips: 113,
    activeCreators: 84,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-the-weeknd",
    leaderboardEnabled: true,
    audio: "Hong Kong – The Weeknd",
    exchangeRate: 89,
    stats: {
      totalSubmissions: 192,
      approvedSubmissions: 113,
      pendingSubmissions: 0,
      deniedSubmissions: 79,
      totalViews: 4300000,
      payableViews: 3900000,
      totalBudget: 692153,
      paidAmount: 692153,
      remainingBudget: 0,
    },
    brief: {
      objective: 'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.',
      targetAudience: ["Meme creators", "Music enthusiasts", "Entertainment editors", "TikTok & Reels creators"],
      coreNarrative:
        'Craft creative, shareable memes utilizing the "Hong Kong" track by The Weeknd paired with the official video assets.',
      talkingPoints: [
        'Use the official "Hong Kong" audio track by The Weeknd',
        'Incorporate the provided music video clips into high-energy memes',
        'Review and adhere to all campaign rules prior to posting',
      ],
      audio: "Hong Kong – The Weeknd",
      assets: [
        {
          id: "asset-w1",
          title: "The Weeknd — Hong Kong Official Audio Track (.MP3)",
          type: "audio_asset",
          sizeText: "8.4 MB",
          url: "#",
        },
        {
          id: "asset-w2",
          title: "Music Video Clip Stems & 4K B-Roll (.MP4)",
          type: "b_roll",
          sizeText: "1.2 GB",
          url: "#",
        },
        {
          id: "asset-w3",
          title: "promote.fun Creator Guidelines (.PDF)",
          type: "guidelines",
          sizeText: "1.1 MB",
          url: "#",
        },
      ],
    },
    rules: [
      {
        id: "rw-1",
        category: "format",
        title: "Accepted Video Formats & Audio",
        detail: 'Vertical short-form video (Instagram Reels and TikTok). Must use official "Hong Kong" audio by The Weeknd.',
      },
      {
        id: "rw-2",
        category: "hashtag",
        title: "Required Audio & Hashtags",
        detail: 'Post memes with "Hong Kong" audio. Include #TheWeeknd #HongKong in the caption.',
      },
      {
        id: "rw-3",
        category: "eligibility",
        title: "Creator Eligibility",
        detail: "Open to short-form meme, music curation, and pop culture pages on Instagram and TikTok.",
      },
      {
        id: "rw-4",
        category: "prohibited",
        title: "Prohibited Content",
        detail: "No low-effort slideshows, no reposts of existing creator memes without transformation, and no non-organic or bot views.",
      },
      {
        id: "rw-5",
        category: "verification",
        title: "48-Hour Fraud Audit & Verification",
        detail: "Views are verified 48 hours post-publication via Collabefy fraud detection. Payout calculated on payable views at ₹178 per 1k views.",
      },
    ],
    createdAt: "2026-11-13T00:00:00Z",
    updatedAt: "2026-11-17T00:00:00Z",
  },
  {
    id: "camp-blake-g",
    title: "Blake G – Audio",
    slug: "blake-g-audio",
    brandName: "promote.fun",
    brandCategory: "TV & Film Edits",
    summary: 'Post the approved content formats using the "Lift You Up" audio.',
    description: 'Post the approved content formats using the "Lift You Up" audio.',
    campaignType: "short_form_clipping",
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "INR",
    totalBudget: 267000, // $3,000 converted at ₹89/$1
    allocatedBudget: 267000,
    budgetVisibility: "public",
    rewardRate: 44.5, // $0.50 converted at ₹89/$1
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["instagram"],
    applicationRequired: false,
    featured: true,
    featuredOrder: 2,
    startDate: "2026-11-11T00:00:00Z",
    endDate: "2026-12-11T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 6000000,
    payableViews: 6000000,
    approvedClips: 106,
    activeCreators: 62,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-blake-g",
    leaderboardEnabled: true,
    audio: "Lift You Up",
    exchangeRate: 89,
    stats: {
      totalSubmissions: 118,
      approvedSubmissions: 106,
      pendingSubmissions: 1,
      deniedSubmissions: 11,
      totalViews: 6000000,
      payableViews: 6000000,
      totalBudget: 267000,
      paidAmount: 267000,
      remainingBudget: 0,
    },
    brief: {
      objective: 'Post approved content formats using the "Lift You Up" audio track.',
      targetAudience: ["Film editors", "TV scene curators", "Cinematic edit creators", "Instagram Reels editors"],
      coreNarrative:
        'Deliver compelling TV/Film edits and cinematic clips synced with the "Lift You Up" audio by Blake G.',
      talkingPoints: [
        'Post approved content formats: TV/Film Edits or TV/Film Clips',
        'NO overly sexual clips/edits',
        'You can play dialogue at the start of your edit before making the song louder',
        'Do not have the song too quiet with audio over the top',
      ],
      audio: "Lift You Up",
      approvedFormats: ["TV/Film Edits", "TV/Film Clips"],
      additionalRules: [
        "NO overly sexual clips/edits.",
        "You can play dialogue at the start of your edit before making the song louder.",
        "Do not have the song too quiet with audio over the top.",
      ],
      assets: [
        {
          id: "asset-bg-1",
          title: "Blake G — Lift You Up Official Master Audio (.WAV)",
          type: "audio_asset",
          sizeText: "32.1 MB",
          url: "#",
        },
        {
          id: "asset-bg-2",
          title: "Editing Masterclass & Format Guide (.PDF)",
          type: "guidelines",
          sizeText: "2.4 MB",
          url: "#",
        },
      ],
    },
    rules: [
      {
        id: "rbg-1",
        category: "format",
        title: "Approved Content Formats",
        detail: "TV/Film Edits and TV/Film Clips only. Must use the official 'Lift You Up' audio track.",
      },
      {
        id: "rbg-2",
        category: "format",
        title: "Audio Mixing Rules",
        detail: "You can play dialogue at the start of your edit before making the song louder. Do not have the song too quiet with audio over the top.",
      },
      {
        id: "rbg-3",
        category: "prohibited",
        title: "Content Safety Restrictions",
        detail: "NO overly sexual clips/edits. Submissions containing prohibited scenes will be denied immediately.",
      },
      {
        id: "rbg-4",
        category: "eligibility",
        title: "Platform Acceptance",
        detail: "Instagram Reels only. Submissions must originate from public Instagram creator accounts.",
      },
      {
        id: "rbg-5",
        category: "verification",
        title: "Verification & Payout",
        detail: "Rate: ₹44.50 per 1k payable views. 100% of the ₹2,67,000 budget is distributed upon audit approval.",
      },
    ],
    createdAt: "2026-11-11T00:00:00Z",
    updatedAt: "2026-11-17T00:00:00Z",
  },
  {
    id: "camp-fifa-content",
    title: "FIFA Content",
    slug: "fifa-content",
    brandName: "promote.fun",
    brandCategory: "Gaming & Sports",
    summary: "FIFA 27 is one of the most anticipated sports game releases of the year. Create clips for FC Head2Head: Bellingham vs Hamilton.",
    description:
      "FIFA 27 is one of the most anticipated sports game releases of the year.\n\nFC Head2Head is a long-form YouTube series from EA SPORTS FC where two stars face off in FC 27. This episode pits Jude Bellingham against Lewis Hamilton.",
    campaignType: "short_form_clipping",
    coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=200&q=80",
    status: "active",
    currency: "INR",
    totalBudget: 284800, // $3,200 converted at ₹89/$1
    allocatedBudget: 0,
    budgetVisibility: "public",
    rewardRate: 155.75, // $1.75 converted at ₹89/$1
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["instagram", "tiktok", "youtube_shorts"],
    applicationRequired: false,
    featured: true,
    featuredOrder: 3,
    startDate: "2026-11-17T00:00:00Z",
    endDate: "2026-12-17T23:59:59Z",
    timeZone: "UTC",
    verifiedViews: 0,
    payableViews: 0,
    approvedClips: 0,
    activeCreators: 0,
    discordInviteUrl: "https://discord.gg/QmGayUXXD",
    discordChannelName: "#campaign-fifa-content",
    leaderboardEnabled: true,
    exchangeRate: 89,
    stats: {
      totalSubmissions: 0,
      approvedSubmissions: 0,
      pendingSubmissions: 0,
      deniedSubmissions: 0,
      totalViews: 0,
      payableViews: 0,
      totalBudget: 284800,
      paidAmount: 0,
      remainingBudget: 284800,
    },
    brief: {
      objective:
        "FIFA 27 is one of the most anticipated sports game releases of the year. Promote FC Head2Head: Jude Bellingham against Lewis Hamilton.",
      targetAudience: ["Soccer fans", "Sports enthusiasts", "Gaming creators", "Meme & theme pages"],
      coreNarrative:
        "FC Head2Head is a long-form YouTube series from EA SPORTS FC where two stars face off in FC 27. This episode pits Jude Bellingham against Lewis Hamilton.",
      talkingPoints: [
        "Use meme format for your on-screen text so it feels like something your followers would share, not something that looks like a promotion.",
        "Be creative and use a header on your videos that drives engagement.",
        "Use the EA logo on your clip. Make sure it is visible throughout the whole clip. The watermark must be visible in full form, without cropping or background removal.",
      ],
      approvedNiches: ["Soccer pages", "General Sports Pages", "Gaming Pages", "Meme/Theme Pages"],
      contentGuidelines: [
        "Use meme format for your on-screen text so it feels like something your followers would share, not something that looks like a promotion.",
        "Be creative and use a header on your videos that drives engagement.",
        "Use the EA logo on your clip. Make sure it is visible throughout the whole clip. The watermark must be visible in full form, without cropping or background removal.",
      ],
      captionRules: [
        "Caption must include #EASportsFCPartner.",
        "Tag @easportsfc in every post.",
        "If you have promoted gambling within your last 12 posts, you will not be accepted into this campaign.",
      ],
      namingConventions: [
        'Series: "FC Head2Head"',
        'Franchise: "FC" or "EA SPORTS FC"',
        'Title: "FC 27" or "EA SPORTS FC 27"',
      ],
      assets: [
        {
          id: "asset-fifa-1",
          title: "EA SPORTS FC 27 Official Vector Watermark (.SVG / .PNG)",
          type: "vector_logo",
          sizeText: "2.8 MB",
          url: "#",
        },
        {
          id: "asset-fifa-2",
          title: "FC Head2Head: Bellingham vs Hamilton Master Video Stems (.MP4)",
          type: "b_roll",
          sizeText: "3.4 GB",
          url: "#",
        },
        {
          id: "asset-fifa-3",
          title: "EA Brand Stylebook & Approved Naming Guide (.PDF)",
          type: "guidelines",
          sizeText: "1.9 MB",
          url: "#",
        },
      ],
    },
    rules: [
      {
        id: "rfifa-1",
        category: "format",
        title: "Content & Header Guidelines",
        detail:
          "Use meme format for your on-screen text so it feels like something your followers would share, not a promo. Be creative with an engagement-driving header.",
      },
      {
        id: "rfifa-2",
        category: "format",
        title: "EA Watermark Requirement",
        detail:
          "Use the EA logo on your clip. Make sure it is visible throughout the whole clip. The watermark must be visible in full form, without cropping or background removal.",
      },
      {
        id: "rfifa-3",
        category: "hashtag",
        title: "Required Caption & Tags",
        detail: "Caption must include #EASportsFCPartner and tag @easportsfc in every post.",
      },
      {
        id: "rfifa-4",
        category: "prohibited",
        title: "Gambling Promotion Prohibition",
        detail: "If you have promoted gambling within your last 12 posts, you will not be accepted into this campaign.",
      },
      {
        id: "rfifa-5",
        category: "eligibility",
        title: "Approved Naming Rules",
        detail:
          'When writing about the series, franchise, or title, use only these options: Series: "FC Head2Head" | Franchise: "FC" or "EA SPORTS FC" | Title: "FC 27" or "EA SPORTS FC 27".',
      },
      {
        id: "rfifa-6",
        category: "verification",
        title: "View Verification & Rate",
        detail:
          "Rate: ₹155.75 per 1,000 verified views. Escrow pool of ₹2,84,800 is active. Views are verified post-48h fraud audit.",
      },
    ],
    createdAt: "2026-11-17T00:00:00Z",
    updatedAt: "2026-11-17T00:00:00Z",
  },
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
    currency: "INR",
    totalBudget: 2670000,
    allocatedBudget: 1263800,
    budgetVisibility: "public",
    rewardRate: 1958.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["tiktok", "youtube_shorts", "instagram_reels"],
    applicationRequired: false,
    featured: false,
    featuredOrder: 4,
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
        title: "Additional ₹8,90,000 Pool Allocation for YouTube Shorts",
        body: "Due to high viewer engagement on YouTube Shorts, an additional ₹8,90,000 budget has been added to the pool.",
        date: "2026-11-09T14:30:00Z",
      },
      {
        id: "up-2",
        title: "Campaign Launched",
        body: "Cursor AI launch campaign officially opened with ₹17,80,000 initial reward pool.",
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
    currency: "INR",
    totalBudget: 3115000,
    allocatedBudget: 2527600,
    budgetVisibility: "public",
    rewardRate: 1646.5,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["youtube_shorts", "instagram_reels", "tiktok"],
    applicationRequired: false,
    featured: false,
    featuredOrder: 5,
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
    currency: "INR",
    totalBudget: 1780000,
    allocatedBudget: 792100,
    budgetVisibility: "public",
    rewardRate: 2314.0,
    rewardUnit: "per_1000_views",
    rewardVisibility: "public",
    platforms: ["tiktok", "instagram_reels"],
    applicationRequired: false,
    featured: false,
    featuredOrder: 6,
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
    currency: "INR",
    totalBudget: 2225000,
    allocatedBudget: 996800,
    budgetVisibility: "public",
    rewardRate: 2136.0,
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
    currency: "INR",
    totalBudget: 1602000,
    allocatedBudget: 836600,
    budgetVisibility: "public",
    rewardRate: 1780.0,
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
    currency: "INR",
    totalBudget: 2225000,
    allocatedBudget: 0,
    budgetVisibility: "public",
    rewardRate: 2225.0,
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
    currency: "INR",
    totalBudget: 1780000,
    allocatedBudget: 1780000,
    budgetVisibility: "public",
    rewardRate: 1869.0,
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
  "camp-weeknd": [
    {
      id: "lb-w1",
      campaignId: "camp-weeknd",
      rank: 1,
      creatorName: "Synth Wave Edits",
      handle: "@synthwave_edits",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 820000,
      pendingViews: 45000,
      approvedPosts: 6,
      rewardEarned: 145960,
      isVerified: true,
      lastUpdated: "2026-11-16T18:00:00Z",
    },
    {
      id: "lb-w2",
      campaignId: "camp-weeknd",
      rank: 2,
      creatorName: "Abel Vibe Vault",
      handle: "@abel_vibe",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 640000,
      pendingViews: 30000,
      approvedPosts: 4,
      rewardEarned: 113920,
      isVerified: true,
      lastUpdated: "2026-11-16T17:30:00Z",
    },
    {
      id: "lb-w3",
      campaignId: "camp-weeknd",
      rank: 3,
      creatorName: "Night Drive Media",
      handle: "@nightdrive.mp4",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 510000,
      pendingViews: 22000,
      approvedPosts: 3,
      rewardEarned: 90780,
      isVerified: true,
      lastUpdated: "2026-11-16T16:15:00Z",
    },
    {
      id: "lb-w4",
      campaignId: "camp-weeknd",
      rank: 4,
      creatorName: "Reels Viral Vault",
      handle: "@reels_vault",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 380000,
      pendingViews: 14000,
      approvedPosts: 2,
      rewardEarned: 67640,
      isVerified: true,
      lastUpdated: "2026-11-16T15:40:00Z",
    },
    {
      id: "lb-w5",
      campaignId: "camp-weeknd",
      rank: 5,
      creatorName: "Retro Pop Cuts",
      handle: "@retro_cuts",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 290000,
      pendingViews: 11000,
      approvedPosts: 2,
      rewardEarned: 51620,
      isVerified: true,
      lastUpdated: "2026-11-16T14:20:00Z",
    },
  ],
  "camp-blake-g": [
    {
      id: "lb-bg1",
      campaignId: "camp-blake-g",
      rank: 1,
      creatorName: "Cinema Edits HQ",
      handle: "@cinema_edits_hq",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 1200000,
      pendingViews: 50000,
      approvedPosts: 8,
      rewardEarned: 53400,
      isVerified: true,
      lastUpdated: "2026-11-16T19:00:00Z",
    },
    {
      id: "lb-bg2",
      campaignId: "camp-blake-g",
      rank: 2,
      creatorName: "Film Cuts Vibe",
      handle: "@filmcutsvibe",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 950000,
      pendingViews: 35000,
      approvedPosts: 5,
      rewardEarned: 42275,
      isVerified: true,
      lastUpdated: "2026-11-16T18:15:00Z",
    },
    {
      id: "lb-bg3",
      campaignId: "camp-blake-g",
      rank: 3,
      creatorName: "Movie Clips Daily",
      handle: "@movie_clips_daily",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 780000,
      pendingViews: 25000,
      approvedPosts: 4,
      rewardEarned: 34710,
      isVerified: true,
      lastUpdated: "2026-11-16T17:45:00Z",
    },
    {
      id: "lb-bg4",
      campaignId: "camp-blake-g",
      rank: 4,
      creatorName: "Aesthetic Reel Cuts",
      handle: "@aesthetic.edits",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 610000,
      pendingViews: 18000,
      approvedPosts: 3,
      rewardEarned: 27145,
      isVerified: true,
      lastUpdated: "2026-11-16T16:20:00Z",
    },
    {
      id: "lb-bg5",
      campaignId: "camp-blake-g",
      rank: 5,
      creatorName: "Hollywood Scenes",
      handle: "@hollywood_scenes",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80",
      verifiedViews: 490000,
      pendingViews: 12000,
      approvedPosts: 2,
      rewardEarned: 21805,
      isVerified: true,
      lastUpdated: "2026-11-16T15:00:00Z",
    },
  ],
  "camp-fifa-content": [],
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
    details: "Increased total pool allocation from ₹17,80,000 to ₹26,70,000 to cover viral YouTube Shorts volume.",
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
    details: "Scheduled campaign launch for Nov 20 with ₹22,25,000 starting pool.",
  },
];

export const sampleCreatorActivities: import("@/types").CreatorActivityItem[] = [
  {
    id: "act-1",
    creatorName: "Alex Rivers",
    creatorHandle: "@alex_builds",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    platform: "tiktok",
    campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
    campaignSlug: "cursor-ai-launch",
    brandName: "Cursor",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    verifiedViews: 148200,
    rewardEarned: 3260.4,
    status: "paid",
    publishedAt: "2 days ago",
  },
  {
    id: "act-2",
    creatorName: "Maya Lin",
    creatorHandle: "@codewithmaya",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    platform: "youtube_shorts",
    campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
    campaignSlug: "cursor-ai-launch",
    brandName: "Cursor",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    verifiedViews: 112400,
    rewardEarned: 2472.8,
    status: "verified",
    publishedAt: "3 days ago",
  },
  {
    id: "act-3",
    creatorName: "Kevin Vance",
    creatorHandle: "@dev_kevin",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    platform: "instagram_reels",
    campaignTitle: "Perplexity AI — Deep Research Mode",
    campaignSlug: "perplexity-deep-research",
    brandName: "Perplexity",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    verifiedViews: 94800,
    rewardEarned: 2085.6,
    status: "paid",
    publishedAt: "5 days ago",
  },
  {
    id: "act-4",
    creatorName: "Samira Patel",
    creatorHandle: "@tech_sam",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    platform: "tiktok",
    campaignTitle: "Arc Browser — Windows Release & Spaces",
    campaignSlug: "arc-browser-windows",
    brandName: "The Browser Company",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    verifiedViews: 68100,
    rewardEarned: 1498.2,
    status: "verified",
    publishedAt: "6 days ago",
  },
];

export function getCreatorActivities(): import("@/types").CreatorActivityItem[] {
  return sampleCreatorActivities;
}

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
  if (leaderboardsStore[campaignId]) return leaderboardsStore[campaignId];
  const c = campaignsStore.find((x) => x.slug === campaignId || x.id === campaignId);
  if (c && leaderboardsStore[c.id]) return leaderboardsStore[c.id];
  return [];
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
    details: `Created campaign ${campaign.title} with rate ₹${campaign.rewardRate} and budget ₹${campaign.totalBudget}.`,
  });

  return campaign;
}

export function updateCampaignStatus(id: string, status: Campaign["status"]): boolean {
  const c = campaignsStore.find((x) => x.id === id || x.slug === id);
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

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const index = campaignsStore.findIndex((x) => x.id === id || x.slug === id);
  if (index === -1) return null;

  const prev = campaignsStore[index];
  const updated: Campaign = {
    ...prev,
    ...updates,
    brief: {
      ...prev.brief,
      ...(updates.brief || {}),
    },
    stats: {
      ...prev.stats,
      ...(updates.stats || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  campaignsStore[index] = updated;

  auditLogsStore.unshift({
    id: `log-${Date.now()}`,
    adminId: "admin-current",
    adminName: "Authorized Administrator",
    action: "Updated Campaign",
    targetEntity: "campaign",
    targetId: updated.id,
    targetTitle: updated.title,
    timestamp: new Date().toISOString(),
    details: `Updated campaign ${updated.title} details.`,
  });

  return updated;
}

export function deleteCampaign(id: string): boolean {
  const index = campaignsStore.findIndex((x) => x.id === id || x.slug === id);
  if (index === -1) return false;

  const removed = campaignsStore[index];
  campaignsStore.splice(index, 1);

  delete leaderboardsStore[removed.id];
  delete leaderboardsStore[removed.slug];

  auditLogsStore.unshift({
    id: `log-${Date.now()}`,
    adminId: "admin-current",
    adminName: "Authorized Administrator",
    action: "Deleted Campaign",
    targetEntity: "campaign",
    targetId: removed.id,
    targetTitle: removed.title,
    timestamp: new Date().toISOString(),
    details: `Permanently deleted campaign ${removed.title}.`,
  });

  return true;
}

