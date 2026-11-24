import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Collabefy Production Database...");

  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_ID || "admin@collabefy.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "CollabefyAdmin2026!";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
  const managerPasswordHash = await bcrypt.hash("CollabefyManager2026!", 12);
  const creatorPasswordHash = await bcrypt.hash("CreatorPass2026!", 12);
  const brandPasswordHash = await bcrypt.hash("BrandPass2026!", 12);

  // 1. Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      isEmailVerified: true,
      adminProfile: {
        create: {
          department: "Executive Management",
          permissions: JSON.stringify(["*"]),
        },
      },
    },
  });
  console.log("✔ Created Super Admin:", superAdmin.email);

  // 2. Campaign Manager
  const campaignManager = await prisma.user.upsert({
    where: { email: "campaigns@collabefy.com" },
    update: {},
    create: {
      email: "campaigns@collabefy.com",
      passwordHash: managerPasswordHash,
      role: "CAMPAIGN_MANAGER",
      status: "ACTIVE",
      isEmailVerified: true,
      adminProfile: {
        create: {
          department: "Campaign Operations",
          permissions: JSON.stringify(["campaigns:read", "campaigns:write", "submissions:review"]),
        },
      },
    },
  });

  // 3. Finance Manager
  const financeManager = await prisma.user.upsert({
    where: { email: "finance@collabefy.com" },
    update: {},
    create: {
      email: "finance@collabefy.com",
      passwordHash: managerPasswordHash,
      role: "FINANCE_MANAGER",
      status: "ACTIVE",
      isEmailVerified: true,
      adminProfile: {
        create: {
          department: "Financial Operations",
          permissions: JSON.stringify(["finance:read", "withdrawals:review", "ledger:read"]),
        },
      },
    },
  });

  // 4. Support Manager
  const supportManager = await prisma.user.upsert({
    where: { email: "support@collabefy.com" },
    update: {},
    create: {
      email: "support@collabefy.com",
      passwordHash: managerPasswordHash,
      role: "SUPPORT_MANAGER",
      status: "ACTIVE",
      isEmailVerified: true,
      adminProfile: {
        create: {
          department: "Customer Experience",
          permissions: JSON.stringify(["support:read", "support:write"]),
        },
      },
    },
  });

  // 5. Brands
  const cursorBrandUser = await prisma.user.upsert({
    where: { email: "brand@cursor.sh" },
    update: {},
    create: {
      email: "brand@cursor.sh",
      passwordHash: brandPasswordHash,
      role: "BRAND",
      status: "ACTIVE",
      isEmailVerified: true,
      brandProfile: {
        create: {
          companyName: "Cursor",
          industry: "Developer Tools & AI",
          website: "https://cursor.com",
          logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
          isVerified: true,
          totalSpent: 30000,
        },
      },
    },
  });

  const arcBrandUser = await prisma.user.upsert({
    where: { email: "brand@arc.net" },
    update: {},
    create: {
      email: "brand@arc.net",
      passwordHash: brandPasswordHash,
      role: "BRAND",
      status: "ACTIVE",
      isEmailVerified: true,
      brandProfile: {
        create: {
          companyName: "The Browser Company",
          industry: "Productivity & Software",
          website: "https://arc.net",
          logoUrl: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=200&q=80",
          isVerified: true,
          totalSpent: 35000,
        },
      },
    },
  });

  const perplexityBrandUser = await prisma.user.upsert({
    where: { email: "brand@perplexity.ai" },
    update: {},
    create: {
      email: "brand@perplexity.ai",
      passwordHash: brandPasswordHash,
      role: "BRAND",
      status: "ACTIVE",
      isEmailVerified: true,
      brandProfile: {
        create: {
          companyName: "Perplexity AI",
          industry: "AI & Search",
          website: "https://perplexity.ai",
          logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
          isVerified: true,
          totalSpent: 20000,
        },
      },
    },
  });

  // 6. Creators
  const alexUser = await prisma.user.upsert({
    where: { email: "alex@creators.xyz" },
    update: {
      role: "CREATOR",
      status: "ACTIVE",
      creatorProfile: {
        upsert: {
          create: {
            displayName: "Alex Rivera",
            handle: "alexrivera",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            bio: "Senior engineer sharing modern web dev frameworks & AI tooling.",
            totalEarnings: 8420.5,
            totalViews: 382000,
            walletAddress: "0x71C...49b2",
            stripeAccountId: "acct_1Nv8B3...",
            isVerified: true,
            socialAccounts: JSON.stringify([
              { platform: "TikTok", handle: "@alexrivera_dev", followers: 84200 },
              { platform: "YouTube", handle: "@AlexRiveraTech", followers: 42100 },
            ]),
          },
          update: {
            displayName: "Alex Rivera",
            handle: "alexrivera",
            totalEarnings: 8420.5,
            totalViews: 382000,
            isVerified: true,
          },
        },
      },
    },
    create: {
      email: "alex@creators.xyz",
      passwordHash: creatorPasswordHash,
      role: "CREATOR",
      status: "ACTIVE",
      isEmailVerified: true,
      creatorProfile: {
        create: {
          displayName: "Alex Rivera",
          handle: "alexrivera",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          bio: "Senior engineer sharing modern web dev frameworks & AI tooling.",
          totalEarnings: 8420.5,
          totalViews: 382000,
          walletAddress: "0x71C...49b2",
          stripeAccountId: "acct_1Nv8B3...",
          isVerified: true,
          socialAccounts: JSON.stringify([
            { platform: "TikTok", handle: "@alexrivera_dev", followers: 84200 },
            { platform: "YouTube", handle: "@AlexRiveraTech", followers: 42100 },
          ]),
        },
      },
    },
  });

  const sarahUser = await prisma.user.upsert({
    where: { email: "sarah@creators.xyz" },
    update: {
      role: "CREATOR",
      status: "ACTIVE",
      creatorProfile: {
        upsert: {
          create: {
            displayName: "Sarah Chen",
            handle: "sarahc_tech",
            avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
            bio: "Productivity designer & software engineer. Building the future of workflows.",
            totalEarnings: 6140.0,
            totalViews: 289000,
            isVerified: true,
            socialAccounts: JSON.stringify([
              { platform: "Instagram", handle: "@sarah.designs", followers: 91400 },
              { platform: "TikTok", handle: "@sarahc_tech", followers: 64000 },
            ]),
          },
          update: {
            displayName: "Sarah Chen",
            handle: "sarahc_tech",
            totalEarnings: 6140.0,
            totalViews: 289000,
            isVerified: true,
          },
        },
      },
    },
    create: {
      email: "sarah@creators.xyz",
      passwordHash: creatorPasswordHash,
      role: "CREATOR",
      status: "ACTIVE",
      isEmailVerified: true,
      creatorProfile: {
        create: {
          displayName: "Sarah Chen",
          handle: "sarahc_tech",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
          bio: "Productivity designer & software engineer. Building the future of workflows.",
          totalEarnings: 6140.0,
          totalViews: 289000,
          isVerified: true,
          socialAccounts: JSON.stringify([
            { platform: "Instagram", handle: "@sarah.designs", followers: 91400 },
            { platform: "TikTok", handle: "@sarahc_tech", followers: 64000 },
          ]),
        },
      },
    },
  });

  const promoteBrandUser = await prisma.user.upsert({
    where: { email: "team@promote.fun" },
    update: {},
    create: {
      email: "team@promote.fun",
      passwordHash: brandPasswordHash,
      role: "BRAND",
      status: "ACTIVE",
      isEmailVerified: true,
      brandProfile: {
        create: {
          companyName: "promote.fun",
          logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
          industry: "Music, Film & Entertainment Marketing",
          isVerified: true,
          totalSpent: 959153,
        },
      },
    },
  });

  // 7. Seed Real Campaigns
  const campaignsData = [
    {
      title: "The Weeknd",
      slug: "the-weeknd",
      brandId: promoteBrandUser.id,
      brandName: "promote.fun",
      brandLogoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
      summary: 'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.',
      description:
        'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.\n\nRead the campaign rules before posting.',
      category: "Music & Entertainment",
      tags: JSON.stringify(["The Weeknd", "Music", "Meme", "Instagram", "TikTok"]),
      totalBudget: 692153,
      allocatedBudget: 692153,
      rewardRateCpm: 178.0,
      rewardUnit: "per_1000_views",
      status: "ACTIVE" as const,
      startDate: new Date("2026-11-13T00:00:00Z"),
      endDate: new Date("2026-12-15T23:59:59Z"),
      platforms: JSON.stringify(["Instagram", "TikTok"]),
      formats: JSON.stringify(["9:16 vertical short-form"]),
      minFollowers: 1000,
      featured: true,
      featuredOrder: 1,
      discordChannel: "#campaign-the-weeknd",
      brief: JSON.stringify({
        objective: 'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.',
        audio: "Hong Kong – The Weeknd",
        targetAudience: ["Meme creators", "Music editors", "TikTok & Reels curators"],
        coreNarrative: 'Craft viral memes utilizing "Hong Kong" by The Weeknd synced to video stems.',
        talkingPoints: [
          'Use the official "Hong Kong" audio track by The Weeknd',
          'Incorporate the provided music video clips into high-energy memes',
          'Review and adhere to all campaign rules prior to posting',
        ],
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
      }),
      rules: JSON.stringify([
        "Vertical short-form video only (Instagram Reels, TikTok).",
        'Must use the official "Hong Kong" audio by The Weeknd.',
        "No low-effort slideshows or stolen content without original edits.",
        "48-hour automated view audit filters non-organic bot traffic.",
        "Payout rate: ₹178 per 1,000 payable verified views.",
      ]),
    },
    {
      title: "Blake G – Audio",
      slug: "blake-g-audio",
      brandId: promoteBrandUser.id,
      brandName: "promote.fun",
      brandLogoUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
      summary: 'Post the approved content formats using the "Lift You Up" audio.',
      description: 'Post the approved content formats using the "Lift You Up" audio.',
      category: "TV & Film Edits",
      tags: JSON.stringify(["Blake G", "TV Edits", "Film Clips", "Instagram"]),
      totalBudget: 267000,
      allocatedBudget: 267000,
      rewardRateCpm: 44.5,
      rewardUnit: "per_1000_views",
      status: "ACTIVE" as const,
      startDate: new Date("2026-11-11T00:00:00Z"),
      endDate: new Date("2026-12-11T23:59:59Z"),
      platforms: JSON.stringify(["Instagram"]),
      formats: JSON.stringify(["TV/Film Edits", "TV/Film Clips"]),
      minFollowers: 1500,
      featured: true,
      featuredOrder: 2,
      discordChannel: "#campaign-blake-g",
      brief: JSON.stringify({
        objective: 'Post approved content formats using the "Lift You Up" audio track.',
        audio: "Lift You Up",
        targetAudience: ["Film editors", "TV scene curators", "Cinematic edit creators"],
        coreNarrative: 'Deliver compelling TV/Film edits synced with "Lift You Up" by Blake G.',
        approvedFormats: ["TV/Film Edits", "TV/Film Clips"],
        additionalRules: [
          "NO overly sexual clips/edits.",
          "You can play dialogue at the start of your edit before making the song louder.",
          "Do not have the song too quiet with audio over the top.",
        ],
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
      }),
      rules: JSON.stringify([
        "Approved formats: TV/Film Edits and TV/Film Clips only.",
        "NO overly sexual clips/edits.",
        "You can play dialogue at the start of your edit before making the song louder.",
        "Do not have the song too quiet with audio over the top.",
        "Instagram Reels only.",
      ]),
    },
    {
      title: "FIFA Content",
      slug: "fifa-content",
      brandId: promoteBrandUser.id,
      brandName: "promote.fun",
      brandLogoUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
      summary: "FIFA 27 is one of the most anticipated sports game releases of the year. Create clips for FC Head2Head: Bellingham vs Hamilton.",
      description:
        "FIFA 27 is one of the most anticipated sports game releases of the year.\n\nFC Head2Head is a long-form YouTube series from EA SPORTS FC where two stars face off in FC 27. This episode pits Jude Bellingham against Lewis Hamilton.",
      category: "Gaming & Sports",
      tags: JSON.stringify(["FIFA 27", "EA SPORTS FC", "Jude Bellingham", "Lewis Hamilton", "Gaming"]),
      totalBudget: 284800,
      allocatedBudget: 0,
      rewardRateCpm: 155.75,
      rewardUnit: "per_1000_views",
      status: "ACTIVE" as const,
      startDate: new Date("2026-11-17T00:00:00Z"),
      endDate: new Date("2026-12-17T23:59:59Z"),
      platforms: JSON.stringify(["Instagram", "TikTok", "YouTube Shorts"]),
      formats: JSON.stringify(["9:16 vertical"]),
      minFollowers: 2000,
      featured: true,
      featuredOrder: 3,
      discordChannel: "#campaign-fifa-content",
      brief: JSON.stringify({
        objective: "Promote FC Head2Head: Jude Bellingham vs Lewis Hamilton in FC 27.",
        targetAudience: ["Soccer pages", "General Sports Pages", "Gaming Pages", "Meme/Theme Pages"],
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
      }),
      rules: JSON.stringify([
        "Use meme format for on-screen text.",
        "Be creative with an engagement header.",
        "EA watermark logo must be visible throughout full clip without cropping.",
        "Must include #EASportsFCPartner and tag @easportsfc.",
        "No gambling promotion in your last 12 posts.",
        'Permitted naming: Series: "FC Head2Head" | Franchise: "FC" or "EA SPORTS FC" | Title: "FC 27" or "EA SPORTS FC 27".',
      ]),
    },
    {
      title: "Cursor AI — Next-Gen Code Editor Launch",
      slug: "cursor-ai-launch",
      brandId: cursorBrandUser.id,
      brandName: "Cursor",
      brandLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
      summary: "Showcase Cursor Composer and AI pair-programming features in real coding workflows.",
      description: "Cursor is the AI-first code editor built for engineer velocity. This campaign invites developers and tech creators to demonstrate solving real bugs, refactoring systems, and building interactive web features in seconds using Cursor Composer.",
      category: "Developer Tools & AI",
      tags: JSON.stringify(["AI", "Coding", "Developer Tools", "Next.js"]),
      totalBudget: 30000,
      allocatedBudget: 14200,
      rewardRateCpm: 22.0,
      status: "ACTIVE",
      featured: true,
      featuredOrder: 1,
      platforms: JSON.stringify(["TikTok", "YouTube Shorts", "Instagram Reels"]),
      formats: JSON.stringify(["9:16 vertical (30s-90s)"]),
      minFollowers: 5000,
      discordChannel: "#campaign-cursor-ai",
      brief: JSON.stringify({
        objective: "Demonstrate developer speed with Cursor Composer and real-world multi-file editing.",
        coreNarrative: "Walk through solving a non-trivial code issue or building an interactive feature in seconds using Cursor Composer. Show the actual diff and result without fake edits.",
        talkingPoints: [
          "Natural language prompt to full diff in 2 seconds",
          "Context awareness across entire codebase (@Files, @Docs)",
          "Zero setup friction — imports all VS Code extensions directly",
        ],
      }),
      rules: JSON.stringify([
        "9:16 vertical video only (TikTok, YouTube Shorts, Instagram Reels). Length 30-90s.",
        "Must include #CursorAI #CodeWithAI in description.",
        "Account must have at least 5,000 followers in tech/coding.",
        "Views audited 48 hours post-publication with automated fraud filter.",
      ]),
    },
    {
      title: "Arc Browser — Windows Release Blitz",
      slug: "arc-browser-windows",
      brandId: arcBrandUser.id,
      brandName: "The Browser Company",
      brandLogoUrl: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
      summary: "Showcase the fluid Spaces, Split Tabs, and Command Bar of Arc Browser on Windows.",
      description: "Arc for Windows has officially launched. We want creators to share how Arc transforms their daily desktop experience, comparing it to standard browsers and highlighting Spaces and Split View.",
      category: "Productivity & Software",
      tags: JSON.stringify(["Browser", "Productivity", "Windows", "Design"]),
      totalBudget: 35000,
      allocatedBudget: 28400,
      rewardRateCpm: 18.5,
      status: "ACTIVE",
      featured: true,
      featuredOrder: 2,
      platforms: JSON.stringify(["YouTube Shorts", "Instagram Reels", "TikTok"]),
      formats: JSON.stringify(["9:16 vertical"]),
      minFollowers: 3000,
      discordChannel: "#campaign-arc-windows",
      brief: JSON.stringify({
        objective: "Drive Windows desktop users to download Arc and try Spaces.",
        coreNarrative: "Contrast the chaos of 50 Chrome tabs with the calm organization of Arc Spaces and Pinned Tabs on Windows.",
        talkingPoints: [
          "Spaces: work, study, and personal lives completely separated",
          "Split view without fiddling with multiple windows",
          "Clean sidebar that collapses when you need focus",
        ],
      }),
      rules: JSON.stringify([
        "Crisp 1080p vertical video.",
        "Include #ArcBrowser #ArcForWindows and tag @arcbrowser.",
      ]),
    },
    {
      title: "Perplexity — Deep Research Challenge",
      slug: "perplexity-deep-research",
      brandId: perplexityBrandUser.id,
      brandName: "Perplexity AI",
      brandLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
      summary: "Compare standard web search against Perplexity Pro search with cited sources for complex questions.",
      description: "Perplexity is revolutionizing how we find answers. Create side-by-side comparison clips demonstrating how Perplexity provides direct cited syntheses vs scrolling through pages of ads on traditional engines.",
      category: "AI & Search",
      tags: JSON.stringify(["AI Search", "Research", "Tech"]),
      totalBudget: 20000,
      allocatedBudget: 8900,
      rewardRateCpm: 26.0,
      status: "ACTIVE",
      featured: true,
      featuredOrder: 3,
      platforms: JSON.stringify(["TikTok", "Instagram Reels"]),
      formats: JSON.stringify(["9:16 vertical"]),
      minFollowers: 2500,
      discordChannel: "#campaign-perplexity",
      brief: JSON.stringify({
        objective: "Highlight the depth and accuracy of Perplexity Pro search with instant cited sources.",
        coreNarrative: "Ask a difficult question and show Perplexity solving it with hyperlinked sources in seconds.",
        talkingPoints: [
          "Direct answer with hyperlinked citations",
          "Pro toggle for multi-step reasoning",
          "Save collections and share pages",
        ],
      }),
      rules: JSON.stringify([
        "Include #PerplexityAI #SearchSmarter in caption.",
      ]),
    },
    {
      title: "Supabase — Vector & AI Hackathon Blitz",
      slug: "supabase-vector-sprint",
      brandName: "Supabase",
      brandLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80",
      summary: "Showcase building AI search and vector embeddings in PostgreSQL with pgvector in under 60 seconds.",
      description: "Supabase Vector allows developers to store, index, and query embeddings alongside their relational data. Create snappy quick-start tutorials demonstrating pgvector in action.",
      category: "Cloud Infrastructure & Backend",
      tags: JSON.stringify(["Postgres", "Database", "AI"]),
      totalBudget: 25000,
      allocatedBudget: 11200,
      rewardRateCpm: 24.0,
      status: "ACTIVE",
      featured: false,
      featuredOrder: 4,
      platforms: JSON.stringify(["YouTube Shorts", "TikTok"]),
      formats: JSON.stringify(["9:16 vertical"]),
      minFollowers: 4000,
      discordChannel: "#campaign-supabase-vector",
      brief: JSON.stringify({
        objective: "Demonstrate ease of vector search with Supabase and Postgres.",
        coreNarrative: "Show how fast you can turn normal Postgres into semantic vector search.",
      }),
      rules: JSON.stringify(["Include #Supabase #Postgres in caption."]),
    },
    {
      title: "Raycast — Developer Extensions Showcase",
      slug: "raycast-pro-extensions",
      brandName: "Raycast",
      brandLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
      summary: "Demonstrate your custom Raycast extension or daily shortcuts that save 2+ hours daily.",
      description: "Raycast is the extendable launcher for Mac and Windows. Show off your favorite store extensions or highlight creating your own custom command in TypeScript.",
      category: "Desktop & Utilities",
      tags: JSON.stringify(["Mac", "Productivity", "Extensions"]),
      totalBudget: 18000,
      allocatedBudget: 9400,
      rewardRateCpm: 20.0,
      status: "ACTIVE",
      featured: false,
      featuredOrder: 5,
      platforms: JSON.stringify(["TikTok", "YouTube Shorts"]),
      formats: JSON.stringify(["9:16 vertical"]),
      minFollowers: 2000,
      discordChannel: "#campaign-raycast",
      brief: JSON.stringify({
        objective: "Highlight the power of Raycast Store Extensions and customized workflow hotkeys.",
      }),
      rules: JSON.stringify(["Include #Raycast in caption."]),
    },
    {
      title: "Linear — Mobile App 2.0 Launch",
      slug: "linear-mobile-launch",
      brandName: "Linear",
      brandLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1600&q=80",
      summary: "Highlight the new ultra-fast Linear Mobile experience designed for product teams on the go.",
      description: "Linear Mobile brings the fluid, keyboard-driven precision of Linear to iOS and Android. Creators show triage, issue creation, and project status updates on mobile.",
      category: "Project Management",
      tags: JSON.stringify(["Productivity", "Mobile", "SaaS"]),
      totalBudget: 22000,
      allocatedBudget: 0,
      rewardRateCpm: 21.0,
      status: "SCHEDULED",
      featured: false,
      featuredOrder: 6,
      platforms: JSON.stringify(["TikTok", "Instagram Reels", "YouTube Shorts"]),
      formats: JSON.stringify(["9:16 vertical"]),
      minFollowers: 3000,
      discordChannel: "#campaign-linear",
      brief: JSON.stringify({
        objective: "Demonstrate fluid issue management on Linear Mobile.",
      }),
      rules: JSON.stringify(["Include #LinearApp #BuildSoftware in caption."]),
    },
  ];

  for (const c of campaignsData) {
    const campaign = await prisma.campaign.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    console.log("✔ Seeded campaign:", campaign.title);

    // If it's Cursor AI, seed some sample verified submissions and ledger credits
    if (c.slug === "cursor-ai-launch") {
      const submission = await prisma.contentSubmission.create({
        data: {
          campaignId: campaign.id,
          creatorId: alexUser.id,
          platform: "TikTok",
          contentUrl: "https://tiktok.com/@alexrivera_dev/video/7391823901",
          status: "VERIFIED",
          reportedViews: 245000,
          verifiedViews: 238000,
          rewardAmount: (238000 / 1000) * c.rewardRateCpm, // $5,236
          auditNotes: "Audited after 48h. Filtered 7,000 non-organic/bot hits. 238,000 organic verified views.",
          reviewedBy: superAdmin.id,
          verifiedAt: new Date(),
        },
      });

      await prisma.earningsLedger.create({
        data: {
          creatorId: alexUser.id,
          campaignId: campaign.id,
          submissionId: submission.id,
          type: "REWARD_CREDIT",
          amount: submission.rewardAmount,
          balanceAfter: submission.rewardAmount,
          referenceId: `LEDGER-${submission.id}`,
          description: `Verified reward for Cursor AI TikTok submission (238k verified views @ $22 CPM)`,
        },
      });

      // Also create an application for Sarah
      await prisma.campaignApplication.upsert({
        where: {
          campaignId_creatorId: {
            campaignId: campaign.id,
            creatorId: sarahUser.id,
          },
        },
        update: {},
        create: {
          campaignId: campaign.id,
          creatorId: sarahUser.id,
          status: "APPROVED",
          pitchText: "I run weekly workflow design breakdowns and will showcase multi-cursor refactoring.",
          reviewedBy: campaignManager.id,
          reviewedAt: new Date(),
        },
      });
    }
  }

  // 8. CMS Website Content
  const cmsItems = [
    {
      key: "homepage_hero",
      section: "HERO",
      content: JSON.stringify({
        badge: "CREATOR PERFORMANCE MARKETPLACE",
        headline: "Performance campaigns with upfront rates and verified views.",
        subheadline: "Collabefy connects short-form creators with brand sponsorships backed by guaranteed escrow pools. Review exact CPM rates and delivery rules before publishing, with weekly payouts on audited organic views.",
        ctaPrimaryText: "Browse Active Campaigns",
        ctaPrimaryLink: "/campaigns",
        ctaSecondaryText: "Join as Creator",
        ctaSecondaryLink: "/register",
        footerHighlights: [
          "Escrow-funded pools",
          "Fixed CPM rates upfront",
          "48h organic fraud audit",
          "Weekly Friday payouts",
        ],
      }),
    },
    {
      key: "homepage_stats",
      section: "STATS",
      content: JSON.stringify({
        auditedViewsCount: "38.4M+",
        totalCreatorPayoutsUsd: "$1.24M+",
        activeCampaignPoolsCount: "42",
        fraudDetectionRatePercent: "99.8%",
      }),
    },
    {
      key: "homepage_how_it_works",
      section: "HOW_IT_WORKS",
      content: JSON.stringify([
        {
          step: 1,
          title: "Select Verified Campaign",
          description: "Browse high-CPM campaigns with guaranteed escrow-funded pools from top tech brands.",
        },
        {
          step: 2,
          title: "Publish 9:16 Short-Form Content",
          description: "Produce genuine organic content on TikTok, YouTube Shorts, or Reels meeting campaign guidelines.",
        },
        {
          step: 3,
          title: "48h Bot & Fraud Audit",
          description: "Collabefy's automated inspection monitors viewership velocity and filters synthetic traffic.",
        },
        {
          step: 4,
          title: "Weekly Direct Settlement",
          description: "Receive instant payouts every Friday directly to Stripe Connect or USDC wallet.",
        },
      ]),
    },
  ];

  for (const item of cmsItems) {
    await prisma.websiteContent.upsert({
      where: { key: item.key },
      update: { content: item.content },
      create: item,
    });
    console.log("✔ Seeded CMS content:", item.key);
  }

  // 9. Platform Settings
  const defaultSettings = [
    { key: "platform_name", value: "Collabefy", category: "GENERAL" },
    { key: "platform_fee_percent", value: "10", category: "FINANCIAL" },
    { key: "min_withdrawal_usd", value: "50", category: "FINANCIAL" },
    { key: "payout_day_of_week", value: "Friday", category: "FINANCIAL" },
    { key: "bot_audit_window_hours", value: "48", category: "SECURITY" },
    { key: "support_contact_email", value: "support@collabefy.com", category: "GENERAL" },
    { key: "maintenance_mode", value: "false", category: "GENERAL" },
  ];

  for (const s of defaultSettings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
    console.log("✔ Seeded Platform Setting:", s.key);
  }

  // 10. Sample Support Ticket
  const ticket = await prisma.supportTicket.create({
    data: {
      userId: alexUser.id,
      subject: "Stripe Connect Payout Routing Confirmation",
      category: "FINANCIAL",
      priority: "MEDIUM",
      status: "OPEN",
      messages: {
        create: {
          senderId: alexUser.id,
          message: "Hello team, I recently updated my payout bank routing in Stripe Connect. Can you verify it will apply for this Friday's settlement?",
        },
      },
    },
  });
  console.log("✔ Seeded Support Ticket:", ticket.id);

  // 11. Initial Audit Log
  await prisma.adminAuditLog.create({
    data: {
      adminId: superAdmin.id,
      action: "PLATFORM_INITIALIZATION",
      targetResource: "SYSTEM",
      targetId: "INIT",
      newValue: JSON.stringify({ message: "Collabefy system initialized and seeded successfully" }),
      ipAddress: "127.0.0.1",
      userAgent: "Seeder/1.0",
      status: "SUCCESS",
    },
  });

  console.log("✅ Collabefy Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
