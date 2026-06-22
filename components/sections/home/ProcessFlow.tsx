"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const steps = [
  {
    num: "01",
    title: "Discover & Audit",
    desc: "We run a technical search, design, and operations audit of your current digital footprint. No guess work, just solid hard data.",
    deliverable: "Technical Audit & Competitor Matrix",
  },
  {
    num: "02",
    title: "Flywheel Strategy",
    desc: "We design an integrated campaign roadmap spanning our four service pillars, aligning marketing acquisition with tech stacks.",
    deliverable: "Pillar Action Roadmap",
  },
  {
    num: "03",
    title: "Execute & Automate",
    desc: "We deploy premium code, set up high-converting ad layouts, and implement background workflows (n8n/Make) to automate leads.",
    deliverable: "Active Core Tech Stack & Campaigns",
  },
  {
    num: "04",
    title: "Measure & Compound",
    desc: "We track weekly lead quality stats, index keywords on Page 1, optimize ad costs, and scale retainers based on absolute outcome ROI.",
    deliverable: "Weekly Performance Dashboard",
  },
];

export function ProcessFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop layout: Horizontal Pinning Scroll
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const trigger = triggerRef.current;
        if (!track || !trigger) return;

        // Calculate scroll width distance
        const scrollDistance = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            invalidateOnRefresh: true,
          },
        });

        // Animate progress line connector
        if (progressLineRef.current) {
          gsap.to(progressLineRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: trigger,
              scrub: 1,
              start: "top top",
              end: () => `+=${scrollDistance}`,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#0D0D0D]">
      {/* Trigger container */}
      <div ref={triggerRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Sticky section header */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 mb-16 pt-24 lg:pt-0 lg:absolute lg:top-24 lg:left-1/2 lg:-translate-x-1/2">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
              Our Process
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              The Path to Expansion
            </h2>
          </div>
        </div>

        {/* Scroll Track */}
        <div className="relative flex items-center h-full">
          {/* Progress Connector bar (Desktop only) */}
          <div className="hidden lg:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#2E2E2E] z-0">
            <div
              ref={progressLineRef}
              className="h-full w-full bg-brand-orange origin-left scale-x-0"
            />
          </div>

          <div
            ref={trackRef}
            className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-6 md:px-8 py-20 lg:py-0 w-full lg:w-auto relative z-10 select-none cursor-none"
            data-cursor="drag"
            data-cursor-type="drag"
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="w-full lg:w-[420px] shrink-0 p-8 rounded-2xl border border-[#2E2E2E] bg-[#141414] hover:border-brand-orange/20 transition-colors duration-300 relative group flex flex-col justify-between min-h-[300px]"
              >
                {/* Ghost Background step index */}
                <div className="absolute right-6 top-4 font-display text-8xl font-black text-white/[0.02] group-hover:text-brand-orange/[0.04] transition-colors select-none pointer-events-none">
                  {step.num}
                </div>

                <div>
                  {/* Step Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/15 text-xs font-mono font-bold text-brand-orange border border-brand-orange/20">
                      {step.num}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-orange transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step copy */}
                  <p className="text-xs text-[#888898] leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Step Deliverable */}
                <div className="border-t border-[#2E2E2E]/60 pt-4 flex flex-col gap-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#888898]">
                    Core Deliverable:
                  </span>
                  <span className="text-[11px] font-semibold text-[#F3F4F6]">
                    {step.deliverable}
                  </span>
                </div>
              </div>
            ))}

            {/* CTA Card */}
            <div className="w-full lg:w-[420px] shrink-0 p-8 rounded-2xl border border-brand-orange bg-brand-orange text-white relative group flex flex-col justify-between min-h-[300px] shadow-[0_15px_30px_rgba(255,98,0,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              
              <div>
                <h3 className="font-display text-2xl font-bold mb-4 tracking-tight leading-tight">
                  Ready to Think Outside the Box?
                </h3>
                <p className="text-xs text-white/80 leading-relaxed mb-6">
                  Skip the generic agency pitches. Get a customized technical blueprint and operational roadmap from our engineers.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-xs font-bold uppercase tracking-wider text-brand-orange hover:bg-white/90 active:scale-95 transition-all shadow-md text-center"
                >
                  Get Free Consultation
                </Link>
                <div className="text-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/60">
                    SLA Response: 24 Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
