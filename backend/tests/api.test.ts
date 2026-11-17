import { describe, it } from "node:test";
import assert from "node:assert";
import { createApp } from "../src/app.js";
import { prisma } from "../src/database/prisma.js";

// Helper to make mock requests to express app without running on real port
const app = createApp();

describe("Collabefy Production Backend Test Suite", () => {
  let server: any;
  let baseUrl: string;
  let adminToken: string;

  it("should boot the test server", async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api/v1`;
        resolve();
      });
    });
    assert.ok(baseUrl, "Base URL should be defined");
  });

  it("1. Health Endpoint: should return healthy status and database connected", async () => {
    const res = await fetch(`${baseUrl}/health`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.status, "healthy");
    assert.strictEqual(json.services.database, "connected");
  });

  it("2. Public Campaigns: should list active seeded campaigns with verified stats", async () => {
    const res = await fetch(`${baseUrl}/campaigns`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 3);

    const cursor = json.data.find((c: any) => c.slug === "cursor-ai-launch");
    assert.ok(cursor, "Cursor AI campaign should exist");
    assert.strictEqual(cursor.rewardRateCpm, 22.0);
    assert.ok(cursor.verifiedViews >= 238000);
  });

  it("3. Single Campaign: should fetch campaign by slug with full brief & rules", async () => {
    const res = await fetch(`${baseUrl}/campaigns/cursor-ai-launch`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, "cursor-ai-launch");
    assert.ok(json.data.brief.objective);
    assert.ok(Array.isArray(json.data.rules));
  });

  it("4. Authentication: should authenticate Super Admin and return JWT token", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@collabefy.com",
        password: "CollabefyAdmin2026!",
      }),
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.accessToken);
    assert.strictEqual(json.data.user.role, "SUPER_ADMIN");
    adminToken = json.data.accessToken;
  });

  it("5. Protected Admin Analytics: should reject unauthenticated requests with 401", async () => {
    const res = await fetch(`${baseUrl}/admin/analytics/overview`);
    assert.strictEqual(res.status, 401);
  });

  it("6. Protected Admin Analytics: should allow Super Admin and return platform metrics", async () => {
    const res = await fetch(`${baseUrl}/admin/analytics/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.metrics.totalVerifiedViews >= 238000);
    assert.ok(json.data.metrics.activeCampaignsCount >= 3);
  });

  it("7. Dynamic CMS: should fetch homepage hero content and allow admin updates", async () => {
    const res = await fetch(`${baseUrl}/cms/homepage_hero`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.content.headline);

    // Update via admin
    const updateRes = await fetch(`${baseUrl}/cms/admin/homepage_hero`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        content: {
          ...json.data.content,
          badge: "VERIFIED CREATOR MARKETPLACE",
        },
      }),
    });
    const updateJson = await updateRes.json();
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateJson.data.content.badge, "VERIFIED CREATOR MARKETPLACE");
  });

  it("8. Audit Logs: should record admin activities in the immutable audit log table", async () => {
    const res = await fetch(`${baseUrl}/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.logs.length > 0);
  });

  it("should close test server", async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    await prisma.$disconnect();
  });
});
