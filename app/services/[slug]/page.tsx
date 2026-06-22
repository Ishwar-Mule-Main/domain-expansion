import Link from "next/link";
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ServiceFaqs } from "@/components/sections/services/ServiceFaqs";
import { ServiceVisual } from "@/components/sections/services/ServiceVisual";
import { JsonLd } from "@/components/ui/JsonLd";


interface ServiceData {
  title: string;
  breadcrumb: string;
  tagline: string;
  headline: string;
  overview: string[];
  subservices: Array<{ title: string; desc: string; metric: string; label: string }>;
  process: string[];
  results: Array<{ client: string; metric: string; label: string; slug: string }>;
  tools: string[];
  faqs: Array<{ q: string; a: string }>;
}

const serviceDetails: Record<string, ServiceData> = {
  "marketing-expansion": {
    title: "Marketing Expansion",
    breadcrumb: "Marketing",
    tagline: "High-Intent Performance Channels",
    headline: "Scale acquisition channels using search engineering and targeted paid systems.",
    overview: [
      "Traditional marketing funnels are leaking. In 2026, user acquisition requires a cross-channel approach combining organic search visibility, structured Generative Engine Optimization (GEO) parameters, and conversion-focused paid social structures.",
      "We design end-to-end performance marketing systems. By structuring targeted paid campaigns across Google and Meta, warm-up sequencing for lifecycle email flows, and creating deep internal keyword clusters, we scale digital footprint conversions.",
      "Our strategy shifts search parameters away from generic keywords toward high-intent conversion pathways. We protect client sender reputations during high-volume outreach campaigns and ensure that every paid rupee is traced back to customer acquisition metrics."
    ],
    subservices: [
      {
        title: "Search Engineering (SEO/GEO/AIO)",
        desc: "Build authority clusters and structured JSON-LD schemas so LLMs (Gemini, Claude, ChatGPT) cite your brand as the primary source.",
        metric: "200+",
        label: "Keywords Page 1"
      },
      {
        title: "Performance Advertising",
        desc: "Targeted paid acquisition across Meta Business Suite and Google Ads, running against high-conversion custom landing page nodes.",
        metric: "4.1x",
        label: "Average ROAS"
      },
      {
        title: "Email & WhatsApp Lifecycles",
        desc: "Authenticated domain warm-up sequencing, spam filter bypass checks, and automated WhatsApp onboarding pipelines.",
        metric: "2.08M",
        label: "Emails Safe-Sent"
      },
      {
        title: "Event Lead Funnels",
        desc: "Targeted localized outreach and automatic scheduling workflows to fill virtual or physical professional events.",
        metric: "200+",
        label: "Registrations Generated"
      }
    ],
    process: [
      "Acquisition Audit: Complete scrape of existing keyword positions, site speed indicators, and ad creatives.",
      "Topical Clustering: Map out high-intent search terms and define category parent clusters.",
      "Campaign Setup: Authenticate DNS records, set up tracking pixels, and prepare creative variations.",
      "Execution Sprints: Deploy search content updates and initiate campaign A/B visual split testing.",
      "Conversion Optimization: Analyze bounce rates and refine form qualification parameters.",
      "Real-Time Reporting: Surface raw lead parameters and attribution channels on a unified dashboard."
    ],
    results: [
      { client: "Data-Hat AI", metric: "+320%", label: "Organic Traffic Growth", slug: "data-hat-ai" },
      { client: "PolyMint / PRCA", metric: "200+", label: "Registrations Generated", slug: "polymint-prca" }
    ],
    tools: ["Google Analytics 4", "Meta Business Manager", "Ahrefs & SEMrush", "Klaviyo", "Mailchimp", "HubSpot"],
    faqs: [
      { q: "What is Generative Engine Optimization (GEO)?", a: "GEO is the process of optimizing website metadata, structured schemas, and topical authority clusters so AI search search systems (like Gemini, perplexity, and search GPT) cite your brand as the primary reference source." },
      { q: "How do you protect email domain sender reputation?", a: "We utilize authenticated sending practices (strict SPF, DKIM, DMARC), warm up IP pathways progressively, and run clean validation checks to weed out inactive emails prior to deployment." },
      { q: "What is the typical timeline for SEO outcome tracking?", a: "While initial structural fixes show crawl optimizations in 30 days, compound organic keyword growth typically hits Page 1 positions between 90 and 180 days." },
      { q: "Do you handle performance ad creative production?", a: "Yes. Our design expansion team builds and tests custom ad templates, thumbnails, and copy variations specifically to cut cost-per-click metrics." }
    ]
  },
  "development-expansion": {
    title: "Development Expansion",
    breadcrumb: "Development",
    tagline: "High-Performance Engineered Systems",
    headline: "Engineered web and mobile platforms with robust architectures optimized for speed.",
    overview: [
      "Slow load times kill conversions. In the modern web ecosystem, digital flagships require structured, highly performant codebases built with modern React standards, server rendering patterns, and lightweight bundle assets.",
      "We design custom web applications, e-commerce storefronts, and cross-platform mobile apps. By leveraging Next.js server actions, pg pool connection singletons, and robust API configurations, we build software that scales securely.",
      "Our architectures bypass generic page builders to eliminate code bloating and layout shifts. We ensure lightning-fast Time to First Byte (TTFB) metrics and configure clean PostgreSQL queries to handle heavy user loads."
    ],
    subservices: [
      {
        title: "Next.js Web Applications",
        desc: "Custom Server-prerendered, dynamic Next.js builds utilizing React 19 standards and optimized Turbopack compilers.",
        metric: "1.2s",
        label: "Typical TTFB"
      },
      {
        title: "Headless E-Commerce storefronts",
        desc: "Fast Shopify, WooCommerce, or custom storefronts equipped with checkout APIs and payment gate integrations.",
        metric: "+2.6x",
        label: "Conversion Boost"
      },
      {
        title: "API & Middleware Integrations",
        desc: "Synchronize customer inputs directly with third-party CRMs, ERPs, database queues, or custom internal systems.",
        metric: "99.9%",
        label: "Connection Uptime"
      },
      {
        title: "Native Mobile Applications",
        desc: "Cross-platform mobile applications developed via React Native or Flutter, deployed to Apple and Android stores.",
        metric: "4.7★",
        label: "Average Store Rating"
      }
    ],
    process: [
      "Requirements Mapping: Draft complete technical scopes, API endpoints, and database schema mappings.",
      "Architecture Blueprint: Design component structures, page route rules, and data caching policies.",
      "Custom Coding: Build out client interfaces using custom styling tokens and clean React hooks.",
      "API Synchronization: Hook up database pools, CRM listeners, and transactional mail servers.",
      "Security Auditing: Test SQL injection points, configure CORS parameters, and audit rate limiting.",
      "Turbopack Deployment: Deliver compiled static routes and configure content-delivery caching configurations."
    ],
    results: [
      { client: "SNAG Parking", metric: "-50%", label: "Booking Friction", slug: "snag-parking" },
      { client: "CropWings", metric: "1.9s", label: "LCP Speed Performance", slug: "cropwings" }
    ],
    tools: ["React & Next.js", "TypeScript", "PostgreSQL & Prisma", "Node.js", "Vercel & AWS", "Shopify API"],
    faqs: [
      { q: "Why use Next.js for corporate flagships?", a: "Next.js enables Server-Side Rendering (SSR) and Static Site Generation (SSG) in a unified framework, delivering fast initial load speeds (LCP) alongside indexable search engine performance." },
      { q: "How do you secure database transactions?", a: "We utilize Prisma ORM with connection pooling (e.g. Neon or PG pools), implement inputs validation via Zod schemas, and gate access endpoints behind authenticated route middlewares." },
      { q: "Can you migrate legacy platforms to headless setups?", a: "Yes. We decouple backend inventories (Shopify, custom ERPs) and rebuild the frontend on Next.js to accelerate checkout page loads." },
      { q: "What is your QA testing workflow?", a: "We run build checks, TypeScript validations, unit tests, and cross-browser responsive tests to confirm stable rendering before launching production bundles." }
    ]
  },
  "design-expansion": {
    title: "Design Expansion",
    breadcrumb: "Design",
    tagline: "Conversion-Tested Visual Systems",
    headline: "Awwwards-tier visual systems and conversion-tested ad creative layouts.",
    overview: [
      "Visual design is not decoration; it is commercial communication. Creative assets must establish immediate authority, capture intent, and guide visitors toward business conversions.",
      "We design custom user interfaces, vector guidelines, and performance ad assets. By building reusable Figma style systems, testing click-through rates on ad layout grids, and rendering premium presentation slides, we clarify brand propositions.",
      "Our design philosophy rejects generic templates. We combine modern display typography, generous white spaces, asymmetrical balance, and subtle scroll indicators to create premium brand impressions."
    ],
    subservices: [
      {
        title: "UI/UX Product Design",
        desc: "High-fidelity Figma mockups, interactive prototypes, and reusable design systems (typography scales, button states).",
        metric: "-31%",
        label: "Bounce Rate Cut"
      },
      {
        title: "Performance Ad Creatives",
        desc: "Hyper-focused ad variations, reel thumbnails, and banners designed to capture scroll-stopping attention.",
        metric: "3.4x",
        label: "Engagement Lift"
      },
      {
        title: "Brand Guideline Systems",
        desc: "Custom vector logomarks, matching color tokens, and layout guidelines that build uniform multi-channel credibility.",
        metric: "100%",
        label: "Custom Assets"
      },
      {
        title: "Sales Pitch Presentations",
        desc: "Corporate decks and presentation assets designed specifically to convert prospective investors and B2B clients.",
        metric: "4x",
        label: "Demo Conversions"
      }
    ],
    process: [
      "Creative Alignment: Audit client visual identity benchmarks, competitor grids, and brand positioning.",
      "Wireframe Prototypes: Map layout hierarchies, scroll paths, and section information weight.",
      "Component Styling: Formulate UI tokens, button vectors, typography variables, and card structures.",
      "Creative Concepts: Draft multiple high-fidelity design directions focusing on depth and motion overlays.",
      "Refinement Sprints: Iterate design concepts based on user conversion requirements.",
      "Developer Hand-off: Export CSS tokens, responsive SVGs, and complete interactive prototypes in Figma."
    ],
    results: [
      { client: "AKC Foods", metric: "3.4x", label: "Creative Engagement", slug: "akc-foods" },
      { client: "Lucid Colloids", metric: "+260%", label: "LinkedIn Impressions", slug: "lucid-colloids" }
    ],
    tools: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Adobe After Effects", "Canva Pro"],
    faqs: [
      { q: "How does Figma design system handoff work?", a: "We export clean interactive mockups alongside structural tokens (spacing parameters, HSL colors, type weights) to make developer coding direct." },
      { q: "What constitutes conversion-focused ad design?", a: "We balance clear visual hooks (bold displays), localized outcome metrics, and zero-friction CTA triggers to drive user clicks." },
      { q: "Do you design custom assets for offline use?", a: "Yes. We create guidelines, presentations, and vector logomarks optimized for both digital displays and premium print assets." },
      { q: "How do you future-proof brand visual guidelines?", a: "We build layouts around responsive grid bounds and define style rules that adapt cleanly across mobile, desktop, and professional banners." }
    ]
  },
  "ai-expansion": {
    title: "AI Expansion",
    breadcrumb: "AI & Automation",
    tagline: "Operation Cost Reduction Frameworks",
    headline: "Integrate LLM features and automate workflows to cut operating costs.",
    overview: [
      "Manual processes drag down growth. Modern organizations require automated integration layers that qualified leads, route inquiries, and run backend workflows without human delay.",
      "We design custom AI automations, conversational RAG assistants, and LLM middleware integrations. By leveraging advanced workflow triggers in n8n/Make and fine-tuning prompt contexts, we automate operational tasks.",
      "Our AI expansion focuses on measurable utility, not taglines. We build scrapers, qualify leads on database entry, and configure automated alerts to cut operational costs by up to 40%."
    ],
    subservices: [
      {
        title: "Cross-Platform Automations",
        desc: "Connect CRM tools, calendar schedulers, SMS alerts, and database logs using robust n8n or Make pipelines.",
        metric: "40%",
        label: "Operation Cost Cut"
      },
      {
        title: "RAG Conversational Bots",
        desc: "Custom vector-matched chat assistants loaded with client documentation to resolve user questions immediately.",
        metric: "-45%",
        label: "Support Tickets"
      },
      {
        title: "AI Lead Qualifications",
        desc: "Automated scraping scripts that search company details and score inquiries immediately upon entry.",
        metric: "12h",
        label: "Inbound Time Saved"
      },
      {
        title: "LLM Middleware Integrations",
        desc: "Connect custom APIs to Claude or Gemini models to execute dynamic content summary or classification loops.",
        metric: "100%",
        label: "Automated Data Flow"
      }
    ],
    process: [
      "Operational Audit: Interview team members to identify repetitive tasks, bottleneck files, and slow routing loops.",
      "Automation Roadmap: Design workflow logic, conditional paths, API triggers, and database queues.",
      "Prototype Pipelines: Construct initial n8n or Make scripts and connect sandbox webhook triggers.",
      "RAG Configuration: Build document vectors, formulate prompt parameters, and load training contexts.",
      "Integration Sprints: Bind automation pipelines to live databases, web forms, and client email nodes.",
      "System Monitoring: Configure alert logs, track run efficiency, and monitor LLM API call overheads."
    ],
    results: [
      { client: "Data-Hat AI", metric: "40%", label: "CAC Cost Reduction", slug: "data-hat-ai" },
      { client: "PolyMint / PRCA", metric: "2.08M", label: "Automated Batch Invites", slug: "polymint-prca" }
    ],
    tools: ["n8n & Make", "Claude API (Anthropic)", "Gemini API (Google)", "LangChain & Vector DBs", "Upstash Redis", "Zod Validators"],
    faqs: [
      { q: "What is an n8n workflow?", a: "n8n is a node-based integration tool that lets us connect client web APIs, trigger custom code logic, and automate database updates without managing complex servers." },
      { q: "How does Retrieval-Augmented Generation (RAG) work?", a: "RAG takes your training documents (FAQs, terms, manuals), stores them in a vector database, and queries them dynamically to draft accurate AI answers." },
      { q: "Is customer data safe during AI automation?", a: "Yes. We configure strict data endpoints, avoid using public LLM training datasets, and run validation filters to protect user identifiers." },
      { q: "What is the typical ROI for AI automation?", a: "By automating lead scoring and follow-ups, clients cut response delay and reduce manual labor overhead, typically recouping setup costs in 60 days." }
    ]
  }
};

export function generateStaticParams() {
  return [
    { slug: "marketing-expansion" },
    { slug: "development-expansion" },
    { slug: "design-expansion" },
    { slug: "ai-expansion" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePillarPage({ params }: PageProps) {
  const { slug } = await params;
  const data = serviceDetails[slug];

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <h1 className="font-display text-4xl font-bold">Pillar Not Found</h1>
          <Link href="/services" className="text-brand-orange text-xs font-bold uppercase tracking-wider hover:underline">
            Back to All Services
          </Link>
        </div>
      </main>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://domainexpansion.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://domainexpansion.in/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.title,
        "item": `https://domainexpansion.in/services/${slug}`
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.title,
    "serviceType": data.title,
    "provider": {
      "@type": "Organization",
      "name": "Domain Expansion"
    },
    "areaServed": ["IN", "US", "GB", "SG", "AE"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": data.title,
      "itemListElement": data.subservices.map((sub) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": sub.title,
          "description": sub.desc
        }
      }))
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white overflow-hidden">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={faqSchema} />
      {/* Hero Header with Breadcrumb */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 text-left flex flex-col gap-5">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#888898]">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-brand-orange transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{data.breadcrumb}</span>
          </nav>

          <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF8C42] mt-2">
            {data.tagline}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-4xl leading-tight text-white">
            {data.title}
          </h1>
          <p className="text-sm sm:text-base text-[#ACACB8] max-w-2xl leading-relaxed mt-1 font-light">
            {data.headline}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Button variant="primary" magnetic className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">
              <Link href="/contact" className="w-full h-full block">Get Free Consultation</Link>
            </Button>
            <Button variant="outline" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">
              <Link href="/portfolio" className="w-full h-full block">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Overview with dynamic ServiceCanvas */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Overview Prose (7 columns) */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
                Overview
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Our Philosophy & Strategy
              </h2>
              <div className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed flex flex-col gap-5">
                {data.overview.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </div>

            {/* WebGL Canvas Right (5 columns) */}
            <div className="lg:col-span-5 h-[360px] sm:h-[400px] w-full rounded-2xl border border-[#2E2E2E] overflow-hidden relative shadow-lg bg-[#0D0D0D]">
              <ServiceVisual slug={slug} />
              <div className="absolute bottom-4 left-6 flex items-center gap-2 z-10">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                </span>
                <span className="font-mono text-[9px] font-bold text-[#888898] uppercase tracking-wider">
                  Active WebGL Object
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Services Deep-Dive */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center flex flex-col gap-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Deep-Dive</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Operational Deliverables</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.subservices.map((sub, sIdx) => (
              <div
                key={sIdx}
                className="p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/20 transition-all duration-300 group flex flex-col justify-between text-left"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-orange transition-colors duration-200">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-[#888898] leading-relaxed mt-3 mb-6">
                    {sub.desc}
                  </p>
                </div>
                <div className="border-t border-[#2E2E2E]/60 pt-4 flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#ACACB8]">Representative Outcome</span>
                  <div className="flex flex-col items-end">
                    <span className="font-display text-lg font-bold text-brand-orange">{sub.metric}</span>
                    <span className="text-[9px] font-mono text-[#888898] uppercase">{sub.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Methodology */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Workflow</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Methodical Execution Steps</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {data.process.map((step, sIdx) => {
              const [title, desc] = step.split(": ");
              return (
                <div key={sIdx} className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/40 flex flex-col gap-3 group">
                  <span className="font-mono text-xs font-bold text-brand-orange">0{sIdx + 1}</span>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-brand-orange transition-colors">
                    {title}
                  </h3>
                  <p className="text-[11px] text-[#888898] leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results / Mini Case Studies */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Outcomes</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Proof in Action</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {data.results.map((res, rIdx) => (
              <div
                key={rIdx}
                className="p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/30 transition-all duration-300 group flex flex-col justify-between text-left"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888898]">Client Outcome</span>
                  <h3 className="font-display text-xl font-bold text-white mt-2 group-hover:text-brand-orange transition-colors">
                    {res.client}
                  </h3>
                </div>
                <div className="mt-8 flex justify-between items-end border-t border-[#2E2E2E]/60 pt-6">
                  <div className="flex flex-col">
                    <span className="font-display text-4xl font-extrabold text-gradient-orange">{res.metric}</span>
                    <span className="text-[9px] font-mono text-[#888898] uppercase mt-1">{res.label}</span>
                  </div>
                  <Link
                    href={`/case-studies/${res.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-brand-orange transition-colors"
                  >
                    Read Study <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center flex flex-col gap-12">
          <span className="font-mono text-[9px] font-bold text-[#888898] uppercase tracking-widest">
            Tools & Technology Stack
          </span>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {data.tools.map((tool, idx) => (
              <div
                key={idx}
                className="px-5 py-3 rounded-lg border border-[#2E2E2E] bg-[#141414] text-xs font-mono font-semibold text-[#888898] hover:text-white hover:border-brand-orange/20 transition-all select-none"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="text-center flex flex-col gap-3 mb-16">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">FAQ</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">Pillar-Specific Details</h2>
          </div>
          <ServiceFaqs faqs={data.faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-8">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Ready to Expand with Our {data.breadcrumb}?
          </h2>
          <p className="text-xs sm:text-sm text-[#ACACB8] max-w-xl leading-relaxed">
            Let's blueprint a custom roadmap. Get direct access to specialist talent and automated reporting pipelines.
          </p>
          <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto">
            <Button variant="primary" magnetic className="px-8 py-4 uppercase text-xs font-bold tracking-wider w-full sm:w-auto">
              <Link href="/contact" className="w-full h-full block">Get Free Consultation</Link>
            </Button>
            <Button variant="outline" className="px-8 py-4 uppercase text-xs font-bold tracking-wider w-full sm:w-auto">
              <Link href="/services" className="w-full h-full block">All Service Pillars</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
