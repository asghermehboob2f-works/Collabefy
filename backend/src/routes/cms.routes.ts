import { Router } from "express";
import { getPublicCms, getAdminCms, updateAdminCms } from "../controllers/cms.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAnyAdmin } from "../middleware/rbac.js";

const router = Router();

// Public
router.get("/:key", getPublicCms);

// Admin
router.get("/admin/all", requireAuth, requireAnyAdmin, getAdminCms);
router.put("/admin/:key", requireAuth, requireAnyAdmin, updateAdminCms);

export default router;
