import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedThreeCampaigns() {
  console.log("🚀 Upserting 3 realistic ongoing campaigns into SQLite database...");

  // Upsert promote.fun brand account if needed
  const brandPasswordHash = await bcrypt.hash("PromoteFunPass2026!", 12);
  const promoteBrand = await prisma.user.upsert({
    where: { email: "team@promote.fun" },
    update: {
      role: "BRAND",
      status: "ACTIVE",
    },
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

  const campaigns = [
    {
      title: "The Weeknd",
      slug: "the-weeknd",
      brandId: promoteBrand.id,
      brandName: "promote.fun",
      brandLogoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
      summary: 'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.',
      description:
        'Post memes using the provided music video and the "Hong Kong" audio by The Weeknd.\n\nRead the campaign rules before posting.',
      category: "Music & Entertainment",
      tags: JSON.stringify(["The Weeknd", "Music", "Meme", "Instagram", "TikTok"]),
      totalBudget: 692153, // $7,777 @ ₹89/$1
      allocatedBudget: 692153,
      rewardRateCpm: 178, // $2.00 @ ₹89/$1
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
        coreNarrative:
          'Craft viral, culturally resonant memes utilizing "Hong Kong" by The Weeknd synced to the provided stems.',
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
      brandId: promoteBrand.id,
      brandName: "promote.fun",
      brandLogoUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
      summary: 'Post the approved content formats using the "Lift You Up" audio.',
      description: 'Post the approved content formats using the "Lift You Up" audio.',
      category: "TV & Film Edits",
      tags: JSON.stringify(["Blake G", "TV Edits", "Film Clips", "Instagram"]),
      totalBudget: 267000, // $3,000 @ ₹89/$1
      allocatedBudget: 267000,
      rewardRateCpm: 44.5, // $0.50 @ ₹89/$1
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
      brandId: promoteBrand.id,
      brandName: "promote.fun",
      brandLogoUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=200&q=80",
      coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
      summary: "FIFA 27 is one of the most anticipated sports game releases of the year. Create clips for FC Head2Head: Bellingham vs Hamilton.",
      description:
        "FIFA 27 is one of the most anticipated sports game releases of the year.\n\nFC Head2Head is a long-form YouTube series from EA SPORTS FC where two stars face off in FC 27. This episode pits Jude Bellingham against Lewis Hamilton.",
      category: "Gaming & Sports",
      tags: JSON.stringify(["FIFA 27", "EA SPORTS FC", "Jude Bellingham", "Lewis Hamilton", "Gaming"]),
      totalBudget: 284800, // $3,200 @ ₹89/$1
      allocatedBudget: 0,
      rewardRateCpm: 155.75, // $1.75 @ ₹89/$1
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
  ];

  for (const c of campaigns) {
    const upserted = await prisma.campaign.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        brandId: c.brandId,
        brandName: c.brandName,
        brandLogoUrl: c.brandLogoUrl,
        coverImage: c.coverImage,
        summary: c.summary,
        description: c.description,
        category: c.category,
        tags: c.tags,
        totalBudget: c.totalBudget,
        allocatedBudget: c.allocatedBudget,
        rewardRateCpm: c.rewardRateCpm,
        rewardUnit: c.rewardUnit,
        status: c.status,
        startDate: c.startDate,
        endDate: c.endDate,
        platforms: c.platforms,
        formats: c.formats,
        minFollowers: c.minFollowers,
        featured: c.featured,
        featuredOrder: c.featuredOrder,
        discordChannel: c.discordChannel,
        brief: c.brief,
        rules: c.rules,
      },
      create: c,
    });
    console.log(`✔ Successfully upserted campaign: "${upserted.title}" (slug: ${upserted.slug})`);
  }

  console.log("✅ All 3 realistic ongoing campaigns seeded successfully!");
}

seedThreeCampaigns()
  .catch((e) => {
    console.error("❌ Error seeding campaigns:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
