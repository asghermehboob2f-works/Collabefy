import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma.js";
import { campaignCreateSchema, campaignUpdateSchema } from "../validators/campaign.validator.js";
import { logAdminActivity } from "../middleware/auditLogger.js";
import { verifyAccessToken } from "../utils/jwt.js";

// Helper to parse JSON fields safely
export function formatCampaign(c: any) {
  const briefObj = typeof c.brief === "string" ? JSON.parse(c.brief || "{}") : c.brief;
  return {
    ...c,
    rewardRate: c.rewardRateCpm ?? c.rewardRate,
    currency: c.currency || "INR",
    audio: c.audio || briefObj?.audio,
    payableViews: c.payableViews ?? briefObj?.stats?.payableViews ?? c.verifiedViews,
    stats: briefObj?.stats || c.stats,
    tags: typeof c.tags === "string" ? JSON.parse(c.tags || "[]") : c.tags,
    platforms: typeof c.platforms === "string" ? JSON.parse(c.platforms || "[]") : c.platforms,
    formats: typeof c.formats === "string" ? JSON.parse(c.formats || "[]") : c.formats,
    allowedCountries: typeof c.allowedCountries === "string" ? JSON.parse(c.allowedCountries || "[]") : c.allowedCountries,
    brief: briefObj,
    rules: typeof c.rules === "string" ? JSON.parse(c.rules || "[]") : c.rules,
  };
}

// Public: Get all active campaigns with optional pagination and filters
export async function getPublicCampaigns(req: Request, res: Response): Promise<void> {
  const { category, search, platform, page, limit, sortBy } = req.query;

  const where: any = {
    status: "ACTIVE",
  };

  if (category && typeof category === "string" && category !== "all") {
    where.category = { contains: category };
  }

  if (platform && typeof platform === "string" && platform !== "all") {
    where.platforms = { contains: platform };
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    where.OR = [
      { title: { contains: search.trim() } },
      { summary: { contains: search.trim() } },
      { brandName: { contains: search.trim() } },
    ];
  }

  // Count total matching records in database
  const totalCount = await prisma.campaign.count({ where });

  // Determine sorting order
  let orderBy: any = [{ featured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }];
  if (sortBy === "highest_rate") {
    orderBy = [{ rewardRateCpm: "desc" }, { createdAt: "desc" }];
  } else if (sortBy === "ending_soon") {
    orderBy = [{ endDate: "asc" }, { createdAt: "desc" }];
  } else if (sortBy === "total_budget") {
    orderBy = [{ totalBudget: "desc" }, { createdAt: "desc" }];
  } else if (sortBy === "newest") {
    orderBy = [{ createdAt: "desc" }];
  }

  // Pagination parameters
  const isAll = limit === "all";
  const limitNum = isAll ? undefined : Math.max(1, Math.min(100, parseInt(limit as string) || 9));
  const pageNum = isAll ? 1 : Math.max(1, parseInt(page as string) || 1);
  const skip = isAll ? undefined : (pageNum - 1) * (limitNum as number);

  const campaigns = await prisma.campaign.findMany({
    where,
    orderBy,
    skip,
    take: limitNum,
    include: {
      _count: {
        select: {
          submissions: { where: { status: "VERIFIED" } },
          applications: { where: { status: "APPROVED" } },
        },
      },
      submissions: {
        where: { status: "VERIFIED" },
        select: { verifiedViews: true },
      },
    },
  });

  const formatted = campaigns.map((c) => {
    const verifiedViewsSum = c.submissions.reduce((acc, s) => acc + s.verifiedViews, 0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { submissions, ...rest } = c;
    return {
      ...formatCampaign(rest),
      verifiedViews: verifiedViewsSum,
      approvedClips: c._count.submissions,
      activeCreators: c._count.applications,
    };
  });

  const effectiveLimit = limitNum || (totalCount > 0 ? totalCount : 1);
  const totalPages = Math.max(1, Math.ceil(totalCount / effectiveLimit));
  const hasMore = !isAll && pageNum * (limitNum as number) < totalCount;

  res.json({
    success: true,
    data: formatted,
    pagination: {
      page: pageNum,
      limit: limitNum ?? totalCount,
      totalCount,
      totalPages,
      hasMore,
    },
  });
}

// Public: Get single campaign by slug with publication rules
export async function getPublicCampaignBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          submissions: { where: { status: "VERIFIED" } },
          applications: { where: { status: "APPROVED" } },
        },
      },
      submissions: {
        where: { status: "VERIFIED" },
        select: { verifiedViews: true },
      },
    },
  });

  if (!campaign) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  // Publication visibility enforcement:
  // DRAFT, SCHEDULED, and ARCHIVED campaigns are hidden from anonymous visitors unless requested by an administrator
  if (campaign.status === "DRAFT" || campaign.status === "ARCHIVED" || campaign.status === "SCHEDULED") {
    const token =
      req.cookies?.collabefy_access ||
      req.cookies?.collabefy_admin_token ||
      (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.substring(7) : null);

    let isAdmin = false;
    if (token) {
      const payload = verifyAccessToken(token);
      if (payload && ["SUPER_ADMIN", "ADMIN", "CAMPAIGN_MANAGER"].includes(payload.role)) {
        isAdmin = true;
      } else if (token.startsWith("adm_")) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Campaign is currently unpublished or not available" },
      });
      return;
    }
  }

  const verifiedViewsSum = campaign.submissions.reduce((acc, s) => acc + s.verifiedViews, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { submissions, ...rest } = campaign;

  res.json({
    success: true,
    data: {
      ...formatCampaign(rest),
      verifiedViews: verifiedViewsSum,
      approvedClips: campaign._count.submissions,
      activeCreators: campaign._count.applications,
    },
  });
}

// Admin: Get all campaigns with all statuses and sorting
export async function getAdminCampaigns(req: Request, res: Response): Promise<void> {
  const { status, search, sortBy } = req.query;

  const where: any = {};
  if (status && typeof status === "string" && status !== "ALL") {
    where.status = status;
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    where.OR = [
      { title: { contains: search.trim() } },
      { brandName: { contains: search.trim() } },
      { slug: { contains: search.trim() } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  else if (sortBy === "highest_rate") orderBy = [{ rewardRateCpm: "desc" }, { createdAt: "desc" }];
  else if (sortBy === "total_budget") orderBy = [{ totalBudget: "desc" }, { createdAt: "desc" }];
  else if (sortBy === "title") orderBy = { title: "asc" };

  const campaigns = await prisma.campaign.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: {
          submissions: true,
          applications: true,
        },
      },
      submissions: {
        where: { status: "VERIFIED" },
        select: { verifiedViews: true },
      },
    },
  });

  const formatted = campaigns.map((c) => {
    const verifiedViewsSum = c.submissions.reduce((acc, s) => acc + s.verifiedViews, 0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { submissions, ...rest } = c;
    return {
      ...formatCampaign(rest),
      verifiedViews: verifiedViewsSum,
      approvedClips: c._count.submissions,
      activeCreators: c._count.applications,
    };
  });

  res.json({
    success: true,
    data: formatted,
    totalCount: campaigns.length,
  });
}

// Admin: Get single campaign by ID
export async function getAdminCampaignById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          submissions: true,
          applications: true,
        },
      },
      submissions: {
        where: { status: "VERIFIED" },
        select: { verifiedViews: true },
      },
    },
  });

  if (!campaign) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  const verifiedViewsSum = campaign.submissions.reduce((acc, s) => acc + s.verifiedViews, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { submissions, ...rest } = campaign;

  res.json({
    success: true,
    data: {
      ...formatCampaign(rest),
      verifiedViews: verifiedViewsSum,
      approvedClips: campaign._count.submissions,
      activeCreators: campaign._count.applications,
    },
  });
}

// Admin: Create Campaign
export async function createAdminCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = campaignCreateSchema.parse(req.body);

    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
        "-" +
        Math.floor(Math.random() * 1000);

    const existing = await prisma.campaign.findUnique({ where: { slug } });
    if (existing) {
      res.status(400).json({ success: false, error: { code: "SLUG_EXISTS", message: "Campaign slug already exists" } });
      return;
    }

    const briefObj = typeof data.brief === "object" ? { ...data.brief } : {};
    if (data.audio) {
      briefObj.audio = data.audio;
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        slug,
        brandName: data.brandName,
        brandLogoUrl: data.brandLogoUrl,
        coverImage: data.coverImage,
        summary: data.summary,
        description: data.description,
        category: data.category,
        tags: JSON.stringify(data.tags),
        totalBudget: data.totalBudget,
        allocatedBudget: data.allocatedBudget ?? 0,
        rewardRateCpm: data.rewardRateCpm,
        rewardUnit: data.rewardUnit || "per_1000_views",
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        platforms: JSON.stringify(data.platforms),
        formats: JSON.stringify(data.formats),
        allowedCountries: JSON.stringify(data.allowedCountries),
        minFollowers: data.minFollowers,
        brief: JSON.stringify(briefObj),
        rules: JSON.stringify(data.rules),
        discordChannel: data.discordChannel,
        featured: data.featured,
        featuredOrder: data.featuredOrder,
      },
    });

    if (req.user) {
      await logAdminActivity({
        adminId: req.user.userId,
        action: "CAMPAIGN_CREATE",
        targetResource: "CAMPAIGN",
        targetId: campaign.id,
        newValue: campaign,
        req,
      });
    }

    res.status(201).json({ success: true, data: formatCampaign(campaign) });
  } catch (err) {
    next(err);
  }
}

// Admin: Update Campaign (Robust field sanitization to prevent Prisma runtime errors)
export async function updateAdminCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = campaignUpdateSchema.parse(req.body);

    const previous = await prisma.campaign.findUnique({ where: { id } });
    if (!previous) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
      return;
    }

    // Explicitly whitelist valid Campaign Prisma model fields only
    const allowedScalarFields = [
      "title",
      "slug",
      "brandName",
      "brandLogoUrl",
      "coverImage",
      "summary",
      "description",
      "category",
      "totalBudget",
      "allocatedBudget",
      "rewardRateCpm",
      "rewardUnit",
      "status",
      "minFollowers",
      "discordChannel",
      "featured",
      "featuredOrder",
    ] as const;

    const updateData: any = {};
    for (const key of allowedScalarFields) {
      if ((data as any)[key] !== undefined) {
        updateData[key] = (data as any)[key];
      }
    }

    // Support rewardRate alias if provided
    if ((data as any).rewardRate !== undefined && updateData.rewardRateCpm === undefined) {
      updateData.rewardRateCpm = (data as any).rewardRate;
    }

    // Safely serialize array/JSON fields
    if (data.tags !== undefined) {
      updateData.tags = typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags);
    }
    if (data.platforms !== undefined) {
      updateData.platforms = typeof data.platforms === "string" ? data.platforms : JSON.stringify(data.platforms);
    }
    if (data.formats !== undefined) {
      updateData.formats = typeof data.formats === "string" ? data.formats : JSON.stringify(data.formats);
    }
    if (data.allowedCountries !== undefined) {
      updateData.allowedCountries = typeof data.allowedCountries === "string" ? data.allowedCountries : JSON.stringify(data.allowedCountries);
    }
    if (data.rules !== undefined) {
      updateData.rules = typeof data.rules === "string" ? data.rules : JSON.stringify(data.rules);
    }
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    // Brief object handling: sync audio, stats, and incoming brief properties
    let briefObj: any = {};
    try {
      briefObj = typeof previous.brief === "string" ? JSON.parse(previous.brief || "{}") : previous.brief || {};
    } catch {}

    if (data.brief !== undefined) {
      const incomingBrief = typeof data.brief === "string" ? JSON.parse(data.brief || "{}") : data.brief;
      briefObj = { ...briefObj, ...incomingBrief };
    }

    if (data.audio !== undefined) {
      briefObj.audio = data.audio;
    }

    if ((data as any).stats !== undefined) {
      briefObj.stats = (data as any).stats;
    }

    updateData.brief = JSON.stringify(briefObj);

    const updated = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });

    if (req.user) {
      await logAdminActivity({
        adminId: req.user.userId,
        action: "CAMPAIGN_UPDATE",
        targetResource: "CAMPAIGN",
        targetId: id,
        previousValue: previous,
        newValue: updated,
        req,
      });
    }

    res.json({ success: true, data: formatCampaign(updated) });
  } catch (err) {
    next(err);
  }
}

// Admin: Update Campaign Status
export async function updateCampaignStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["DRAFT", "SCHEDULED", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, error: { code: "INVALID_STATUS", message: "Invalid campaign status" } });
    return;
  }

  const previous = await prisma.campaign.findUnique({ where: { id } });
  if (!previous) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  const updated = await prisma.campaign.update({
    where: { id },
    data: { status },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: `CAMPAIGN_STATUS_${status}`,
      targetResource: "CAMPAIGN",
      targetId: id,
      previousValue: { status: previous.status },
      newValue: { status },
      req,
    });
  }

  res.json({ success: true, data: formatCampaign(updated) });
}

// Admin: Duplicate Campaign as DRAFT
export async function duplicateCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const original = await prisma.campaign.findUnique({ where: { id } });
  if (!original) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

  const duplicated = await prisma.campaign.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      brandId: original.brandId,
      brandName: original.brandName,
      brandLogoUrl: original.brandLogoUrl,
      coverImage: original.coverImage,
      summary: original.summary,
      description: original.description,
      category: original.category,
      tags: original.tags,
      totalBudget: original.totalBudget,
      allocatedBudget: 0,
      rewardRateCpm: original.rewardRateCpm,
      rewardUnit: original.rewardUnit,
      status: "DRAFT",
      startDate: original.startDate,
      endDate: original.endDate,
      platforms: original.platforms,
      minFollowers: original.minFollowers,
      formats: original.formats,
      allowedCountries: original.allowedCountries,
      brief: original.brief,
      rules: original.rules,
      discordChannel: original.discordChannel,
      featured: false,
      featuredOrder: 99,
    },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "CAMPAIGN_DUPLICATE",
      targetResource: "CAMPAIGN",
      targetId: duplicated.id,
      newValue: duplicated,
      req,
    });
  }

  res.status(201).json({ success: true, data: formatCampaign(duplicated) });
}

// Admin: Delete Campaign with atomic relational clean-up
export async function deleteAdminCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const previous = await prisma.campaign.findUnique({ where: { id } });
    if (!previous) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
      return;
    }

    // Execute atomic cleanup transaction:
    // Disassociate earningsLedger records to preserve financial audit history while removing campaign
    await prisma.$transaction(async (tx) => {
      await tx.earningsLedger.updateMany({
        where: { campaignId: id },
        data: { campaignId: null },
      });

      await tx.contentSubmission.deleteMany({
        where: { campaignId: id },
      });

      await tx.campaignApplication.deleteMany({
        where: { campaignId: id },
      });

      await tx.campaign.delete({
        where: { id },
      });
    });

    if (req.user) {
      await logAdminActivity({
        adminId: req.user.userId,
        action: "CAMPAIGN_DELETE",
        targetResource: "CAMPAIGN",
        targetId: id,
        previousValue: previous,
        req,
      });
    }

    res.json({ success: true, message: "Campaign deleted successfully", data: { id, title: previous.title } });
  } catch (err) {
    next(err);
  }
}
