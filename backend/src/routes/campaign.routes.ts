import { Router } from "express";
import {
  getPublicCampaigns,
  getPublicCampaignBySlug,
  getAdminCampaigns,
  createAdminCampaign,
  updateAdminCampaign,
  updateCampaignStatus,
  duplicateCampaign,
  deleteAdminCampaign,
} from "../controllers/campaign.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireCampaignAdmin } from "../middleware/rbac.js";

const router = Router();

// Public routes
router.get("/", getPublicCampaigns);
router.get("/:slug", getPublicCampaignBySlug);

// Admin routes
router.get("/admin/all", requireAuth, requireCampaignAdmin, getAdminCampaigns);
router.post("/admin", requireAuth, requireCampaignAdmin, createAdminCampaign);
router.patch("/admin/:id", requireAuth, requireCampaignAdmin, updateAdminCampaign);
router.patch("/admin/:id/status", requireAuth, requireCampaignAdmin, updateCampaignStatus);
router.post("/admin/:id/duplicate", requireAuth, requireCampaignAdmin, duplicateCampaign);
router.delete("/admin/:id", requireAuth, requireCampaignAdmin, deleteAdminCampaign);

export default router;
