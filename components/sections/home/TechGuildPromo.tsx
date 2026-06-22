"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function TechGuildPromo() {
  return (
    <section className="relative z-10 py-24 bg-[#0D0D0D] border-b border-[#2E2E2E] overflow-hidden">
      {/* Background Violet/Orange Mesh Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6200]/5 via-transparent to-[#6D28D9]/10 pointer-events-none" />
      
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#6D28D9/8_0%,transparent_70%)] opacity-30 animate-pulse pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <div className="relative p-8 md:p-14 rounded-3xl border border-[#6D28D9]/20 bg-gradient-to-br from-[#141414] to-[#6D28D9]/5 shadow-[0_20px_50px_rgba(109,40,217,0.04)] overflow-hidden">
          {/* Inner details */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
            <div className="flex flex-col gap-4 max-w-xl text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B5CF6]">
                  Introducing TechGuild
                </span>
                <span className="rounded-full bg-[#6D28D9]/15 px-2.5 py-0.5 text-[9px] font-bold text-[#8B5CF6] border border-[#6D28D9]/30 uppercase tracking-wider">
                  Coming Q3 2026
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                The Verified, Agency-Only B2B Marketplace
              </h3>
              <p className="text-xs sm:text-sm text-[#888898] leading-relaxed">
                Connect pre-vetted digital agencies directly with high-intent business clients. No independent freelancers, no bidding wars, and no compromised timelines. Secured by milestones.
              </p>
              
              {/* Split values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 border-t border-[#2E2E2E]/60 pt-6">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">For Clients</h4>
                  <p className="text-[11px] text-[#888898] leading-relaxed">Hire structured, accountable team agencies with verified review metrics.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">For Agencies</h4>
                  <p className="text-[11px] text-[#888898] leading-relaxed">Scale stable pipelines without spending 40% of retainers on outbound sales campaigns.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0">
              <Button variant="primary" className="bg-[#6D28D9] hover:bg-[#5b21b6] focus:ring-[#6D28D9] shadow-[0_0_20px_rgba(109,40,217,0.15)] hover:shadow-[0_0_25px_rgba(109,40,217,0.3)] w-full lg:w-48 text-center text-xs tracking-wider uppercase font-bold py-3.5">
                <Link href="/techguild" className="w-full h-full block">Join Waitlist</Link>
              </Button>
              <Button variant="outline" className="w-full lg:w-48 text-center text-xs tracking-wider uppercase font-bold py-3.5">
                <Link href="/techguild#post" className="w-full h-full block">Post a Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
