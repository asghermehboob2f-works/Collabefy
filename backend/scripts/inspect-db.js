const { PrismaClient } = require("../node_modules/@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, status: true },
  });
  console.log("Users in DB:", users);

  const campaigns = await prisma.campaign.findMany({
    select: { id: true, title: true, slug: true, status: true, totalBudget: true },
  });
  console.log("Campaigns in DB:", campaigns);

  const submissions = await prisma.contentSubmission.findMany({
    select: { id: true, campaignId: true, creatorId: true, status: true, viewsVerified: true },
  });
  console.log("Submissions in DB:", submissions);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
