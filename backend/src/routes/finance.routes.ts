import { Router } from "express";
import {
  getCreatorBalance,
  requestWithdrawal,
  getAdminFinanceOverview,
  getAdminWithdrawals,
  reviewWithdrawal,
  getAdminLedger,
} from "../controllers/finance.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireFinanceAdmin } from "../middleware/rbac.js";

const router = Router();

// Creator routes
router.get("/balance", requireAuth, getCreatorBalance);
router.post("/withdraw", requireAuth, requestWithdrawal);

// Admin routes
router.get("/admin/overview", requireAuth, requireFinanceAdmin, getAdminFinanceOverview);
router.get("/admin/withdrawals", requireAuth, requireFinanceAdmin, getAdminWithdrawals);
router.patch("/admin/withdrawals/:id/review", requireAuth, requireFinanceAdmin, reviewWithdrawal);
router.get("/admin/ledger", requireAuth, requireFinanceAdmin, getAdminLedger);

export default router;
