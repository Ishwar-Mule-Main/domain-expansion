# Domain Expansion — Project Chat History

> Saved: 2026-06-19 | Conversation ID: aecb92b1-11c5-4cee-8164-223342a17614

---

## Summary of What Was Built

This project is the full-stack website and admin portal for **Domain Expansion**, a premium digital agency.

---

## Phase 1 — Project Scaffold & Design System
- Created Next.js 16 (App Router) project with TypeScript
- Set up global CSS design system: custom fonts (Inter/Outfit from Google Fonts), CSS variables for colors, spacing, and typography
- Configured Tailwind (minimal, used mostly vanilla CSS)
- Set up `prisma.config.ts`, `schema.prisma`, and Prisma 7 adapter patterns

## Phase 2 — Homepage & Core Pages
- Built premium animated **Hero section** with GSAP scroll-trigger
- Built **Services section** with animated cards
- Built **About**, **Contact**, **Portfolio**, **Case Studies** pages
- All pages include JSON-LD schema markup for SEO

## Phase 3 — TechGuild Marketplace
- Created `/techguild` section — a sub-brand marketplace page
- Waitlist form with email capture (stored in `TechGuildWaitlist` DB table)
- Premium dark-mode design with glassmorphism effects

## Phase 4 — Admin Dashboard
- Protected admin portal at `/admin/*`
- NextAuth.js (v5 / `next-auth`) with CredentialsProvider
- JWT session strategy (8 hours)
- Admin login at `/admin/login`
- Dashboard with leads management, waitlist overview, portfolio editor stubs

## Phase 5 — Lead Management API
- `POST /api/leads` — accepts contact form submissions, validates, stores to DB
- Rate limiting (Upstash Redis mock, ready for real key)
- hCaptcha integration (test keys pre-configured)

## Phase 6 — Security & SEO
- Strict Content Security Policy (CSP) headers in `next.config.ts`
- `unsafe-eval` conditionally allowed in dev mode for Next.js HMR
- GA4 integration stub
- Open Graph / Twitter Card meta tags on all pages
- JSON-LD Organization, WebSite, Service schemas

## Phase 7 — Database (Neon PostgreSQL)
- Migrated from local PostgreSQL to **Neon** cloud database
- Prisma 7 adapter pattern: `PrismaPg` in `lib/db/prisma.ts`
- `prisma.config.ts` holds the connection URL
- Schema pushed: `db push --force-reset` applied to Neon
- Admin user seeded with credentials below

---

## Admin Access

| Field    | Value                      |
|----------|----------------------------|
| URL      | http://localhost:3000/admin |
| Email    | info@domainexpansion.in    |
| Password | DomainAdmin2026!           |
| Role     | SUPER_ADMIN                |

> ⚠️ Change this password after first login!

---

## Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://neondb_owner:...@ep-noisy-flower-adql1kaz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="3bc3b6c2f37c357f897df890b0e5138e6dfd15024479bd72b153b6fa0f214cb8"
```

---

## Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | DB schema (Lead, AdminUser, AdminSession, etc.) |
| `prisma/seed.ts` | Seeds SUPER_ADMIN user |
| `prisma.config.ts` | Prisma 7 config with DATABASE_URL |
| `lib/db/prisma.ts` | PrismaClient singleton with PrismaPg adapter |
| `lib/auth.ts` | NextAuth config (CredentialsProvider + JWT) |
| `app/admin/login/page.tsx` | Admin login page |
| `app/api/leads/route.ts` | Contact form API |
| `next.config.ts` | CSP headers, image domains |

---

## Issues Resolved

1. **eval() CSP Error** — Added `unsafe-eval` to CSP in development mode in `next.config.ts`
2. **Prisma schema missing url** — Prisma 7 moved URL to `prisma.config.ts`; reverted schema to provider-only
3. **Neon SSL** — Added `ssl: true` to `pg.Pool` in `lib/db/prisma.ts`
4. **Admin login 404** — Was caused by DB not being seeded; fixed by running `db push` + seed
5. **Port conflicts** — Dev server runs on 3000; a second instance auto-uses 3001
6. **Admin Login Redirect Loop / proxy.ts vs middleware.ts** — Resolved the infinite redirect loop on `/admin/login` by adding a custom `x-pathname` header injection in `proxy.ts` (the Next.js 16 required filename for middleware proxies) and conditionally rendering the children directly (bypassing the sidebar UI and `session` check layout wrapper) for `/admin/login`.
7. **Contact Form Submission Failure (TypeError: fetch failed)** — Fixed the "Internal server error occurred" on lead form submissions by making the Upstash Redis rate limiter fail-open. If the Upstash API has connection issues or is configured with mock credentials (e.g. `mock-redis.upstash.io`), the rate limiter now gracefully logs a warning and allows the submission rather than throwing an error and crashing the endpoint.
8. **Logo Redesign** — Updated the text logo in the navigation header and footer to render as `domain.expansion` (using `font-semibold` medium-bold weight of the `Bricolage Grotesque` typeface) with a customized orange dot.
9. **Custom Interactive Preloader** — Built a full-screen loader (`components/ui/Preloader.tsx`) loaded globally in the root layout. It locks page scrolling, displays a pulsing brand orange dot on default `#0D0D0D` background, and expands the dot to cover the viewport on 100% window load. Re-engineered to animate a natively huge circle down to a decimal scale (`scale: 0.005` to `scale: 1.15`), bypassing browser rasterization limits to secure perfect vector smoothness, backed by GPU-acceleration properties and radial gradients.

---

## Commands Reference

```bash
# Start dev server
node node_modules\next\dist\bin\next dev

# Push schema to DB
node node_modules\prisma\build\index.js db push

# Run seed
node node_modules\tsx\dist\cli.mjs prisma/seed.ts

# Generate Prisma client
node node_modules\prisma\build\index.js generate
```
