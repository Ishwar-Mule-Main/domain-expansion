"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const row1 = [
  "PolyMint",
  "Data-Hat AI",
  "AKC Foods",
  "RocoMamas",
  "Lucid Colloids",
  "Sai Proviso Emporis",
  "CropWings",
  "Kubera",
  "Nahl",
  "AgriStox",
];

const row2 = [
  "Organoindia",
  "Meat Me Foods",
  "Sahchi United",
  "Periship",
  "Find Me Eats",
  "Reyleaf",
  "House Escort",
  "Whats The Buz",
  "SNAG Parking",
  "Teegolf",
];

export function ClientTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const skewSetter = gsap.quickTo([track1Ref.current, track2Ref.current], "skewX", {
        duration: 0.3,
        ease: "power3.out",
      });

      const clamp = gsap.utils.clamp(-12, 12);

      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const skewVal = clamp(velocity / -300);
          skewSetter(skewVal);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderLogoRow = (logos: string[]) => {
    // Duplicate list to achieve a seamless layout-wrap looping effect
    const list = [...logos, ...logos, ...logos];
    return list.map((logo, idx) => (
      <div
        key={idx}
        className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#2E2E2E] bg-[#0D0D0D] text-xs font-mono font-medium text-[#888898] hover:text-white hover:border-[#FF6200] transition-colors duration-300 select-none cursor-none whitespace-nowrap gap-1.5"
        data-cursor="hover"
      >
        <span>{logo}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6200]/40" />
      </div>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="relative z-10 py-12 bg-[#141414] border-y border-[#2E2E2E] overflow-hidden flex flex-col gap-6"
    >
      {/* Left/Right mask gradient overlay */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#141414] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#141414] to-transparent z-20 pointer-events-none" />

      {/* Row 1: Scrolling Left */}
      <div className="flex w-full overflow-hidden">
        <div
          ref={track1Ref}
          className="flex gap-4 animate-marquee-left whitespace-nowrap will-change-transform"
        >
          {renderLogoRow(row1)}
        </div>
      </div>

      {/* Row 2: Scrolling Right */}
      <div className="flex w-full overflow-hidden">
        <div
          ref={track2Ref}
          className="flex gap-4 animate-marquee-right whitespace-nowrap will-change-transform"
        >
          {renderLogoRow(row2)}
        </div>
      </div>

      {/* Tailwind marquee custom CSS injections inside global theme styles */}
      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 25s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 25s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
