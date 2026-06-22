"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Heart, Shield, Cpu, Zap, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { gsap } from "@/lib/gsap";

// Constants for stats counters
const stats = [
  { value: 6, suffix: "+", title: "Years combined expertise" },
  { value: 21, suffix: "+", title: "Projects delivered" },
  { value: 4, suffix: "", title: "Service Pillars" },
  { value: 17, suffix: "+", title: "Industries served" },
  { value: 2700, suffix: "+", title: "Leads generated" },
  { value: 200, suffix: "+", title: "Keywords ranked page 1" },
];

// Constants for values
const values = [
  {
    icon: Award,
    title: "Measurable Impact",
    desc: "We focus on traffic, leads, and revenue metrics. If it doesn't move the needle, we don't build it."
  },
  {
    icon: Shield,
    title: "Radical Transparency",
    desc: "No black-box reports. Clients have real-time access to dashboards, task boards, and raw performance metrics."
  },
  {
    icon: Globe,
    title: "Remote-First Excellence",
    desc: "By operating 100% remotely, we hire top-tier specialists from any zip code, cutting corporate rent overhead."
  },
  {
    icon: Cpu,
    title: "AI-Powered Execution",
    desc: "Every process is augmented by bespoke automation (n8n/Make) to execute tasks 3x faster than traditional agencies."
  },
  {
    icon: Heart,
    title: "Founder Accountability",
    desc: "No junior account managers passing the buck. Ishwar Mule personally codes, inspects, and approves every delivery."
  }
];

// Timeline Milestones
const milestones = [
  { year: "2024", title: "Founded", desc: "Established as a remote digital agency in Maharashtra by Ishwar B. Mule to offer premium web architectures." },
  { year: "Q2 2024", title: "First 5 Clients", desc: "Delivered conversion-optimized e-commerce sites and organic traffic strategies." },
  { year: "Q3 2024", title: "AI Pillar Launch", desc: "Introduced advanced workflow automations (n8n, Make) to scale client operational efficiency." },
  { year: "Q4 2024", title: "10+ Engagements", desc: "Secured long-term retention contracts with professional networks and F&B brands." },
  { year: "2025", title: "TechGuild Concept", desc: "Designed the architecture for an agency-only B2B marketplace to eliminate freelance discovery friction." },
  { year: "Q3 2025", title: "15+ Projects", desc: "Successfully completed major projects including custom app installations and complex SEO cluster pipelines." },
  { year: "Q1 2026", title: "Website Relaunch", desc: "Updated brand design systems to premium dark-mode visuals and optimized scroll behaviors." },
  { year: "Q3 2026", title: "TechGuild Launch", desc: "Upcoming launch of the agency-only escrow-supported B2B marketplace platform." }
];

export default function AboutPage() {
  const statsContainerRef = useRef<HTMLDivElement>(null);

  // GSAP numbers count-up animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const counters = gsap.utils.toArray<HTMLElement>(".about-stat-counter");
      counters.forEach((counter) => {
        const targetVal = parseInt(counter.getAttribute("data-target-value") || "0", 10);
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: targetVal,
            duration: 1.5,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            onUpdate: function () {
              const currentVal = Math.floor(parseFloat(counter.innerText));
              counter.innerText = currentVal.toLocaleString();
            },
          }
        );
      });
    }, statsContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* SECTION 1 — Brand Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden border-b border-[#2E2E2E]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vw] bg-brand-orange/5 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-[10px] font-mono tracking-widest uppercase text-[#FF8C42]">
            Our Identity
          </span>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
            We are <span className="text-gradient-orange">Domain Expansion</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#ACACB8] max-w-2xl leading-relaxed font-light">
            A remote-first creative engineering collective in India building premium digital products, high-intent acquisition systems, and AI-native automation frameworks.
          </p>
        </div>
      </section>

      {/* SECTION 2 — The Founder Story */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story text (60% width) */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
                The Origin
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
                An Agency Built on Code and Outcomes
              </h2>
              <div className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed flex flex-col gap-5">
                <p>
                  In early 2024, I founded Domain Expansion with a simple thesis: the traditional agency model is broken. Brands are tired of paying massive retainers to fund premium metropolitan rent overheads, only to have their accounts passed onto junior developers who rely on off-the-shelf templates.
                </p>
                <p>
                  I envisioned an alternative. A 100% remote digital collective matching the country's best specialist talents directly with growing companies. We consolidated creative design, custom code architectures, performance growth marketing, and AI process automation into a unified, reinforcing engine.
                </p>
                <p>
                  Today, we operate outside of boxes. We code custom platforms from scratch, optimize campaigns for organic and paid search channels, and engineer robust AI scripts. I still personally audit, audit-approve, and code-review every single execution to enforce the absolute highest standards.
                </p>
              </div>
            </div>

            {/* Founder Card (40% width) */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#FF6200/5_0%,transparent_50%)] pointer-events-none" />
                
                {/* Photo avatar area */}
                <div className="w-24 h-24 rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] overflow-hidden mb-6 shadow-lg">
                  <img
                    src="/Team Members/Ishwar Mule.png"
                    alt="Ishwar B. Mule"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl font-bold text-white">Ishwar B. Mule</h3>
                  <span className="font-mono text-[10px] text-brand-orange uppercase tracking-wider">
                    Founder & CEO
                  </span>
                  <p className="text-xs text-[#888898] leading-relaxed mt-2">
                    Leading creative strategy and custom React/Next.js and AI pipeline integrations remotely.
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[#2E2E2E]/60">
                  <Link
                    href="https://www.linkedin.com/in/ishwarmule/"
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] hover:border-brand-orange hover:text-brand-orange transition-all duration-300 text-[#ACACB8]"
                    aria-label="LinkedIn Profile"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </Link>
                  <Link
                    href="https://aratt.ai/user/@ishwarmule"
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] hover:border-brand-orange hover:text-brand-orange transition-all duration-300 text-[#ACACB8]"
                    aria-label="Arattai Contact"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Mission, Vision & Values */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          {/* Centered Mission statement */}
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-6 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
              Our Compass
            </span>
            <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight italic leading-normal text-white">
              "To eliminate the friction between creative expression and technical execution, delivering compounding growth outcomes for our clients."
            </blockquote>
          </div>

          {/* 5 Values Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/20 transition-all duration-300 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-350 mb-6">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-[11px] text-[#888898] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Remote-First Culture */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Net diagram visual left (50%) */}
            <div className="lg:col-span-6 relative h-[360px] sm:h-[400px] w-full rounded-2xl border border-[#2E2E2E] bg-[#141414] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6D28D9/4_0%,transparent_60%)] pointer-events-none" />
              
              {/* Custom CSS network web layout */}
              <div className="relative w-72 h-72">
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-orange border border-white/20 z-10 flex items-center justify-center shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </div>
                
                {/* Pulsing rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-brand-orange/10 animate-[ping_4s_infinite_linear]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#6D28D9]/10 animate-[ping_6s_infinite_linear]" />
                
                {/* Orbiting Node 1 */}
                <div className="absolute top-4 left-10 w-4 h-4 rounded-full bg-[#1A1A1A] border border-[#6D28D9] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
                </div>
                {/* Orbiting Node 2 */}
                <div className="absolute bottom-12 left-6 w-4 h-4 rounded-full bg-[#1A1A1A] border border-brand-orange flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                </div>
                {/* Orbiting Node 3 */}
                <div className="absolute top-16 right-4 w-4 h-4 rounded-full bg-[#1A1A1A] border border-brand-orange flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                </div>
                {/* Orbiting Node 4 */}
                <div className="absolute bottom-6 right-16 w-4 h-4 rounded-full bg-[#1A1A1A] border border-[#6D28D9] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
                </div>

                {/* Connecting SVG lines */}
                <svg className="absolute inset-0 w-full h-full stroke-[#2E2E2E] stroke-1" fill="none">
                  <line x1="144" y1="144" x2="48" y2="24" />
                  <line x1="144" y1="144" x2="32" y2="232" />
                  <line x1="144" y1="144" x2="264" y2="72" />
                  <line x1="144" y1="144" x2="216" y2="256" />
                  <line x1="48" y1="24" x2="264" y2="72" className="stroke-brand-orange/10" />
                  <line x1="32" y1="232" x2="216" y2="256" className="stroke-[#6D28D9]/10" />
                </svg>
              </div>

              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[9px] font-bold text-[#888898] uppercase tracking-wider">
                  Active Async Networks
                </span>
              </div>
            </div>

            {/* Culture copy right (50%) */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
                Talent Pipeline
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
                Global Standards, Zero Geographic Limits
              </h2>
              <div className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed flex flex-col gap-5">
                <p>
                  We operate 100% remotely. By doing so, we bypass the constraint of local hiring pools. If a complex SEO campaign needs India's top structured-schema editor, or if a WebGL project requires a seasoned shader developer, we onboard them without worrying about relocation boundaries.
                </p>
                <p>
                  Our async workflow is organized around clear inputs, checklist items, and transparent boards. We align our timezone schedules with clients in the US, UK, EU, and Asia, ensuring seamless coordination loops.
                </p>
                <p>
                  Lower corporate overhead translates directly into competitive retainer rates and maximum allocation toward high-level specialist talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — By The Numbers */}
      <section
        ref={statsContainerRef}
        className="py-20 bg-[#141414]/30 border-b border-[#2E2E2E]"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 lg:divide-x divide-[#2E2E2E]/60">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1 pt-6 sm:pt-0 lg:pl-6 first:pl-0 first:pt-0"
              >
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-white flex items-baseline tracking-tight">
                  <span
                    className="about-stat-counter text-gradient-orange"
                    data-target-value={stat.value}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[#FF8C42]">{stat.suffix}</span>
                </div>
                <span className="font-mono text-[9px] font-bold text-[#888898] uppercase tracking-wider leading-tight mt-1">
                  {stat.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Agency Timeline */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
              Our Journey
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Milestones & Iterations
            </h2>
          </div>

          <div className="relative border-l border-[#2E2E2E]/80 max-w-3xl mx-auto pl-6 sm:pl-8 flex flex-col gap-12 text-left">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Bullet indicator */}
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0D0D0D] border border-[#2E2E2E] group-hover:border-brand-orange group-hover:bg-brand-orange transition-all duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>

                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-xs font-bold text-brand-orange">{m.year}</span>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-orange transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#ACACB8] leading-relaxed max-w-xl">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Team Scalable Grid */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
              The Crew
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Founder & Network Specialists
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Core Founder Card */}
            <div className="p-6 rounded-2xl border border-brand-orange/20 bg-[#141414] flex flex-col items-center text-center shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#FF6200/5_0%,transparent_50%)] pointer-events-none" />
              <Link
                href="https://www.linkedin.com/in/ishwarmule/"
                target="_blank"
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A]/80 border border-[#2E2E2E] hover:border-brand-orange hover:text-brand-orange text-[#ACACB8] transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
              <div className="w-20 h-20 rounded-full border border-brand-orange/20 bg-[#1A1A1A] overflow-hidden mb-6 shadow-md">
                <img 
                  src="/Team Members/Ishwar Mule.png" 
                  alt="Ishwar B. Mule" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-orange transition-colors duration-200">
                Ishwar B. Mule
              </h3>
              <span className="font-mono text-[9px] text-[#888898] uppercase tracking-widest mt-1">
                Founder & CEO
              </span>
              <p className="text-xs text-[#ACACB8] leading-relaxed mt-4">
                Sets engineering conventions, client strategy pipelines, and reviews every deployment codebase.
              </p>
            </div>

            {/* CTO Card */}
            <div className="p-6 rounded-2xl border border-violet-500/20 bg-[#141414] flex flex-col items-center text-center shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6D28D9/5_0%,transparent_50%)] pointer-events-none" />
              <Link
                href="https://www.linkedin.com/in/suraj-baride-a5b1a81b4/"
                target="_blank"
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A]/80 border border-[#2E2E2E] hover:border-violet-400 hover:text-violet-400 text-[#ACACB8] transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
              <div className="w-20 h-20 rounded-full border border-violet-500/20 bg-[#1A1A1A] overflow-hidden mb-6 shadow-md">
                <img 
                  src="/Team Members/Suraj Baride.JPG" 
                  alt="Suraj Baride" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-violet-400 transition-colors duration-200">
                Suraj Baride
              </h3>
              <span className="font-mono text-[9px] text-[#888898] uppercase tracking-widest mt-1">
                Co-Founder & CTO
              </span>
              <p className="text-xs text-[#ACACB8] leading-relaxed mt-4">
                Architects core cloud databases, scales API backend pipelines, and manages our high-speed developer networks.
              </p>
            </div>

            {/* Specialist network cards placeholder */}
            <div className="p-6 rounded-2xl border border-[#2E2E2E] bg-[#141414]/40 flex flex-col items-center justify-center text-center border-dashed relative">
              <Link
                href="https://linkedin.com/company/domainexpansion"
                target="_blank"
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A1A]/80 border border-[#2E2E2E] hover:border-[#888898] hover:text-white text-[#ACACB8] transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
              <h3 className="font-display text-sm font-semibold text-[#888898]">
                Senior Brand Designer & DevOps Specialists
              </h3>
              <span className="font-mono text-[8px] text-[#5A5A6A] uppercase tracking-widest mt-1">
                Remote Network Specialists
              </span>
              <p className="text-[11px] text-[#5A5A6A] leading-relaxed mt-3 max-w-[200px]">
                High-end vector systems and custom n8n / workflow automation pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA Let's Build Something */}
      <section className="py-32 relative overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-8">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Ready to Think <span className="text-gradient-orange">Outside The Box</span>?
          </h2>
          <p className="text-xs sm:text-sm text-[#ACACB8] max-w-xl leading-relaxed">
            Stop waiting for slow agency account loops. Deal directly with custom code architects and performance specialists to scale your digital presence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 w-full sm:w-auto">
            <Button variant="primary" magnetic className="px-8 py-4 uppercase text-xs font-bold tracking-wider w-full sm:w-auto">
              <Link href="/contact" className="w-full h-full block">Get Free Consultation</Link>
            </Button>
            <Button variant="outline" className="px-8 py-4 uppercase text-xs font-bold tracking-wider w-full sm:w-auto">
              <Link href="/services" className="w-full h-full block">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
