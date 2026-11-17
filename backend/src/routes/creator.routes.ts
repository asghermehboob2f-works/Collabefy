import { Router } from "express";
import {
  getAdminCreators,
  getAdminCreatorDetail,
  updateCreatorStatus,
  getPublicLeaderboard,
} from "../controllers/creator.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAnyAdmin } from "../middleware/rbac.js";

const router = Router();

// Public route
router.get("/leaderboard", getPublicLeaderboard);

// Admin routes
router.get("/admin/all", requireAuth, requireAnyAdmin, getAdminCreators);
router.get("/admin/:id", requireAuth, requireAnyAdmin, getAdminCreatorDetail);
router.patch("/admin/:id/status", requireAuth, requireAnyAdmin, updateCreatorStatus);

export default router;
