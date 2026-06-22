"use client";

import { motion } from "framer-motion";
import { TrendingUp, Sparkles, UserCheck, Zap } from "lucide-react";

const items = [
  {
    icon: TrendingUp,
    title: "Results Before Relationships",
    desc: "We prioritize measurable output and business outcomes over fancy report pitches. If it doesn't move the traffic, lead, or revenue needle, we don't build it.",
  },
  {
    icon: Sparkles,
    title: "AI-Native By Default",
    desc: "Every process in our agency is augmented by AI automation. We engineer custom prompt systems and automated flows to achieve 3x faster turnaround times.",
  },
  {
    icon: UserCheck,
    title: "Founder-Led Quality",
    desc: "No junior account handlers passing the buck. Ishwar Mule (Founder & Lead Architect) personally reviews, audits, and code-approves every single delivery.",
  },
  {
    icon: Zap,
    title: "Remote Efficiency",
    desc: "We operate 100% remotely. No premium city rent overheads mean that every single rupee of your retainer budget is channeled directly into expert specialist talent.",
  },
];

export function Differentiators() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
    <section className="relative z-10 py-32 bg-[#0D0D0D]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[25vw] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center gap-3 mb-20">
          <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
            Why Us
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            How We Think Outside The Box
          </h2>
        </div>

        {/* Elevated Surface Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-5 p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414]/60 hover:bg-[#141414] hover:border-brand-orange/20 transition-all duration-300 group"
              >
                {/* Custom Icon Wrapper */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                  <IconComponent className="h-5 w-5" />
                </div>

                {/* Text Block */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-brand-orange duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#888898] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
