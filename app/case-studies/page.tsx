"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Sparkles, TrendingUp } from "lucide-react";
import { projects, Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const categories = [
  { id: "all", label: "All Categories" },
  { id: "marketing", label: "Marketing" },
  { id: "development", label: "Development" },
  { id: "design", label: "Design" },
  { id: "ai", label: "AI & Automation" },
] as const;

export default function CaseStudiesPage() {
  const [selectedRegion, setSelectedRegion] = useState<"All" | "India" | "International">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Find PolyMint / PRCA as the featured project
  const featuredProject = projects.find((p) => p.slug === "polymint-prca") || projects[0];

  useEffect(() => {
    // Filter out the featured project from the main list, OR keep it if requested,
    // let's keep all projects in the filter list so they can easily search/filter it.
    let list = projects;

    if (selectedRegion !== "All") {
      list = list.filter((p) => p.region === selectedRegion);
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categories.includes(selectedCategory as any));
    }

    setFilteredProjects(list);
  }, [selectedRegion, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* SECTION 1 — Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-[#2E2E2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-[10px] font-mono tracking-widest uppercase text-[#FF8C42]">
            <BookOpen className="h-3.5 w-3.5 text-[#FF6200]" /> Empirical Evidence
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            Real Problems. <span className="text-gradient-orange">Real Strategies.</span> Real Results.
          </h1>
          <p className="text-sm sm:text-base text-[#ACACB8] max-w-2xl leading-relaxed">
            Read detailed breakdowns of how we diagnose issues, architect systems, and scale organic channels without the boilerplate.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Featured Case Study */}
      {featuredProject && (
        <section className="py-20 border-b border-[#2E2E2E]">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold mb-4 block text-left">
              ★ Flagship Case Deep-Dive
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch rounded-2xl border border-[#2E2E2E] bg-[#141414]/30 overflow-hidden">
              {/* Left Side Details */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between text-left">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="orange">{featuredProject.industry}</Badge>
                    <Badge variant="dark">{featuredProject.region} Market</Badge>
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                    {featuredProject.clientName}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-[#FF8C42]">
                    {featuredProject.title}
                  </p>
                  <p className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
                    {featuredProject.challengeDescription}
                  </p>

                  <div className="flex flex-col gap-2 mt-4">
                    <span className="text-[10px] font-mono text-[#888898] uppercase">Primary Challenge</span>
                    <p className="text-xs text-white font-medium border-l-2 border-[#FF6200] pl-3">
                      {featuredProject.challengeHeadline}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#2E2E2E] flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4">
                    {featuredProject.metrics.slice(0, 2).map((m, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="font-display text-xl font-extrabold text-white">{m.value}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[#888898]">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/case-studies/${featuredProject.slug}`}>
                    <Button variant="primary" className="py-2.5 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                      Read Full Deep-Dive <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side Visual Mock */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#FF6200]/25 to-[#6D28D9]/25 p-8 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#2E2E2E]">
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded self-start">
                    Attributed Metrics
                  </span>
                  
                  <div className="flex flex-col gap-4 bg-black/40 p-6 rounded-xl border border-[#2E2E2E]">
                    <div className="flex justify-between items-center border-b border-[#2E2E2E]/60 pb-3">
                      <span className="text-xs font-mono text-[#888898]">Emails Dispatched</span>
                      <span className="text-xs font-bold text-white">2.08 Million</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#2E2E2E]/60 pb-3">
                      <span className="text-xs font-mono text-[#888898]">Spam Trap Bypass</span>
                      <span className="text-xs font-bold text-emerald-500">100% Secure</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-[#888898]">Registrations Generated</span>
                      <span className="text-xs font-bold text-[#FF6200]">200+ Seats</span>
                    </div>
                  </div>
                </div>

                {featuredProject.testimonial && (
                  <div className="flex flex-col gap-2 mt-8 text-left border-l-2 border-brand-orange pl-4 italic text-xs text-white/95 leading-relaxed">
                    <p>"{featuredProject.testimonial.quote}"</p>
                    <span className="text-[10px] font-mono text-[#FF8C42] not-italic font-bold uppercase mt-1">
                      — {featuredProject.testimonial.author}, {featuredProject.testimonial.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3 — Region & Categories Filter Bar */}
      <section className="border-b border-[#2E2E2E] bg-[#141414]/30 py-6">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Region Toggle (India vs International) */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-[#2E2E2E] bg-black/40">
            {(["All", "India", "International"] as const).map((reg) => {
              const isActive = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                    isActive ? "bg-[#FF6200] text-black" : "text-[#ACACB8] hover:text-white"
                  }`}
                >
                  {reg === "All" ? "All Regions" : reg === "India" ? "India" : "International"}
                </button>
              );
            })}
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all border ${
                    isActive
                      ? "border-[#FF6200] text-[#FF6200] bg-[#FF6200]/5"
                      : "border-[#2E2E2E] text-[#ACACB8] hover:text-white hover:border-[#888898]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Case Studies Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <motion.div 
            layout 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  key={project.slug}
                  className="group rounded-xl border border-[#2E2E2E] bg-[#141414]/20 p-6 sm:p-8 flex flex-col justify-between hover:bg-[#141414]/40 hover:border-[#FF6200]/30 transition-all duration-300"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">{project.industry}</span>
                      <span className="text-[10px] font-mono text-[#ACACB8]">{project.duration} ({project.year})</span>
                    </div>

                    <h3 className="font-display text-xl font-bold group-hover:text-brand-orange transition-colors mb-2">
                      {project.clientName}
                    </h3>
                    <p className="text-xs text-[#FF8C42] font-semibold mb-4 leading-snug">
                      {project.title}
                    </p>

                    {/* Challenge Box */}
                    <div className="p-4 rounded-lg bg-black/40 border border-[#2E2E2E] mb-6">
                      <span className="text-[9px] font-mono text-[#888898] uppercase block mb-1">Diagnosed Bottleneck</span>
                      <p className="text-xs text-[#ACACB8] leading-relaxed line-clamp-2">
                        {project.challengeDescription}
                      </p>
                    </div>

                    {/* Attributed Results bullet items */}
                    <div className="mb-6 flex flex-col gap-2">
                      <span className="text-[9px] font-mono text-[#888898] uppercase tracking-wider block">Empirical Results</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {project.metrics.slice(0, 3).map((met, idx) => (
                          <li key={idx} className="bg-white/2 border border-[#2E2E2E] rounded p-2 text-center flex flex-col justify-center">
                            <span className="text-xs font-extrabold text-white block">{met.value}</span>
                            <span className="text-[8px] text-[#888898] uppercase tracking-tighter mt-0.5 line-clamp-1">{met.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[#2E2E2E]/60 mt-auto">
                    <div className="flex gap-1.5">
                      {project.categories.map((c) => (
                        <span key={c} className="text-[8px] font-mono uppercase bg-white/5 border border-white/10 text-white/50 px-1 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/case-studies/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8C42] hover:text-[#FF6200] transition-colors"
                      data-cursor="hover"
                    >
                      Deep-Dive Narrative <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <span className="text-xs font-mono text-[#888898]">No case studies match this filter query.</span>
              <Button
                onClick={() => {
                  setSelectedRegion("All");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="py-2 text-xs font-mono"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5 — Consult CTA */}
      <section className="py-24 relative overflow-hidden border-t border-[#2E2E2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 md:px-8 relative z-10 text-center flex flex-col items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Review Roadmap</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Build Your Growth Blueprint</h2>
            <p className="text-xs sm:text-sm text-[#ACACB8] max-w-lg mx-auto leading-relaxed">
              Book a 30-minute operational session with our lead architects. We will examine your active acquisition channels and design a structured optimization plan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button variant="primary" className="px-8 py-3 text-xs uppercase tracking-wider font-bold">
                Submit Lead Briefing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact#calendly">
              <Button variant="outline" className="px-8 py-3 text-xs uppercase tracking-wider font-bold">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
