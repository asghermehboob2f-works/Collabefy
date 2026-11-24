import { Router } from "express";
import {
  getPublicCampaigns,
  getPublicCampaignBySlug,
  getAdminCampaigns,
  getAdminCampaignById,
  createAdminCampaign,
  updateAdminCampaign,
  updateCampaignStatus,
  duplicateCampaign,
  deleteAdminCampaign,
} from "../controllers/campaign.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireCampaignAdmin } from "../middleware/rbac.js";

const router = Router();

// Admin routes (mounted before parameterized wildcard /:slug to avoid route collisions)
router.get("/admin/all", requireAuth, requireCampaignAdmin, getAdminCampaigns);
router.get("/admin/:id", requireAuth, requireCampaignAdmin, getAdminCampaignById);
router.post("/admin", requireAuth, requireCampaignAdmin, createAdminCampaign);
router.patch("/admin/:id", requireAuth, requireCampaignAdmin, updateAdminCampaign);
router.patch("/admin/:id/status", requireAuth, requireCampaignAdmin, updateCampaignStatus);
router.post("/admin/:id/duplicate", requireAuth, requireCampaignAdmin, duplicateCampaign);
router.delete("/admin/:id", requireAuth, requireCampaignAdmin, deleteAdminCampaign);

// Public routes
router.get("/", getPublicCampaigns);
router.get("/:slug", getPublicCampaignBySlug);

export default router;
