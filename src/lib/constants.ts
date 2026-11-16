export const APP_CONSTANTS = {
  ADMIN_COOKIE_NAME: 'collabefy_admin_token',
  ROLE_COOKIE_NAME: 'collabefy_role',
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  API_TIMEOUT_MS: 10_000,
  RATE_LIMIT: {
    ADMIN_LOGIN: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts / 15 min
    API_GENERAL: { max: 60, windowMs: 60 * 1000 },      // 60 req / min
    SUBMISSION: { max: 10, windowMs: 60 * 1000 },        // 10 submissions / min
  },
  PLATFORMS: ['tiktok', 'youtube_shorts', 'instagram_reels', 'x'] as const,
} as const;
