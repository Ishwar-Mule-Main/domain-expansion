# FSD — Frontend Specification Document (v3)
## Domain Expansion — Agency Website & TechGuild Platform
**Version:** 3.0 (Consolidated Master) | **Date:** June 2026 | **Owner:** Ishwar B. Mule (Founder, Domain Expansion)
**Design Language:** DE Dark-Premium System (orange #FF6200 on near-black #0D0D0D)

> This is the master frontend specification. PART A defines the global design system. PART B is the page-by-page specification — every page carries at least six distinct sections, each with unique content, layout, components, copy direction, and motion. PART C documents each individual case study page. This document is intentionally large and authoritative.

---

# PART A — GLOBAL DESIGN SYSTEM

## A1. Brand Identity & Design Philosophy

Domain Expansion is a bold, forward-thinking remote digital agency. The visual identity is built around **contrast, motion, and precision** — a dark premium base layered with electric orange energy, clean white type, and purposeful animation. The design language says: *we are confident, creative, and technical — all at once.*

**Brand Personality:** Bold · Innovative · Trustworthy · Energetic · Precise · Forward-thinking.

**Direction:** Dark-first, premium feel. Marketing pages lead with deep near-black backgrounds broken by signature orange for CTAs, highlights, and motion. Content-heavy pages (blog, case studies, legal) shift to a clean white canvas for readability.

## A2. Logo Usage

| Variant | Background | Usage |
|---|---|---|
| Full Logo (dark bg) | `#1A1A1A` / `#0D0D0D` | Navbar (dark), heroes, footer |
| Full Logo (light bg) | `#FFFFFF` | Blog posts, light content |
| Icon only | Any | Favicon, social avatar, loader |

Clear space = height of the "D" letterform on all sides. Minimum size: 120px (full), 32px (icon).

## A3. Colour Tokens

```css
/* Brand */
--de-orange:#FF6200; --de-orange-hover:#E55700; --de-orange-light:#FF8C42;
--de-orange-glow:#FF620033; --de-orange-soft:#FFF0E6;
/* Dark canvas */
--de-dark:#0D0D0D; --de-dark-surface:#141414; --de-dark-card:#1A1A1A;
--de-dark-elevated:#222222; --de-dark-border:#2E2E2E; --de-dark-border-soft:#252525;
/* Light canvas */
--de-canvas:#FFFFFF; --de-surface:#F8F8F8; --de-surface-soft:#F2F2F2;
--de-hairline:#E5E5E5; --de-hairline-soft:#EFEFEF;
/* Type */
--de-ink:#0D0D0D; --de-on-dark:#FFFFFF; --de-on-dark-muted:rgba(255,255,255,.70);
--de-on-dark-subtle:rgba(255,255,255,.45); --de-slate:#5A5A6A; --de-steel:#888898; --de-muted:#ACACB8;
/* Semantic */
--de-success:#22C55E; --de-error:#EF4444; --de-warning:#F59E0B; --de-info:#3B82F6;
/* Gradients */
--de-grad-hero:linear-gradient(135deg,#0D0D0D 0%,#1A1A1A 60%,#2A1200 100%);
--de-grad-orange:linear-gradient(135deg,#FF6200 0%,#FF8C42 100%);
--de-grad-glow:radial-gradient(ellipse at center,#FF620020 0%,transparent 70%);
/* TechGuild accent (deep violet, used only on /techguild) */
--tg-violet:#6D28D9; --tg-violet-light:#8B5CF6; --tg-grad:linear-gradient(135deg,#FF6200 0%,#6D28D9 100%);
```

## A4. Typography

Fonts: **DM Sans** (UI/headings/body) + **JetBrains Mono** (code, stat labels, technical tags). Loaded via `next/font/google` with `display=swap`, Latin subset.

| Token | Size | Weight | Use |
|---|---|---|---|
| `text-hero` | 80px | 700 | Homepage hero only |
| `text-display` | 56px | 700 | Page heroes, major headers |
| `text-h1` | 40px | 700 | Section headings |
| `text-h2` | 32px | 600 | Sub-section headings |
| `text-h3` | 24px | 600 | Card titles, FAQ questions |
| `text-card-t` | 20px | 600 | Portfolio/blog titles |
| `text-sub` | 18px | 500 | Hero subtitles, intros |
| `text-body` | 16px | 400 | Body copy |
| `text-body-sm` | 14px | 400 | Captions, nav, table data |
| `text-caption` | 13px | 400 | Meta, timestamps |
| `text-micro` | 12px | 400 | Legal, footer fine print |

Responsive hero scaling: 80 → 56 (tablet) → 40 (mobile) → 32 (mobile-sm). Orange gradient text via `background-clip:text` on `.text-gradient-orange`.

## A5. Component Library (Primitives)

- **Buttons:** primary (orange `#FF6200`, full radius, 44px), secondary (transparent + white border), orange-CTA (gradient, 16px/700, glow on hover), WhatsApp (`#25D366`), light-bg variants (`#0D0D0D` fill / outline).
- **Cards:** Service (dark `#1A1A1A`, orange glow on hover), Portfolio (16:9, slide-up overlay), Case Study (light or dark, lifting hover), Blog (light, image scale + title color shift), Stat Counter (animated GSAP CountTo).
- **Badges/Pills:** orange accent, dark, success, service-tag.
- **Forms:** Input/Textarea/Select with 52px height, 12px radius, orange focus ring `0 0 0 4px rgba(255,98,0,.12)`, inline error/valid states.
- **Navbar:** transparent at top → frosted `rgba(13,13,13,.9)` + `backdrop-blur(20px)` on scroll; Services mega-dropdown (600px, 2-col); TechGuild link with orange "NEW" badge; mobile hamburger → full-height drawer with staggered links.
- **Footer:** 5-column (brand + 3 link groups + contact), social icons, bottom bar with Privacy/Terms.
- **Floating WhatsApp button:** fixed bottom-right, 56px, pulse ring every 4s, tooltip.
- **Scroll progress bar:** 3px orange gradient, top-fixed, used on long pages.
- **Skeletons:** shimmer `#1A1A1A→#222→#1A1A1A`.

## A6. Motion System

Principles: purposeful, smooth (transform/opacity only, 60fps), respectful (`prefers-reduced-motion`), consistent easing.

```ts
export const ease = { smooth:[0.25,0.46,0.45,0.94], snappy:[0.16,1,0.3,1], gentle:[0.4,0,0.2,1] }
export const fadeUp = { hidden:{opacity:0,y:28}, visible:{opacity:1,y:0,transition:{duration:.55,ease:ease.smooth}} }
export const stagger = (d=0.1)=>({ hidden:{}, visible:{transition:{staggerChildren:d}} })
export const scaleIn = { hidden:{opacity:0,scale:.92}, visible:{opacity:1,scale:1,transition:{duration:.45,ease:ease.smooth}} }
```

Scroll reveals via `useInView({once:true,amount:0.15})`. Page transitions via `AnimatePresence` fade/slide. Counters via GSAP. All animations gated behind `useReducedMotion()`.

## A7. Responsive Breakpoints

| Name | Breakpoint | Prefix |
|---|---|---|
| Mobile Small | < 480px | default |
| Mobile Large | 480+ | `sm:` |
| Tablet | 768+ | `md:` |
| Desktop Small | 1024+ | `lg:` |
| Desktop Full | 1280+ | `xl:` |
| Wide | 1536+ | `2xl:` |

Navbar collapses < 1024px. Section padding: 96px desktop → 80px tablet → 64px mobile. WhatsApp button shifts to 16px insets on mobile.

## A8. Accessibility & Performance Baseline

WCAG 2.1 AA: 4.5:1 contrast for text, orange used for decorative/large only; 2px orange focus outlines; semantic landmarks; skip-to-main; full keyboard nav; labelled inputs. Performance: WebP via `next/image`, explicit dimensions (no CLS), hero preload, lazy below-fold, dynamic imports for GSAP/Calendly, JS bundle < 200KB gzipped, Tailwind purge.

---

# PART B — PAGE-BY-PAGE FRONTEND SPECIFICATION

> Every page below defines **at least six unique sections**. No section copy or layout is reused between pages. Each section lists: purpose, layout, components, copy direction, and motion.

## B1. HomePage (`/`)

**Page Goal:** Establish premium credibility in 5 seconds, communicate the four-pillar value proposition, surface proof, and capture leads. Background canvas `#0D0D0D` with animated grid drift and a central orange radial glow.

**Section 1 — Hero ("Think Outside The Box").** Full-viewport split: left 60% holds an orange eyebrow pill ("India's Growth-Driven Digital Agency"), an 80px three-line headline with "Outside" in orange gradient, an 18px sub-promise, dual CTAs ([Get Free Consultation] orange + [View Our Work] outline), and a quick-stats row (10M+ Touchpoints · 2,700+ Leads · 200+ Keywords). Right 40% is a parallax collage of three tilted portfolio mockups bobbing at different rates. Motion: staggered entry at 150ms intervals; headline reveals word-by-word; mockups slide in from the right at 900ms. LCP target < 2s on 4G.

**Section 2 — Client Trust Marquee.** Purpose: instant social proof. Background `#141414` with top/bottom hairlines. Two rows of wordmark pills scroll in opposite directions (30s / 35s) with gradient fade edges. Clients: AKC Foods, RocoMamas, Lucid Colloids, Data-Hat AI, Emporis, CropWings, Kubera, Organoindia, Meat Me Foods, Periship, Find Me Eats, Reyleaf, House Escort, SNAG Parking, Teegolf, AgriStox, Nahl, PolyMint. Hover brightens the pill with an orange border. CSS-only animation, no JS.

**Section 3 — Four Pillars Grid.** Purpose: explain the offering. Centered header ("What We Do" / "Four Pillars of Your Digital Growth"). 2×2 dark service cards numbered 01–04, each with an orange gradient icon, H3 title, 2-line description, three sub-services with arrow prefixes, and an "Explore →" link. Cards lift 6px with an orange glow on hover; scroll-triggered stagger entry. Copy emphasizes integration: pillars amplify each other.

**Section 4 — Animated Impact Statistics.** Purpose: quantify credibility. Five GSAP counters in a divided horizontal row: 10M+ Digital Touchpoints, 2,700+ Leads Generated, 200+ Keywords on Page 1, 43% Avg Traffic Growth, 6+ Years Expertise. Counts animate 0→value on viewport entry; reduced-motion shows final value instantly. Seamless dark background with subtle grid texture.

**Section 5 — Featured Portfolio (Filterable).** Purpose: prove results visually. Left-aligned header with right-side "View All Work →". Category filter pills (All/Marketing/Design/Development/AI) drive a client-side filtered 3-column grid of six featured projects, each card showing image, client name, service tags, and one orange result metric. Hover reveals a slide-up metadata overlay; filter changes animate with Framer Motion layout transitions.

**Section 6 — Why Domain Expansion (Differentiators).** Purpose: address "why you". Elevated surface with four icon+text tiles: Results Before Relationships, AI-Native by Default, Founder-Led Quality, Remote Efficiency. Each tile carries unique supporting copy (not a tagline restated). Icons orange, copy muted-white.

**Section 7 — Process Flow (Discover → Strategy → Execute → Measure).** Purpose: reduce perceived risk. Horizontal four-step flow with ghost step numbers behind cards and an animated dashed connector that fills orange as the user scrolls (GSAP). Mobile stacks vertically. Each step has distinct micro-copy describing inputs and outputs.

**Section 8 — Featured Case Studies (3-Up).** Purpose: bridge to deep proof. Three preview cards: client, industry tag, one-line challenge, a large orange headline metric, and "Read Case Study →". Distinct from the portfolio grid — these emphasize narrative and outcome, not thumbnails.

**Section 9 — TechGuild Promo Strip.** Purpose: tease the SaaS product. Full-width dark band with subtle violet+orange gradient, "Introducing TechGuild" + "Coming Q3 2026" badge, a one-line value prop for agencies and one for clients, and two CTAs ([Join the Waitlist] / [Post a Project]). Animated background shimmer.

**Section 10 — Blog Preview + Footer CTA.** Latest three blog cards (category, title, excerpt, read time, author) under "From the Domain Expansion Blog", then a full-width CTA strip ("Ready to Think Outside The Box?") with an email input, "Get Free Consultation" button, and trust copy ("No commitment. Free discovery call. Response within 24 hours."). WhatsApp quick-contact button persists.

*All CTAs instrumented with GA4 events (`cta_click` + `cta_location`). Sticky scroll progress bar at top.*

## B2. About Us (`/about`)

**Page Goal:** Convert visitors who need human trust before contact. Mixed dark hero → lighter narrative surfaces.

**Section 1 — Brand Hero ("We're Domain Expansion").** Dark grid hero, orange accent word, subheadline introducing the remote-first mission. No stats here (kept distinct from homepage hero) — instead a single declarative positioning line.

**Section 2 — The Founder Story.** Two-column (first-person narrative left, founder card right). Ishwar's 2024 founding story, the choice to go fully remote, and the vision behind the four pillars — written as an entrepreneurial journey, never a resume. Founder card: photo, "Founder & Chief Strategist", LinkedIn + WhatsApp links.

**Section 3 — Mission, Vision & Values.** Three sub-blocks: Mission as a large centered quote display; Vision under a forward-arrow icon; Values as five cards (Measurable Impact, Radical Transparency, Remote-First Excellence, AI-Powered Execution, Founder Accountability) — each with a unique 2-sentence rationale.

**Section 4 — Remote-First Culture.** Why remote is a strength: access to India's best talent regardless of geography, lower overheads = better client value, async deep-work, deliberate timezone overlap with US/UK/EU. Visual: abstract network/world-map graphic.

**Section 5 — By The Numbers.** Counter strip distinct from homepage: 6+ Years Combined Expertise, 21+ Projects Delivered, 4 Service Pillars, 17+ Industries Served, 2,700+ Leads Generated, 200+ Keywords Ranked.

**Section 6 — Agency Timeline.** Vertical milestone timeline: 2024 founded → Q2 first 5 clients → Q3 AI Expansion launched → Q4 10+ engagements → 2025 TechGuild concept → 2025 Q3 15+ projects → 2026 Q1 website relaunch → 2026 Q3 TechGuild launch.

**Section 7 — Team (Scalable Grid).** Founder card now, "More team profiles coming soon" placeholder, built to accept future member cards.

**Section 8 — CTA ("Let's Build Something Together").** Orange CTA to Contact + optional WhatsApp strip.

## B3. Contact Us (`/contact`)

**Page Goal:** Convert intent into a qualified, well-briefed lead. Dark hero → dark form card.

**Section 1 — Hero.** "Let's Build Something Great Together" / "Tell us about your project — we'll come back with a plan, not a pitch."

**Section 2 — Form + Info (2-Column).** Left 60%: the lead form (Name, Email, Phone, Company, Service dropdown, Budget dropdown, Message, How-did-you-hear, consent checkbox, honeypot, hCaptcha, "Send My Inquiry"). Right 40%: contact cards (Email click-to-copy, WhatsApp click-to-open, LinkedIn) + 24-hour response note.

**Section 3 — Book a Discovery Call.** DE-branded Calendly/Cal.com embed in a 600px dark container: "Prefer to talk first? Book a free 30-minute discovery call."

**Section 4 — Pre-Engagement FAQ.** Five accordions: minimum budget, working outside India, typical timeline, monthly retainers, what happens after submitting.

**Section 5 — Trust Signals.** "50+ Projects Delivered" badge, "24-Hour Response" badge, relevant tool/platform marks.

**Section 6 — Form Behavior Spec.** Real-time Zod + React Hook Form validation; lazy hCaptcha when in view; loading spinner on submit; success replaces form with confirmation ("Thanks [Name]! Inquiry #[ID] logged"); Resend confirmation + admin notification; DB store with timestamp, IP hash, UTM; rate limit 3/IP/hour; honeypot silent reject.

## B4. Services Archive (`/services`)

**Page Goal:** Orient and route. Dark animated grid.

**Section 1 — Hero.** "Everything Your Brand Needs to Grow Digitally" / "Four interconnected pillars. One integrated strategy. Measurable outcomes."

**Section 2 — Four Large Pillar Cards.** 2×2 large cards, each ~50% width, with pillar name, icon, tagline, 3-line description, 5-8 visible sub-services, and an "Explore [Pillar]" button. Staggered scroll-in, lifting hover with orange border.

**Section 3 — Full Sub-Service Grid (SEO).** Every sub-service across all pillars as linkable chips under pillar headers — each an indexable, crawlable element routing to the relevant detail page/anchor.

**Section 4 — How Our Services Work Together.** Integration diagram: Brand Identity (Design) → Website (Dev) → SEO Campaign (Marketing) → AI Lead-Gen (AI), each phase amplifying the next — DE's integrated edge vs single-service shops.

**Section 5 — Industries We Serve.** Visual grid: Food & Beverage, Real Estate, SaaS & Tech, E-Commerce, Healthcare, Professional Services, Education, Events, Manufacturing.

**Section 6 — Free Consultation CTA.** "Not sure which service is right for you?" → free 30-minute discovery call.

## B5. Service Page Template (`/services/[slug]`)

Applies to all four pillar pages; sub-service pages reuse at reduced depth. Each carries these eight sections with pillar-specific content:

1. **Hero + Breadcrumb** (Home > Services > [Service]) with a service-specific value prop and dual CTAs.
2. **Service Overview** — 2-column prose (250-400 words) + relevant visual (channels / tech-stack logos / AI tool ecosystem).
3. **Sub-Services Deep-Dive** — card grid of every sub-service with icon, description, and one outcome.
4. **Process Methodology** — pillar-specific numbered steps (see below).
5. **Results / Mini Case Studies** — 2-3 mini cards with orange metrics linking to full case studies.
6. **Tools & Technologies** — logo grid specific to the pillar.
7. **FAQ (8-10)** — accordion with FAQPage schema.
8. **CTA** — pre-selects this service in the Contact form dropdown.

### B5.1 Marketing Expansion (`/services/marketing-expansion`)
Overview covers SEO/GEO/AIO/GSO, performance, social, email (2.08M emails), WhatsApp, content, influencer, events (200+ regs). Process: Discover → Audit → Strategy → Execution → Optimization → Reporting. Mini case studies: Data-Hat AI (SEO), Meat Me Foods (social), PolyMint (event). Tools: GA4, Meta Business, HubSpot, Ahrefs, SEMrush, Mailchimp, Klaviyo. Headline proof: 7.4M+ impressions, 2,700+ leads, 43% traffic growth.

### B5.2 Development Expansion (`/services/development-expansion`)
Overview covers WordPress/Framer/custom, Shopify/WooCommerce, React/Next.js web apps, React Native/Flutter, custom software, APIs, CRM/ERP, SaaS. Process: Discover → Architecture → Design → Development → Testing → Launch. Mini case studies: SNAG Parking (web+app), Find Me Eats (web/app), CropWings (website+SEO). Tools: React, Next.js, Node, PostgreSQL, Tailwind, Vercel, AWS, Shopify, WordPress.

### B5.3 Design Expansion (`/services/design-expansion`)
Overview covers UI/UX, social creative, ad creative, banners, brand identity, presentations, packaging. Process: Brief → Research → Concepts → Refinement → Delivery → Handoff. Mini case studies: AKC Foods, RocoMamas, Lucid Colloids. Tools: Figma, Adobe Creative Suite, Canva Pro.

### B5.4 AI Expansion (`/services/ai-expansion`)
Overview covers automation (n8n/Make/Zapier), chatbots/RAG, AI lead-gen, LLM integration, AI calling/voice, custom AI software, AI analytics. Process: Audit → Roadmap → Prototype → Build → Train → Monitor. Mini case studies: Data-Hat AI, an AI lead-gen automation (40% CAC reduction), an AI chatbot deployment. Tools: Claude API, GPT-4, Gemini, n8n, Make, Langchain, Pinecone.

---

## B6. Portfolio Archive (`/portfolio`)

**Page Goal:** Showcase breadth across 21 projects and convert browsers into consultations.

**Section 1 — Hero.** "Our Work Speaks for Itself" / "21 projects across Marketing, Development, Design, and AI — each measured by results."

**Section 2 — Sticky Category Filter Bar.** All (21) | Marketing (8) | Development (6) | Design (5) | AI (2). Client-side filtering with fade transitions; sticky on scroll.

**Section 3 — Portfolio Grid (3-Column).** 21 cards (16:9 image/gradient placeholder, client name, service-tag pills, 1-2 word metric). Hover: subtle image zoom + slide-up overlay with description and "View Project →".

**Section 4 — Aggregate Results Strip.** "Across 21 projects: 10M+ Touchpoints · 2,700+ Leads · 200+ Keywords on Page 1 · 17+ Industries Served."

**Section 5 — Industries Served.** Visual sector grid linking (future) to filtered views.

**Section 6 — Start a Project CTA.** "See something you like? Let's build your success story."

## B7. Portfolio Project Template (`/portfolio/[slug]`)

1. **Project Hero** — project name, client, service chips, optional "View Live →", 16:9 cover.
2. **Metadata Strip** — Industry | Services | Duration | Year.
3. **The Challenge** — 400-600 word narrative of the pre-DE situation.
4. **The Approach** — strategy, tactics, tools, and decisions (shows thinking, not just output).
5. **Results & Metrics** — dominant orange metric cards (≥ 3) + narrative attribution.
6. **Visual Gallery** — 3-6 screenshots/creatives in a lightbox grid.
7. **Client Testimonial** (if available).
8. **Similar Project CTA** + **Related Projects** (3 cards).

## B8. Case Study Archive (`/case-studies`)

**Page Goal:** Deep strategic proof for high-value visitors. Dark with orange accents.

**Section 1 — Hero.** "Real Problems. Real Strategies. Real Results."

**Section 2 — Featured Case Study (Full Width).** Largest engagement (PolyMint/PRCA) as a hero feature: visual left, challenge summary right, three orange metrics, "Read Full Case Study →".

**Section 3 — Case Studies Grid (2-Column).** Remaining studies: industry chip, client, challenge headline, excerpt, 2-3 metric pills, CTA.

**Section 4 — Industry Filter.** Filter pills by sector.

**Section 5 — Region Filter.** India vs International toggle (relevant to Persona 2).

**Section 6 — CTA.** "Want results like these? Let's talk."

## B9. Case Study Page Template (`/case-studies/[slug]`)

Each is a 1,500-3,000 word deep-dive with ten sections: (1) Hero + three key metric tiles; (2) Context & Background; (3) The Problem; (4) Domain Expansion's Strategy; (5) Execution; (6) Results & Analysis (visual + narrative, before/after, attribution); (7) Client Testimonial; (8) Lessons & Takeaways; (9) Related Case Studies; (10) Start Your Success Story CTA. See PART C for the content of each individual case study.

## B10. Blog / NewsRoom Archive (`/blog`)

**Page Goal:** Organic SEO traffic + expertise demonstration. Light canvas for readability.

**Section 1 — Hero.** "Domain Expansion Blog & NewsRoom" / "Expert insights on Marketing, Development, Design, and AI — written by practitioners, not theorists."

**Section 2 — Featured Article.** Full-width feature card (large image, category, headline, 3-line excerpt, author, date, read time, CTA).

**Section 3 — Category Filter Tabs.** All | SEO & Marketing | Design | Development | AI | Agency News; active tab underlined orange.

**Section 4 — Article Grid (3-Column).** Cards with category pill on image, title, excerpt, author avatar + name + date + read time.

**Section 5 — Sidebar (Desktop).** Popular Posts (5), Categories with counts, Newsletter signup ("join 300+ subscribers").

**Section 6 — Load More / Pagination.** 9 per page.

Launch posts (10): SEO 200+ keywords case study; WhatsApp Marketing guide; AI automation cut CAC 40%; 2026 social design trends; GEO vs SEO vs AIO; event marketing 200+ regs; remote-first agencies; 2.08M emails deep-dive; e-commerce that converts; What is TechGuild.

## B11. Blog Post Template (`/blog/[slug]`)

1. **Article Hero** — category tag, title (≤80 chars), author byline (Ishwar Mule, photo, date, read time), 16:9 Cloudinary cover.
2. **Article Body** — Sanity Portable Text renderer; 65-75 char line length, line-height 1.7; supports H2/H3, lists, blockquotes, code, captioned images, callouts (info/warning/tip).
3. **Related Articles** — 3 cards by category/tag.
4. **Author Box** — Ishwar bio with LinkedIn + Instagram.
5. **Article CTA** — contextual to article category, pre-selects matching service.
6. **Social Share Bar** — LinkedIn, X, WhatsApp, copy-link; sticky left on desktop, inline on mobile. Scroll progress bar active.

## B12. Privacy Policy (`/privacy`)

Clean light layout with sticky table-of-contents sidebar and "last updated" date. Twelve sections, DPDP Act 2023 + GDPR-compatible: (1) Intro & company info; (2) Information We Collect; (3) How We Use It; (4) Legal Basis; (5) Third Parties (Resend, GA4, Cloudinary, Sanity, Neon/Vercel — no data selling); (6) Retention; (7) Your Rights; (8) Cookies (essential vs opt-in); (9) International Transfers; (10) Children's Privacy; (11) Changes; (12) Contact (Info@domainexpansion.in, +91 89834 33664). Six-plus distinct content blocks visually separated; anchor-linked TOC.

## B13. Terms & Conditions (`/terms`)

Same clean light layout/TOC. Twelve sections: Agreement; Use of Website; Intellectual Property; Client Services Terms; Payment Terms; Limitation of Liability; Indemnification; TechGuild Platform Terms; Dispute Resolution (Indian Arbitration Act); Governing Law (Maharashtra; Solapur/Latur courts); Changes (30-day notice); Contact.

## B14. TechGuild Page (`/techguild`)

**Product:** A verified, agency-only B2B marketplace. Unlike Upwork/Freelancer/Fiverr (individuals, unpredictable quality), TechGuild lists ONLY manually-verified digital agencies. Clients post briefs; agencies respond with structured proposals; the platform handles matching, communication, milestone tracking, and (Phase 3) escrow. Visual identity adds a deep-violet accent (`--tg-violet`) alongside DE orange via `--tg-grad`.

**Section 1 — Hero.** "TechGuild: Where Great Agencies Meet Great Clients" + "Coming Q3 2026" chip. Subhead: "The first B2B marketplace built exclusively for verified digital agencies. No freelancers. No guesswork." CTAs: [Join Agency Waitlist] (orange) + [Post a Project] (white). Animated violet/orange gradient mesh background.

**Section 2 — The Problem We're Solving.** Split panel: client side ("burned by freelancers — low quality, missed deadlines") vs agency side ("30-50% of revenue on lead gen — cold outreach, ads, referral dependency").

**Section 3 — How It Works (Tabbed).** For Clients (Post Project → Receive Proposals in 48h → Hire with Confidence) and For Agencies (Create Verified Profile → Browse & Propose → Win More Clients). Tab toggle animates content swap.

**Section 4 — Platform Features (6 Cards).** Agency Verification System; Structured Proposal Management; Milestone Tracking; Escrow-Protected Payments (Phase 3); Outcome-Weighted Review & Rating; In-Platform Messaging. Each card has unique explanatory copy.

**Section 5 — Pricing Preview (Agency Plans).** Free (Starter): 1 active proposal, basic profile, all-projects access. Growth (₹2,999/mo): 5 proposals, enhanced profile, search priority, analytics, direct messaging. Pro (₹7,999/mo): unlimited proposals, featured placement, badge, account manager, early access. Note: "Waitlist members get 3 months free on any plan."

**Section 6 — FAQ (8).** For freelancers? (No); how agencies are verified (manual review); project types (all digital services); agencies outside India? (Yes — South Asia & beyond); launch (Q3 2026); waitlist fee (none); vs Upwork (agency-only); agencies at launch (target 50 verified).

**Section 7 — Waitlist Signup.** Minimal form: Email, I am a: Agency/Client toggle, Company, Phone (WhatsApp preferred), consent, hCaptcha, [Join the Waitlist]. Success: "You're on the list! Position #[N]."

---

# PART C — INDIVIDUAL CASE STUDY CONTENT

> One detailed case study per documented project. Each follows the B9 ten-section template. Metrics are best-effort representative figures consistent with DE's aggregate stats and are to be replaced with verified client data before publication.

### C1. PolyMint / PRCA — Marketing, AI Automation & Event (`/case-studies/polymint-prca`)
**Metric tiles:** 200+ event registrations · 2.08M emails delivered · 38% open rate.
**Context:** PolyMint, in partnership with PRCA, ran a multi-market professional event series across Asian markets and needed to fill seats while protecting sender reputation across a very large outreach footprint.
**Problem:** Previous broadcast attempts hurt deliverability; registrations were flat and attribution was guesswork. The list was large but unsegmented, and manual follow-up did not scale.
**Strategy:** DE built a segmented lifecycle: warm-up sequencing to rebuild domain reputation, persona-based registration tracks, and an AI-assisted personalization layer that tailored subject lines and send-times per cohort. Event-marketing funnels were mapped end-to-end from invite to attendance.
**Execution:** 2.08M emails dispatched in controlled, reputation-safe batches with authenticated sending (SPF/DKIM/DMARC), automated registration pages, and n8n workflows pushing registrants into reminder cadences and CRM. Real-time dashboards tracked opens, clicks, and registrations by market.
**Results & Analysis:** 200+ registrations generated across Asian markets at a high 38% average open rate, with inbox placement protected throughout. Automation removed manual follow-up entirely, and attribution clarified which markets and subject lines drove sign-ups.
**Takeaways:** Reputation-first sending plus AI personalization at scale beats blast volume — a transferable playbook for any high-volume event funnel.

### C2. Data-Hat AI — SEO, Web Dev & Growth Marketing (`/case-studies/data-hat-ai`)
**Metric tiles:** 200+ keywords on Page 1 · +320% organic traffic in 90 days · 6-mo payback.
**Context:** A US-based AI startup with strong product but near-zero organic visibility, competing in a crowded AI tooling category.
**Problem:** No technical SEO foundation, thin content, slow site, and no ranking authority — paid acquisition was the only channel and CAC was rising.
**Strategy:** Technical-SEO-first — fix crawlability and Core Web Vitals, then build a topical content cluster around high-intent AI queries, layered with GEO/AIO optimization so the brand surfaces in AI-generated answers.
**Execution:** Rebuilt the marketing site on Next.js for speed and schema; shipped pillar pages + supporting articles on a content calendar; structured data and internal linking; ongoing link acquisition. Rankings monitored in Search Console and Ahrefs.
**Results & Analysis:** 200+ keywords reached Page 1 and organic sessions grew ~320% within 90 days, shifting the acquisition mix away from paid and reducing blended CAC. Organic became the leading pipeline source within two quarters.
**Takeaways:** Speed + structured data + intent-mapped clusters compound; GEO/AIO future-proofs visibility as search shifts to AI answers.

### C3. AKC Foods — Social Media Design & Ad Creatives (`/case-studies/akc-foods`)
**Metric tiles:** 3.4x engagement · 210% follower growth · 28% lower CPC.
**Context:** An Indian F&B brand with an inconsistent feed and underperforming ads.
**Problem:** No cohesive visual system; posts felt ad-hoc; ad creatives fatigued quickly and cost-per-click kept climbing.
**Strategy:** Build a branded creative system — templated post/story/reel-thumbnail formats and a testing framework for ad creatives so winners could be scaled and losers retired fast.
**Execution:** Designed a monthly content system in the brand palette, produced carousel and video-thumbnail variants for Meta, and ran structured creative A/B tests tied to performance.
**Results & Analysis:** Engagement rose 3.4x, followers grew 210% over the campaign, and disciplined creative testing cut CPC 28% by killing fatigue early.
**Takeaways:** A reusable creative system plus a testing loop turns social design into a measurable performance channel, not just decoration.

### C4. RocoMamas — Social Media & Ad Creative Design (`/case-studies/rocomamas`)
**Metric tiles:** +180% reach · 5x saves · 2.1x store-visit intent.
**Context:** A casual-dining brand needing appetite-driven, scroll-stopping creative.
**Problem:** Generic food photography and flat captions failed to drive saves, shares, or footfall intent.
**Strategy:** Lead with bold, craveable creative and a consistent voice; design for saves and shares (the algorithmic multipliers) rather than vanity likes.
**Execution:** High-contrast food creative, motion thumbnails, and a posting rhythm aligned to peak meal-time windows; localized offers in creative to drive intent.
**Results & Analysis:** Reach grew 180% and saves jumped 5x, with measurable lift in store-visit intent signals — creative that earns saves earns distribution.
**Takeaways:** Designing explicitly for saves/shares unlocks organic reach that paid alone cannot buy.

### C5. Lucid Colloids — B2B Social Media Design (`/case-studies/lucid-colloids`)
**Metric tiles:** +260% LinkedIn impressions · 3.2x profile visits · 40+ qualified inquiries.
**Context:** A B2B hydrocolloids manufacturer needing credibility with technical buyers.
**Problem:** B2B content was dry and invisible; the brand looked smaller than its actual capability.
**Strategy:** Translate technical expertise into clean, authoritative B2B visuals — explainer carousels, application use-cases, and trust-building thought leadership.
**Execution:** A LinkedIn-first content system with industry-specific creative, consistent cadence, and lead-capture CTAs routed to the team.
**Results & Analysis:** LinkedIn impressions rose 260%, profile visits 3.2x, producing 40+ qualified inbound inquiries — proof that disciplined B2B design generates pipeline.
**Takeaways:** B2B social works when expertise is made visual, specific, and consistent.

### C6. Sai Proviso Emporis — Social Media, Ads & Lead Gen (`/case-studies/emporis`)
**Metric tiles:** 320+ leads · ₹-41% cost-per-lead · 22% lead-to-visit.
**Context:** A real-estate developer needing qualified site visits, not just clicks.
**Problem:** High ad spend with low-quality leads and poor follow-up conversion.
**Strategy:** Tighten targeting to high-intent geos/segments, build a qualification-first funnel, and automate instant lead routing so speed-to-lead improved.
**Execution:** Localized Meta + Google campaigns, project-specific landing pages, and automated WhatsApp/CRM routing for instant follow-up.
**Results & Analysis:** 320+ leads at a 41% lower cost-per-lead, with a 22% lead-to-site-visit rate — quality and speed beat raw volume.
**Takeaways:** In real estate, speed-to-lead and qualification design outperform broad reach.

### C7. CropWings — Website Design & SEO (`/case-studies/cropwings`)
**Metric tiles:** +43% organic traffic · 1.9s LCP · 90+ Lighthouse.
**Context:** An agri-tech/drone-services brand with a slow, hard-to-find site.
**Problem:** Poor performance and weak search presence limited inbound discovery.
**Strategy:** Rebuild for performance and SEO simultaneously — a fast, schema-rich site mapped to service-intent keywords.
**Execution:** New responsive site, image optimization, structured data, and an on-page SEO pass targeting agri-service queries.
**Results & Analysis:** Organic traffic up 43%, LCP cut to 1.9s, Lighthouse 90+ — a faster site that also ranks.
**Takeaways:** Performance and SEO are one project, not two — speed is a ranking and conversion lever.

### C8. Kubera — Website & E-Commerce (`/case-studies/kubera`)
**Metric tiles:** +2.6x conversion rate · -34% cart abandonment · +58% AOV.
**Context:** A consumer brand moving from a basic catalog to a real storefront.
**Problem:** Clunky checkout, high abandonment, and low average order value.
**Strategy:** Conversion-first commerce — streamline checkout, add trust signals, and design merchandising that lifts AOV via bundles and upsells.
**Execution:** Rebuilt store with optimized PDPs, a shortened checkout, payment-gateway integration, and bundle/upsell modules.
**Results & Analysis:** Conversion rate up 2.6x, cart abandonment down 34%, AOV up 58% — compounding revenue impact.
**Takeaways:** Small checkout and merchandising changes drive outsized revenue when designed around the buyer.

### C9. Kubera Communications — Web Dev & Digital Marketing (`/case-studies/kubera-communications`)
**Metric tiles:** +150% qualified traffic · 4x demo requests · 1.2s TTFB.
**Context:** A communications/services firm needing a credible web presence and pipeline.
**Problem:** Outdated site and no inbound engine.
**Strategy:** Modern Next.js site + an inbound funnel combining SEO and targeted campaigns feeding a clear demo CTA.
**Execution:** Rebuild, analytics instrumentation, content + paid campaigns, and conversion-focused CTAs.
**Results & Analysis:** Qualified traffic up 150% and demo requests 4x on a fast (1.2s TTFB) site.
**Takeaways:** A credible, fast site is the foundation that paid and organic both convert against.

### C10. Nahl — Website & Performance Marketing (`/case-studies/nahl`)
**Metric tiles:** 4.1x ROAS · -29% CPA · +63% landing-page CVR.
**Context:** A brand scaling paid acquisition that needed efficiency, not just spend.
**Problem:** Mediocre ROAS and high CPA dragged by weak landing pages.
**Strategy:** Align creative, audience, and landing-page message into one tight loop; iterate on the highest-leverage points (the page and the offer).
**Execution:** New conversion-optimized landing pages, restructured campaigns, audience refinement, and continuous CRO testing.
**Results & Analysis:** ROAS reached 4.1x, CPA fell 29%, and landing-page conversion rose 63%.
**Takeaways:** The landing page is usually the biggest paid-performance lever — fix it first.

### C11. AgriStox — Web/App Dev & Marketing (`/case-studies/agristox`)
**Metric tiles:** 12k+ app installs · 4.6★ store rating · -45% support tickets.
**Context:** An agri-commerce platform needing a reliable web + mobile product and adoption.
**Problem:** Fragmented experience, friction in onboarding, and high support load.
**Strategy:** Unify web and mobile on a shared design system, simplify onboarding, and reduce support load through clearer UX and in-app guidance.
**Execution:** React Native app + web app on shared components, streamlined onboarding flows, and a growth-marketing launch.
**Results & Analysis:** 12k+ installs, a 4.6★ rating, and 45% fewer support tickets from clearer UX.
**Takeaways:** A shared design system across web and app accelerates delivery and lifts quality simultaneously.

### C12. Organoindia — E-Commerce & Marketing (`/case-studies/organoindia`)
**Metric tiles:** +210% online revenue · 3.1x repeat purchase · -22% CAC.
**Context:** An organic-products brand growing direct-to-consumer.
**Problem:** Low repeat purchase and rising acquisition cost threatened unit economics.
**Strategy:** Shift focus from one-time acquisition to retention — email/WhatsApp lifecycle flows, subscriptions, and a storefront tuned for repeat buyers.
**Execution:** Optimized store, post-purchase and win-back flows, subscription option, and retention-weighted campaigns.
**Results & Analysis:** Online revenue up 210%, repeat purchase rate 3.1x, CAC down 22% as retention carried growth.
**Takeaways:** For consumables, retention design is the cheapest growth channel available.

### C13. Meat Me Foods — Social Media & Marketing (`/case-studies/meat-me-foods`)
**Metric tiles:** +230% lead volume · 4.5x reach · 19% cost-per-order reduction.
**Context:** A meat-delivery brand needing local demand and orders.
**Problem:** Limited reach and inconsistent ordering demand in target zones.
**Strategy:** Appetite-led creative + hyperlocal targeting + a frictionless order/WhatsApp path to convert interest into orders fast.
**Execution:** Craveable social creative, geo-targeted campaigns, and an instant WhatsApp ordering/lead route.
**Results & Analysis:** Lead volume up 230%, reach 4.5x, cost-per-order down 19% — a same-industry proof point for Persona 1.
**Takeaways:** Local F&B wins on craveable creative + zero-friction ordering.

### C14. Sahchi United — Digital Marketing (`/case-studies/sahchi-united`)
**Metric tiles:** +140% inbound · 2.4x conversion · +35% brand search.
**Context:** A growing organization needing broad digital demand generation.
**Problem:** Low brand awareness and an inconsistent inbound flow.
**Strategy:** Coordinated awareness-to-conversion funnel across content, social, and paid, reinforcing brand search.
**Execution:** Multi-channel campaigns, content cadence, and conversion tracking across the funnel.
**Results & Analysis:** Inbound up 140%, conversion 2.4x, branded search up 35% — awareness compounding into demand.
**Takeaways:** Brand and performance are not opposites — awareness lifts conversion efficiency.

### C15. Periship — Web Dev & Marketing (`/case-studies/periship`)
**Metric tiles:** 99.9% uptime · +120% organic leads · 1.7s LCP.
**Context:** A logistics/shipping-adjacent business needing a dependable, discoverable web presence.
**Problem:** Reliability and visibility gaps undermined trust and inbound.
**Strategy:** Build a robust, fast, SEO-ready platform and pair it with a focused inbound campaign.
**Execution:** Hardened, performant build with monitoring, plus SEO and targeted marketing.
**Results & Analysis:** 99.9% uptime, organic leads up 120%, LCP 1.7s — reliability and discoverability together.
**Takeaways:** Trust-sensitive businesses convert better on demonstrably reliable, fast platforms.

### C16. Find Me Eats — Web/App & Marketing (`/case-studies/find-me-eats`)
**Metric tiles:** 18k+ MAU · +3.3x session length · 4.7★ rating.
**Context:** A food-discovery product needing engagement and retention.
**Problem:** Discovery friction and shallow sessions limited stickiness.
**Strategy:** Design for discovery and habit — fast search, personalization, and a clean cross-platform experience.
**Execution:** Web + mobile app on shared components, personalization, and a growth launch.
**Results & Analysis:** 18k+ monthly active users, session length up 3.3x, 4.7★ rating.
**Takeaways:** Discovery products live or die on speed and personalization of the core loop.

### C17. Reyleaf — SEO & Marketing (`/case-studies/reyleaf`)
**Metric tiles:** +280% organic traffic · 60+ Page-1 keywords · +90% leads.
**Context:** A brand with strong offering but minimal search footprint.
**Problem:** Invisible in organic search; reliant on referrals.
**Strategy:** Intent-mapped content clusters + technical SEO to own category queries.
**Execution:** Keyword research, content production, on-page and technical fixes, link building.
**Results & Analysis:** Organic traffic up 280%, 60+ keywords on Page 1, leads up 90%.
**Takeaways:** Methodical cluster-based SEO turns an invisible brand into a category contender.

### C18. House Escort — Web Dev & Marketing (`/case-studies/house-escort`)
**Metric tiles:** +175% qualified inquiries · 2.8x CVR · -31% bounce.
**Context:** A property/relocation-services brand needing qualified inbound.
**Problem:** A confusing site and unqualified inquiries wasted team time.
**Strategy:** Clarify the offer, redesign for conversion, and qualify leads earlier in the form flow.
**Execution:** New site/IA, conversion-focused pages, qualification fields, and targeted campaigns.
**Results & Analysis:** Qualified inquiries up 175%, conversion 2.8x, bounce down 31%.
**Takeaways:** Clarity and qualification design improve both volume and lead quality.

### C19. Whats The Buz — Marketing & Social Media (`/case-studies/whats-the-buz`)
**Metric tiles:** +400% reach · 6x shares · +120% follower growth.
**Context:** A media/entertainment-leaning brand chasing cultural reach.
**Problem:** Content lacked shareable hooks and consistency.
**Strategy:** Trend-native, share-optimized content with a fast publishing rhythm.
**Execution:** Reactive content calendar, format experiments, and creator-style production.
**Results & Analysis:** Reach up 400%, shares 6x, followers up 120%.
**Takeaways:** Share-native formats and speed are the engine of cultural reach.

### C20. SNAG Parking — Web + App + Marketing (`/case-studies/snag-parking`)
**Metric tiles:** 25k+ installs · -50% booking friction · 4.5★ rating.
**Context:** A parking-tech product needing adoption and smooth bookings.
**Problem:** Booking friction and low awareness limited usage.
**Strategy:** Simplify the booking core loop, ship reliable web + app, and drive installs through targeted marketing.
**Execution:** Cross-platform build on shared design system, streamlined booking, and launch campaigns.
**Results & Analysis:** 25k+ installs, booking friction halved, 4.5★ rating.
**Takeaways:** Reducing core-loop friction is the highest-ROI work in a transactional app.

### C21. Teegolf — Digital Marketing & SEO (`/case-studies/teegolf`)
**Metric tiles:** +190% organic traffic · 3.5x bookings · 50+ Page-1 keywords.
**Context:** A golf/leisure brand needing both discovery and bookings.
**Problem:** Weak search presence and low online booking volume.
**Strategy:** SEO for discovery + a conversion path optimized for bookings, reinforced by seasonal campaigns.
**Execution:** SEO program, booking-focused UX, and seasonal performance campaigns.
**Results & Analysis:** Organic traffic up 190%, bookings 3.5x, 50+ keywords on Page 1.
**Takeaways:** Pair SEO discovery with a booking-optimized path to convert interest into revenue.

---

## PART D — IMPLEMENTATION NOTES

- **Routing:** Marketing pages SSG; blog/case studies SSG + ISR (revalidate 3600s) from Sanity; admin/TechGuild dynamic.
- **Component reuse:** Section components live under `components/sections/<page>/`; shared primitives under `components/ui/`.
- **Content sourcing:** Portfolio, case studies, and blog content from Sanity CMS; legal pages as MDX/static.
- **Instrumentation:** Every CTA emits a GA4 `cta_click` event with a `cta_location` parameter matching the section names above.
- **Placeholders:** Where client imagery is unavailable, use branded gradient placeholders; replace progressively.
- **Case-study metrics:** Figures in PART C are representative and consistent with DE aggregate stats; replace with verified client data before publishing.

---

*Document Version: 3.0 | Status: Consolidated Master — Approved | Domain Expansion © 2026*



