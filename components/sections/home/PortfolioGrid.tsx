"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Project {
  slug: string;
  client: string;
  category: "marketing" | "development" | "design" | "ai";
  categoryLabel: string;
  metric: string;
  metricLabel: string;
  desc: string;
  bgGradient: string;
}

const projects: Project[] = [
  {
    slug: "polymint-prca",
    client: "PolyMint / PRCA",
    category: "marketing",
    categoryLabel: "Marketing Expansion",
    metric: "2.08M",
    metricLabel: "Emails Delivered",
    desc: "Hyper-targeted event marketing sequencing across Asian markets.",
    bgGradient: "from-orange-600/30 to-[#0D0D0D]",
  },
  {
    slug: "data-hat-ai",
    client: "Data-Hat AI",
    category: "ai",
    categoryLabel: "AI Expansion",
    metric: "+320%",
    metricLabel: "Organic Traffic Growth",
    desc: "Rebuilt marketing platform optimized for generative search engine discovery (GEO).",
    bgGradient: "from-violet-600/30 to-[#0D0D0D]",
  },
  {
    slug: "akc-foods",
    client: "AKC Foods",
    category: "design",
    categoryLabel: "Design Expansion",
    metric: "3.4x",
    metricLabel: "Social Engagement Rate",
    desc: "Cohesive visual creative systems and structured ad template testing loops.",
    bgGradient: "from-blue-600/30 to-[#0D0D0D]",
  },
  {
    slug: "emporis",
    client: "Sai Proviso Emporis",
    category: "marketing",
    categoryLabel: "Marketing Expansion",
    metric: "320+",
    metricLabel: "Inbound Leads",
    desc: "Geo-targeted lead generation pipelines pushing real-estate prospects to CRM.",
    bgGradient: "from-emerald-600/30 to-[#0D0D0D]",
  },
  {
    slug: "cropwings",
    client: "CropWings",
    category: "development",
    categoryLabel: "Development Expansion",
    metric: "1.9s",
    metricLabel: "Core Web Vital LCP Speed",
    desc: "Performant Next.js site rebuild with embedded crop analysis tools.",
    bgGradient: "from-yellow-600/30 to-[#0D0D0D]",
  },
  {
    slug: "snag-parking",
    client: "SNAG Parking",
    category: "development",
    categoryLabel: "Development Expansion",
    metric: "25k+",
    metricLabel: "Mobile App Installs",
    desc: "Cross-platform React Native app with automated slot booking flows.",
    bgGradient: "from-pink-600/30 to-[#0D0D0D]",
  },
];

const categories = [
  { value: "all", label: "All Work" },
  { value: "marketing", label: "Marketing" },
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "ai", label: "AI Automation" },
];

export function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = projects.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  return (
    <section className="relative z-10 py-32 bg-[#0D0D0D] border-b border-[#2E2E2E]">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Header Title & Navigation Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
              Our Work
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Projects That Shipped Results
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group flex items-center gap-2 text-xs font-bold text-white hover:text-brand-orange transition-colors duration-200"
            data-cursor="hover"
          >
            View All 2 project case studies
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(cat.value)}
              className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 select-none cursor-none border ${
                activeFilter === cat.value
                  ? "bg-[#FF6200] border-[#FF6200] text-white"
                  : "bg-[#141414] border-[#2E2E2E] text-[#ACACB8] hover:text-white hover:border-[#888898]"
              }`}
              data-cursor="hover"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-influenced 3-column masonry grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#2E2E2E] bg-[#141414] overflow-hidden min-h-[360px] p-8 hover:border-brand-orange/40 hover:shadow-[0_10px_30px_rgba(255,98,0,0.05)] transition-all duration-300"
              >
                {/* Background Color Glow overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${project.bgGradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none z-0`}
                />

                {/* Card Header information */}
                <div className="relative z-10 flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF8C42]">
                    {project.categoryLabel}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mt-1 group-hover:text-brand-orange transition-colors">
                    {project.client}
                  </h3>
                  <p className="text-xs text-[#888898] leading-relaxed mt-2 max-w-xs">
                    {project.desc}
                  </p>
                </div>

                {/* Metrics Footer display */}
                <div className="relative z-10 border-t border-[#2E2E2E]/60 pt-6 mt-8 flex flex-col items-start gap-1">
                  <span className="font-display text-4xl font-extrabold text-white flex items-baseline tracking-tight">
                    <span className="text-gradient-orange">{project.metric}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">
                    {project.metricLabel}
                  </span>
                </div>

                {/* Hover overlay link */}
                <Link
                  href={`/case-studies/${project.slug}`}
                  className="absolute inset-0 z-20 cursor-none"
                  data-cursor="view"
                  data-cursor-type="media"
                  aria-label={`Read case study for ${project.client}`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
