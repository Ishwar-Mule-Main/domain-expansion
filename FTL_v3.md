# FTL — Feature Ticket List (v3)
## Domain Expansion — Agency Website & TechGuild Platform
**Version:** 3.0 (Consolidated Master) | **Date:** June 2026 | **Owner:** Ishwar B. Mule (Founder)

> Each ticket is an atomic, completable task. Work phases in order. Estimates assume a solo developer with strong Next.js skills. Priority legend: P0 blocker · P1 core MVP · P2 important · P3 nice-to-have.

---

## PHASE 0 — Setup & Foundation (~14h)
- **0.1** Repo & branch strategy (main/dev/feature/*), secret scanning, Dependabot. *P0, 1h*
- **0.2** Next.js 14 init (TS, Tailwind, App Router) + deps (framer-motion, gsap, lucide-react, zustand, react-hook-form, zod). *P0, 1h*
- **0.3** Tailwind design-system config (all DE tokens, type/spacing/radius scales, keyframes, shadows). *P0, 2h*
- **0.4** Google fonts (DM Sans + JetBrains Mono) + globals.css (CSS vars, resets, `.text-gradient-orange`, reduced-motion). *P0, 1h*
- **0.5** Neon + Prisma (all models from TAD §4), `db push`, client singleton. *P0, 2h*
- **0.6** NextAuth v5 credentials provider + seed Super Admin (bcrypt). *P0, 2h*
- **0.7** Route-protection middleware (/admin/*, /api/admin/*, /studio). *P0, 1h*
- **0.8** Sanity setup (blogPost + caseStudy schemas, Studio at /studio). *P0, 2h*
- **0.9** Upstash rate-limit configs (leads 3/hr, waitlist 1/day, auth 5/15min). *P0, 1h*
- **0.10** Security headers + env validation (Zod) + CI workflow. *P0, 1.5h*
- **0.11** Cloudinary integration (loader, upload helper). *P0, 1h*
- **0.12** Resend setup (lead notification + confirmation templates). *P0, 1h*

## PHASE 1 — Core Layout (~13h)
- **1.1** Layout scaffold (Navbar + main + Footer wrapper). *P1, 1h*
- **1.2** Navbar (transparent→frosted, Services mega-dropdown, TechGuild NEW badge, mobile drawer). *P1, 4h*
- **1.3** Footer (5-column, social, bottom bar). *P1, 3h*
- **1.4** Floating WhatsApp button (pulse ring, tooltip). *P1, 1h*
- **1.5** Scroll progress bar (long pages). *P1, 0.5h*
- **1.6** UI primitives (Button, Badge, Card, Input, Textarea, Select, Skeleton, Modal, Tabs, Divider, SectionWrapper). *P1, 4h*

## PHASE 2 — Homepage (~20h)
One ticket per FSD B1 section: **2.1** shell + SEO/JSON-LD; **2.2** Hero; **2.3** Client Marquee; **2.4** Stats counters; **2.5** Four Pillars grid; **2.6** Featured Portfolio (filterable); **2.7** Why DE differentiators; **2.8** Process flow; **2.9** Featured Case Studies 3-up; **2.10** TechGuild promo strip; **2.11** Blog preview + footer CTA. *All P1.*

## PHASE 3 — Core Marketing Pages (~25h)
- **3.1** About Us (8 sections per FSD B2). *P1, 5h*
- **3.2** Contact page (form + info + Calendly + FAQ + trust + behavior). *P1, 4h*
- **3.3** Lead Submission API (Zod, hCaptcha verify, rate limit, Prisma, Resend). *P1, 2h*
- **3.4** Services Archive (6 sections per FSD B4). *P1, 2h*
- **3.5** Marketing Expansion page (FSD B5.1). *P1, 4h*
- **3.6** Development Expansion page (FSD B5.2). *P1, 3h*
- **3.7** Design Expansion page (FSD B5.3). *P1, 3h*
- **3.8** AI Expansion page (FSD B5.4). *P1, 3h*
- **3.9** Privacy Policy (12 sections, DPDP+GDPR). *P1, 1.5h*
- **3.10** Terms & Conditions (12 sections). *P1, 1.5h*

## PHASE 4 — Portfolio & Case Studies (~40h)
- **4.1** Portfolio archive (filterable 21-card grid, FSD B6). *P1, 4h*
- **4.2** Case Study archive (featured + grid + industry/region filters, FSD B8). *P1, 3h*
- **4.3** Case Study template (10 sections, Sanity-sourced, OG image, Article schema, FSD B9). *P1, 3h*
- **4.4–4.24** Individual case study content (one per project, FSD Part C). *P2, ~1.5h each:* PolyMint/PRCA, Data-Hat AI, AKC Foods, RocoMamas, Lucid Colloids, Sai Proviso Emporis, CropWings, Kubera, Kubera Communications, Nahl, AgriStox, Organoindia, Meat Me Foods, Sahchi United, Periship, Find Me Eats, Reyleaf, House Escort, Whats The Buz, SNAG Parking, Teegolf.
- **4.25** Portfolio project template (8 sections, FSD B7). *P1, 3h*

## PHASE 5 — Blog / NewsRoom (~35h)
- **5.1** Blog archive (featured, filter tabs, grid, sidebar, pagination, FSD B10). *P1, 3h*
- **5.2** Blog post template (Portable Text, share bar, related, author box, CTA, FSD B11). *P1, 3h*
- **5.3** 10 initial posts (content entry, ~3h each). *P2.*

## PHASE 6 — TechGuild Page (~7h)
- **6.1** TechGuild landing (7 sections, violet+orange accent, FSD B14). *P1, 5h*
- **6.2** TechGuild waitlist API (Zod, hCaptcha, rate limit, position, welcome email). *P1, 1.5h*

## PHASE 7 — Admin Dashboard (~15h)
- **7.1** Admin login (noindex, lockout). *P1, 2h*
- **7.2** Admin layout + sidebar nav. *P1, 2h*
- **7.3** Overview dashboard (KPI tiles, recent leads). *P1, 2h*
- **7.4** Lead management (table, filters, status/notes, CSV export, pagination) + admin leads API. *P1, 4h*
- **7.5** TechGuild waitlist admin (table, role filter, export). *P1, 2h*
- **7.6** Portfolio management (publish toggle, add/edit, Cloudinary upload). *P2, 3h*

## PHASE 8 — SEO, Performance & Polish (~16h)
- **8.1** SEO metadata + JSON-LD all pages. *P1, 3h*
- **8.2** Dynamic sitemap + robots.txt. *P1, 1h*
- **8.3** Image optimization pass. *P1, 2h*
- **8.4** Performance audit (Lighthouse, bundle analyzer, dynamic imports). *P1, 3h*
- **8.5** Cross-browser/device testing. *P1, 3h*
- **8.6** Accessibility audit (axe, keyboard, skip link). *P1, 2h*
- **8.7** GA4 events (form_submit, cta_click, portfolio_filter, blog_view, scroll_depth). *P1, 1.5h*
- **8.8** Final security scan (headers, SSL, rate limits, auth, injection). *P1, 1.5h*

## PHASE 9 — Deployment & Launch (~5h)
- **9.1** Staging deploy (Vercel preview, env vars, smoke test). *P1, 2h*
- **9.2** DNS/domain (Cloudflare → Vercel, HSTS, Full-Strict SSL). *P1, 1h*
- **9.3** Production deploy (merge, smoke test, GA4 check, form check, announce). *P1, 1h*
- **9.4** Post-launch monitoring (uptime, Sentry, alerts, GSC sitemap). *P1, 1h*

## PHASE 10 — TechGuild MVP (post-launch, ~54h)
10.1 subdomain; 10.2 agency registration/profile; 10.3 email verification; 10.4 client registration/project posting; 10.5 agency browse/search; 10.6 proposal submission; 10.7 in-platform messaging; 10.8 admin agency approval; 10.9 review/rating; 10.10 logged-in dashboard; 10.11 notifications; 10.12 mobile QA.

---

## Effort Summary
| Phase | Estimate |
|---|---|
| 0 Setup | ~14h |
| 1 Layout | ~13h |
| 2 Homepage | ~20h |
| 3 Marketing pages | ~25h |
| 4 Portfolio & case studies | ~40h |
| 5 Blog | ~35h |
| 6 TechGuild page | ~7h |
| 7 Admin | ~15h |
| 8 SEO/Perf/Polish | ~16h |
| 9 Deploy | ~5h |
| **Website total (0–9)** | **~190h (~6 weeks solo)** |
| 10 TechGuild MVP | ~54h (~8 weeks) |

---

*Document Version: 3.0 | Status: Ready for Development | Domain Expansion © 2026*
