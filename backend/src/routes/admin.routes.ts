import { Router } from "express";
import {
  getAdminOverview,
  getPlatformSettings,
  updatePlatformSettings,
  getAdminAuditLogs,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAnyAdmin, requireSuperAdmin } from "../middleware/rbac.js";

const router = Router();

router.get("/analytics/overview", requireAuth, requireAnyAdmin, getAdminOverview);
router.get("/settings", requireAuth, requireAnyAdmin, getPlatformSettings);
router.put("/settings", requireAuth, requireSuperAdmin, updatePlatformSettings);
router.get("/audit-logs", requireAuth, requireAnyAdmin, getAdminAuditLogs);

export default router;
