"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const studies = [
  {
    client: "Data-Hat AI",
    industry: "AI SaaS & Technology",
    challenge: "Competing in a crowded AI space with zero organic search pipeline.",
    metric: "+320%",
    metricLabel: "Organic Session Growth",
    slug: "data-hat-ai",
  },
  {
    client: "PolyMint / PRCA",
    industry: "Events & Professional Network",
    challenge: "High-volume email outreach failing to reach target market inboxes.",
    metric: "2.08M",
    metricLabel: "Reputation-Safe Emails Sent",
    slug: "polymint-prca",
  },
  {
    client: "AKC Foods",
    industry: "Food & Beverage Retail",
    challenge: "Inconsistent ad creatives causing rising customer acquisition costs.",
    metric: "3.4x",
    metricLabel: "Social Creative Engagement",
    slug: "akc-foods",
  },
];

export function CaseStudiesShowcase() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="relative z-10 py-32 bg-[#0D0D0D] border-b border-[#2E2E2E]">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3 mb-20 max-w-2xl">
          <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
            Case Studies
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Proof in Action: Real Results
          </h2>
          <p className="text-sm sm:text-base text-[#888898] leading-relaxed">
            We don't talk about aesthetics or lines of code. We document absolute outcomes that directly contributed to growth.
          </p>
        </div>

        {/* 3-Up Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {studies.map((study, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col justify-between p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/30 hover:shadow-[0_4px_30px_rgba(255,98,0,0.04)] transition-all duration-300 group"
            >
              <div>
                {/* Industry Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#888898]">
                    {study.industry}
                  </span>
                  <span className="text-[10px] font-mono text-brand-orange">Outcome Study</span>
                </div>

                {/* Client title */}
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  {study.client}
                </h3>

                {/* Challenge description */}
                <p className="text-xs text-[#888898] leading-relaxed mt-3 mb-8">
                  {study.challenge}
                </p>
              </div>

              {/* Dominant Metric display & Action */}
              <div className="border-t border-[#2E2E2E]/60 pt-6 flex flex-col gap-5">
                <div className="flex flex-col items-start gap-1">
                  <span className="font-display text-5xl font-extrabold text-white flex items-baseline tracking-tight">
                    <span className="text-gradient-orange">{study.metric}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">
                    {study.metricLabel}
                  </span>
                </div>

                <Link
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-brand-orange transition-all duration-200"
                >
                  Read Case Study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
