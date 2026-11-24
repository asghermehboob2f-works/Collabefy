import { Router } from "express";
import {
  createTicket,
  createPublicInquiry,
  getTickets,
  getTicketById,
  addMessage,
  updateTicketStatus,
} from "../controllers/support.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireSupportAdmin } from "../middleware/rbac.js";

const router = Router();

// Public contact inquiry
router.post("/inquiries", createPublicInquiry);

// Authenticated ticket endpoints
router.post("/tickets", requireAuth, createTicket);
router.get("/tickets", requireAuth, getTickets);
router.get("/tickets/:id", requireAuth, getTicketById);
router.post("/tickets/:id/messages", requireAuth, addMessage);
router.patch("/admin/tickets/:id", requireAuth, requireSupportAdmin, updateTicketStatus);

export default router;
