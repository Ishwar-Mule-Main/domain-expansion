# WORKLOG — Domain Expansion (v3)
## Living project memory — read at session start, append at session end

> Format: newest entries at the TOP. Every session adds a dated block. The **NEXT UP** pointer below always reflects the single next action.

---

## 📍 NEXT UP (current pointer)

Awaiting user's next set of instructions.

---

## SESSION LOG

### 2026-06-22 — Session 19 (Service Blogs & Vercel Standalone Deployment Configs)
- Removed 10 demo posts and created 4 long-form articles (~5,000 words each) exploring industry challenges and AI/automation solutions for all 4 service pillars in [blog.ts](file:///d:/demo%202/lib/data/blog.ts).
- Generated 4 premium featured images using Gemini image engine and saved them to `/public/blog/`.
- Modified [page.tsx](file:///d:/demo%202/app/blog/page.tsx) and [[slug]/page.tsx](file:///d:/demo%202/app/blog/[slug]/page.tsx) to support rendering `featuredImage` values.
- Updated the "Connect on LinkedIn ↗" author card link to point directly to Ishwar Mule's LinkedIn profile: `https://www.linkedin.com/in/ishwarmule/`.
- Configured Vercel deployment variables, enabled `output: "standalone"` in [next.config.ts](file:///d:/demo%202/next.config.ts), and resolved NPM ERESOLVE peer conflicts on React 19 by introducing [.npmrc](file:///d:/demo%202/.npmrc) with `legacy-peer-deps=true`.
- Added a proprietary copyright [LICENSE](file:///d:/demo%202/LICENSE) file owned by Domain Expansion and Ishwar Mule.
- Updated [AGENTS.md](file:///d:/demo%202/AGENTS.md) to document the dynamic routing sync rules for `sitemap.ts` and `robots.ts` so future sessions preserve SEO crawlers.
- Pushed changes to GitHub repository: `https://github.com/Ishwar-Mule-Main/domain-expansion.git`.

### 2026-06-21 — Session 18 (TechGuild Countdown Timer & Brand Asset Refresh)
- Integrated a premium, responsive 30-day pre-launch countdown timer inside the Hero section of the TechGuild landing page ([page.tsx](file:///d:/demo%202/app/techguild/page.tsx)) using hydration-safe mount checks.
- Copied the new `public/favicon.ico` asset into the `app/` directory and renamed the default `app/icon.svg` to prevent Next.js from overriding the new icon configuration.
- Added the brand logo image (`Domain Expansion New Logo.png`) as the sole logo representation in both the header [Navbar.tsx](file:///d:/demo%202/components/layout/Navbar.tsx) and the [Footer.tsx](file:///d:/demo%202/components/layout/Footer.tsx), removing the accompanying `domain.expansion` text.
- Substituted the default security Lock icon in the Admin Security Sign-In ([page.tsx](file:///d:/demo%202/app/admin/login/page.tsx)) with the new brand logo image.
- Expanded the Privacy Policy ([privacy/page.tsx](file:///d:/demo%202/app/privacy/page.tsx)) to cover collection of corporate verification records, payment subprocessing gateways (Stripe/Razorpay), and message logging.
- Expanded the Terms & Conditions ([terms/page.tsx](file:///d:/demo%202/app/terms/page.tsx)) to incorporate marketplace intermediary safe harbor parameters, escrow payment flows, billing auto-renewals, and mediation rules.
- Implemented global typography prose fallback styles (`.prose`, `.prose-sm`, `.prose-lg`) in [globals.css](file:///d:/demo%202/app/globals.css) and streamlined [[slug]/page.tsx](file:///d:/demo%202/app/blog/[slug]/page.tsx) to provide standard-compliant heading spacing (h1 to h6), proper text-justify alignment, responsive padding, distinct quote blocks, and alert components.
- Updated all blog entries database records ([blog.ts](file:///d:/demo%202/lib/data/blog.ts)) and blog templates to replace text initials avatars (`IM`) with the real author image path (`/Team Members/Ishwar Mule.png`).
- Integrated team member image assets in the About page ([page.tsx](file:///d:/demo%202/app/about/page.tsx)): updated the main Founder Story avatar card, and added a detailed CTO profile card displaying the real image of Suraj Baride (`/Team Members/Suraj Baride.JPG`).
- Verified compilation builds cleanly (`cmd /c npm run build`), type-checking successfully and producing all static/dynamic routes.

### 2026-06-20 — Session 17 (Creative Grid Polish & Image Ratio Preservation)
- Modified the portfolio grid component [PortfolioMediaGrid.tsx](file:///d:/demo%202/components/sections/portfolio/PortfolioMediaGrid.tsx) to remove static card details at the bottom.
- Implemented a title parser helper to extract the Brand Name and Image Type from each item's title, rendering them beautifully inside a premium, backdrop-blurred hover overlay.
- Reconfigured the layout of the portfolio grid items to render images in their native aspect ratio, transitioning to a native CSS columns masonry format (`columns-1 md:columns-2 lg:columns-3 break-inside-avoid [column-fill:balance]`) across all categories (Social Media, Campaign Ads, Outdoor Banners, Logo Designs, and Print Collaterals), excluding only the 1920x1080 interactive Website Designs section. This resolves layout row-height locking and prevents vertical whitespace gaps.
- Reverted the homepage [ClientTicker.tsx](file:///d:/demo%202/components/sections/home/ClientTicker.tsx) back to its original text-only scrolling state as requested, leaving all home page sections below the hero untouched.
- Redesigned the homepage [HeroSection.tsx](file:///d:/demo%202/components/sections/home/HeroSection.tsx) to support a full-viewport looping background video (`https://d8j0ntlcm91z4.cloudfront.net/...`) with a masked bottom-blur backdrop-blur-xl overlay.
- Set container background colors in both [HeroSection.tsx](file:///d:/demo%202/components/sections/home/HeroSection.tsx) and the home page [page.tsx](file:///d:/demo%202/app/page.tsx) to `bg-transparent` to ensure the fixed background video displays clearly without being covered by solid background overlays.
- Styled secondary action CTA buttons with a premium glowing `.liquid-glass` effect, and added staggered GPU-accelerated `.animate-blur-fade-up` load animations defined in [globals.css](file:///d:/demo%202/app/globals.css).
- Verified compilation builds cleanly (`npm run build`, exit code: 0) producing all 75 static/dynamic routes.

### 2026-06-20 — Session 16 (Redesign Portfolio Page & Build Polish)
- Redesigned the main `/portfolio` route to render a custom story-driven portfolio page showcasing visual deliverables from `SM Domain Expansion PPT.pdf` (Social Media, Ads, Banners, Web, and UI/UX sections).
- Implemented `PortfolioMediaGrid.tsx` with dynamic aspect-ratio cards, visual zoom effects, keyboard navigation, and custom lightbox previews.
- Styled custom interactive browser mockups and mobile device mockups in `app/portfolio/page.tsx` using `public/SM Domain Expansion PPT files` and `public/website design` assets.
- Resolved TypeScript compile errors in `Preloader.tsx` (Framer Motion easing type signatures) and `admin/layout.tsx` (null check on NextAuth session context).
- Created a new transparent vector favicon brand icon [icon.svg](file:///d:/demo%202/app/icon.svg) depicting the brand's signature expanding orange dot.
- Removed the WebGL 3D rotating HeroCanvas background animation from the homepage HeroSection to transition the hero section into a clean, static, performance-tuned background.
- Verified clean Next.js build compilation (`npm run build`, exit code: 0) producing all 75 static routes.

### 2026-06-19 — Session 15 (Post-Deployment Polish & Preloader Integration)
- Implemented full-screen custom **Preloader** component [Preloader.tsx](file:///d:/demo%202/components/ui/Preloader.tsx) at root [layout.tsx](file:///d:/demo%202/app/layout.tsx). Re-engineered the animation mechanics to scale down a natively huge viewport-relative circle to a tiny decimal fraction, which forces native GPU-accelerated rasterization at high resolution to guarantee 60FPS fluid motion during the expansion reveal transition.
- Fixed admin login loop error by creating custom headers in Next.js 16 [proxy.ts](file:///d:/demo%202/proxy.ts) and bypassing the authentication layout checks on the `/admin/login` page.
- Made the Upstash Redis rate limiter fail-open in [ratelimit.ts](file:///d:/demo%202/lib/ratelimit.ts) to gracefully handle mock/unreachable database endpoints on form submissions.
- Updated text branding dynamically to `domain.expansion` in the navbar and footer layouts.
- Cleared stale Turbopack caches and validated successful local compilation builds (`status: 200`).

### 2026-06-19 — Session 14 (Phase 9 — Deployment & Launch Setup)
- Configured production security transport headers inside [next.config.ts](file:///d:/demo%202/next.config.ts) globally, covering Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
- Implemented a secure Content-Security-Policy (CSP) whitelisting Domain Expansion, Google Tag Manager, GA4, hCaptcha, Google Fonts, Cloudinary, Sanity, and Calendly frames.
- Verified template [.env](file:///d:/demo%202/.env) keys.
- Executed local production compile verification (`cmd /c npm run build`), compiling TS cleanly and pre-generating all 74 static routes successfully.

### 2026-06-19 — Session 13 (Phase 8 — SEO, Performance & Polish)
- Built dynamic sitemap builder [sitemap.ts](file:///d:/demo%202/app/sitemap.ts) mapping all base, service, blog, portfolio, and case study page routes (74 routes in total).
- Configured robots crawl index permissions in [robots.ts](file:///d:/demo%202/app/robots.ts), blocking search index bots from `/admin`, `/api`, and `/studio` directories.
- Created reusable [JsonLd.tsx](file:///d:/demo%202/components/ui/JsonLd.tsx) schema injection component.
- Injected schemas dynamically on all target pages (Organization & LocalBusiness on homepage, Service & FAQ on service pillars, Article & Breadcrumbs on portfolio, case-studies, and blog pages).
- Created GA4 event tracking library [analytics.ts](file:///d:/demo%202/lib/analytics.ts) and loader script [GoogleAnalytics.tsx](file:///d:/demo%202/components/analytics/GoogleAnalytics.tsx), loaded globally in the root layout body.
- Wired tracking triggers (`form_submit` and `cta_click` events) into contact form, Waitlist submissions, and home email banners.
- Ran compile build verification checks successfully (`npm run build`).

### 2026-06-19 — Session 12 (Phase 7 — Admin Dashboard Development)
- Configured dynamic route protection hooks directly via Next.js 16 [proxy.ts](file:///d:/demo%202/proxy.ts) middleware rules.
- Created admin credentials login layout [layout.tsx](file:///d:/demo%202/app/admin/login/layout.tsx) with strict index blocks and visual credentials form [page.tsx](file:///d:/demo%202/app/admin/login/page.tsx).
- Built admin overview dashboard [page.tsx](file:///d:/demo%202/app/admin/page.tsx) with counts KPIs and recent inbound summaries.
- Built interactive leads dashboard [LeadsListClient.tsx](file:///d:/demo%202/app/admin/leads/LeadsListClient.tsx) and page wrapper [page.tsx](file:///d:/demo%202/app/admin/leads/page.tsx) with sorting filters, inline status updaters, and CSV compilers, backed by a PATCH endpoint [route.ts](file:///d:/demo%202/app/api/admin/leads/%5Bid%5D/route.ts).
- Built waitlist dashboard [WaitlistClient.tsx](file:///d:/demo%202/app/admin/waitlist/WaitlistClient.tsx) and page wrapper [page.tsx](file:///d:/demo%202/app/admin/waitlist/page.tsx) with search capabilities.
- Built portfolio visibility dashboard [PortfolioClient.tsx](file:///d:/demo%202/app/admin/portfolio/PortfolioClient.tsx) and page wrapper [page.tsx](file:///d:/demo%202/app/admin/portfolio/page.tsx) backed by a PATCH status modifier [route.ts](file:///d:/demo%202/app/api/admin/portfolio/%5Bid%5D/route.ts).
- Verified compilation builds cleanly, with all admin routes pre-rendering as Dynamic (`ƒ`) routes (`npm run build`).

### 2026-06-19 — Session 11 (Phase 6 — TechGuild Page Development)
- Created TechGuild page route metadata [layout.tsx](file:///d:/demo%202/app/techguild/layout.tsx).
- Built interactive dual-gradient landing page [page.tsx](file:///d:/demo%202/app/techguild/page.tsx) with a Coming Q3 2026 hero, tabbed client/agency operational steps, 6-card platform overview, pricing plans grid, and FAQ accordions.
- Wired hCaptcha verification, honey pots, and client validations into the waitlist signup form to submit payloads directly to our Postgres database endpoint.
- Verified compilation builds cleanly, pre-rendering `/techguild` successfully (`npm run build`).

### 2026-06-19 — Session 10 (Phase 5 — Blog / NewsRoom Development)
- Populated static data store [blog.ts](file:///d:/demo%202/lib/data/blog.ts) containing structured categories, metadata, HTML bodies, and bios for 10 initial posts.
- Created blog archive layouts [layout.tsx](file:///d:/demo%202/app/blog/layout.tsx) and interactive index grid [page.tsx](file:///d:/demo%202/app/blog/page.tsx) featuring featured posts, search bars, category selectors, and sidebar newsletter widgets.
- Built interactive [ShareBar.tsx](file:///d:/demo%202/components/blog/ShareBar.tsx) with custom inline social SVGs (LinkedIn, X, WhatsApp) to work in legacy package environments.
- Built dynamic details page template [page.tsx](file:///d:/demo%202/app/blog/[slug]/page.tsx) utilizing static params pre-generation (`generateStaticParams`) for all 10 articles.
- Verified Next.js compilation builds successfully with 70 pre-rendered static routes (`npm run build`).

### 2026-06-19 — Session 9 (Phase 4 — Portfolio & Case Studies Development)
- Populated centralized static data store [projects.ts](file:///d:/demo%202/lib/data/projects.ts) containing complete details and metrics for all 21 clients.
- Built interactive filterable **Portfolio Archive Grid** [portfolio/page.tsx](file:///d:/demo%202/app/portfolio/page.tsx) with a sticky category filter bar and smooth Framer Motion card animations, including [layout.tsx](file:///d:/demo%202/app/portfolio/layout.tsx) for route metadata tags.
- Built **Portfolio Project Template** dynamic page [portfolio/[slug]/page.tsx](file:///d:/demo%202/app/portfolio/[slug]/page.tsx) with `generateStaticParams` for compile-time pre-generation of all 21 client projects.
- Built interactive **Case Studies Archive** [case-studies/page.tsx](file:///d:/demo%202/app/case-studies/page.tsx) with synchronized category and region (India vs International) filters, including [layout.tsx](file:///d:/demo%202/app/case-studies/layout.tsx) for route metadata.
- Built **Case Study Detail Template** dynamic page [case-studies/[slug]/page.tsx](file:///d:/demo%202/app/case-studies/[slug]/page.tsx) displaying a deep-dive narrative structure, pre-rendered statically for all 21 client slugs.
- Resolved missing `TrendingUp` icon import and verified that Next.js compilation builds successfully (`npm run build`).

### 2026-06-19 — Session 8 (Phase 3 — Core Marketing Pages Development)
- Created the interactive [ServiceCanvas.tsx](file:///d:/demo%202/components/sections/services/ServiceCanvas.tsx) and wrapped dynamic import calls inside the Client Component [ServiceVisual.tsx](file:///d:/demo%202/components/sections/services/ServiceVisual.tsx) to support Next.js 16 Server Components rendering.
- Built the **About Us** page [about/page.tsx](file:///d:/demo%202/app/about/page.tsx) with custom CSS network maps, GSAP timeline milestones, and team placeholder grids.
- Built the **Contact Us** page [contact/page.tsx](file:///d:/demo%202/app/contact/page.tsx) incorporating custom lead forms (react-hook-form native checks), direct copy shortcuts, hCaptcha, and dynamic FAQ accordions.
- Built **Services Archive** page [services/page.tsx](file:///d:/demo%202/app/services/page.tsx) and dynamic **Service Pillar Detail** routing [services/[slug]/page.tsx](file:///d:/demo%202/app/services/[slug]/page.tsx) with static params pre-generation (`generateStaticParams`).
- Built **Privacy Policy** [privacy/page.tsx](file:///d:/demo%202/app/privacy/page.tsx) and **Terms & Conditions** [terms/page.tsx](file:///d:/demo%202/app/terms/page.tsx) on high-readability light canvas layouts.
- Replaced lucide-react brand imports (which had missing exports on this environment's legacy lucide version) with custom inline SVGs for LinkedIn.
- Verified Next.js 16/Turbopack compilation successfully (`npm run build`).

### 2026-06-19 — Session 7 (Phase 2 — Homepage Development & Verification)
- Completed and polished all 10 Homepage components under `components/sections/home` and integrated them into `app/page.tsx`.
- Resolved type-checking and compilation issues in `BlogPreview.tsx` by adding proper imports for `motion` and `AnimatePresence`.
- Fixed unused and incorrect Lucide icon imports inside `PillarsGrid.tsx`.
- Cast motion variants to `as const` in `CaseStudiesShowcase.tsx`, `Differentiators.tsx`, `PillarsGrid.tsx`, and `HeroSection.tsx` to satisfy strict Framer Motion easing type constraints in React 19.
- Verified compilation and build checks pass successfully with `npm run build`.

### 2026-06-19 — Session 6 (Phase 1 — Core Layout & API endpoints)
- Created global layout elements: Navbar (frosted scroll transition, mega-dropdown), Footer (with custom social SVGs), floating WhatsApp contact button, and ScrollProgress.
- Built custom Cursor component (spring-damped lag ring, state machine) and SmoothScroll provider (Lenis + GSAP Sync).
- Designed baseline UI primitives (Button, Badge, Card, Input, Textarea, Select) supporting spring animations and validation borders.
- Configured [seed.ts](file:///d:/demo%202/prisma/seed.ts) to automatically populate SUPER_ADMIN credentials.
- Authored `/api/leads` and `/api/techguild-waitlist` routes with Zod parsing, hCaptcha verification, honeypots, rate limiting, and Resend confirmations.
- Ran compilation build checks successfully (`npm run build`).

### 2026-06-18 — Session 5 (database & backend integrations)
- Installed backend packages (`@prisma/client`, `next-auth@beta`, `bcryptjs`, `@upstash/redis`, `@upstash/ratelimit`, `resend`, `@sanity/client`, `next-sanity`, `sanity`, `@prisma/adapter-pg`, `pg`, `@neondatabase/serverless`, `@prisma/adapter-neon`).
- Structured Prisma 7 compatible schema [schema.prisma](file:///d:/demo%202/prisma/schema.prisma) and [prisma.config.ts](file:///d:/demo%202/prisma.config.ts) for connection parameters, with [prisma.ts](file:///d:/demo%202/lib/db/prisma.ts) singleton leveraging pg pool.
- Configured NextAuth credentials auth settings in [auth.ts](file:///d:/demo%202/lib/auth.ts) and created handlers.
- Created [proxy.ts](file:///d:/demo%202/proxy.ts) to adhere to the Next.js 16 route protection standards.
- Coded CMS schema specs, rate-limiting handlers, Resend transactional mail functions, and Cloudinary custom image loaders.
- Created a template `.env` config holding placeholders.
- Ran validation builds successfully (`npm run build`).
- Next: Database seeding and Phase 1 Layout.

### 2026-06-18 — Session 4 (scaffolding & theme setup)
- Scaffolded Next.js 16 project structure (bypassed space naming restriction on "demo 2" using temporary build directory) without git setup (as requested by user).
- Installed main libraries: Animation (`framer-motion`, `gsap`, `lenis`), UI (`lucide-react`, `zustand`, `react-hook-form`, `zod`), and 3D (`three`, `@react-three/fiber`, `@react-three/drei`).
- Defined Tailwind CSS v4 design tokens (Brand Orange `#FF6200`, Light Orange `#FF8C42`, TechGuild Violet `#6D28D9`, Canvas Near-Black `#0D0D0D`) in `@theme` configurations inside `app/globals.css`.
- Loaded Google fonts (Bricolage Grotesque, Inter, JetBrains Mono) dynamically with variable mappings in `app/layout.tsx`.
- Designed a custom premium-dark flagship landing layout in `app/page.tsx` incorporating radial lights, statistics showcase, service pillar cards, and waitlist call-to-actions.
- Verified compilation and build checks pass successfully with `npm run build`.
- Next: FTL Ticket 0.5 (Neon + Prisma ORM setup).

### 2026-06-18 — Session 3 (skill creation)
- Created the agent skill: `AGENTS.md` (loader), `v3/PROJECT_BRAIN_v3.md` (role + knowledge + plan + brainstorm protocol), and this `v3/WORKLOG_v3.md` (memory).
- Purpose: any new chat can boot, understand the whole project, and continue from NEXT UP.
- Committed on branch `feat/experience-architecture-v3`.
- Decisions: source of truth = v3 docs; honesty constraint documented (no live server/media/WebGL execution); typography for flagship = Bricolage Grotesque + Inter.
- Next: owner to merge `!1` and `!2`, then start Phase 0.

### 2026-06-18 — Session 2 (experience architecture)
- Added `v3/EXPERIENCE_BLUEPRINT_v3.md`, `v3/MOTION_ARCHITECTURE_v3.md`, `v3/SEO_DISCOVERABILITY_v3.md`.
- Opened MR `!2`.
- Covers: anti-template layout system, Lenis+GSAP+Motion+R3F integration patterns with code, and SEO/AEO/GSO/GEO + JSON-LD for all 21 case studies.

### 2026-06-18 — Session 1 (documentation consolidation)
- Consolidated all duplicate docs into a clean v3 set: kept `PRD_v3.md`; authored `FSD_v3.md` (flagship — design system + every page with 6+ unique sections + 21 detailed case studies), `TAD_v3.md`, `FTL_v3.md`, `SAD_v3.md`.
- Removed 14 stale duplicate files.
- Opened MR `!1` (branch `docs/consolidated-master-v3`).
- Note: this `feat/experience-architecture-v3` branch was cut from `main` and still shows old duplicates until `!1` merges.

---

## DECISION REGISTER (durable choices)
- **Brand:** orange `#FF6200`, dark `#0D0D0D`, TechGuild violet `#6D28D9`.
- **Typography (flagship):** Bricolage Grotesque (display) + Inter (body) + JetBrains Mono (technical).
- **Stack:** Next.js 14, TS, Tailwind, Prisma/Neon, Sanity, Cloudinary, Resend, Upstash, hCaptcha, Vercel, Cloudflare; experiential: Lenis + GSAP + Motion + R3F.
- **Source of truth:** the v3 documents; v3 wins over any older duplicate.
- **Working method:** feature branch + MR per task; update this worklog every session.

---

*Maintained by every agent session | Domain Expansion © 2026*
