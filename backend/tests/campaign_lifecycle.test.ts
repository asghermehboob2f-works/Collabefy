import { describe, it, after } from "node:test";
import assert from "node:assert";
import { Duplex } from "node:stream";
import { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../src/app.js";
import { prisma } from "../src/database/prisma.js";

const app = createApp();

interface ApiResponse {
  status: number;
  headers: Record<string, any>;
  json: any;
  text: string;
}

function createMockSocket() {
  const s = new Duplex({
    read() {},
    write(chunk, encoding, callback) {
      callback();
    },
  }) as any;
  s.remoteAddress = "127.0.0.1";
  s.encrypted = false;
  return s;
}

function callApi(
  method: string,
  url: string,
  options: {
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    try {
      const socket = createMockSocket();
      const req = new IncomingMessage(socket);
      req.method = method.toUpperCase();
      req.url = url;

      const headers: Record<string, string> = {};
      if (options.headers) {
        for (const [k, v] of Object.entries(options.headers)) {
          headers[k.toLowerCase()] = v;
        }
      }
      let payload: string | null = null;
      if (options.body !== undefined) {
        payload =
          typeof options.body === "string" ? options.body : JSON.stringify(options.body);
        headers["content-type"] = headers["content-type"] || "application/json";
        headers["content-length"] = Buffer.byteLength(payload).toString();
      }
      req.headers = headers;

      let rawBody = "";
      const res = new ServerResponse(req) as any;
      res.write = (chunk: any) => {
        if (chunk) rawBody += chunk.toString();
        return true;
      };
      res.end = (chunk: any) => {
        if (chunk) rawBody += chunk.toString();
        let parsed = null;
        try {
          parsed = JSON.parse(rawBody);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.getHeaders ? res.getHeaders() : {},
          json: parsed,
          text: rawBody,
        });
      };

      app(req, res);

      if (payload !== null) {
        req.push(payload);
      }
      req.push(null);
    } catch (err) {
      reject(err);
    }
  });
}

describe("End-to-End Campaign Lifecycle Verification", () => {
  let adminToken: string = "";
  let createdCampaignId: string = "";
  let createdCampaignSlug: string = "";
  let duplicateCampaignId: string = "";

  after(async () => {
    // Cleanup any lingering test records if needed
    if (createdCampaignId) {
      await prisma.campaign.deleteMany({ where: { id: createdCampaignId } });
    }
    if (duplicateCampaignId) {
      await prisma.campaign.deleteMany({ where: { id: duplicateCampaignId } });
    }
    await prisma.$disconnect();
  });

  it("1. Admin Authentication: authenticate Super Admin and acquire JWT", async () => {
    const res = await callApi("POST", "/api/v1/auth/login", {
      body: {
        email: "admin@collabefy.com",
        password: "CollabefyAdmin2026!",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.accessToken);
    adminToken = res.json.data.accessToken;
  });

  it("2. Campaign Creation: admin creates a new campaign in ACTIVE status", async () => {
    const uniqueSuffix = Date.now();
    const newCampaign = {
      title: `E2E Automated Campaign ${uniqueSuffix}`,
      brandName: "Acme Cloud AI",
      brandWebsite: "https://acmecloud.ai",
      summary: "High-yield creator performance campaign for Acme Cloud AI.",
      category: "ai_tools",
      description: "End-to-end test campaign for verification of full lifecycle.",
      platforms: ["tiktok", "youtube_shorts"],
      formats: ["dedicated_review", "tutorial"],
      totalBudget: 15000,
      rewardRateCpm: 35,
      maxPayoutPerVideo: 1200,
      status: "ACTIVE",
      featured: true,
      discordChannelUrl: "https://discord.gg/acme-test",
      brief: {
        talkingPoints: ["Fast deployment", "Zero latency", "Escrow protection"],
        dos: ["Show UI", "Include link in bio"],
        donts: ["No false claims"],
        audio: {
          allowedTypes: ["Original voiceover", "Trending commercial sound"],
        },
      },
      rules: ["Minimum 30s duration", "Tagged with #CollabefyAcme"],
    };

    const res = await callApi("POST", "/api/v1/campaigns/admin", {
      headers: { Authorization: `Bearer ${adminToken}` },
      body: newCampaign,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.id);
    assert.ok(res.json.data.slug);
    assert.strictEqual(res.json.data.status, "ACTIVE");

    createdCampaignId = res.json.data.id;
    createdCampaignSlug = res.json.data.slug;
  });

  it("3. Public Discovery: created campaign appears in public /campaigns listing", async () => {
    const res = await callApi("GET", "/api/v1/campaigns");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);

    const found = res.json.data.find((c: any) => c.id === createdCampaignId);
    assert.ok(found, "Newly created campaign must appear in public listing");
    assert.strictEqual(found.slug, createdCampaignSlug);
    assert.strictEqual(found.status, "ACTIVE");
  });

  it("4. Public Single View: campaign is accessible by slug with full parsed brief", async () => {
    const res = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.id, createdCampaignId);
    assert.ok(res.json.data.brief);
    assert.ok(Array.isArray(res.json.data.rules));
  });

  it("5. Campaign Update: update campaign rate, budget, and description", async () => {
    const res = await callApi("PATCH", `/api/v1/campaigns/admin/${createdCampaignId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        rewardRateCpm: 45,
        totalBudget: 20000,
        description: "Updated description via admin edit endpoint.",
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.rewardRateCpm, 45);
    assert.strictEqual(res.json.data.totalBudget, 20000);
    assert.strictEqual(res.json.data.description, "Updated description via admin edit endpoint.");
  });

  it("6. Real-time Public Sync: public detail immediately reflects updated rate and budget", async () => {
    const res = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.data.rewardRateCpm, 45);
    assert.strictEqual(res.json.data.totalBudget, 20000);
    assert.strictEqual(res.json.data.description, "Updated description via admin edit endpoint.");
  });

  it("7. Pause Campaign: admin pauses campaign, status changes to PAUSED", async () => {
    const res = await callApi("PATCH", `/api/v1/campaigns/admin/${createdCampaignId}/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: "PAUSED" },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.status, "PAUSED");

    // Public detail reflects PAUSED status
    const publicRes = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`);
    assert.strictEqual(publicRes.status, 200);
    assert.strictEqual(publicRes.json.data.status, "PAUSED");
  });

  it("8. Unpublish Campaign: set status to DRAFT, public unauthenticated requests receive 404", async () => {
    const res = await callApi("PATCH", `/api/v1/campaigns/admin/${createdCampaignId}/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: "DRAFT" },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.data.status, "DRAFT");

    // Public unauthenticated request receives 404
    const publicRes = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`);
    assert.strictEqual(publicRes.status, 404);

    // Admin authorized preview request receives 200
    const adminPreviewRes = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(adminPreviewRes.status, 200);
    assert.strictEqual(adminPreviewRes.json.data.id, createdCampaignId);
  });

  it("9. Resume Campaign: set status back to ACTIVE, public discovery restored", async () => {
    const res = await callApi("PATCH", `/api/v1/campaigns/admin/${createdCampaignId}/status`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: "ACTIVE" },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.data.status, "ACTIVE");

    const publicRes = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`);
    assert.strictEqual(publicRes.status, 200);
    assert.strictEqual(publicRes.json.data.status, "ACTIVE");
  });

  it("10. Duplicate Campaign: clones campaign as DRAFT with unique slug", async () => {
    const res = await callApi("POST", `/api/v1/campaigns/admin/${createdCampaignId}/duplicate`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.id);
    assert.notStrictEqual(res.json.data.id, createdCampaignId);
    assert.notStrictEqual(res.json.data.slug, createdCampaignSlug);
    assert.strictEqual(res.json.data.status, "DRAFT");
    assert.ok(res.json.data.title.includes("(Copy)"));

    duplicateCampaignId = res.json.data.id;
  });

  it("11. Delete Campaign: atomic deletion removes campaign from admin and public views", async () => {
    const res = await callApi("DELETE", `/api/v1/campaigns/admin/${createdCampaignId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);

    // Public detail must return 404
    const publicRes = await callApi("GET", `/api/v1/campaigns/${createdCampaignSlug}`);
    assert.strictEqual(publicRes.status, 404);

    // Admin detail must return 404
    const adminRes = await callApi("GET", `/api/v1/campaigns/admin/${createdCampaignId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(adminRes.status, 404);

    // Reset so after hook doesn't re-delete
    createdCampaignId = "";
  });

  it("12. Clean Up Duplicate Campaign", async () => {
    if (duplicateCampaignId) {
      const res = await callApi("DELETE", `/api/v1/campaigns/admin/${duplicateCampaignId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert.strictEqual(res.status, 200);
      duplicateCampaignId = "";
    }
  });
});
