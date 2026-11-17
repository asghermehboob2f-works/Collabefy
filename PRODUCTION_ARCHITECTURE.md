# Collabefy — Production Backend, Security & Administrator Architecture

Collabefy is a creator marketing marketplace connecting short-form video creators (TikTok, YouTube Shorts, Instagram Reels) with brand sponsorships backed by escrow pools, upfront fixed CPM rates, and audited organic views.

---

## 1. System Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │          Public Visitors &           │
                      │          Creators & Admins           │
                      └──────────────────┬───────────────────┘
                                         │ HTTPS
                                         ▼
                      ┌──────────────────────────────────────┐
                      │     Next.js 14 Frontend (Vercel)     │
                      │        http://localhost:3000         │
                      │  - App Router, Tailwind CSS, SSR/SSG │
                      │  - Same-origin API rewrites to API   │
                      └──────────────────┬───────────────────┘
                                         │ /api/v1 (REST)
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    Collabefy Independent Backend     │
                      │        http://localhost:4000         │
                      │  - Express.js, TypeScript (ES2022)   │
                      │  - Helmet, CORS, Cookie-Parser       │
                      │  - Sliding Window Rate Limiting      │
                      │  - Role-Based Access Control (RBAC)  │
                      └──────────────────┬───────────────────┘
                                         │ Prisma ORM
                                         ▼
                      ┌──────────────────────────────────────┐
                      │    Persistent Database Storage       │
                      │  - SQLite (Local Dev: dev.db)        │
                      │  - PostgreSQL (Production / Railway) │
                      │  - 20 Models, Atomic Transactions    │
                      └──────────────────────────────────────┘
```

---

## 2. Security & Authentication Architecture

### 1. Password Security
- Passwords are encrypted using **Bcrypt with 12 salt rounds**.
- No plaintext passwords ever hit the database or logs.

### 2. Dual-Token JWT & HttpOnly Cookies
- **Access Token**: Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`.
- **Refresh Token**: Long-lived (7 days), signed with `JWT_REFRESH_SECRET`, hashed with SHA-256 and stored in the `RefreshToken` database table with device/IP tracking.
- **Rotation**: Every refresh invalidates the previous refresh token and issues a new cryptographic pair.
- **Cookie Security**: `HttpOnly`, `Secure` (in production), `SameSite=Lax/None`, protecting against XSS token harvesting.

### 3. Server-Side RBAC (Role-Based Access Control)
Roles supported on the backend:
- `SUPER_ADMIN`: Unrestricted platform privileges.
- `ADMIN`: Comprehensive operations access across moderation, creators, and campaigns.
- `CAMPAIGN_MANAGER`: Campaign CRUD, status modifications, and submission reviews.
- `FINANCE_MANAGER`: Withdrawal queue approvals, escrow ledger auditing, and payouts.
- `SUPPORT_MANAGER`: Ticket triage, assignments, and customer inquiries.
- `BRAND`: Campaign funding, briefs, and brand profiles.
- `CREATOR`: Video submissions, ledger balances, and withdrawal requests.

### 4. Rate Limiting & Input Sanitization
- In-memory sliding-window rate limiters on all authentication routes (15 attempts / 15 minutes) and general API endpoints (120 req/min).
- Strict **Zod schemas** validate and sanitize all incoming payloads before controller execution.

---

## 3. Persistent Database Schema (Prisma)

The database schema (`backend/prisma/schema.prisma`) manages 20 core models:
1. `User`: Primary identity, email, password hash, role, status (`ACTIVE`, `SUSPENDED`).
2. `RefreshToken`: Cryptographic SHA-256 session store with automatic revocation.
3. `AdminProfile`: Department and granular admin permission JSON.
4. `CreatorProfile`: Bio, display name, handle, verified status, social channels, earnings balance, total verified views.
5. `BrandProfile`: Company name, logo, industry, website, total spend.
6. `Campaign`: Upfront CPM rate, total budget, allocated budget, status (`ACTIVE`, `PAUSED`, `SCHEDULED`, `COMPLETED`, `ARCHIVED`), brief, rules, formats, platforms, Discord channel.
7. `CampaignApplication`: Creator applications with pitch and internal admin review notes.
8. `ContentSubmission`: Creator video URL, platform, reported views, verified views, reward amount, rejection reason, audit notes.
9. `EarningsLedger`: Atomic, immutable accounting ledger (`REWARD_CREDIT`, `WITHDRAWAL_DEBIT`, `ADJUSTMENT`).
10. `WithdrawalRequest`: Creator payout requests with status (`PENDING`, `APPROVED`, `PROCESSED`, `REJECTED`).
11. `SupportTicket`: Customer support inquiries with priority and status.
12. `SupportMessage`: Threaded support replies (including internal staff notes).
13. `Notification`: In-app notification center.
14. `Announcement`: Scheduled platform broadcasts.
15. `WebsiteContent`: Live dynamic CMS store (`homepage_hero`, `homepage_stats`, `homepage_how_it_works`).
16. `PlatformSetting`: Configurable financial thresholds (`min_withdrawal_usd`, `platform_fee_percent`, `bot_audit_window_hours`).
17. `AdminAuditLog`: Immutable audit trail recording every administrative mutation.

---

## 4. API Endpoints Catalog (`/api/v1`)

### Authentication & Profiles (`/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register new Creator or Brand |
| POST | `/api/v1/auth/login` | Public | Authenticate user, receive JWT & HttpOnly cookie |
| POST | `/api/v1/auth/refresh` | Public | Rotate refresh token and obtain new access token |
| POST | `/api/v1/auth/logout` | User | Revoke session and clear cookies |
| GET | `/api/v1/auth/me` | User | Retrieve current user profile and role |
| PATCH | `/api/v1/auth/profile` | User | Update creator or brand profile metadata |

### Campaigns (`/campaigns`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/campaigns` | Public | List active campaigns with filters (category, search, platform) |
| GET | `/api/v1/campaigns/:slug` | Public | Fetch campaign detail by slug with live view aggregates |
| GET | `/api/v1/campaigns/admin/all` | Admin | List all campaigns (including Drafts, Paused, Scheduled) |
| POST | `/api/v1/campaigns/admin` | Admin | Create and publish a new campaign |
| PATCH | `/api/v1/campaigns/admin/:id` | Admin | Update campaign specs, budget, brief, or rules |
| PATCH | `/api/v1/campaigns/admin/:id/status` | Admin | Pause, activate, or archive campaign |
| POST | `/api/v1/campaigns/admin/:id/duplicate` | Admin | Clone existing campaign as DRAFT |

### Submissions & View Verification (`/submissions`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/submissions` | Creator | Submit video clip link for 48h view audit |
| GET | `/api/v1/submissions/my` | Creator | List own submitted clips and approval statuses |
| GET | `/api/v1/submissions/admin/all` | Admin | Review queue with filter by status (`PENDING`, `VERIFIED`, `REJECTED`) |
| PATCH | `/api/v1/submissions/admin/:id/review` | Admin | Approve verified views (automatically calculates reward and credits ledger) or reject with reason |

### Finance & Settlements (`/finance`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/finance/balance` | Creator | View current balance, ledger transactions, and payouts |
| POST | `/api/v1/finance/withdraw` | Creator | Request payout to Stripe Connect or USDC wallet |
| GET | `/api/v1/finance/admin/overview` | Admin | Platform escrow totals, allocated rewards, and pending payouts |
| GET | `/api/v1/finance/admin/withdrawals` | Admin | List withdrawal requests |
| PATCH | `/api/v1/finance/admin/withdrawals/:id/review` | Admin | Approve/process withdrawal (debits creator balance) |
| GET | `/api/v1/finance/admin/ledger` | Admin | Global ledger audit history |

### Dynamic CMS & Settings (`/cms`, `/admin`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/cms/:key` | Public | Fetch published CMS content (Hero, Stats, FAQs) |
| GET | `/api/v1/cms/admin/all` | Admin | List all editable website CMS blocks |
| PUT | `/api/v1/cms/admin/:key` | Admin | Update homepage copy and CMS parameters |
| GET | `/api/v1/admin/analytics/overview` | Admin | Real-time platform KPI dashboard data |
| GET | `/api/v1/admin/settings` | Admin | View platform financial & email settings |
| PUT | `/api/v1/admin/settings` | Super Admin | Update platform fee, min withdrawal, support email |
| GET | `/api/v1/admin/audit-logs` | Admin | Query immutable administrative audit logs |

---

## 5. Default Seed Accounts

When running `npm run prisma:seed` in `backend/`, the following accounts are initialized:

| Account Role | Email | Password | Department |
|---|---|---|---|
| **Super Admin** | `admin@collabefy.com` | `CollabefyAdmin2026!` | Executive Management |
| **Campaign Manager** | `campaigns@collabefy.com` | `CollabefyManager2026!` | Campaign Operations |
| **Finance Manager** | `finance@collabefy.com` | `CollabefyFinance2026!` | Financial Operations |
| **Support Manager** | `support@collabefy.com` | `CollabefySupport2026!` | Customer Experience |
| **Creator** | `alex@creators.xyz` | `CreatorPass2026!` | Alex Rivera (@alexrivera) |
| **Creator** | `sarah@creators.xyz` | `CreatorPass2026!` | Sarah Chen (@sarahc_tech) |
| **Brand** | `brand@cursor.sh` | `BrandPass2026!` | Cursor AI |

---

## 6. How to Run Locally

### Terminal 1: Backend API (Port 4000)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

### Terminal 2: Frontend (Port 3000)
```bash
npm install
npm run dev
```

Or run both simultaneously on Windows via PowerShell:
```powershell
.\scripts\start-all.ps1
```

---

## 7. Production Deployment Guide

### Deploying Backend to Railway / Render / Fly.io:
1. Create a new service from the `backend/` directory or use the provided `backend/Dockerfile`.
2. Attach a PostgreSQL database service.
3. Configure Environment Variables in the backend dashboard:
   ```env
   PORT=4000
   NODE_ENV=production
   DATABASE_URL=postgresql://collabefy:password@host:5432/collabefy?schema=public
   JWT_ACCESS_SECRET=your-64-character-random-secret
   JWT_REFRESH_SECRET=your-64-character-random-secret
   FRONTEND_URL=https://collabefy.com
   ```
4. Run migrations: `npx prisma db push` or `npx prisma migrate deploy`.

### Connecting Vercel Frontend:
1. In your Vercel Project Settings > Environment Variables:
   - `BACKEND_INTERNAL_URL`: `https://api.collabefy.com` (or your Railway backend URL)
   - `NEXT_PUBLIC_API_URL`: `https://api.collabefy.com`
2. Deploy the frontend. Next.js rewrites in `next.config.js` will seamlessly route `/api/v1/*` traffic directly to your secure production backend!
