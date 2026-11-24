import { Router } from "express";
import authRoutes from "./auth.routes.js";
import campaignRoutes from "./campaign.routes.js";
import submissionRoutes from "./submission.routes.js";
import discordSubmissionRoutes from "./discordSubmission.routes.js";
import websiteSubmissionRoutes from "./websiteSubmission.routes.js";
import financeRoutes from "./finance.routes.js";
import creatorRoutes from "./creator.routes.js";
import cmsRoutes from "./cms.routes.js";
import supportRoutes from "./support.routes.js";
import adminRoutes from "./admin.routes.js";
import { prisma } from "../database/prisma.js";

const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        api: "operational",
      },
      version: "1.0.0",
    });
  } catch (err: any) {
    res.status(503).json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      error: "Database connectivity issue",
    });
  }
});

// Mounted domain routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/campaigns", campaignRoutes);
apiRouter.use("/submissions/discord", discordSubmissionRoutes);
apiRouter.use("/submissions/website", websiteSubmissionRoutes);
apiRouter.use("/submissions", submissionRoutes);
apiRouter.use("/finance", financeRoutes);
apiRouter.use("/creators", creatorRoutes);
apiRouter.use("/cms", cmsRoutes);
apiRouter.use("/support", supportRoutes);
apiRouter.use("/admin", adminRoutes);

export default apiRouter;
