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

describe("Complete Submissions System E2E Automated Verification", () => {
  let adminToken: string = "";
  let testUserToken: string = "";
  let testUserId: string = "";
  let discordSubmissionId: string = "";
  let websiteSubmissionId: string = "";

  const uniqueDiscordTag = `testcreator_${Date.now()}`;
  const testEmail = `sub_user_${Date.now()}@test.com`;
  const testUsername = `creator_${Date.now()}`;

  after(async () => {
    // Clean up created records
    if (discordSubmissionId) {
      await prisma.discordSubmission.deleteMany({ where: { id: discordSubmissionId } });
    }
    if (testUserId) {
      await prisma.websiteSubmission.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  // ==========================================
  // SECTION 1: ADMIN & USER AUTHENTICATION
  // ==========================================
  it("1. Authenticate Admin user and acquire staff token", async () => {
    const res = await callApi("POST", "/api/v1/auth/login", {
      body: {
        email: "admin@collabefy.com",
        password: "CollabefyAdmin2026!",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    adminToken = res.json.data.accessToken;
    assert.ok(adminToken);
  });

  it("2. Register a new Website User with Username & Password confirmation", async () => {
    const res = await callApi("POST", "/api/v1/auth/register", {
      body: {
        email: testEmail,
        username: testUsername,
        password: "StrongPassword123!",
        passwordConfirmation: "StrongPassword123!",
        role: "CREATOR",
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.accessToken);
    testUserToken = res.json.data.accessToken;
    testUserId = res.json.data.user.id;
    assert.strictEqual(res.json.data.user.username, testUsername);
  });

  it("3. Authenticate User using Username instead of Email", async () => {
    const res = await callApi("POST", "/api/v1/auth/login", {
      body: {
        email: testUsername, // Controller accepts username or email in this field
        password: "StrongPassword123!",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.accessToken);
  });

  // ==========================================
  // SECTION 2: SYSTEM A — DISCORD SUBMISSIONS
  // ==========================================
  it("4. Discord Submission: Public submission v1 creates new parent record and snapshot v1", async () => {
    const res = await callApi("POST", "/api/v1/submissions/discord", {
      body: {
        discordUsername: uniqueDiscordTag,
        instagramUrl: "https://instagram.com/mytestcreator",
        youtubeUrl: "https://youtube.com/@mytestcreator",
        tiktokUrl: "https://tiktok.com/@mytestcreator",
        additionalInfo: "I create short-form tech and gaming review content.",
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.currentVersion, 1);
    assert.strictEqual(res.json.data.status, "PENDING");
    assert.strictEqual(res.json.data.isUpdate, false);
    discordSubmissionId = res.json.data.id;
  });

  it("5. Discord Submission: Resubmission with same normalized identity creates v2 snapshot and updates active record", async () => {
    // Same username with different casing
    const res = await callApi("POST", "/api/v1/submissions/discord", {
      body: {
        discordUsername: `  ${uniqueDiscordTag.toUpperCase()}  `,
        instagramUrl: "https://instagram.com/mytestcreator_updated",
        youtubeUrl: "https://youtube.com/@mytestcreator",
        tiktokUrl: "https://tiktok.com/@mytestcreator_v2",
        otherPlatform: "Twitter/X",
        otherPlatformUrl: "https://x.com/mytestcreator",
        additionalInfo: "Updated my handles and added my X account.",
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.currentVersion, 2);
    assert.strictEqual(res.json.data.isUpdate, true);
    assert.strictEqual(res.json.data.id, discordSubmissionId);

    // Verify database has exactly 1 parent and 2 version records
    const versions = await prisma.discordSubmissionVersion.findMany({
      where: { submissionId: discordSubmissionId },
      orderBy: { versionNumber: "asc" },
    });
    assert.strictEqual(versions.length, 2);
    assert.strictEqual(versions[0].versionNumber, 1);
    assert.strictEqual(versions[0].instagramUrl, "https://instagram.com/mytestcreator");
    assert.strictEqual(versions[1].versionNumber, 2);
    assert.strictEqual(versions[1].instagramUrl, "https://instagram.com/mytestcreator_updated");
    assert.strictEqual(versions[1].otherPlatform, "Twitter/X");
  });

  it("6. Discord Admin: List all submissions with search and filter", async () => {
    const res = await callApi(
      "GET",
      `/api/v1/submissions/discord/admin/all?search=${uniqueDiscordTag}&status=PENDING`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.length >= 1);
    const found = res.json.data.find((s: any) => s.id === discordSubmissionId);
    assert.ok(found);
    assert.strictEqual(found.currentVersion, 2);
  });

  it("7. Discord Admin: Inspect single submission with full version history", async () => {
    const res = await callApi(
      "GET",
      `/api/v1/submissions/discord/admin/${discordSubmissionId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.versions.length, 2);
    assert.strictEqual(res.json.data.versions[0].versionNumber, 2); // Descending order
    assert.strictEqual(res.json.data.versions[1].versionNumber, 1);
  });

  it("8. Discord Admin: Update review status and save confidential admin notes", async () => {
    const res = await callApi(
      "PATCH",
      `/api/v1/submissions/discord/admin/${discordSubmissionId}/review`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          status: "APPROVED",
          adminNotes: "Creator verified in Discord #partners channel. Audience metrics meet requirements.",
        },
      }
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.status, "APPROVED");
    assert.strictEqual(
      res.json.data.adminNotes,
      "Creator verified in Discord #partners channel. Audience metrics meet requirements."
    );
  });

  // ==========================================
  // SECTION 3: SYSTEM B — WEBSITE SUBMISSIONS
  // ==========================================
  it("9. Website Submission: Authenticated user submits creator profile v1", async () => {
    const res = await callApi("POST", "/api/v1/submissions/website", {
      headers: { Authorization: `Bearer ${testUserToken}` },
      body: {
        category: "Gaming",
        bio: "Specializing in FPS strategy analysis and hardware reviews.",
        portfolioUrl: "https://myportfolio.dev/creator",
        youtubeUrl: "https://youtube.com/@webcreator",
        instagramUrl: "https://instagram.com/webcreator",
      },
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.currentVersion, 1);
    assert.strictEqual(res.json.data.status, "PENDING");
    assert.strictEqual(res.json.data.category, "Gaming");
    websiteSubmissionId = res.json.data.id;
  });

  it("10. Website Submission: Authenticated user updates profile creating v2 snapshot while preserving v1", async () => {
    const res = await callApi("POST", "/api/v1/submissions/website", {
      headers: { Authorization: `Bearer ${testUserToken}` },
      body: {
        category: "Tech & Gaming",
        bio: "Specializing in FPS strategy analysis, hardware reviews, and live streaming.",
        portfolioUrl: "https://myportfolio.dev/creator_v2",
        youtubeUrl: "https://youtube.com/@webcreator",
        tiktokUrl: "https://tiktok.com/@webcreator_stream",
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.currentVersion, 2);
    assert.strictEqual(res.json.data.category, "Tech & Gaming");

    // Check version records in DB
    const versions = await prisma.websiteSubmissionVersion.findMany({
      where: { submissionId: websiteSubmissionId },
      orderBy: { versionNumber: "asc" },
    });
    assert.strictEqual(versions.length, 2);
    assert.strictEqual(versions[0].versionNumber, 1);
    assert.strictEqual(versions[0].category, "Gaming");
    assert.strictEqual(versions[1].versionNumber, 2);
    assert.strictEqual(versions[1].category, "Tech & Gaming");
  });

  it("11. Website Submission: Creator fetches own dashboard data with full version history", async () => {
    const res = await callApi("GET", "/api/v1/submissions/website/my", {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.id, websiteSubmissionId);
    assert.strictEqual(res.json.data.currentVersion, 2);
    assert.strictEqual(res.json.data.versions.length, 2);
  });

  it("12. Website Admin: List all website submissions with user account linkage", async () => {
    const res = await callApi(
      "GET",
      `/api/v1/submissions/website/admin/all?search=${testUsername}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(res.json.data.length >= 1);
    const found = res.json.data.find((s: any) => s.id === websiteSubmissionId);
    assert.ok(found);
    assert.strictEqual(found.user.username, testUsername);
    assert.strictEqual(found.user.email, testEmail);
  });

  it("13. Website Admin: Update status and save private administrative notes", async () => {
    const res = await callApi(
      "PATCH",
      `/api/v1/submissions/website/admin/${websiteSubmissionId}/review`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          status: "UNDER_REVIEW",
          adminNotes: "Portfolio reviewed. Requested sample video editing files.",
        },
      }
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.data.status, "UNDER_REVIEW");
    assert.strictEqual(
      res.json.data.adminNotes,
      "Portfolio reviewed. Requested sample video editing files."
    );
  });

  // ==========================================
  // SECTION 4: EXPORT AND DATA INTEGRITY
  // ==========================================
  it("14. Admin Export: Discord Submissions export returns valid CSV content", async () => {
    const res = await callApi(
      "GET",
      `/api/v1/submissions/discord/admin/export?format=csv&token=${adminToken}`
    );

    assert.strictEqual(res.status, 200);
    assert.ok(res.headers["content-type"].includes("text/csv"));
    assert.ok(res.text.includes("Discord Username"));
    assert.ok(res.text.includes(uniqueDiscordTag));
  });

  it("15. Admin Export: Website Submissions export returns valid JSON content", async () => {
    const res = await callApi(
      "GET",
      `/api/v1/submissions/website/admin/export?format=json&token=${adminToken}`
    );

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.success, true);
    assert.ok(Array.isArray(res.json.data));
    const found = res.json.data.find((s: any) => s.id === websiteSubmissionId);
    assert.ok(found);
  });

  it("16. Isolation Check: Unauthorized creator cannot access admin endpoints", async () => {
    const res = await callApi("GET", "/api/v1/submissions/discord/admin/all", {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    // CREATOR role should receive 403 Forbidden
    assert.strictEqual(res.status, 403);
  });
});
