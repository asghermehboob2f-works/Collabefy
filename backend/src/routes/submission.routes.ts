import { Router } from "express";
import {
  createSubmission,
  getMySubmissions,
  getAdminSubmissions,
  reviewSubmission,
} from "../controllers/submission.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireCampaignAdmin } from "../middleware/rbac.js";

const router = Router();

// Creator submission
router.post("/", requireAuth, createSubmission);
router.get("/my", requireAuth, getMySubmissions);

// Admin review
router.get("/admin/all", requireAuth, requireCampaignAdmin, getAdminSubmissions);
router.patch("/admin/:id/review", requireAuth, requireCampaignAdmin, reviewSubmission);

export default router;
