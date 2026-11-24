import { Router } from "express";
import {
  submitWebsiteCreatorProfile,
  getMyWebsiteSubmission,
  getAdminWebsiteSubmissions,
  getAdminWebsiteSubmissionById,
  updateAdminWebsiteSubmission,
  deleteAdminWebsiteSubmission,
  exportAdminWebsiteSubmissions,
} from "../controllers/websiteSubmission.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAnyAdmin } from "../middleware/rbac.js";

const router = Router();

// Authenticated Creator routes
router.post("/me", requireAuth, submitWebsiteCreatorProfile);
router.get("/me", requireAuth, getMyWebsiteSubmission);
router.post("/", requireAuth, submitWebsiteCreatorProfile);
router.get("/my", requireAuth, getMyWebsiteSubmission);

// Admin: Website Submissions Management
router.get("/admin/all", requireAuth, requireAnyAdmin, getAdminWebsiteSubmissions);
router.get("/admin/export", requireAuth, requireAnyAdmin, exportAdminWebsiteSubmissions);
router.get("/admin/:id", requireAuth, requireAnyAdmin, getAdminWebsiteSubmissionById);
router.patch("/admin/:id/review", requireAuth, requireAnyAdmin, updateAdminWebsiteSubmission);
router.patch("/admin/:id", requireAuth, requireAnyAdmin, updateAdminWebsiteSubmission);
router.delete("/admin/:id", requireAuth, requireAnyAdmin, deleteAdminWebsiteSubmission);

export default router;
