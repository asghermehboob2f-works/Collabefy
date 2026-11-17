import { Request, Response, NextFunction } from "express";

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CAMPAIGN_MANAGER"
  | "FINANCE_MANAGER"
  | "SUPPORT_MANAGER"
  | "BRAND"
  | "CREATOR";

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required to access this resource",
        },
      });
      return;
    }

    // SUPER_ADMIN has access to everything
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    // ADMIN has broad access across operational panels
    if (req.user.role === "ADMIN" && !allowedRoles.includes("SUPER_ADMIN")) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]. Current role: ${req.user.role}`,
        },
      });
      return;
    }

    next();
  };
}

// Convenience shortcuts
export const requireSuperAdmin = requireRole("SUPER_ADMIN");
export const requireAnyAdmin = requireRole(
  "SUPER_ADMIN",
  "ADMIN",
  "CAMPAIGN_MANAGER",
  "FINANCE_MANAGER",
  "SUPPORT_MANAGER"
);
export const requireCampaignAdmin = requireRole("SUPER_ADMIN", "ADMIN", "CAMPAIGN_MANAGER");
export const requireFinanceAdmin = requireRole("SUPER_ADMIN", "ADMIN", "FINANCE_MANAGER");
export const requireSupportAdmin = requireRole("SUPER_ADMIN", "ADMIN", "SUPPORT_MANAGER");
export const requireCreator = requireRole("CREATOR");
export const requireBrand = requireRole("BRAND");
