# TAD — Technical Architecture Document (v3)
## Domain Expansion — Agency Website & TechGuild Platform
**Version:** 3.0 (Consolidated Master) | **Date:** June 2026 | **Owner:** Ishwar B. Mule (Founder)

---

## 1. Architecture Overview

The platform is built on a **Jamstack + API-first** architecture: a statically pre-rendered Next.js 14 (App Router) frontend on Vercel's edge network, with lightweight Route Handlers for dynamic operations (lead capture, auth, waitlist, CMS reads). This maximizes performance, SEO, and developer simplicity while staying affordable for a startup.

```
┌─ PUBLIC WEBSITE (domainexpansion.in, Next.js SSG/SSR) ─┐   ┌─ TECHGUILD (subdomain, SSR/CSR) ─┐
└────────────────────────────┬────────────────┘   └───────────┬────────────────┘
                            └───── NEXT.JS API ROUTES ─────┘
        /api/leads | /api/contact | /api/techguild-waitlist | /api/auth | /api/admin/*
                            │
  BACKEND: PostgreSQL (Neon) | Sanity CMS | Cloudinary CDN | Upstash Redis
  3RD-PARTY: GA4 | GTM | WhatsApp API | Resend | hCaptcha | Calendly | Sentry | Cloudflare
```

**Design tenets:** static-by-default, server-only secrets, type-safety end-to-end, graceful degradation, observability from day one.

---

## 2. Technology Stack

### 2.1 Frontend
| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG for SEO, SSR/RSC for dynamic + performance |
| Language | TypeScript 5.x | Full-stack type safety |
| Styling | Tailwind CSS 3.x | Token-driven design system |
| Animation | Framer Motion 11 + GSAP 3 (selective) | Scroll reveals, page transitions, counters |
| Icons | Lucide React + custom SVG | Consistent iconography |
| State | Zustand | Lightweight global state (filters, modals) |
| Forms | React Hook Form + Zod | Performant validated forms |
| CMS client | @sanity/client + next-sanity | Blog/case study content |
| Images | next/image + Cloudinary loader | WebP, responsive, lazy |
| SEO | next-seo + next-sitemap | Meta, OG, sitemap, robots |
| Analytics | next/third-parties (GA4) | Privacy-respecting GA4 |

### 2.2 Backend / API
| Layer | Technology | Rationale |
|---|---|---|
| API | Next.js Route Handlers | Serverless, co-located |
| ORM | Prisma 5.x | Type-safe DB access + migrations |
| Database | PostgreSQL 15 (Neon serverless) | Free tier, serverless scaling, ACID |
| Auth | NextAuth.js v5 | Admin auth (credentials/OAuth) |
| Email | Resend SDK | Transactional email |
| Validation | Zod | Shared FE/BE schemas |
| Rate limiting | Upstash Redis + @upstash/ratelimit | Spam/abuse protection |

### 2.3 CMS & Infra
Sanity.io (headless CMS, Studio at `/studio`, GROQ queries, Sanity CDN). Hosting: Vercel (Hobby→Pro). DB: Neon. Redis: Upstash. Media: Cloudinary. DNS/CDN: Cloudflare. CI/CD: GitHub Actions + Vercel. Monitoring: Vercel Analytics + Sentry.

---

## 3. Frontend Architecture

### 3.1 Directory Structure (App Router)
```
app/
  (marketing)/  page.tsx (home), about/, contact/, services/(+4 pillars), portfolio/(+[slug]),
                case-studies/(+[slug]), blog/(+[slug]), techguild/, privacy/, terms/
  (admin)/      admin/(layout, page, leads, blog, portfolio, case-studies, techguild-waitlist)
  api/          leads/route.ts, contact/route.ts, techguild-waitlist/route.ts,
                blog/route.ts, admin/leads/route.ts, auth/[...nextauth]/route.ts
  layout.tsx, globals.css, sitemap.ts
components/ ui/ | layout/ | sections/<page>/ | forms/ | admin/
lib/ db/(prisma.ts) | sanity/(client,queries,schema) | auth.ts | email.ts | validations.ts | ratelimit.ts | utils.ts
hooks/ useScrollAnimation | useCounter | useFilteredPortfolio
prisma/ schema.prisma | migrations/ | seed.ts
```

### 3.2 Rendering Strategy
| Page type | Strategy | Notes |
|---|---|---|
| Home, About, Services, Legal | SSG | Pre-rendered at build |
| Portfolio archive | SSG | Filters client-side |
| Blog & Case Study | SSG + ISR (revalidate 3600s) | From Sanity; `generateStaticParams` |
| Contact, TechGuild | SSG shell + client form | Form posts to API |
| Admin | SSR/CSR (auth-gated) | No indexing |

---

## 4. Data Model (PostgreSQL via Prisma)

Core models: **Lead** (contact + inquiry + status enum NEW→CONTACTED→IN_PROGRESS→PROPOSAL_SENT→CONVERTED/LOST/SPAM + tracking fields ipAddress, userAgent, referrer, utm*), **TechGuildWaitlist** (email unique, role, company, phone, position autoincrement), **AdminUser** (email, bcrypt password, role enum SUPER_ADMIN/ADMIN/EDITOR, lastLogin), **AdminSession** (token, expiresAt), **PortfolioItem** (title, clientName, slug unique, category[], description, image/thumbnail, metricHeadline, published, featured, order).

TechGuild (Phase 2) additions: **Agency** (profile, services, locations, verificationStatus), **Client** (profile), **Project** (brief, budget, timeline, status, category), **Proposal** (agency→project, pricing, timeline, message), **Message** (agency↔client thread), **Review** (client→agency, outcome-weighted), **Transaction** (escrow, Phase 3). Relationships enforced with FKs; all access through Prisma (parameterized, no raw SQL).

---

## 5. API Design

### 5.1 Public Endpoints
| Endpoint | Method | Auth | Rate limit | CAPTCHA |
|---|---|---|---|---|
| /api/leads | POST | none | 3/IP/hr, 10/IP/day | hCaptcha |
| /api/contact | POST | none | 3/IP/hr | hCaptcha |
| /api/techguild-waitlist | POST | none | 1/IP/day | hCaptcha |
| /api/blog, /api/blog/[slug] | GET | none | n/a | n/a |

**Lead POST contract:** body `{name, email, phone?, company?, service, budget?, message, source?, captchaToken}`; validates via Zod, verifies hCaptcha server-side, rate-limits, persists via Prisma, sends Resend admin + confirmation emails; returns `200 {success,message}` / `400` / `429`.

### 5.2 Admin Endpoints
`GET /api/admin/leads` (paginated, filters: status/service/dateFrom/dateTo), `PATCH /api/admin/leads/:id` (status/notes/assignedTo), `DELETE` (Super Admin), `GET /api/admin/stats`. All require a valid HttpOnly session cookie; 401 otherwise.

### 5.3 Hardening
Server-only secrets; CORS restricted to `https://domainexpansion.in`; 50KB body cap; strict HTTP method enforcement (405 otherwise); sanitized production errors (no stack traces); idempotency keys on writes.

---

## 6. Animation Architecture

Page transitions via `AnimatePresence` (fade/slide). Scroll reveals via `useInView` + `motion.div` variants. Stagger via container/child variants (`staggerChildren: 0.1`). Stat counters via GSAP CountTo on Intersection Observer. Hero combines CSS keyframe grid drift + Framer Motion text reveal. All gated by `useReducedMotion()`. GSAP dynamically imported only where used.

---

## 7. SEO Architecture

`generateMetadata()` per page: title + " | Domain Expansion", unique 120-160 char description, OG image, Twitter card, canonical, robots (noindex on admin/studio). JSON-LD: Organization/WebSite/LocalBusiness (home), Service/FAQPage/BreadcrumbList (service pages), Article/BreadcrumbList/Person (blog/case studies), ContactPage (contact), ItemList (portfolio). Dynamic `sitemap.ts` includes static + Sanity slugs; `robots.txt` disallows /admin, /api, /studio.

---

## 8. TechGuild Platform Architecture (Phase 2)

Subdomain `techguild.domainexpansion.in`. Key flows: **Agency onboarding** (Register → Verify email → Profile → Submit portfolio → Manual DE review → Approved → Live) and **Client posting** (Register → Post project → Set budget/timeline/category → Publish → Receive proposals → Shortlist → Message → Hire). Messaging is an append-only thread model; reviews are outcome-weighted and gated on completed projects; escrow (Phase 3) tracks milestone-based releases via Transaction records.

---

## 9. Deployment Pipeline

Push → GitHub Actions CI (tsc --noEmit, ESLint, Prisma migration check, Vitest) → on success Vercel builds a preview deployment (shared URL) → on merge to `main` Vercel deploys production (PRODUCTION env, Neon production, CDN invalidation). Required env vars: `DATABASE_URL`, `NEXTAUTH_URL/SECRET`, `NEXT_PUBLIC_SANITY_*`/`SANITY_API_TOKEN`, `RESEND_API_KEY`/`FROM_EMAIL`/`ADMIN_EMAIL`, `*_HCAPTCHA_*`, `UPSTASH_REDIS_REST_*`, `CLOUDINARY_*`, optional `WHATSAPP_*`.

---

## 10. Performance Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | Image optimization, hero preload |
| FID/INP | < 100ms / < 200ms | Code splitting, minimal JS |
| CLS | < 0.1 | Reserved image dimensions |
| TTFB | < 600ms | SSG + Vercel edge cache |
| JS bundle | < 200KB gz | Tree-shaking, dynamic imports |
| Fonts | < 50KB | display=swap, Latin subset |

---

*Document Version: 3.0 | Status: Approved for Development | Domain Expansion © 2026*
