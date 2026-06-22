"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const stats = [
  { value: 10, suffix: "M+", title: "Digital Touchpoints" },
  { value: 2700, suffix: "+", title: "Leads Generated" },
  { value: 200, suffix: "+", title: "Keywords Page 1" },
  { value: 43, suffix: "%", title: "Avg Traffic Growth" },
  { value: 6, suffix: "+", title: "Years Expertise" },
];

export function StatsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const counters = gsap.utils.toArray<HTMLElement>(".stat-counter-value");
      
      counters.forEach((counter) => {
        const targetVal = parseInt(counter.getAttribute("data-target-value") || "0", 10);
        
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: targetVal,
            duration: 1.8,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            // Format number with commas on updates
            onUpdate: function () {
              const currentVal = Math.floor(parseFloat(counter.innerText));
              counter.innerText = currentVal.toLocaleString();
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 py-20 bg-[#0D0D0D] border-b border-[#2E2E2E]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-[#2E2E2E]/60">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center lg:items-start text-center lg:text-left gap-2 pt-6 sm:pt-0 lg:pl-8 first:pl-0 first:pt-0`}
            >
              {/* Animated number counter block */}
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-white flex items-baseline tracking-tight">
                <span
                  className="stat-counter-value text-gradient-orange"
                  data-target-value={stat.value}
                >
                  {stat.value}
                </span>
                <span className="text-[#FF8C42]">{stat.suffix}</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#888898] uppercase tracking-widest mt-1">
                {stat.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
