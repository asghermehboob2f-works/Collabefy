import assert from "node:assert";
import test from "node:test";
import { z } from "zod";

// 1. Test Rate Limiter Logic
function createRateLimiter(maxRequests = 5, windowMs = 1000) {
  const store = new Map();
  return function check(key) {
    const now = Date.now();
    const record = store.get(key);
    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    record.count += 1;
    return { allowed: true, remaining: maxRequests - record.count };
  };
}

test("Rate Limiter correctly blocks after threshold", () => {
  const limiter = createRateLimiter(3, 2000);
  assert.strictEqual(limiter("user_1").allowed, true);
  assert.strictEqual(limiter("user_1").allowed, true);
  assert.strictEqual(limiter("user_1").allowed, true);
  assert.strictEqual(limiter("user_1").allowed, false, "4th request must be blocked");
  assert.strictEqual(limiter("user_2").allowed, true, "Different key must be allowed");
});

// 2. Test Zod Schemas
const submissionSchema = z.object({
  campaignId: z.string().min(1),
  platform: z.enum(["tiktok", "youtube_shorts", "instagram_reels", "x"]),
  contentUrl: z.string().url(),
  creatorHandle: z.string().min(2),
  estimatedViews: z.number().int().nonnegative().optional(),
});

test("Validation rejects invalid submission input", () => {
  const invalid = {
    campaignId: "",
    platform: "facebook_invalid",
    contentUrl: "not-a-url",
    creatorHandle: "",
  };
  const result = submissionSchema.safeParse(invalid);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error.issues.length >= 3, true);
});

test("Validation accepts valid submission input", () => {
  const valid = {
    campaignId: "camp-01",
    platform: "tiktok",
    contentUrl: "https://www.tiktok.com/@alex/video/12345",
    creatorHandle: "@alex_builds",
    estimatedViews: 25000,
  };
  const result = submissionSchema.safeParse(valid);
  assert.strictEqual(result.success, true);
});

// 3. Test Reward Calculation
function calculateReward(views, cpmRate) {
  return (views / 1000) * cpmRate;
}

test("Reward calculation accurately computes CPM earnings", () => {
  const views = 148200;
  const cpm = 22.0;
  const reward = calculateReward(views, cpm);
  assert.strictEqual(Math.round(reward * 100) / 100, 3260.4);
});

// 4. Test RBAC permissions
function canAccessAdmin(role) {
  return role === "ADMIN";
}

test("RBAC prevents non-admin access to management endpoints", () => {
  assert.strictEqual(canAccessAdmin("VISITOR"), false);
  assert.strictEqual(canAccessAdmin("CREATOR"), false);
  assert.strictEqual(canAccessAdmin("ADMIN"), true);
});

// 5. Test Campaign Status rules
function canSubmitToCampaign(status) {
  return status === "active";
}

test("Campaign status prevents submissions to paused or expired campaigns", () => {
  assert.strictEqual(canSubmitToCampaign("active"), true);
  assert.strictEqual(canSubmitToCampaign("paused"), false);
  assert.strictEqual(canSubmitToCampaign("completed"), false);
  assert.strictEqual(canSubmitToCampaign("draft"), false);
  assert.strictEqual(canSubmitToCampaign("budget_exhausted"), false);
});
