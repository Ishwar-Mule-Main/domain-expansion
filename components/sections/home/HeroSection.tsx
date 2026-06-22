"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-transparent py-20 lg:py-0">
      
      {/* 1. Full-screen fixed background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
      />

      {/* 2. Bottom Blur Overlay (no gradient darkening) */}
      <div 
        className="fixed inset-0 backdrop-blur-xl z-[1] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 45%)'
        }}
      />

      {/* 3. Ambient Grid Overlay (for subtle texture) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.04] pointer-events-none z-[2]" />

      {/* 4. Ambient Gradient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#FF6200]/5 rounded-full blur-[130px] pointer-events-none z-[2]" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[30vw] h-[30vw] bg-[#6D28D9]/5 rounded-full blur-[120px] pointer-events-none z-[2]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left copy text block (col-span-8 to hold structure beautifully over the video) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left gap-6 max-w-3xl">
            
            {/* Eyebrow badge (animate-blur-fade-up at 300ms) */}
            <span
              className="animate-blur-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-widest uppercase text-[#FF8C42]"
              style={{ animationDelay: "300ms" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6200] animate-pulse" />
              India's Growth-Driven Digital Agency
            </span>

            {/* Display Headline (animate-blur-fade-up at 400ms) */}
            <h1
              className="animate-blur-fade-up font-display text-4xl sm:text-6xl md:text-[5.25rem] font-bold tracking-tight leading-[0.95] text-white"
              style={{ animationDelay: "400ms" }}
            >
              Think <br />
              <span className="text-gradient-orange">Outside The Box</span>
            </h1>

            {/* Subtitle description (animate-blur-fade-up at 500ms) */}
            <p
              className="animate-blur-fade-up text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-light mt-2"
              style={{ animationDelay: "500ms" }}
            >
              We combine creative strategy, premium design, engineered software, and AI-powered automation to scale businesses globally. Outcome-driven, remote-first.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-wrap gap-4 mt-4 w-full sm:w-auto">
              {/* Solid White Button (Get Free Consultation) - animate-blur-fade-up at 600ms */}
              <div 
                className="animate-blur-fade-up w-full sm:w-auto"
                style={{ animationDelay: "600ms" }}
              >
                <Link href="/contact" className="w-full h-full block">
                  <button className="bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-8 py-4 text-xs tracking-wider uppercase transition-colors duration-300 w-full sm:w-auto cursor-pointer">
                    Get Free Consultation
                  </button>
                </Link>
              </div>

              {/* Liquid Glass Button (View Our Work) - animate-blur-fade-up at 700ms */}
              <div 
                className="animate-blur-fade-up w-full sm:w-auto"
                style={{ animationDelay: "700ms" }}
              >
                <Link href="/portfolio" className="w-full h-full block">
                  <button className="liquid-glass text-white hover:bg-white/5 rounded-full font-semibold px-8 py-4 text-xs tracking-wider uppercase transition-all duration-300 w-full sm:w-auto cursor-pointer flex items-center justify-center border border-white/5">
                    View Our Work
                  </button>
                </Link>
              </div>
            </div>

            {/* Trust Indicators stats row - animate-blur-fade-up at 800ms */}
            <div
              className="animate-blur-fade-up flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 pt-8 border-t border-white/10 w-full text-left"
              style={{ animationDelay: "800ms" }}
            >
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white">10M+</span>
                <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Digital Touchpoints</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white">2,700+</span>
                <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Leads Generated</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white">200+</span>
                <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Keywords Page 1</span>
              </div>
            </div>
          </div>

          {/* Right side placeholder for layout structure spacing */}
          <div className="hidden lg:block lg:col-span-4 h-[500px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
