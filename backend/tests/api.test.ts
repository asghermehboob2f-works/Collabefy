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

describe("Collabefy Production Backend Test Suite", () => {
  let adminToken: string = "";

  after(async () => {
    await prisma.$disconnect();
  });

  it("1. Health Endpoint: should return healthy status and database connected", async () => {
    const res = await callApi("GET", "/api/v1/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.status, "healthy");
    assert.strictEqual(res.json.services.database, "connected");
  });

  it("2. Public Campaigns: should list active seeded campaigns from database", async () => {
    const res = await callApi("GET", "/api/v1/campaigns");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(Array.isArray(res.json.data));
    assert.ok(res.json.data.length >= 1);
  });

  it("3. Single Campaign: should fetch campaign by slug with full brief & rules", async () => {
    const res = await callApi("GET", "/api/v1/campaigns/cursor-ai-launch");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.slug, "cursor-ai-launch");
    assert.ok(res.json.data.brief);
    assert.ok(Array.isArray(res.json.data.rules));
  });

  it("4. Public Creator Leaderboard: should return audited creator rankings", async () => {
    const res = await callApi("GET", "/api/v1/creators/leaderboard");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(Array.isArray(res.json.data));
    assert.ok(res.json.data.length >= 1);
  });

  it("5. Public Support Desk: should record guest contact inquiries in database", async () => {
    const res = await callApi("POST", "/api/v1/support/inquiries", {
      body: {
        name: "Test Sponsor",
        email: "sponsor-test@example.com",
        subject: "Brand Sponsorship Inquiry",
        category: "brand_campaign",
        message: "We would like to fund a $25,000 short-form video sprint.",
        budget: "$25,000",
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.ticketId);
  });

  it("6. Authentication: should authenticate Super Admin and return JWT token", async () => {
    const res = await callApi("POST", "/api/v1/auth/login", {
      body: {
        email: "admin@collabefy.com",
        password: "CollabefyAdmin2026!",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.accessToken);
    assert.strictEqual(res.json.data.user.role, "SUPER_ADMIN");
    adminToken = res.json.data.accessToken;
  });

  it("7. Protected Admin Analytics: should reject unauthenticated requests with 401", async () => {
    const res = await callApi("GET", "/api/v1/admin/analytics/overview");
    assert.strictEqual(res.status, 401);
  });

  it("8. Protected Admin Analytics: should allow Super Admin and return platform metrics", async () => {
    const res = await callApi("GET", "/api/v1/admin/analytics/overview", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.metrics);
    assert.ok(typeof res.json.data.metrics.activeCampaignsCount === "number");
    assert.ok(typeof res.json.data.metrics.totalCampaignsCount === "number");
  });

  it("9. Admin Campaigns List: should return all campaigns including paused and drafts", async () => {
    const res = await callApi("GET", "/api/v1/campaigns/admin/all", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(Array.isArray(res.json.data));
    assert.ok(res.json.data.length >= 5);
  });

  it("10. Admin Finance Overview: should return platform escrow and payout queue stats", async () => {
    const res = await callApi("GET", "/api/v1/finance/admin/overview", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(typeof res.json.data.totalEscrowPools === "number");
  });

  it("11. Dynamic CMS: should fetch homepage hero and allow administrative updates", async () => {
    const res = await callApi("GET", "/api/v1/cms/homepage_hero");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.content);

    const updateRes = await callApi("PUT", "/api/v1/cms/admin/homepage_hero", {
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        content: {
          ...res.json.data.content,
          badge: "VERIFIED CREATOR MARKETPLACE",
        },
      },
    });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.json.data.content.badge, "VERIFIED CREATOR MARKETPLACE");
  });

  it("12. Audit Logs: should record admin activities in the immutable audit log table", async () => {
    const res = await callApi("GET", "/api/v1/admin/audit-logs", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.logs.length > 0);
  });
});
