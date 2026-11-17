import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  addMessage,
  updateTicketStatus,
} from "../controllers/support.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireSupportAdmin } from "../middleware/rbac.js";

const router = Router();

router.post("/tickets", requireAuth, createTicket);
router.get("/tickets", requireAuth, getTickets);
router.get("/tickets/:id", requireAuth, getTicketById);
router.post("/tickets/:id/messages", requireAuth, addMessage);
router.patch("/admin/tickets/:id", requireAuth, requireSupportAdmin, updateTicketStatus);

export default router;
