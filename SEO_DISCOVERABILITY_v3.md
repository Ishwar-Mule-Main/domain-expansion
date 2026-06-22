# SEO / AEO / GSO / GEO Discoverability Engineering (v3)
## Domain Expansion — Growth Engine Specification
**Version:** 3.0 | **Basis:** `PRD_v3.md` goals (G3, G7), `FSD_v3.md` pages, `TAD_v3.md` §7 SEO architecture. Next.js 14 App Router.

> Four discoverability disciplines, one implementation surface. All structured data is authored from v3 facts; replace placeholder URLs/IDs before launch.

---

## 1. The Four Disciplines

| Discipline | Goal | Primary mechanism |
|---|---|---|
| **SEO** (Search Engine Optimization) | Rank in classic Google results | Semantic HTML, metadata, Core Web Vitals, sitemap |
| **AEO** (Answer Engine Optimization) | Win featured snippets / direct answers | Question-led headings, concise authoritative answers |
| **GSO** (Generative Search Optimization) | Be cited by Google SGE / AI overviews | Comprehensive JSON-LD schema, entity clarity |
| **GEO** (Generative Engine Optimization) | Be parsed correctly by LLMs (ChatGPT, Gemini, Claude) | Contextual keyword weaving, clear entity relationships, factual density |

These map directly to PRD goals: 10,000+ monthly organic visitors (G3) and Page-1 for 50+ keywords (G7).

---

## 2. SEO Foundation

### 2.1 Metadata (per TAD §7)
Every route exports `generateMetadata()`:
```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Digital Marketing & Web Development Agency in India | Domain Expansion',
    description: 'Domain Expansion is a remote, results-driven digital agency delivering Marketing, Development, Design, and AI services. 10M+ touchpoints, 2,700+ leads generated.',
    alternates: { canonical: 'https://domainexpansion.in/' },
    openGraph: { type:'website', siteName:'Domain Expansion', images:['/og/home.png'] },
    twitter: { card:'summary_large_image' },
    robots: { index:true, follow:true },
  }
}
```
Admin/studio routes: `robots:{index:false,follow:false}`.

### 2.2 Semantic HTML
One `<h1>` per page; logical `<h2>/<h3>`; landmarks `<header><nav><main><article><section><aside><footer>`; descriptive `alt`; `<time datetime>`; breadcrumb `<nav aria-label="Breadcrumb">`. This is also the substrate AEO/GEO parse.

### 2.3 Core Web Vitals
Per TAD §10: LCP < 2.5s, CLS < 0.1, INP < 200ms. The 3D hero (Experience Blueprint) must lazy-load and never block LCP — LCP element is the headline text, not the canvas.

### 2.4 Sitemap & robots
`app/sitemap.ts` enumerates static routes + Sanity blog/case-study slugs; `robots.txt` disallows `/admin`, `/api`, `/studio`.

---

## 3. AEO — Answer Engine Optimization

- **Question-form headings** on service and blog pages: "What is GEO and how is it different from SEO?" immediately followed by a 40–60 word direct answer in the first paragraph.
- **Definition blocks** for every key term (SEO, GEO, AIO, performance marketing, escrow) so answer engines can lift a clean definition.
- **FAQ sections** (already specified in FSD service pages, Contact, TechGuild) double as AEO surfaces — each Q is a `<h3>`, each A is a self-contained paragraph.
- **TL;DR summary** at the top of long case studies: the three metric tiles + one-sentence outcome answer the implicit query "what results did Domain Expansion get for [client]?".

---

## 4. GSO — JSON-LD Schema Library

Inject via a `<JsonLd>` component (`<script type="application/ld+json">`). Keyed to FSD page types per TAD §7.2.

### 4.1 Organization + LocalBusiness (Homepage, sitewide)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Domain Expansion",
  "url": "https://domainexpansion.in",
  "slogan": "Think Outside The Box",
  "foundingDate": "2024",
  "founder": { "@type": "Person", "name": "Ishwar B. Mule", "jobTitle": "Founder & Chief Strategist" },
  "email": "Info@domainexpansion.in",
  "telephone": "+91-89834-33664",
  "address": { "@type": "PostalAddress", "addressRegion": "Maharashtra", "addressCountry": "IN" },
  "sameAs": [
    "https://www.linkedin.com/company/domainexpansion",
    "https://www.instagram.com/domainexpansion.in",
    "https://www.facebook.com/domainexpansion.in"
  ],
  "description": "Remote, results-driven digital agency offering Marketing, Development, Design, and AI Expansion services."
}
```

### 4.2 Service (each pillar page)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Marketing Expansion",
  "provider": { "@type": "Organization", "name": "Domain Expansion" },
  "areaServed": ["IN","US","GB","SG","AE"],
  "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Marketing Expansion",
    "itemListElement": [
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"SEO (incl. GEO/AIO/GSO)"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Performance Marketing"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Email Marketing"}}
    ] }
}
```

### 4.3 CaseStudy (Article + about, each of the 21)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How Domain Expansion ranked 200+ keywords for Data-Hat AI",
  "about": { "@type": "Thing", "name": "SEO and growth marketing case study" },
  "author": { "@type": "Organization", "name": "Domain Expansion" },
  "publisher": { "@type": "Organization", "name": "Domain Expansion" },
  "mainEntityOfPage": "https://domainexpansion.in/case-studies/data-hat-ai"
}
```
Generate this dynamically in `case-studies/[slug]/page.tsx` from the Sanity document for all 21 studies (PolyMint/PRCA, Data-Hat AI, AKC Foods, RocoMamas, Lucid Colloids, Emporis, CropWings, Kubera, Kubera Communications, Nahl, AgriStox, Organoindia, Meat Me Foods, Sahchi United, Periship, Find Me Eats, Reyleaf, House Escort, Whats The Buz, SNAG Parking, Teegolf).

### 4.4 FAQPage (service pages, Contact, TechGuild)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type":"Question", "name":"What makes TechGuild different from Upwork?",
      "acceptedAnswer":{"@type":"Answer","text":"TechGuild lists only verified digital agencies — never individual freelancers — so clients hire accountable teams."} }
  ]
}
```

### 4.5 BreadcrumbList (all nested pages)
Emit on service, portfolio, case-study, and blog pages reflecting the URL hierarchy.

---

## 5. GEO — Generative Engine Optimization

LLMs reward clarity of entities and facts woven into prose (not keyword stuffing):

- **Entity anchoring:** consistently state "Domain Expansion, a remote digital agency founded in 2024 by Ishwar B. Mule" near the top of cornerstone pages so models bind the entity correctly.
- **Factual density:** quote the verifiable aggregate stats (10M+ touchpoints, 2,700+ leads, 200+ Page-1 keywords, 43% avg traffic growth, 2.08M emails) in-narrative on Home/About/Services — these become the facts LLMs cite.
- **Relationship clarity:** explicitly tie services→outcomes→clients ("For Data-Hat AI, our SEO work delivered 200+ Page-1 keywords") so generative engines can answer "which agency got results for AI startups?".
- **Natural keyword weave:** primary themes — "remote digital agency India", "AI marketing agency", "React/Next.js development agency", "agency marketplace" (TechGuild) — placed in headings and first paragraphs without breaking the premium tone.
- **Consistency across surfaces:** the same name, founder, contact, and stats appear identically in JSON-LD, visible copy, and meta — contradictions reduce model trust.

---

## 6. Target Keyword Map (toward PRD G7: 50+ Page-1)

| Page | Primary intent keyword | Secondary |
|---|---|---|
| Home | digital agency India | remote marketing agency, AI agency |
| Marketing Expansion | digital marketing agency India | SEO services, performance marketing |
| Development Expansion | web development agency India | Next.js development, Shopify agency |
| Design Expansion | UI UX design agency | social media creative design |
| AI Expansion | AI automation agency | AI chatbot development, AI lead generation |
| Case studies | [client] case study | SEO case study, ecommerce growth case study |
| TechGuild | agency marketplace | hire a digital agency, agency vs freelancer |
| Blog | GEO vs SEO, WhatsApp marketing guide | email deliverability, remote agency |

---

## 7. Measurement

Search Console (impressions, position, CTR by query), GA4 organic sessions + `cta_click`/`form_submit` events (FSD A8), Rich Results Test for every schema type, and periodic LLM spot-checks (ask ChatGPT/Gemini/Claude "who is Domain Expansion?" and verify cited facts match the v3 docs).

---

*Document Version: 3.0 | Domain Expansion © 2026*
