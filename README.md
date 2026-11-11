# Collabefy — Creator Campaign Marketplace

> **Collabefy** is where creators find paid performance campaigns worth their time. Clear rules, transparent rates, verified views, and weekly payouts.

Built strictly according to the **Collabefy Product & Build Specification v1.0** (`md/Collabefy.md`).

---

## 🎨 Design System & Stitch MCP

Designed using the **Stitch MCP** server with the **Collabefy Design System** (`assets/7365538115566753193`) on Stitch Project: `projects/2970834159970369141`:

- **Design Philosophy**: Quiet confidence, tight craft, generous purposeful space. Content-first editorial product interface rather than a generic AI template.
- **Color Tokens**:
  - `--bg`: `#0E0F11` (Deep Obsidian)
  - `--surface-1`: `#141518` (Card & panel base)
  - `--surface-2`: `#1A1C20` (Raised inputs, hover)
  - `--surface-3`: `#22252A` (Active & pressed)
  - `--border`: `rgba(255, 255, 255, 0.08)`
  - `--border-strong`: `rgba(255, 255, 255, 0.16)`
  - `--text`: `#F2F3F5` (Off-white primary)
  - `--text-muted`: `#A0A4AB`
  - `--text-subtle`: `#6B7078`
  - `--accent`: `#C8F560` (Refined Lime, used with strict restraint for key numbers and primary CTAs)
  - `--accent-ink`: `#0E0F11`
  - `--success`: `#4ADE80`
  - `--warning`: `#F5B84B`
  - `--danger`: `#F26D6D`
- **Typography**: Clean grotesque sans-serif (`Geist Sans` / `Inter`) with monospaced tabular figures (`Geist Mono` / `tabular-nums`) for CPM rates, budgets, views, and rankings.

### Generated Stitch Screens:
1. **Marketplace Homepage & Directory** (`projects/2970834159970369141/screens/a776721c114d4e0c911fc2810d06895f`)
2. **Campaign Detail Page** (`projects/2970834159970369141/screens/cb8a0716144b44caa2a7752d4292a48c`)

---

## 🚀 Features & Architecture

### 1. Central Configuration (`src/site.config.ts`)
- Centralized `siteConfig` containing brand name, tagline, description, domain, accent color, legal entity name, support email, social and Discord links.
- No components hardcode the product name or links.

### 2. Public Marketplace Layer
- **Homepage (`/`)**:
  - Left-aligned display headline with trust badges.
  - Interactive hero preview card stack with live campaign data.
  - Live platform statistics band calculated purely from stored active records.
  - Curated featured campaigns grid.
  - 5-step editorial How It Works section.
  - Creator benefits & Discord community CTA.
- **Campaign Directory (`/campaigns`)**:
  - Instant debounced search matching titles, brands, and categories.
  - Multi-facet filters: Status (Active, Upcoming, Completed), Platform (TikTok, YouTube Shorts, Reels, X), Format (Developer Tools, UGC, etc.), and Sort (Newest, Highest CPM, Ending Soonest).
  - Active filter chips with individual removal and reset all.
  - Result counter and empty states.
- **Campaign Detail Page (`/campaigns/[slug]`)**:
  - 21:9 cinematic cover media with dark scrim.
  - Overlapping brand mark, status pill, platform tags, and breadcrumbs.
  - Main column: Overview & objective, creative brief, talking points, downloadable brand assets, 2-column structured rules & eligibility table, verified campaign leaderboard, and updates timeline.
  - Sticky right sidebar: Hero tabular rate callout (`$22.00 per 1,000 verified views`), pool progress bar, quick stats (views, clips, creators, countdown), primary Discord join CTA, and 4-step onboarding guide.
- **Leaderboards (`/leaderboard`)**:
  - Platform-wide verified rankings with audited status badges.
- **How It Works (`/how-it-works`)**:
  - Deep-dive into the Discord-first operational model and 48-hour fraud prevention audit.
- **Community Hub (`/community`)**:
  - Discord workspace guide and channel directory.
- **Brand Inquiries (`/contact`)**:
  - Contact form for brands launching performance sprints.
- **Legal & Compliance (`/terms`, `/privacy`)**:
  - Plain-language policies on performance terms, non-guaranteed earnings, anti-bot fraud filtering, and data privacy.

### 3. Creator Profiles & Auth
- **Sign In (`/login`)**, **Registration (`/register`)**, **Password Recovery (`/forgot-password`)**.
- **Creator Profile (`/profile`)**:
  - Profile image, username, bio, and total performance stats.
  - Social accounts list clearly distinguishing between **Unverified Manual Links** and **Verified OAuth Connections**.
  - Interactive form to connect new social handles.

### 4. Secure Admin Portal (`/admin`)
- **Admin Overview (`/admin`)**:
  - Real-time aggregated KPIs (ongoing campaigns, verified views, total rewards paid, active creators).
  - Quick campaign management table.
  - Integration health monitors (Discord Bot, 48h Auditor, Escrow Ledger).
  - Recent administrative activity feed.
- **Campaign Management (`/admin/campaigns`)**:
  - Table of all campaigns with instant pause/resume toggles, budget meters, and direct links.
- **Campaign Creator (`/admin/campaigns/new`)**:
  - Complete form covering basic info, auto-generated slug, rates, budget pool, platforms, brief, rules, and Discord channel routing.
- **Creator Directory (`/admin/creators`)**:
  - Searchable list of creators with verification status.
- **Audit Log (`/admin/audit-log`)**:
  - Administrative history of all campaign changes, budget increases, and approvals.
- **Platform Settings (`/admin/settings`)**:
  - Edit hero headline, Discord link, and support email.

---

## 🛠️ Development & Build

### Running locally:
```bash
# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for production:
```bash
npm run build
npm run start
```

