import { Router } from "express";
import {
  submitDiscord,
  getAdminDiscordSubmissions,
  getAdminDiscordSubmissionById,
  updateAdminDiscordSubmission,
  deleteAdminDiscordSubmission,
  exportAdminDiscordSubmissions,
} from "../controllers/discordSubmission.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAnyAdmin } from "../middleware/rbac.js";

const router = Router();

// Public: Discord direct submission channel
router.post("/", submitDiscord);

// Admin: Discord Submissions Management
router.get("/admin/all", requireAuth, requireAnyAdmin, getAdminDiscordSubmissions);
router.get("/admin/export", requireAuth, requireAnyAdmin, exportAdminDiscordSubmissions);
router.get("/admin/:id", requireAuth, requireAnyAdmin, getAdminDiscordSubmissionById);
router.patch("/admin/:id/review", requireAuth, requireAnyAdmin, updateAdminDiscordSubmission);
router.patch("/admin/:id", requireAuth, requireAnyAdmin, updateAdminDiscordSubmission);
router.delete("/admin/:id", requireAuth, requireAnyAdmin, deleteAdminDiscordSubmission);

export default router;
