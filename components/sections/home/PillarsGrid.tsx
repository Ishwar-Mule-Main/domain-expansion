"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Inline customized SVGs as Lucide icons matching the PRD/FSD service types
const pillars = [
  {
    num: "01",
    title: "Marketing Expansion",
    desc: "Scale acquisition channels using search engines, conversion-driven performance ads, and email lifecycle systems.",
    items: ["SEO (GEO, AIO, GSO)", "Performance Ads (Meta/Google)", "WhatsApp & Email Lifecycle"],
    path: "/services/marketing-expansion",
    offsetClass: "lg:translate-y-0",
    color: "from-[#FF6200] to-[#FF8C42]",
  },
  {
    num: "02",
    title: "Development Expansion",
    desc: "Engineered web and mobile platforms with robust architectures, optimized for lightning-fast speeds and high conversions.",
    items: ["Next.js & Web Apps", "Premium E-Commerce", "API & Systems Integrations"],
    path: "/services/development-expansion",
    offsetClass: "lg:translate-y-10",
    color: "from-[#FF8C42] to-[#FF6200]",
  },
  {
    num: "03",
    title: "Design Expansion",
    desc: "Awwwards-tier visual systems, conversion-tested ad designs, and custom presentation assets tailored for modern companies.",
    items: ["UI/UX Product Design", "Performance Ad Creative", "Brand Guidelines & Logo Systems"],
    path: "/services/design-expansion",
    offsetClass: "lg:translate-y-20",
    color: "from-[#6D28D9] to-[#8B5CF6]",
  },
  {
    num: "04",
    title: "AI Expansion",
    desc: "Integrate LLM features and automated workflow pipelines (n8n/Make) directly to streamline operation costs by up to 40%.",
    items: ["AI Automations (n8n/Make)", "Conversational RAG Chatbots", "AI-Powered Lead Generation"],
    path: "/services/ai-expansion",
    offsetClass: "lg:translate-y-[120px]",
    color: "from-[#8B5CF6] to-[#6D28D9]",
  },
];

export function PillarsGrid() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  } as const;

  return (
    <section className="relative z-10 py-32 bg-[#0D0D0D] overflow-hidden">
      {/* Background Decorative Radial */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#6D28D9]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Centered Header */}
        <div className="text-center flex flex-col items-center gap-3 mb-24">
          <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
            What We Do
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight">
            Four Pillars of Your Digital Growth
          </h2>
          <p className="text-sm sm:text-base text-[#888898] max-w-lg leading-relaxed mt-1">
            Individually strong. Together, they create an integrated, self-reinforcing flywheel for compound growth.
          </p>
        </div>

        {/* Staircase Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-32"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/40 hover:shadow-[0_0_40px_rgba(255,98,0,0.06)] transition-all duration-300 group ${pillar.offsetClass}`}
            >
              <div>
                {/* Index Indicator */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs font-bold text-[#888898]">
                    {pillar.num}
                  </span>
                  {/* Abstract Orange/Violet Accent Circle */}
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${pillar.color}`} />
                </div>

                {/* Card Title */}
                <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-orange transition-colors duration-200">
                  {pillar.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs text-[#888898] leading-relaxed mt-3 mb-6">
                  {pillar.desc}
                </p>

                {/* Sub-services mapping */}
                <ul className="flex flex-col gap-2.5 border-t border-[#2E2E2E]/60 pt-6 mt-6">
                  {pillar.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#ACACB8]">
                      <span className="text-brand-orange mt-0.5 select-none">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link */}
              <div className="mt-8 pt-6">
                <Link
                  href={pillar.path}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-brand-orange transition-all duration-200"
                >
                  Explore Pillar
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
