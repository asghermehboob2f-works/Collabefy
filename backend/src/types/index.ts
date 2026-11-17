export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CAMPAIGN_MANAGER"
  | "FINANCE_MANAGER"
  | "SUPPORT_MANAGER"
  | "BRAND"
  | "CREATOR";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ARCHIVED";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SubmissionStatus =
  | "PENDING"
  | "VERIFYING"
  | "VERIFIED"
  | "REJECTED"
  | "FLAGGED";

export type LedgerType =
  | "REWARD_CREDIT"
  | "WITHDRAWAL_DEBIT"
  | "ADJUSTMENT"
  | "REFUND";

export type WithdrawalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSED"
  | "FAILED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_USER"
  | "RESOLVED"
  | "CLOSED";

export type NotificationType =
  | "SYSTEM"
  | "CAMPAIGN"
  | "PAYMENT"
  | "VERIFICATION"
  | "SUPPORT";

export type AnnouncementStatus = "DRAFT" | "SCHEDULED" | "SENT";
