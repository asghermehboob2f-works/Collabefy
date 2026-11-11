# Collabefy — Product & Build Specification

**Document status:** Final specification, v1.0\
**Project name:** Collabefy\
**Category reference:** [Promote.fun](https://promote.fun) (dark, campaign-first creator marketplace)\
**Operating model:** Public campaign marketplace + creator accounts + secure administration + Discord-led operations

------------------------------------------------------------------------

## 0. How to use this document

This document is the single source of truth for building Collabefy. It is written for a developer or AI coding assistant and should be followed in order.

**Hard rules**

1.  Build a production-minded, maintainable web application, not a static mockup.
2.  Use **Collabefy** everywhere the product name appears: logo, page titles, metadata, emails, footer, legal pages, repository, package name and code comments. Keep it in one central config file (see §15) so a future change is a one-line edit.
3.  Take *inspiration* from Promote.fun's category and broad direction (dark, performance-oriented, campaign-led) but use original branding, copy, layouts, components and assets. Never copy its source code, proprietary assets or exact page designs.
4.  Never display fabricated campaign counts, earnings, views, testimonials, logos or platform-wide statistics. Every public number must come from stored data.
5.  Seed data is allowed in development only, must be clearly labelled, and must never ship to production.
6.  Do not build Phase 5 features (§19) unless explicitly approved.

**Quality bar:** The finished site should feel like an established, carefully designed creator marketplace, not a template. Clear, credible, fast, restrained and premium.

------------------------------------------------------------------------

## 1. Product vision

Collabefy is a campaign marketplace where brands, creators and editors discover promotional campaigns and understand exactly what each opportunity offers, before they join.

The **public website** is the discovery, information and recruitment layer. It shows active campaigns, budgets and rates, requirements, rules, public performance information and leaderboards. Creators can create accounts, maintain profiles and list their social channels.

**Discord is the primary operational workspace.** Campaign discussion, community support, task coordination, assignments, creator communication, manual review and day-to-day verification happen in Discord and through the internal team. The website links each user into the correct Discord community or campaign channel.

A **secure admin dashboard** publishes and manages campaigns and maintains everything shown publicly.

### Positioning

-   **One-line description:** Collabefy is where creators find paid campaigns worth their time.
-   **Recommended tagline options** (owner to pick one, keep configurable):
    -   "Create. Collaborate. Get paid for performance."
    -   "Real campaigns. Clear rules. Paid on performance."
    -   "Campaigns for creators who ship."
-   **Tone of voice:** confident, plain, specific. No hype, no get-rich language, no emoji in product copy.

### Product principles

-   Campaigns are the centre of the experience.
-   Make rates, budgets, rules and eligibility clear *before* a creator joins.
-   Keep the interface premium, restrained, fast and trustworthy.
-   Avoid generic AI-generated visual patterns and decoration for its own sake.
-   Make the website useful even when operational work happens in Discord.
-   Treat every public performance figure as sourced, calculated or explicitly marked as an estimate.
-   Never imply guaranteed earnings.

------------------------------------------------------------------------

## 2. Roles and permissions

### Visitor

-   Browse the homepage and public campaign catalogue.
-   Search and filter campaigns.
-   Open campaign detail pages.
-   View public campaign information and public leaderboards, where enabled.
-   Follow Discord invitation links.
-   Register or sign in.

### Creator / editor

-   Register and sign in.
-   Manage profile details and profile image.
-   Add social profile links and usernames; select the platforms they publish on.
-   Add portfolio links and a short bio.
-   View campaigns and requirements.
-   Follow a campaign-specific Discord invitation or application route.
-   View public campaign leaderboards.
-   Manage account settings and privacy.
-   See the status of any website-side application, if applications are enabled later.

The website is **not** the operational task manager in the first release. Do not build clip uploading, task assignment, moderation queues or automated payout processing unless approved as a later phase.

### Administrator

-   Access a protected admin area.
-   Create, edit, preview, publish, schedule, pause, resume, complete, cancel, archive and duplicate campaigns.
-   Upload campaign images and brand assets.
-   Configure rates, budgets, dates, rules and platforms.
-   Configure Discord invitation links per campaign.
-   Set leaderboard visibility and display rules.
-   Manage campaign ordering and featured campaigns.
-   View and manage creator accounts.
-   Review platform content and reported issues.
-   View an audit log of important administrative actions.
-   Manage site-wide settings and integrations, subject to permissions.

### Staff roles (role-based access control)

| Role | Scope |
|---|---|
| Owner / super administrator | Everything, including security settings, staff management and integrations |
| Campaign manager | Campaigns, assets, leaderboards. No security settings, no staff management, no sensitive account data |
| Moderator | Creator accounts, reports, content review |
| Analyst (read-only) | Dashboards and exports. No edits |

Permissions must be enforced server-side and follow least privilege.

------------------------------------------------------------------------

## 3. Website information architecture

### Public routes

| Route | Purpose |
|---|---|
| `/` | Homepage and platform overview |
| `/campaigns` | Browse all campaigns |
| `/campaigns/[slug]` | Individual campaign detail page |
| `/leaderboard` | Optional platform-wide leaderboard |
| `/about` | Platform and operating model |
| `/how-it-works` | How creators discover and join campaigns |
| `/faq` | Frequently asked questions |
| `/community` | Discord community landing / invitation |
| `/login` | Sign in |
| `/register` | Create an account |
| `/forgot-password` | Password recovery |
| `/profile` | Creator profile |
| `/settings` | Account and privacy settings |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |
| `/contact` | Contact and support |

### Admin routes

All admin routes must be protected **server-side**. Hiding admin links in the UI is not security. Admin pages must send `noindex` and must never appear in the sitemap.

| Route | Purpose |
|---|---|
| `/admin` | Overview |
| `/admin/campaigns` | Campaign management |
| `/admin/campaigns/new` | Create a campaign |
| `/admin/campaigns/[id]` | Edit a campaign |
| `/admin/creators` | Creator account management |
| `/admin/leaderboards` | Leaderboard controls and data |
| `/admin/integrations` | Discord and approved external integrations |
| `/admin/team` | Staff accounts and roles |
| `/admin/audit-log` | Administrative activity history |
| `/admin/settings` | Site configuration |

The final route structure can change to fit the framework, but public and privileged areas must stay clearly separated.

------------------------------------------------------------------------

## 4. Brand identity

Branding must be centralized so the identity can be changed in one place.

### Name and wordmark

-   Product name: **Collabefy**.
-   Create an original **text wordmark** in the chosen sans-serif (medium or semibold weight, slightly tightened tracking). Optional: a small, simple monogram mark derived from the letter "C" (for example a clean geometric C or two interlocking arcs, suggesting collaboration). No clip-art, no stock icons, no gradients in the logo.
-   Provide the logo as SVG in light-on-dark and dark-on-light variants, plus a square favicon / app icon.
-   Minimum clear space around the logo equals the height of the "C".

### Colour (recommended defaults, owner can override)

One accent only. The accent is used for primary actions, active states, key figures and focus rings, and nothing else.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0E0F11` | Page background |
| `--surface-1` | `#141518` | Cards, panels |
| `--surface-2` | `#1A1C20` | Raised elements, inputs, hover |
| `--surface-3` | `#22252A` | Active / pressed surfaces |
| `--border` | `rgba(255,255,255,0.08)` | Default 1px borders |
| `--border-strong` | `rgba(255,255,255,0.16)` | Hover and focus-adjacent borders |
| `--text` | `#F2F3F5` | Primary text (off-white, never pure white) |
| `--text-muted` | `#A0A4AB` | Secondary text |
| `--text-subtle` | `#6B7078` | Tertiary text, captions |
| `--accent` | `#C8F560` | Primary accent (recommended: refined lime) |
| `--accent-ink` | `#0E0F11` | Text on accent backgrounds |
| `--success` | `#4ADE80` | Active / verified |
| `--warning` | `#F5B84B` | Upcoming / pending |
| `--danger` | `#F26D6D` | Ended with issue / rejected |

Rules: all text/background pairs meet WCAG AA contrast. Never use a purple-to-blue gradient. Use the accent sparingly: if more than roughly 5% of a screen is accent-coloured, reduce it.

### Light theme

Ship dark as the default and primary experience. A light theme is optional and must not delay launch. If added, it uses the same tokens with inverted values and honours `prefers-color-scheme`.

------------------------------------------------------------------------

## 5. Visual design system

The goal is a **natural, high-end, professional** look: quiet confidence, tight craft, generous but purposeful space. Think editorial product interface rather than landing-page template.

### 5.1 Principles

-   **Content-first.** Campaign artwork, rates and rules are the visual centrepieces. Chrome stays out of the way.
-   **Hierarchy through type and spacing, not decoration.** Use size, weight, colour and whitespace before reaching for boxes, shadows or effects.
-   **Depth through layers, not glow.** Surfaces step up in lightness (`surface-1` → `surface-2` → `surface-3`) with 1px borders. No neon, no heavy shadows.
-   **Numbers are the hero.** Rates, budgets and views use tabular figures in a monospace or tabular-nums style so they scan quickly and align.
-   **Consistency over novelty.** One radius scale, one spacing scale, one type scale, one icon set.

### 5.2 Typography

-   **Primary family:** Geist Sans (fallback: Inter, system-ui). Load via `next/font` with `display: swap` and subsetting.
-   **Numeric / data family:** Geist Mono (or `font-variant-numeric: tabular-nums` on the primary family) for rates, budgets, counts, ranks and timestamps.
-   Use a small, strict scale:

| Role | Size / line height | Weight | Notes |
|---|---|---|---|
| Display (hero only) | 56 / 60 desktop, 38 / 42 mobile | 600 | Tracking -0.03em. Used once per page |
| H1 | 40 / 44 | 600 | Page titles |
| H2 | 28 / 34 | 600 | Section titles |
| H3 | 20 / 28 | 600 | Card and subsection titles |
| Body L | 17 / 28 | 400 | Intro paragraphs |
| Body | 15 / 24 | 400 | Default |
| Small | 13 / 20 | 400 / 500 | Meta, captions, labels |
| Overline | 12 / 16 | 500 | Uppercase, +0.06em tracking, used sparingly |

-   Do not make every section heading huge. Reserve the display size for the hero.
-   Maximum line length for reading text: 65 to 75 characters.

### 5.3 Layout, spacing and shape

-   **Grid:** 12 columns, max content width 1200px, 24px gutters desktop, 16px mobile.
-   **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96. Section vertical padding: 80 to 96 desktop, 56 mobile. Avoid huge empty sections.
-   **Radius:** 6px (inputs, small chips), 10px (buttons), 14px (cards), 20px (large media). Avoid heavily rounded cards and avoid pill shapes except tiny status dots and the single "live" indicator.
-   **Borders:** 1px `--border`. Prefer borders over shadows. If a shadow is used (menus, dialogs), keep it soft and low-opacity.
-   **Dividers:** hairline rules between sections instead of coloured bands.

### 5.4 Iconography and imagery

-   One consistent icon set (Lucide or Phosphor, 1.5px stroke). Platform logos (TikTok, Instagram, YouTube, X, Discord) used at small size, monochrome by default, in the platform's brand colour only on hover where brand guidelines allow.
-   Campaign imagery is the visual identity. Give cover images room, use consistent aspect ratios (16:9 for covers, 1:1 for brand logos), and apply a very subtle bottom gradient scrim so text over images is always legible.
-   Do not use stock photography, AI-generated filler art, floating 3D shapes, dotted backgrounds or mesh gradients.
-   When no cover image exists, use a clean typographic placeholder (brand initial on `surface-2`), never a generic illustration.

### 5.5 Motion

-   Subtle and purposeful. Durations 120 to 220ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
-   Allowed: hover lift of 2px on cards with border brighten, fade-and-rise on first scroll into view (max 12px, once only), skeleton shimmer, smooth filter list transitions, number count-up on the stats row (once, short).
-   Not allowed: parallax, looping animations, bouncing, scroll-jacking, cursor effects.
-   Respect `prefers-reduced-motion`: disable all non-essential motion.

### 5.6 Avoid

-   Generic purple-to-blue gradients.
-   Excessive glow and neon.
-   Random floating decorative objects.
-   Unnecessary dotted or grid backgrounds.
-   Too many pill-shaped containers.
-   Excessively rounded cards.
-   Huge empty sections or oversized headings everywhere.
-   Fake testimonials, invented metrics or placeholder brand logos in production.
-   Stock imagery that makes the site look like a template.
-   Emoji in the interface.

### 5.7 Component library

Build a coherent set of reusable components with documented states (default, hover, focus-visible, active, disabled, loading, error):

-   **Header / navigation** (sticky, blur background after scroll, 1px bottom border on scroll).
-   **Buttons:** Primary (accent fill, `accent-ink` text), Secondary (surface-2 with border), Ghost, Destructive. Height 40 (default) and 48 (hero). Never more than one primary button per viewport region.
-   **Links:** underlined on hover, accent only for inline emphasis.
-   **Campaign card** (see §7.2).
-   **Status label:** small, 12px, dot + text (Active green, Upcoming amber, Paused grey, Ended muted, Budget exhausted amber-outline). Not a large pill.
-   **Platform icon group.**
-   **Stat block:** big tabular figure, small label, optional "as of" caption.
-   **Leaderboard row:** rank, avatar, name, verified views, last updated.
-   **Tabs, segmented control, filter chips, dropdowns, range slider.**
-   **Form fields** with visible labels, helper text and inline errors.
-   **Tables** (sticky header, dense option, horizontal scroll on mobile).
-   **Dialogs, drawers (mobile filters), toasts, tooltips.**
-   **Empty states, error states, loading skeletons.**
-   **Admin shell:** left rail navigation, breadcrumb, content area, sticky action bar.

### 5.8 Responsive design

Design mobile-first for 360px upward. Breakpoints: 640, 768, 1024, 1280. Campaign cards, filters, tables, admin forms and leaderboards must stay fully usable on narrow screens (filters in a bottom drawer, tables collapse to stacked rows or scroll in a contained region). No horizontal page scroll at any width.

### 5.9 Accessibility

-   Full keyboard navigation and visible focus rings (2px accent outline, 2px offset).
-   WCAG AA contrast minimum.
-   Semantic HTML landmarks and heading order.
-   Accessible names for all controls and icon buttons.
-   `prefers-reduced-motion` support.
-   Form errors announced to assistive tech; status changes use `aria-live`.
-   Minimum touch target 44x44px.

------------------------------------------------------------------------

## 6. Homepage

The homepage must immediately communicate that Collabefy is an **active campaign marketplace**.

### 6.1 Header

-   Collabefy wordmark (links to `/`).
-   Nav: Campaigns, How it works, Leaderboard (if enabled), Community (Discord).
-   Right side: Sign in (ghost) and primary CTA "Browse campaigns" or "Join as creator".
-   Mobile: full-height slide-in menu with the same items, large tap targets.

### 6.2 Hero

-   **Layout:** left-aligned headline block on desktop with a real campaign preview on the right (a live, database-driven stack of two or three real campaign cards with subtle offset). If there are no live campaigns, show a clean empty-state hero without fake cards.
-   **Headline:** short and confident, no income promises. Examples: "Campaigns for creators who deliver." / "Create content. Get paid for performance." Keep the final wording in the CMS-editable site settings.
-   **Supporting paragraph:** one or two sentences, plain language.
-   **CTAs:** primary "Browse campaigns", secondary "Join the community" (Discord).
-   **Trust line (optional, only if true):** "Rules and rates shown upfront on every campaign."
-   Background: flat `--bg` with a very soft, single-colour radial vignette at low opacity. No gradients across hues.

### 6.3 Live platform statistics

Show verified, database-backed values only:

-   Ongoing campaigns.
-   Total campaigns launched.
-   Total views generated (only if supported by reliable records).
-   Total rewards paid (only if supported by reliable records).
-   Active creators (only if accurately measured).

Requirements:

-   Ongoing campaign count is calculated from campaigns whose **status and dates qualify them as active** at request time.
-   Never hardcode statistics.
-   If a metric is unavailable, omit it. Development-only placeholders must be labelled.
-   Define the calculation and time window for every metric in code comments and admin settings.
-   Cache aggregates briefly (for example 60 seconds) and invalidate on relevant campaign changes.
-   Display style: a single horizontal band of 3 to 4 stat blocks with hairline dividers, tabular figures, small label beneath, and a tiny "Updated {time}" caption.

### 6.4 Featured campaigns

Show selected active campaigns (admin-curated) using the campaign card in §7.2. Include a "View all campaigns" link. Horizontal layout of 3 cards on desktop, 1 on mobile with snap-scroll.

### 6.5 How it works

Five concise steps, each with a number, title and one sentence:

1.  Discover a campaign.
2.  Review the rules and rate.
3.  Join through Discord or apply.
4.  Create and publish your content.
5.  Submit or report as the campaign requires. The team verifies performance and handles rewards.

Do not claim the website automatically verifies views or pays creators if those processes are manual.

### 6.6 Additional sections

-   **Platform benefits** (three or four short, specific benefits, no filler).
-   **Leaderboard preview** (top entries of a selected public leaderboard, with last-updated time).
-   **FAQ preview** (4 to 6 questions, expandable, links to `/faq`).
-   **Discord community CTA** (clean panel with a short explanation of what members get).
-   **Footer:** wordmark, short description, navigation columns (Platform, Company, Legal), Discord and social links, copyright "© {year} Collabefy".

------------------------------------------------------------------------

## 7. Campaign marketplace

### 7.1 Campaign catalogue (`/campaigns`)

A searchable, filterable directory.

**Layout (desktop):** sticky left filter column (280px) + results grid (2 to 3 columns). **Mobile:** search bar, a "Filters" button opening a bottom drawer, and a single-column list.

**Search** matches title, brand, category and relevant keywords, with a short debounce and instant results.

**Filters:**

-   Status: Active, Upcoming, Completed.
-   Platform.
-   Campaign type.
-   Reward rate range.
-   Application required / Open participation.
-   Sort: Newest, Ending soon, Highest reward rate.

**Required behaviours:**

-   Clear-all filters.
-   Active filter chips above results with individual remove.
-   Result count.
-   Empty state with a useful message and a clear-filters action.
-   Loading skeletons matching card layout.
-   Pagination or accessible load-more.
-   Filter and search state stored in **URL query parameters** so views are shareable and back-button safe.

### 7.2 Campaign card

The card is the most important component. Specification:

-   **Media:** 16:9 cover with subtle bottom scrim; brand logo (1:1, 36px, 1px border) overlapping the lower left corner.
-   **Top row:** status label (left) and platform icons (right).
-   **Title** (H3, max two lines) and brand name (muted).
-   **Reward block:** the rate as the hero figure in tabular type, with the unit beneath, for example **$X** `per 1,000 verified views`.
-   **Budget indicator:** if public, a thin progress bar (4px, accent fill on `surface-3`) with "$X of $Y" in small mono text. Hide the bar if budget is private.
-   **Meta row:** end date or time remaining, and an "Application required" tag only when true.
-   **Interaction:** whole card is a single link. On hover: border brightens, card lifts 2px, cover scales 1.02. Visible focus ring.
-   Never show a rate or budget the campaign has set to private.

### 7.3 Campaign types

Administrators define campaign types rather than the system hardcoding categories. Seed examples: short-form clipping, UGC, fan-page content, audio / music promotion, logo or brand promotion, product promotion, plus custom types.

------------------------------------------------------------------------

## 8. Campaign detail page (`/campaigns/[slug]`)

Every campaign has a dedicated, stable, server-rendered route. This is a core page and deserves particular design care.

### 8.1 Layout

Two-column on desktop: wide main column (brief, rules, leaderboard, updates) and a **sticky right sidebar** (key figures + join CTA). On mobile the sidebar collapses to a sticky bottom action bar containing the rate and the join button.

### 8.2 Header

-   Large cover image (21:9 on desktop, 16:9 on mobile) with scrim.
-   Brand logo, campaign title (H1), brand name, status label.
-   Short summary.
-   Platform icons with names.
-   Primary join CTA and a "Share campaign" action (copy link, native share on mobile).
-   Breadcrumb: Campaigns / {title}.

### 8.3 Key figures (sidebar and summary)

Display only fields configured as public:

-   Reward rate and exact unit (largest element).
-   Total budget and remaining budget (progress bar).
-   Views generated.
-   Approved submissions or clips.
-   Start and end dates (with time zone) and time remaining.
-   Optional: maximum reward per post, minimum view threshold, campaign-wide view target.

Include a clear, calm line: "Rewards depend on the campaign rules and verified performance. Rates are not guaranteed earnings."

### 8.4 Brief

Rich-text content with good typography (65 to 75 character measure):

-   Campaign objective.
-   What creators should make.
-   Content themes and required talking points.
-   Brand or product information.
-   Reference videos and links (embedded safely or as links).
-   Downloadable assets / resources.
-   Examples of acceptable content.

### 8.5 Rules and eligibility

Structured, scannable, visible before joining. Use a two-column definition layout (label left, detail right) grouped by theme:

-   Accepted content formats and platforms.
-   Account eligibility.
-   Minimum and maximum video duration.
-   Required hashtags, tags, captions or sounds.
-   Prohibited content.
-   Geographic or audience requirements.
-   View thresholds.
-   Duplicate-content rules.
-   Submission deadline.
-   Verification and dispute policy.
-   Reward calculation and payout terms.

Important restrictions must never be hidden behind vague expandable text. A short "Key rules" summary may sit above the full list.

### 8.6 How to join

The CTA follows the campaign's configured method:

-   Main Discord invitation.
-   Campaign-specific Discord invitation.
-   External application URL.
-   Website-side application flow (only if enabled later).

For Discord links: open the correct invite in a new tab with `rel="noopener noreferrer"`, explain what to do after joining (a short numbered list), show a fallback community link if a campaign-specific invite is missing, and never expose private channels or tokens.

### 8.7 Campaign leaderboard

Optional per campaign.

-   Columns: rank, avatar, creator display name, public handle (only if consented), verified views, approved posts, reward earned (only if the campaign publishes it).
-   Period tabs: Daily, Weekly, Monthly, All-time, where data exists.
-   Show a "Last updated" timestamp.
-   Clearly separate **verified** from **pending or estimated** figures (label and visual treatment, not just colour).
-   Top three rows get a subtle emphasis (a rank numeral treatment, not medals or confetti).
-   Admins can hide the leaderboard or specific fields.
-   Never expose private creator information. Never fabricate rankings.
-   Link to the ranking rules and a dispute/correction route.

### 8.8 Updates

Optional timeline of campaign updates: new rules, budget changes, deadline changes, paused or resumed notices, announcements and links to relevant Discord posts. Each entry has a date and short text.

### 8.9 Campaign states

Handle each state with an appropriate explanation and CTA:

| State | Banner / treatment | CTA |
|---|---|---|
| Upcoming | "Starts {date}" | "Join Discord to get notified" |
| Active | None | Join / Apply |
| Paused | "Paused by the team" with note | Disabled, link to updates |
| Budget exhausted | "Budget fully allocated" | Disabled, "Browse other campaigns" |
| Ended | "This campaign has ended" | "Browse active campaigns" |
| Cancelled | Reason if provided | "Browse active campaigns" |
| Archived | Hidden from catalogue, still accessible by URL with a notice | None |

An ended, cancelled or exhausted campaign must never show an active join button.

------------------------------------------------------------------------

## 9. Creator accounts and profiles

### 9.1 Registration and authentication

-   Email and password registration with email verification.
-   Secure sign-in, password reset, session management.
-   Optional OAuth sign-in (Google, Discord) where configured.
-   Account deletion request flow.
-   Auth pages: centred card on `--bg`, wordmark above, minimal fields, clear errors, no marketing clutter.

### 9.2 Creator profile fields

-   Display name and unique username / profile slug.
-   Avatar and short bio.
-   Country or region, only where necessary and voluntarily supplied.
-   Social platforms with public profile URLs / handles.
-   Portfolio links.
-   Preferred content categories.
-   Discord username or linked Discord identity, only with consent.

### 9.3 Social account connections

Distinguish between:

1.  A **manually entered** public profile link (display as "Unverified").
2.  An account **verified through an official OAuth or platform-supported process** (display "Verified" with the method).

Never label a manually entered URL as verified. When OAuth is used, store provider account IDs and the minimum metadata, protect tokens, and never send them to the browser.

### 9.4 Public profile privacy

Creators choose which profile details are public. Never expose email addresses, private Discord identifiers, payment details or other sensitive information.

------------------------------------------------------------------------

## 10. Secure administration dashboard

The admin dashboard is essential. It must be a real authenticated administrative application, not a visual-only page. Visually it shares the same design system but is denser and more utilitarian: left rail navigation, compact tables, sticky action bars.

### 10.1 Overview

-   Active, upcoming, completed and total campaigns.
-   Registered creators.
-   Recent campaign updates and recent admin activity.
-   Integration health indicators.

All analytics are calculated from actual stored records.

### 10.2 Campaign creation and edit form

Use a sectioned form with a sticky side outline, autosave of drafts, inline validation, and a live preview panel.

**Basic information:** title, URL slug (auto-generated, editable, unique), brand / client name, campaign type, short summary, full description, cover image, brand logo.

**Budget and rewards:** total budget, currency, reward rate, reward unit (per 1,000 views, per view, fixed bounty, per approved post, custom), maximum reward per post, minimum views, maximum campaign views, budget visibility, reward visibility, reward calculation notes.

**Dates and status:** start date and time, end date and time, time zone, status, featured toggle.

**Platforms and eligibility:** accepted platforms, application-required toggle, eligibility requirements, accepted regions, minimum account requirements.

**Content and rules:** campaign brief, rules (ordered, titled blocks), required hashtags / tags / sounds, prohibited content, video references, asset links, submission instructions.

**Discord and external links:** main Discord invitation, campaign-specific Discord invitation, external application link, support / announcement link.

**Leaderboard:** enable / disable, public ranking fields, ranking period, data source, last-updated timestamp.

### 10.3 Campaign management actions

Save draft, preview, publish, schedule, edit, pause, resume, mark completed, cancel, archive, duplicate. Require confirmation for destructive or high-impact actions. Record who performed each action and when.

### 10.4 Content management

-   Upload and replace images (with automatic resizing, WebP/AVIF conversion, and alt text field).
-   Manage FAQs.
-   Choose and order homepage featured campaigns.
-   Edit hero headline and supporting copy.
-   Configure which public statistics are shown.
-   Manage Discord invitation links.
-   Update legal and informational pages.

### 10.5 Admin security

-   Server-side role and permission checks on every route and action.
-   Strong password policy and secure password hashing (Argon2id or bcrypt with appropriate cost).
-   Multi-factor authentication required for administrators.
-   Rate limiting on login and sensitive actions.
-   Secure, HTTP-only, same-site cookies.
-   CSRF protection where applicable.
-   Input validation (schema-based) and output escaping.
-   Audit logs for important actions.
-   Session listing and revocation.
-   Least-privilege staff permissions.
-   Secrets in environment variables only.
-   Automated database backups and a tested recovery plan.

Never store admin passwords in plain text, expose secret keys in frontend code, or rely only on hiding admin routes in the UI.

------------------------------------------------------------------------

## 11. Discord integration

Discord is the primary operational hub for the initial release.

### 11.1 Phase-one integration (invite links)

-   Main community invitation in header, footer and homepage.
-   Campaign-specific invitation stored on each campaign.
-   Campaign detail page links to the appropriate invitation.
-   Clear instructions for what happens after joining.
-   Optional Discord server widget, only if it fits the design and privacy requirements.

### 11.2 Optional bot integration (later)

A bot can welcome new members, assign roles, direct members to campaign channels, post campaign announcements, notify channels when campaigns launch or change, link to campaign pages, and send staff notifications about new registrations or applications. Use only the permissions required, store the token server-side, and never place it in frontend code or public repositories.

### 11.3 Identity linking

If users can connect Discord: use the official OAuth2 flow, request only required scopes, verify the returned identity server-side, let users disconnect, and never treat a typed username as proof of Discord identity.

The first release works perfectly well with invitation links alone.

------------------------------------------------------------------------

## 12. External platform integrations

Use official APIs and documented OAuth flows wherever possible.

| Platform | Potential use | Important limitation |
|---|---|---|
| Discord | Community, roles, announcements, notifications | Bot permissions and server configuration required |
| YouTube | Connect channel, retrieve permitted channel/video metrics | API quota, scopes and metric availability |
| TikTok | Account connection, permitted public/video data | API access depends on product approval and scopes |
| Instagram | Professional account connection, permitted media insights | Account type and Meta permissions matter |
| X | Connect account, retrieve permitted data | API access and pricing may restrict features |
| Google | Optional sign-in | OAuth consent and verification requirements |
| Analytics provider | Traffic and conversion measurement | Consent and privacy obligations |

Do not promise automatic view verification across every platform.

### Integration architecture

-   A provider adapter per supported platform.
-   Credentials server-side only.
-   OAuth state validation and secure callback handling.
-   Encrypt access and refresh tokens at rest.
-   Request minimum scopes.
-   Handle expired tokens and revoked permissions.
-   Respect rate limits and API terms.
-   Log sync failures without logging secrets.
-   Track last-synchronized time.
-   Manual review / data-entry fallback for metrics that cannot be obtained reliably.

### Metrics and verification

For every external metric store: provider, provider content ID, metric name, value, retrieval time, reporting period, verification status, source / method, and an error or review note where applicable. Keep verified, pending, rejected and estimated figures separate.

------------------------------------------------------------------------

## 13. Leaderboards and performance data

Leaderboards can be campaign-specific or platform-wide, and daily, weekly, monthly or all-time.

**Ranking criteria:** verified views, approved posts, total approved rewards, or campaign points if a documented points system is introduced.

### Data ownership

Because Discord and staff handle initial verification, the first release uses an **admin-only form or controlled CSV import** to update leaderboard records. Later, official APIs can populate supported metrics automatically. Do not scrape platforms in ways that violate their terms or bypass access controls.

### Fairness and transparency

-   Publish ranking rules.
-   Show last-updated time.
-   Provide a correction / dispute route.
-   Avoid exposing private data.
-   Keep an audit trail of manual adjustments.
-   Distinguish pending metrics from approved metrics.

------------------------------------------------------------------------

## 14. Recommended technical architecture

A suggested architecture, not a final framework decision.

### Frontend and application

-   Next.js (App Router) with TypeScript.
-   React components, Tailwind CSS with design tokens from §4 and §5 mapped into the Tailwind theme.
-   Accessible primitives (Radix UI or similar) for dialogs, menus, tabs and tooltips.
-   Server-rendered public campaign pages for performance and search visibility.
-   `next/image` with responsive sizes and AVIF/WebP.

### Backend

-   Next.js route handlers / server actions, or a separate API service.
-   PostgreSQL with Prisma or Drizzle.
-   Authentication via a vetted provider or a carefully implemented solution (Auth.js, Clerk, Supabase Auth or similar).
-   Object storage for campaign images and avatars.
-   Background jobs for scheduled campaign changes (start, end), notifications and API sync.
-   Schema validation with Zod on all inputs.

### Infrastructure

-   Hosting appropriate to the framework, with a CDN.
-   Managed PostgreSQL with automated backups.
-   Transactional email provider.
-   Error monitoring and uptime monitoring.
-   Privacy-respecting analytics.
-   Separate development, staging and production environments.

### Performance targets

-   Largest Contentful Paint under 2.0s on a mid-range mobile device over 4G for `/`, `/campaigns` and `/campaigns/[slug]`.
-   Cumulative Layout Shift under 0.05 (reserve image and skeleton space).
-   Initial JS for public pages kept lean; admin code split from the public bundle.
-   Lighthouse scores: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.

### Logical modules

Authentication; users and creator profiles; campaigns; campaign assets; campaign rules; campaign links and integrations; leaderboards; metrics and metric history; admin roles and permissions; audit logs; notifications; site settings.

Keep integrations modular so the platform does not depend on one social network or on Discord for its core data model.

### Central configuration

Create a single `site.config` (and design-token file) containing: product name (**Collabefy**), tagline, description, domain, logo paths, accent colour, social and Discord links, support email, legal entity name, default metadata and footer text. No component should hardcode these.

------------------------------------------------------------------------

## 15. Initial database model

### User
id, email, password hash or external auth identity, display name, username, avatar URL, bio, role, email verification status, account status, created_at, updated_at.

### CreatorSocialAccount
id, user_id, platform, profile URL, platform username, provider account ID (if authorized), verification method, verification status, connected_at.

### Campaign
id, title, slug, brand name, summary, description, campaign type, cover image, logo, status, currency, total budget, remaining budget (if tracked), reward rate, reward unit, start_at, end_at, featured, featured_order, application_required, main Discord URL, campaign Discord URL, external application URL, leaderboard_enabled, budget_visibility, reward_visibility, created_by, created_at, updated_at.

### CampaignRule
id, campaign_id, title, content, display_order.

### CampaignPlatform
id, campaign_id, platform.

### CampaignAsset
id, campaign_id, title, asset URL, asset type, alt text.

### CampaignUpdate
id, campaign_id, title, body, published_at, created_by.

### LeaderboardEntry
id, campaign_id, user_id or public creator label, rank, verified views, approved posts, reward amount (if public), period, last_updated_at, source.

### MetricSnapshot
id, campaign_id, provider, metric, value, captured_at, verification status, source reference.

### AdminAuditLog
id, admin_user_id, action, entity type, entity ID, timestamp, safe metadata.

### IntegrationConnection
id, user_id or system owner ID, provider, provider account ID, encrypted token reference, scopes, status, connected_at, expires_at.

### SiteSetting
key, value (JSON), updated_by, updated_at (hero copy, FAQs, statistics configuration, Discord links).

Use appropriate indexes, foreign keys, unique constraints (for example `Campaign.slug`) and transactions. Review the final schema against the chosen ORM and authentication provider.

------------------------------------------------------------------------

## 16. Search engine and sharing

-   Unique title and description per campaign.
-   Canonical URLs.
-   Open Graph and Twitter card metadata (default share image 1200x630 using the Collabefy brand).
-   Dynamically generated campaign share images (title, brand, rate) where possible.
-   XML sitemap and robots directives.
-   Structured data only where accurate and applicable.
-   Fast loads and optimized images.
-   Human-readable campaign slugs.
-   Theme colour meta set to the `--bg` value.

Private admin routes, private profile data and authenticated pages must not be indexed.

------------------------------------------------------------------------

## 17. Copy and content guidelines

-   Plain, specific, calm. Prefer "Rewards depend on verified performance" over "Earn big".
-   Always show the unit with a rate.
-   Avoid superlatives, urgency tricks and income claims.
-   Button labels are verbs: "Browse campaigns", "Join Discord", "View rules".
-   Empty states explain what happened and what to do next.
-   Error messages say what went wrong and how to fix it, without blame.
-   Dates in the user's locale with the time zone shown for campaign deadlines.
-   Currency formatted with `Intl.NumberFormat`.
-   Do not claim the website guarantees payment or verification unless the operating model supports it.

------------------------------------------------------------------------

## 18. Privacy, legal and trust

Before launch, prepare: terms of service, privacy policy, cookie policy (if applicable), campaign-specific terms, creator eligibility and age requirements, content ownership / licensing terms, prohibited-content policy, view verification policy, reward and payout policy, dispute and appeal process, contact and support details.

The platform must explain who is responsible for approving work and issuing payments. Do not imply that Discord or the website guarantees payment unless the actual operating agreement supports it.

Collect only necessary personal data. Never expose private social tokens, email addresses, payment details or internal moderation notes. Have qualified legal advice review the final terms, especially regarding creator age, international participation, taxes, intellectual property and payment obligations.

------------------------------------------------------------------------

## 19. Delivery phases

### Phase 1: Public marketplace foundation
Design system and responsive shell; homepage; live campaign statistics; campaign directory with search and filters; campaign detail pages; rules and public leaderboard presentation; Discord invitation links; FAQ, about, contact and legal page structure.

### Phase 2: Authentication and creator profiles
Registration and login; email verification and recovery; creator profile; social profile links; public/private profile controls; optional Discord OAuth linking.

### Phase 3: Secure admin CMS
Admin authentication, MFA and roles; campaign creation and editing; draft / publish / pause / complete workflow; asset management; Discord links; leaderboard controls and import; audit log; homepage content and statistics management.

### Phase 4: Integrations
Discord bot (if needed); official social platform OAuth integrations; supported metric synchronization; notifications; admin-assisted metric imports and verification.

### Phase 5: Advanced marketplace capabilities
Only after the operating model is validated: website-side applications; creator participation records; submission management; automated verification where supported; earnings ledger; payout integration; fraud and abuse monitoring; brand accounts and self-service campaign creation.

Do not build Phase 5 merely because it is technically possible. The initial product is intentionally Discord-led.

------------------------------------------------------------------------

## 20. Functional acceptance checklist

The first production release is not complete until:

**Functionality**

-   [ ] Homepage shows accurate ongoing-campaign counts from the database.
-   [ ] Campaign cards are populated from real campaign records.
-   [ ] Search and filters work and are shareable by URL.
-   [ ] Every campaign has its own stable detail page.
-   [ ] Campaign rules, pricing, budget and dates are configurable.
-   [ ] Campaign status changes are reflected publicly.
-   [ ] Campaign-specific Discord links work.
-   [ ] Users can register, sign in and recover accounts.
-   [ ] Users can manage social profile links.
-   [ ] Private profile information is not publicly exposed.
-   [ ] Administrators can create, preview, publish, pause and close campaigns.
-   [ ] Important admin actions are logged.
-   [ ] Leaderboards distinguish verified from unverified data.

**Security**

-   [ ] Admin routes are protected server-side.
-   [ ] Unauthorized users cannot create or edit campaigns.
-   [ ] Admin MFA is enforced.
-   [ ] Secrets are not exposed in client-side code.
-   [ ] Database backups and production monitoring are configured.

**Design and quality**

-   [ ] Visual design follows §4 and §5 (tokens, type scale, spacing, components).
-   [ ] No fabricated data, logos, testimonials or statistics anywhere in production.
-   [ ] Mobile, tablet and desktop layouts work with no horizontal page scroll.
-   [ ] Empty, loading, error and unavailable states are designed.
-   [ ] Keyboard navigation, focus states and reduced-motion support verified.
-   [ ] Performance targets in §14 are met.
-   [ ] Every page carries the Collabefy name, correct metadata and share image.
-   [ ] Legal and privacy pages are reviewed before public launch.

------------------------------------------------------------------------

## 21. Decisions and recommended defaults

Do not invent these details. Keep them configurable. The right-hand column is the recommended default to use until the owner confirms otherwise.

| # | Decision | Recommended default |
|---|---|---|
| 1 | Final domain | Owner to confirm. Keep in `site.config` |
| 2 | Logo and accent colour | Text wordmark + lime accent `#C8F560` (see §4) |
| 3 | Can visitors see every campaign without signing in? | Yes |
| 4 | Must creators register before getting Discord links? | No at launch; configurable per campaign |
| 5 | Open to everyone or approval required? | Per-campaign toggle |
| 6 | Are budgets and remaining balances public? | Per-campaign visibility setting |
| 7 | Currencies | USD at launch; currency field on each campaign |
| 8 | Reward models at launch | Per 1,000 views, per approved post, fixed bounty |
| 9 | Leaderboards: views only or earnings too? | Views and approved posts; earnings hidden by default |
| 10 | Who supplies leaderboard data? | Staff via admin form / CSV import |
| 11 | One Discord server or several? | One main server, optional campaign invites |
| 12 | Essential social platforms | TikTok, Instagram, YouTube, X |
| 13 | Social links manual or OAuth? | Manual, shown as "Unverified"; OAuth in Phase 4 |
| 14 | Brands request campaigns via the website? | Contact form only at launch |
| 15 | Public creator directory in first release? | No |
| 16 | Hosting, database, deployment | Vercel + managed PostgreSQL + S3-compatible storage |

------------------------------------------------------------------------

## 22. Final implementation instruction

Build **Collabefy** as a production-minded, maintainable web application, not a static mockup.

1.  Set up the project, design tokens, central `site.config` and component library first (§4, §5, §14).
2.  Implement the public campaign marketplace and the underlying campaign data model (Phase 1).
3.  Build creator authentication and profiles (Phase 2).
4.  Build the secure admin CMS that controls the public content (Phase 3). Treat Discord links as a first-class campaign field.
5.  Keep social integrations modular and use official APIs only (Phase 4).

Use realistic seed data only in development and label it clearly. Never present seed data as actual campaign activity. Make every public statistic traceable to real stored data.

**The final result should feel like an established, carefully designed creator campaign marketplace: clear, credible, fast, restrained and premium.**
