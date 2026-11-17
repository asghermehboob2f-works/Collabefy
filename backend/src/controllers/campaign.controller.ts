import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { campaignCreateSchema, campaignUpdateSchema } from "../validators/campaign.validator.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

// Helper to parse JSON fields safely
export function formatCampaign(c: any) {
  return {
    ...c,
    tags: typeof c.tags === "string" ? JSON.parse(c.tags || "[]") : c.tags,
    platforms: typeof c.platforms === "string" ? JSON.parse(c.platforms || "[]") : c.platforms,
    formats: typeof c.formats === "string" ? JSON.parse(c.formats || "[]") : c.formats,
    allowedCountries: typeof c.allowedCountries === "string" ? JSON.parse(c.allowedCountries || "[]") : c.allowedCountries,
    brief: typeof c.brief === "string" ? JSON.parse(c.brief || "{}") : c.brief,
    rules: typeof c.rules === "string" ? JSON.parse(c.rules || "[]") : c.rules,
  };
}

// Public: Get all active campaigns
export async function getPublicCampaigns(req: Request, res: Response): Promise<void> {
  const { category, search, platform } = req.query;

  const where: any = {
    status: "ACTIVE",
  };

  if (category && typeof category === "string" && category !== "all") {
    where.category = { contains: category };
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    where.OR = [
      { title: { contains: search.trim() } },
      { summary: { contains: search.trim() } },
      { brandName: { contains: search.trim() } },
    ];
  }

  const campaigns = await prisma.campaign.findMany({
    where,
    orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
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

  res.json({ success: true, data: formatted });
}

// Public: Get single campaign by slug
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

// Admin: Get all campaigns with all statuses
export async function getAdminCampaigns(req: Request, res: Response): Promise<void> {
  const { status, search } = req.query;

  const where: any = {};
  if (status && typeof status === "string" && status !== "ALL") {
    where.status = status;
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    where.OR = [
      { title: { contains: search.trim() } },
      { brandName: { contains: search.trim() } },
    ];
  }

  const campaigns = await prisma.campaign.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          submissions: true,
          applications: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: campaigns.map((c) => formatCampaign(c)),
  });
}

// Admin: Create Campaign
export async function createAdminCampaign(req: Request, res: Response): Promise<void> {
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
      allocatedBudget: 0,
      rewardRateCpm: data.rewardRateCpm,
      status: data.status,
      platforms: JSON.stringify(data.platforms),
      formats: JSON.stringify(data.formats),
      allowedCountries: JSON.stringify(data.allowedCountries),
      minFollowers: data.minFollowers,
      brief: JSON.stringify(data.brief),
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
}

// Admin: Update Campaign
export async function updateAdminCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = campaignUpdateSchema.parse(req.body);

  const previous = await prisma.campaign.findUnique({ where: { id } });
  if (!previous) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  const updateData: any = { ...data };
  if (data.tags) updateData.tags = JSON.stringify(data.tags);
  if (data.platforms) updateData.platforms = JSON.stringify(data.platforms);
  if (data.formats) updateData.formats = JSON.stringify(data.formats);
  if (data.allowedCountries) updateData.allowedCountries = JSON.stringify(data.allowedCountries);
  if (data.brief) updateData.brief = JSON.stringify(data.brief);
  if (data.rules) updateData.rules = JSON.stringify(data.rules);

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

// Admin: Duplicate Campaign
export async function duplicateCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const original = await prisma.campaign.findUnique({ where: { id } });
  if (!original) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;

  const duplicated = await prisma.campaign.create({
    data: {
      ...original,
      id: undefined,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      status: "DRAFT",
      allocatedBudget: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
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
