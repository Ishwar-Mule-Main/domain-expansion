"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

interface ServiceItem {
  name: string;
  desc: string;
  path: string;
}

interface Pillar {
  title: string;
  path: string;
  items: ServiceItem[];
}

const pillars: Pillar[] = [
  {
    title: "Marketing Expansion",
    path: "/services/marketing-expansion",
    items: [
      { name: "SEO & Search Growth", desc: "GEO, AIO, GSO future-proof search optimization", path: "/services/marketing-expansion#seo" },
      { name: "Performance Marketing", desc: "Meta, Google, and LinkedIn ROI-driven campaigns", path: "/services/marketing-expansion#performance" },
      { name: "WhatsApp & Email Marketing", desc: "Lifecycle automation and sender reputation handling", path: "/services/marketing-expansion#lifecycle" },
    ],
  },
  {
    title: "Development Expansion",
    path: "/services/development-expansion",
    items: [
      { name: "Next.js & Web Apps", desc: "Bespoke, high-performance, type-safe development", path: "/services/development-expansion#webapps" },
      { name: "Premium Commerce", desc: "Shopify & WooCommerce optimized storefronts", path: "/services/development-expansion#commerce" },
      { name: "Mobile App Development", desc: "React Native cross-platform iOS & Android apps", path: "/services/development-expansion#mobile" },
    ],
  },
  {
    title: "Design Expansion",
    path: "/services/design-expansion",
    items: [
      { name: "UI/UX Product Design", desc: "Figma wireframing, high-fidelity mockups, and UX mapping", path: "/services/design-expansion#uiux" },
      { name: "Performance Ad Design", desc: "Scroll-stopping, A/B tested ad creatives", path: "/services/design-expansion#ads" },
      { name: "Brand Identity Design", desc: "Visual systems, guidelines, and corporate decks", path: "/services/design-expansion#brand" },
    ],
  },
  {
    title: "AI Expansion",
    path: "/services/ai-expansion",
    items: [
      { name: "AI Automations (n8n/Make)", desc: "Operational workflow designs and lead pipelines", path: "/services/ai-expansion#automations" },
      { name: "Conversational RAG Chatbots", desc: "LLM-powered custom chatbots and voice agents", path: "/services/ai-expansion#chatbots" },
      { name: "AI-Powered Lead Generation", desc: "Outbound systems leveraging hyper-personalized messaging", path: "/services/ai-expansion#leadgen" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowMegaMenu(false);
  }, [pathname]);

  const navLinks = [
    { name: "Portfolio", path: "/portfolio" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
        ? "border-b border-[#2E2E2E] bg-[#0D0D0D]/95 backdrop-blur-md py-4"
        : "bg-transparent py-6"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center relative z-50 group">
            <img
              src="/Domain Expansion New Logo.png"
              alt="Domain Expansion Logo"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Services Mega Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-white ${pathname.startsWith("/services") ? "text-white" : "text-[#ACACB8]"
                  }`}
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showMegaMenu ? "rotate-180 text-brand-orange" : ""
                    }`}
                />
              </button>

              {/* Services Mega Dropdown Panel */}
              <AnimatePresence>
                {showMegaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full -left-48 mt-2 w-[720px] rounded-xl border border-[#2E2E2E] bg-[#0D0D0D] p-6 shadow-2xl"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {pillars.map((pillar, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <Link
                            href={pillar.path}
                            className="group flex items-center justify-between font-display text-sm font-bold text-white transition-colors hover:text-brand-orange"
                          >
                            {pillar.title}
                            <ArrowRight className="h-4 w-4 opacity-0 transition-all -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-brand-orange" />
                          </Link>
                          <ul className="flex flex-col gap-1.5 pl-1.5 border-l border-[#2E2E2E]/60">
                            {pillar.items.map((item, idx) => (
                              <li key={idx}>
                                <Link
                                  href={item.path}
                                  className="group block rounded-md p-1.5 transition-all hover:bg-[#1A1A1A]/40"
                                >
                                  <div className="text-xs font-semibold text-white group-hover:text-brand-orange transition-colors">
                                    {item.name}
                                  </div>
                                  <p className="text-[10px] text-[#888898] mt-0.5 line-clamp-1">
                                    {item.desc}
                                  </p>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Bottom strip inside mega menu */}
                    <div className="mt-6 border-t border-[#2E2E2E] pt-4 flex items-center justify-between">
                      <p className="text-xs text-[#888898]">
                        Need help scaling your digital footprint?
                      </p>
                      <Link
                        href="/services"
                        className="text-xs font-bold text-brand-orange hover:text-brand-orange-light flex items-center gap-1"
                      >
                        All Services <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${pathname === link.path ? "text-white" : "text-[#ACACB8]"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* TechGuild (NEW) Link */}
            <Link
              href="/techguild"
              className="group flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white"
            >
              <span
                className={`${pathname === "/techguild" ? "text-white" : "text-[#ACACB8]"
                  } group-hover:text-white`}
              >
                TechGuild
              </span>
              <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-[9px] font-bold text-brand-orange border border-brand-orange/30 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                coming soon
              </span>
            </Link>
          </div>

          {/* Contact Button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-orange-hover hover:scale-105"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden text-[#ACACB8] hover:text-white focus:outline-none relative z-50 p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0D0D0D] flex flex-col justify-between p-8 pt-28 lg:hidden"
          >
            {/* Nav list */}
            <div className="flex flex-col gap-6">
              {/* Services Header */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#888898]">
                  Services
                </span>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  {pillars.map((pillar, i) => (
                    <Link
                      key={i}
                      href={pillar.path}
                      className="group flex flex-col p-2.5 rounded-lg border border-[#2E2E2E]/40 bg-[#1A1A1A]/30 hover:border-brand-orange/30 transition-all"
                    >
                      <span className="font-display text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                        {pillar.title.split(" ")[0]}
                      </span>
                      <span className="text-[9px] text-[#888898] mt-0.5">Explore</span>
                    </Link>
                  ))}
                </div>
              </div>

              <hr className="border-[#2E2E2E]/40" />

              {/* Standard Links */}
              <div className="flex flex-col gap-4">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    className="font-display text-2xl font-bold text-white hover:text-brand-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  href="/techguild"
                  className="font-display text-2xl font-bold text-white hover:text-brand-orange transition-colors flex items-center gap-2"
                >
                  TechGuild
                  <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold text-brand-orange border border-brand-orange/30">
                    NEW
                  </span>
                </Link>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 border-t border-[#2E2E2E]/40 pt-6">
              <p className="text-xs text-[#888898]">
                Think Outside The Box — info@domainexpansion.in
              </p>
              <Link
                href="/contact"
                className="w-full text-center rounded-full bg-brand-orange py-3 text-sm font-bold text-white transition-all hover:bg-brand-orange-hover"
              >
                Get Free Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
