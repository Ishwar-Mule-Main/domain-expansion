"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Award, Zap, TrendingUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Service pillars list
const pillars = [
  {
    slug: "marketing-expansion",
    title: "Marketing Expansion",
    num: "01",
    tagline: "High-Intent Performance Channels",
    desc: "Acquire and scale digital customer pipelines using structured search parameters, search-engine optimization, and targeted paid campaigns.",
    color: "from-[#FF6200] to-[#FF8C42]",
    subservices: [
      "SEO & Search Engineering (GEO, AIO, GSO)",
      "Performance Marketing (Meta & Google Ads)",
      "WhatsApp & Email Lifecycle Automation",
      "Event Marketing & Attendee Acquisition",
      "Content Cluster Generation Pipelines"
    ]
  },
  {
    slug: "development-expansion",
    title: "Development Expansion",
    num: "02",
    tagline: "High-Performance Engineered Systems",
    desc: "Custom web applications, e-commerce storefronts, and API structures built for speed, security, and compound conversion metrics.",
    color: "from-[#FF8C42] to-[#FF6200]",
    subservices: [
      "React & Next.js Web Application Architectures",
      "Premium Headless E-Commerce Integrations",
      "Custom REST/GraphQL API & Sync Systems",
      "Cloud Infrastructure & Vercel/AWS Setup",
      "Mobile Applications (React Native & Flutter)"
    ]
  },
  {
    slug: "design-expansion",
    title: "Design Expansion",
    num: "03",
    tagline: "Conversion-Tested Visual Systems",
    desc: "Interactive user interfaces, ad creative templates, and brand assets that communicate authority and increase user engagement.",
    color: "from-[#6D28D9] to-[#8B5CF6]",
    subservices: [
      "UI/UX Product Design (Figma systems)",
      "Performance Ad Creative Testing Systems",
      "Premium Pitch Decks & Sales Collateral",
      "Brand Identity, Logomarks & Guidelines",
      "Interactive 3D Assets & Vector Graphics"
    ]
  },
  {
    slug: "ai-expansion",
    title: "AI Expansion",
    num: "04",
    tagline: "Operation Cost Reduction Frameworks",
    desc: "Integrate LLM API capabilities and automate cross-platform work pipelines to scale output speed and slash labor hours.",
    color: "from-[#8B5CF6] to-[#6D28D9]",
    subservices: [
      "Autonomous Workflow Automations (n8n/Make)",
      "Conversational RAG Chatbots & Vector Databases",
      "AI-Powered Lead Generation & Qualification",
      "Bespoke LLM Integrations (Claude/Gemini/GPT)",
      "Automated Reporting & Analytics Dashboards"
    ]
  }
];

// Flat catalog list of sub-services for Section 3 chips
const subservicesCatalog = [
  { name: "Search Engine Optimization (SEO)", pillar: "Marketing" },
  { name: "Generative Engine Optimization (GEO)", pillar: "Marketing" },
  { name: "Conversion Rate Optimization (CRO)", pillar: "Marketing" },
  { name: "Meta Business Paid Ads", pillar: "Marketing" },
  { name: "Google Search & Display Ads", pillar: "Marketing" },
  { name: "Lifecycle Email Warming", pillar: "Marketing" },
  { name: "Next.js Web Applications", pillar: "Development" },
  { name: "Headless E-Commerce Engines", pillar: "Development" },
  { name: "API Middleware Integrations", pillar: "Development" },
  { name: "Docker Container Deployments", pillar: "Development" },
  { name: "React Native Mobile Apps", pillar: "Development" },
  { name: "Custom CRM Synchronization", pillar: "Development" },
  { name: "Figma UI/UX Prototypes", pillar: "Design" },
  { name: "Ad Creative A/B Testing", pillar: "Design" },
  { name: "Pitch Presentations", pillar: "Design" },
  { name: "Logomarks & Visual Systems", pillar: "Design" },
  { name: "3D Extruded Asset Modeling", pillar: "Design" },
  { name: "n8n Workflow Engineering", pillar: "AI" },
  { name: "Make Automation Pipelines", pillar: "AI" },
  { name: "LangChain RAG Nodes", pillar: "AI" },
  { name: "Claude API Embeddings", pillar: "AI" },
  { name: "Conversational Voice Agents", pillar: "AI" },
];

const industries = [
  "SaaS & Technology",
  "E-Commerce & D2C",
  "Food & Beverage",
  "Real Estate & Construction",
  "Healthcare & Pharma",
  "Professional Services",
  "Education & E-Learning",
  "Events & Exhibitions",
  "Manufacturing & Logistics"
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* SECTION 1 — Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 border-b border-[#2E2E2E]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vw] bg-brand-orange/5 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-[10px] font-mono tracking-widest uppercase text-[#FF8C42]">
            What We Deliver
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
            Everything Your Brand Needs to <span className="text-gradient-orange">Grow Digitally</span>
          </h1>
          <p className="text-sm sm:text-base text-[#ACACB8] max-w-xl leading-relaxed">
            Four interconnected service pillars. One unified digital strategy. We design, code, market, and automate to create measurable compounding output.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Four Large Pillar Cards */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col gap-16">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="relative p-8 md:p-12 rounded-2xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/30 transition-all duration-300 group overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from)/5_0%,transparent_60%)] pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  {/* Copy left (7 columns) */}
                  <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#888898]">{p.num}</span>
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${p.color}`} />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#FF8C42]">{p.tagline}</span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-brand-orange transition-colors">
                      {p.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed max-w-xl">
                      {p.desc}
                    </p>

                    <div className="mt-4">
                      <Button variant="outline" className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
                        <Link href={`/services/${p.slug}`} className="flex items-center gap-1.5">
                          Explore Pillar <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Sub-services right (5 columns) */}
                  <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#2E2E2E]/60 pt-6 lg:pt-0 lg:pl-8 flex flex-col gap-4 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888898]">Sub-Services Grid</span>
                    <ul className="flex flex-col gap-3">
                      {p.subservices.map((sub, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5 text-xs text-[#ACACB8] leading-tight">
                          <ChevronRight className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Full Sub-Service Grid */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Sub-Service Catalog</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Index of Specializations</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {subservicesCatalog.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#2E2E2E] bg-[#141414] text-xs font-mono text-[#ACACB8] hover:border-brand-orange/30 hover:text-white transition-all select-none"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  chip.pillar === "Marketing" ? "bg-[#FF6200]" :
                  chip.pillar === "Development" ? "bg-[#FF8C42]" :
                  chip.pillar === "Design" ? "bg-[#8B5CF6]" : "bg-[#6D28D9]"
                }`} />
                {chip.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — How Our Services Work Together */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Integrated Engine</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">The Compound Flywheel</h2>
            <p className="text-xs sm:text-sm text-[#888898] max-w-md mt-1">
              Individually strong, but designed to work together. Each pillar accelerates and feeds the output of the next.
            </p>
          </div>

          {/* Flywheel process visualization flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2E2E2E] -translate-y-1/2 z-0 hidden lg:block" />
            
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative z-10 flex flex-col gap-4 text-left group hover:border-[#8B5CF6]/30">
              <span className="font-mono text-2xl font-bold text-[#8B5CF6]">01</span>
              <h3 className="font-display text-base font-bold text-white">Brand & Creative (Design)</h3>
              <p className="text-[11px] text-[#888898] leading-relaxed">
                We design conversion-optimized visual layouts, ad mockups, and corporate vectors.
              </p>
              <div className="text-[10px] font-mono text-[#5A5A6A] mt-2">↳ Input to Development</div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative z-10 flex flex-col gap-4 text-left group hover:border-[#FF8C42]/30">
              <span className="font-mono text-2xl font-bold text-[#FF8C42]">02</span>
              <h3 className="font-display text-base font-bold text-white">Speed & Structure (Dev)</h3>
              <p className="text-[11px] text-[#888898] leading-relaxed">
                Next.js code builds out the UI structures, optimizing Core Web Vitals and schema markers.
              </p>
              <div className="text-[10px] font-mono text-[#5A5A6A] mt-2">↳ Input to Marketing</div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative z-10 flex flex-col gap-4 text-left group hover:border-brand-orange/30">
              <span className="font-mono text-2xl font-bold text-brand-orange">03</span>
              <h3 className="font-display text-base font-bold text-white">Acquisition Channels (Marketing)</h3>
              <p className="text-[11px] text-[#888898] leading-relaxed">
                Launch SEO content clusters and performance campaigns running against high-conversion pages.
              </p>
              <div className="text-[10px] font-mono text-[#5A5A6A] mt-2">↳ Input to AI Automations</div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative z-10 flex flex-col gap-4 text-left group hover:border-[#6D28D9]/30">
              <span className="font-mono text-2xl font-bold text-[#6D28D9]">04</span>
              <h3 className="font-display text-base font-bold text-white">Scale & Qualify (AI)</h3>
              <p className="text-[11px] text-[#888898] leading-relaxed">
                Automated CRM tools process leads instantly and qualifies prospects via RAG chatbot sequences.
              </p>
              <div className="text-[10px] font-mono text-[#5A5A6A] mt-2">↳ Feeds the Flywheel</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Industries We Serve */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Sectors</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">Industries We Scale</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-4 rounded-xl border border-[#2E2E2E] bg-[#141414] text-center text-xs font-mono font-semibold text-[#888898] hover:border-brand-orange/30 hover:text-white transition-all select-none min-h-[80px]"
              >
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Consultation CTA */}
      <section className="py-32 relative overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-8">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Not Sure Which Service fits Your Scale?
          </h2>
          <p className="text-xs sm:text-sm text-[#ACACB8] max-w-xl leading-relaxed">
            Let's dissect your current channel footprints. We will map out a customized digital roadmap containing explicit milestones on a free 30-minute discovery call.
          </p>
          <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto">
            <Button variant="primary" magnetic className="px-8 py-4 uppercase text-xs font-bold tracking-wider w-full sm:w-auto">
              <Link href="/contact" className="w-full h-full block">Get Free Consultation</Link>
            </Button>
            <Button variant="outline" className="px-8 py-4 uppercase text-xs font-bold tracking-wider w-full sm:w-auto">
              <Link href="/about" className="w-full h-full block">About the Founder</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
