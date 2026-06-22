"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Tv, 
  Globe, 
  Palette, 
  Smartphone, 
  Layers, 
  ChevronRight,
  ExternalLink,
  ZoomIn,
  Award,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PortfolioMediaGrid, MediaItem } from "@/components/sections/portfolio/PortfolioMediaGrid";
import Image from "next/image";

// --- PROGRAMMATIC MEDIA ITEM GENERATOR ---
const generateItems = (
  prefix: string, 
  ext: string, 
  count: number, 
  titlePrefix: string, 
  desc: string,
  aspectRatio: "square" | "video" | "auto" = "auto"
): MediaItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    src: `${prefix} (${i + 1}).${ext}`,
    alt: `${titlePrefix} ${i + 1}`,
    title: `${titlePrefix} #${i + 1}`,
    description: desc,
    aspectRatio
  }));
};

// --- CUSTOM INTERACTIVE WEBMOCKUP CARD ---
interface WebMockupCardProps {
  name: string;
  domain: string;
  tagline: string;
  screenshot: string;
  description: string;
  tags: string[];
  onClickExpand: () => void;
}

function WebMockupCard({
  name,
  domain,
  tagline,
  screenshot,
  description,
  tags,
  onClickExpand
}: WebMockupCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [duration, setDuration] = useState(6);

  const handleMouseEnter = () => {
    if (!containerRef.current || !imageRef.current) return;
    const containerHeight = containerRef.current.offsetHeight;
    const imageHeight = imageRef.current.offsetHeight;
    const travelDistance = imageHeight - containerHeight;
    
    if (travelDistance > 0) {
      setTranslateY(-travelDistance);
      // Calculate scroll duration at constant speed: distance / rate (e.g. 180px/s)
      const calculatedDuration = Math.max(3.5, travelDistance / 180);
      setDuration(calculatedDuration);
    }
  };

  const handleMouseLeave = () => {
    setTranslateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-video rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] overflow-hidden group cursor-zoom-in shadow-lg hover:border-[#FF6200]/40 transition-all duration-300"
      onClick={onClickExpand}
      data-cursor="expand"
    >
      {/* Scrollable screenshot inside 16:9 viewport */}
      <div
        className="w-full absolute top-0 left-0 transition-transform ease-linear"
        style={{
          transform: `translateY(${translateY}px)`,
          transitionDuration: translateY === 0 ? "1.5s" : `${duration}s`,
          transitionTimingFunction: translateY === 0 ? "ease-out" : "linear"
        }}
      >
        <img
          ref={imageRef}
          src={screenshot}
          alt={`${name} web design`}
          className="w-full h-auto object-top block"
        />
      </div>

      {/* Gloss effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/2 to-white/0 pointer-events-none" />

      {/* Hover action overlay */}
      <div className="absolute inset-0 bg-[#0D0D0D]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-black/80 border border-white/10 text-[#FF8C42] uppercase tracking-wider">
            {domain}
          </span>
          <span className="text-[9px] font-mono text-[#FF8C42]/80 font-bold uppercase tracking-widest animate-pulse">Hover to Scroll</span>
        </div>
        
        <div className="flex items-center justify-center flex-grow">
          <span className="px-3.5 py-2 rounded-full bg-[#FF6200] text-[10px] font-mono font-bold text-white shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <ZoomIn className="h-3.5 w-3.5" /> View Screen Layout
          </span>
        </div>
        
        <div className="text-left bg-black/70 backdrop-blur-sm p-3.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <span className="text-[9px] font-mono text-[#FF8C42] uppercase font-bold tracking-wider">{tagline}</span>
          <h4 className="font-display text-sm font-bold text-white line-clamp-1">{name}</h4>
          <p className="text-[10px] text-[#ACACB8] line-clamp-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

// --- SOCIAL MEDIA CREATIVES DATA ---
const smBrands = [
  {
    id: "akc",
    name: "AKC Foods",
    tagline: "Indian F&B Spices & Masales",
    description: "Designed appetizing social media feeds, localized campaigns, and digital posts to drive consumer engagement and brand trust.",
    metrics: "3.4x engagement · 210% follower growth",
    items: generateItems(
      "/Creative Designs/AKCfoods Social Media Creatives", 
      "jpg", 
      9, 
      "AKC Foods Social Post", 
      "Appetizing local spices social campaign design element."
    )
  },
  {
    id: "roco",
    name: "RocoMamas",
    tagline: "Premium Smash Burgers & Shakes",
    description: "Bold, punchy, high-contrast creative design focusing on appetite appeal and scroll-stopping visual hooks.",
    metrics: "+180% organic reach · 5x post saves",
    items: [
      ...generateItems(
        "/Creative Designs/rocomamas social media as well as paid campaign creatives", 
        "png", 
        7, 
        "RocoMamas Campaign Ad", 
        "Premium high-contrast burger menu ad layout."
      ),
      ...generateItems(
        "/Creative Designs/rocomamas valentine week campaign", 
        "png", 
        7, 
        "RocoMamas Valentine Campaign", 
        "Interactive seasonal social graphic."
      )
    ]
  },
  {
    id: "lucid",
    name: "Lucid Colloids",
    tagline: "B2B Hydrocolloids & Polymers",
    description: "Clean, professional, vector-driven industrial product designs establishing technical authority and product application.",
    metrics: "+260% LinkedIn impressions · 40+ inbound leads",
    items: generateItems(
      "/Creative Designs/Lucid Colloids Social Media Creatives", 
      "jpg", 
      10, 
      "Lucid B2B Post", 
      "Clean vector layout establishing industrial polymer application."
    )
  },
  {
    id: "chang",
    name: "My Chang",
    tagline: "Schezwan Chutney Products",
    description: "Vibrant product marketing posts emphasizing packaging designs, spicy flavors, and D2C food campaigns.",
    metrics: "4.5x brand reach · 230% order inquiry surge",
    items: generateItems(
      "/Creative Designs/My chang sezwan chuteny product marketing campaign and social media creatives", 
      "png", 
      6, 
      "My Chang Post", 
      "Vibrant product marketing post highlighting schezwan chutney flavor."
    )
  },
  {
    id: "earthly",
    name: "Earthly Joy",
    tagline: "Organic Home & Wellness",
    description: "Organic product graphics mapping eco-friendly household blends, sustainable materials, and healthy ingredients.",
    metrics: "+190% reach · 4x repeat store visits",
    items: generateItems(
      "/Creative Designs/earthly joy product marketing campaign creatives and social media creatives", 
      "png", 
      12, 
      "Earthly Joy Post", 
      "Organic product graphics mapping eco-friendly household blends."
    )
  },
  {
    id: "furry",
    name: "Furry Friends",
    tagline: "Pet Care & Veterinary Scheduling",
    description: "Vibrant pet wellness and care layout designs mapping clinic announcements, pet checkups, and scheduling hooks.",
    metrics: "12k+ app installs · 4.6★ app store rating",
    items: [
      ...generateItems(
        "/Creative Designs/furry friends lauching campaign", 
        "jpg", 
        6, 
        "Furry Friends Post", 
        "Vibrant pet wellness and care layout design."
      ),
      ...generateItems(
        "/Creative Designs/furry friends lauching campaign", 
        "jpeg", 
        3, 
        "Furry Friends Wellness", 
        "Hyperlocal digital poster design for pet clinic services."
      )
    ]
  },
  {
    id: "polymint",
    name: "PolyMint / PRCA",
    tagline: "Corporate Event Campaigns",
    description: "Visual content layouts, email templates, and registration invitations for multi-market professional seminars.",
    metrics: "200+ event registrations · 38% open rate",
    items: [
      ...generateItems(
        "/Creative Designs/polymint social media creatives", 
        "png", 
        3, 
        "PolyMint Social Graphic", 
        "Visual content layouts for professional events."
      ),
      ...generateItems(
        "/Creative Designs/polymint social media creatives", 
        "jpeg", 
        2, 
        "PolyMint Event Invite", 
        "Email campaign header graphics."
      )
    ]
  }
];

const adsItems: MediaItem[] = [
  ...[7, 8, 9, 10, 11, 13].map((idx) => ({
    src: `/Creative Designs/Sai Proviso Emporis Real Estate Lead Gen Paid campaign creatives (${idx}).jpg`,
    alt: `Sai Proviso Lead Gen Ad ${idx}`,
    title: `Sai Proviso Lead Gen Ad #${idx}`,
    description: "Investment-focused commercial showroom advertisement.",
    aspectRatio: "square" as const
  })),
  ...generateItems(
    "/Creative Designs/Sai Proviso Emporis social media creatives", 
    "jpg", 
    4, 
    "Sai Proviso Social Post", 
    "Aesthetic location branding banner for Hinjewadi.",
    "square"
  ),
  ...generateItems(
    "/Creative Designs/polymint paid campaign creatives", 
    "png", 
    10, 
    "PolyMint Paid Ad", 
    "Email lifecycle newsletter and event outreach ad grids.",
    "video"
  ),
  {
    src: "/Creative Designs/polymint paid campaign creatives (1).jpeg",
    alt: "PolyMint Paid Ad #1 (JPEG)",
    title: "PolyMint Paid Ad #1 (JPEG)",
    description: "Email lifecycle newsletter and event outreach ad.",
    aspectRatio: "video"
  }
];

// --- OUTDOOR BANNER CREATIVES DATA ---
const bannerItems = generateItems(
  "/Creative Designs/ACKFoods Outdoor Marketing Campaign creatives", 
  "png", 
  9, 
  "ACK Foods Outdoor Banner", 
  "Marathi language display banner prints and Amazon listings.",
  "video"
);

// --- LOGO DESIGN DATA ---
const logoItems = [
  { src: "/Creative Designs/Agristox Logo Design.png", alt: "Agristox Logo Design", title: "AgriStox Logo Design", description: "Minimalist brand logo combining agrarian geometry and technological trust vectors." },
  { src: "/Creative Designs/HoneyBoo Logo Design.png", alt: "HoneyBoo Logo Design", title: "HoneyBoo Logo Design", description: "Playful, friendly brand identity and typography design for consumer goods." },
  { src: "/Creative Designs/Nahl Logo Design.png", alt: "Nahl Logo Design", title: "Nahl Logo Design", description: "Sleek corporate logotype showing speed, logistics pathing, and B2B strength." },
  { src: "/Creative Designs/Shachi Designs Logo Design.png", alt: "Shachi Designs Logo Design", title: "Shachi Designs Logo Design", description: "Elegant textile brand emblem detailing premium fabric weaving aesthetics." },
  { src: "/Creative Designs/Shree Fruit Katta logo design.png", alt: "Shree Fruit Katta Logo Design", title: "Shree Fruit Katta Logo Design", description: "Localized fruit brand logo displaying fresh juices and vibrant natural colors." }
];

// --- PRINT & CORPORATE COLLATERALS (Old Portfolio Gallery) ---
const printItems = generateItems(
  "/Creative Designs/Old Portfolio Gallary", 
  "jpg", 
  14, 
  "Print Collateral Asset", 
  "Corporate booklets, visiting cards, i-cards, envelope layouts, and brand print mockups."
);

// --- WEBSITE ENGINEERING DATA ---
const websiteItems = [
  {
    slug: "akcfoods",
    name: "AKC Foods",
    domain: "akcfoods.in",
    tagline: "Indian F&B Spices E-Commerce",
    screenshot: "/website design/ACKFoods.png",
    description: "Responsive e-commerce marketplace showcasing spices, blends, and online D2C ordering options.",
    tags: ["React E-Commerce", "Tailwind CSS", "Resend API"]
  },
  {
    slug: "nahl",
    name: "Nahl Logistics",
    domain: "nahl.in",
    tagline: "Corporate Logistics & Fleet Management",
    screenshot: "/website design/Nahl.png",
    description: "Corporate web platform built to track logistics pipelines, fleet sizes, and cargo deliveries.",
    tags: ["Next.js", "Zod Validation", "Framer Motion"]
  },
  {
    slug: "polymint",
    name: "PolyMint / PRCA",
    domain: "polymint-prca.org",
    tagline: "International Event Lifecycle",
    screenshot: "/website design/PRCApolymint.png",
    description: "Global event registration systems mapped to secure email broadcast lifecycles.",
    tags: ["Next.js", "ISR Cache", "Tailwind"]
  },
  {
    slug: "agristox",
    name: "AgriStox",
    domain: "agristox.in",
    tagline: "Agricultural Exchange Commodity Portal",
    screenshot: "/website design/agristox.png",
    description: "B2B commodity exchange board displaying market rates, crop data, and freight logistics.",
    tags: ["Next.js", "Prisma Postgres", "Zustand"]
  },
  {
    slug: "datahat",
    name: "Data-Hat AI",
    domain: "datahat.ai",
    tagline: "Developer API & Models Portal",
    screenshot: "/website design/datahatai.png",
    description: "Sleek developer portal featuring interactive prompts, model catalogs, and developer access logs.",
    tags: ["React 19", "RSC Pages", "Upstash Redis"]
  },
  {
    slug: "furryfriends",
    name: "Furry Friends",
    domain: "furryfriends.co",
    tagline: "Pet Care Scheduling Platform",
    screenshot: "/website design/furryfriends.png",
    description: "Responsive vet scheduling portal listing care clinics and pet wellness plans.",
    tags: ["Next.js", "Zod Forms", "Tailwind CSS"]
  },
  {
    slug: "houseescort",
    name: "House Escort",
    domain: "houseescort.in",
    tagline: "Relocation & Transit Portal",
    screenshot: "/website design/houseescort.png",
    description: "Dynamic housing search portal mapping city zones, transit details, and moving logistics.",
    tags: ["React", "Zustand Core", "Framer Layout"]
  },
  {
    slug: "periship",
    name: "PeriShip",
    domain: "periship.com",
    tagline: "Maritime Logistics Coordinator",
    screenshot: "/website design/periship.png",
    description: "Maritime shipping and logistics dashboard showing live cargo routes and arrival estimates.",
    tags: ["Next.js", "Leaflet Maps", "Node.js"]
  },
  {
    slug: "shachi",
    name: "Shachi United",
    domain: "shachiunited.com",
    tagline: "Textile & Apparel Showcase",
    screenshot: "/website design/shachidesigns.png",
    description: "Headless D2C showcase displaying seasonal catalogs, garment lines, and size guides.",
    tags: ["Shopify headless", "Tailwind", "Next.js"]
  },
  {
    slug: "whatsthebuzz",
    name: "Whats The Buzz",
    domain: "whatsthebuzz.media",
    tagline: "High-Traffic Newsroom",
    screenshot: "/website design/whatsthebuzz.png",
    description: "Dynamic magazine layout with fast caching nodes and real-time banner injection models.",
    tags: ["Sanity CMS", "Next.js", "Vercel Cache"]
  },
  {
    slug: "ihr",
    name: "IHR Collective",
    domain: "ihr-collective.com",
    tagline: "Hospitality Staff Recruitment",
    screenshot: "/website design/IHR.png",
    description: "Staff hiring platform mapping talent requests, recruiter queues, and onboarding checklists.",
    tags: ["Next.js 16", "PostgreSQL", "NextAuth v5"]
  }
];


export default function PortfolioPage() {
  const [activeBrand, setActiveBrand] = useState("akc");
  const [selectedWebImage, setSelectedWebImage] = useState<string | null>(null);

  const currentBrandData = smBrands.find((b) => b.id === activeBrand) || smBrands[0];

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* SECTION 1 — Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 border-b border-[#2E2E2E] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/4_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.04] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF6200]/20 bg-[#FF6200]/5 text-[10px] font-mono tracking-widest uppercase text-[#FF8C42]"
          >
            <Sparkles className="h-3 w-3 text-[#FF6200] animate-pulse" /> Agency Creative Portfolio
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[1.05]"
          >
            Domain Expansion <br />
            <span className="text-gradient-orange">Portfolio & Deliverables</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-[#ACACB8] max-w-2xl leading-relaxed font-light mt-2"
          >
            A comprehensive look at our design ecosystems, social campaigns, advertising visual systems, website engineering, and custom software architectures.
          </motion.p>

          {/* Sticky Navigation anchors */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 text-[10px] font-mono font-bold uppercase tracking-wider text-[#888898]"
          >
            <a href="#social" className="hover:text-white transition-colors">01. Social Creatives</a>
            <span className="text-[#FF6200]/30 hidden sm:inline">•</span>
            <a href="#ads" className="hover:text-white transition-colors">02. Campaign Ads</a>
            <span className="text-[#FF6200]/30 hidden sm:inline">•</span>
            <a href="#banners" className="hover:text-white transition-colors">03. Brand Banners</a>
            <span className="text-[#FF6200]/30 hidden sm:inline">•</span>
            <a href="#websites" className="hover:text-white transition-colors">04. Web Design</a>
            <span className="text-[#FF6200]/30 hidden sm:inline">•</span>
            <a href="#logos" className="hover:text-white transition-colors">05. Logo Designs</a>
            <span className="text-[#FF6200]/30 hidden sm:inline">•</span>
            <a href="#prints" className="hover:text-white transition-colors">06. Brand Collaterals</a>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Social Media Creatives */}
      <section id="social" className="py-24 md:py-32 border-b border-[#2E2E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#FF6200]/3 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-start gap-4 mb-16 text-left max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold flex items-center gap-2">
              <Tv className="h-4.5 w-4.5 text-[#FF6200]" /> Service Pillar 01
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Social Media <span className="text-gradient-orange">Creatives</span>
            </h2>
            <p className="text-sm text-[#ACACB8] leading-relaxed font-light">
              Crafting visual narratives that arrest attention. We build branded grids and bespoke asset cards structured around audience psychology, visual consistency, and algorithmic reach patterns.
            </p>
          </div>

          {/* Brand Switcher Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#2E2E2E]/60 pb-6 mb-12">
            {smBrands.map((brand) => {
              const isActive = activeBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.id)}
                  className={`relative px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 ${
                    isActive 
                      ? "text-[#0D0D0D] bg-[#FF6200]" 
                      : "text-[#ACACB8] hover:text-white hover:bg-white/5 border border-[#2E2E2E]"
                  }`}
                  data-cursor="hover"
                >
                  {brand.name}
                </button>
              );
            })}
          </div>

          {/* Current Tab Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start text-left">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2.5">
                {currentBrandData.name} <span className="text-sm font-mono font-normal text-[#888898]">/ {currentBrandData.tagline}</span>
              </h3>
              <p className="text-sm text-[#ACACB8] leading-relaxed">
                {currentBrandData.description}
              </p>
            </div>
            <div className="lg:col-span-7 lg:pl-8 flex flex-col gap-2.5 lg:border-l border-[#2E2E2E]/60">
              <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Campaign Outcomes</span>
              <span className="font-display text-xl sm:text-2xl font-extrabold text-[#FF8C42]">
                {currentBrandData.metrics}
              </span>
            </div>
          </div>

          {/* Media Grid Component */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrand}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <PortfolioMediaGrid items={currentBrandData.items} columns={3} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 3 — Ads Creatives */}
      <section id="ads" className="py-24 md:py-32 border-b border-[#2E2E2E] bg-[#141414]/10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] bg-[#6D28D9]/3 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-start gap-4 mb-16 text-left max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold flex items-center gap-2">
              <Palette className="h-4.5 w-4.5 text-[#FF6200]" /> Service Pillar 02
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Campaign Ads <span className="text-gradient-orange">Creatives</span>
            </h2>
            <p className="text-sm text-[#ACACB8] leading-relaxed font-light">
              Performance-driven marketing creatives engineered to convert. These designs are tailored for high-conversion real estate promotions, commercial launches, and D2C product scaling.
            </p>
          </div>

          {/* Ads Custom Masonry Columns */}
          <PortfolioMediaGrid items={adsItems} columns={3} />
        </div>
      </section>

      {/* SECTION 4 — Banner Creatives */}
      <section id="banners" className="py-24 md:py-32 border-b border-[#2E2E2E] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-start gap-4 mb-16 text-left max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-[#FF6200]" /> Service Pillar 03
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Brand & Local <span className="text-gradient-orange">Marketing Banners</span>
            </h2>
            <p className="text-sm text-[#ACACB8] leading-relaxed font-light">
              Print-ready and digital wide-format banners featuring localized Marathi copywriting, custom packaging alignments, and high-impact marketplace listings.
            </p>
          </div>

          {/* Banner wide display list */}
          <PortfolioMediaGrid items={bannerItems} columns={3} />
        </div>
      </section>

      {/* SECTION 5 — Web Design & Engineering (16:9 Hover Scrolling Mockups) */}
      <section id="websites" className="py-24 md:py-32 border-b border-[#2E2E2E] bg-[#141414]/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] bg-[#FF6200]/3 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-start gap-4 mb-16 text-left max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-[#FF6200]" /> Service Pillar 04
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Web Design & <span className="text-gradient-orange">Engineering</span>
            </h2>
            <p className="text-sm text-[#ACACB8] leading-relaxed font-light">
              Interactive 16:9 aspect-video screens. Hover your cursor over each screen mock to slowly scroll through the full vertical site designs.
            </p>
          </div>

          {/* Web Showcase Grid with Interactive Hover-Scroll Mockups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websiteItems.map((web) => (
              <WebMockupCard
                key={web.slug}
                name={web.name}
                domain={web.domain}
                tagline={web.tagline}
                screenshot={web.screenshot}
                description={web.description}
                tags={web.tags}
                onClickExpand={() => setSelectedWebImage(web.screenshot)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Logo & Brand Identity Designs */}
      <section id="logos" className="py-24 md:py-32 border-b border-[#2E2E2E] relative overflow-hidden bg-[#141414]/5">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-start gap-4 mb-16 text-left max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-[#FF6200]" /> Service Pillar 05
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Logo & Brand <span className="text-gradient-orange">Identity Designs</span>
            </h2>
            <p className="text-sm text-[#ACACB8] leading-relaxed font-light">
              Minimalist logs, brand symbols, and local food packaging marks designed to encapsulate business entities and trust values.
            </p>
          </div>

          <PortfolioMediaGrid items={logoItems} columns={3} />
        </div>
      </section>

      {/* SECTION 6 — Print & Corporate Collaterals (Old Portfolio Gallery) */}
      <section id="prints" className="py-24 md:py-32 border-b border-[#2E2E2E] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col items-start gap-4 mb-16 text-left max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-[#FF6200]" /> Service Pillar 06
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Print & Corporate <span className="text-gradient-orange">Collaterals</span>
            </h2>
            <p className="text-sm text-[#ACACB8] leading-relaxed font-light">
              Physical marketing print templates, corporate booklets, visiting cards, ID cards, envelope mockups, and corporate catalog spreads.
            </p>
          </div>

          <PortfolioMediaGrid items={printItems} columns={3} />
        </div>
      </section>

      {/* SECTION 9 — Aggregate Output stats */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#FF6200/2_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Consolidated Outputs</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Our Global Performance Metrics</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-4xl font-extrabold text-[#FF6200]">10M+</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">Digital Touchpoints</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-4xl font-extrabold text-[#6D28D9]">2,700+</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">Leads Generated</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-4xl font-extrabold text-[#FF6200]">200+</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">Page 1 Keywords</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-4xl font-extrabold text-emerald-500">43%</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">Avg Traffic Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — CTA Card */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/4_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10">
          <div className="rounded-2xl border border-[#2E2E2E] bg-gradient-to-br from-[#141414] to-[#0D0D0D] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-left max-w-xl">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Expansionize <span className="text-gradient-orange">Your Brand?</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
                Connect with our technical design and campaign specialists. We will analyze your digital footprint and lay out an actionable blueprint on our discovery call.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full justify-center">
                  Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact#calendly" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full justify-center">
                  Schedule Discovery Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Viewport Fullscreen Screenshot Lightbox */}
      <AnimatePresence>
        {selectedWebImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col bg-[#0D0D0D]/98 p-4 md:p-8 backdrop-blur-md overflow-y-auto cursor-zoom-out"
            onClick={() => setSelectedWebImage(null)}
          >
            {/* Top Bar controls */}
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#2E2E2E] mb-6 select-none shrink-0" onClick={(e)=>e.stopPropagation()}>
              <span className="text-xs font-mono text-[#ACACB8] uppercase tracking-widest">Full Screenshot Preview</span>
              <button 
                onClick={() => setSelectedWebImage(null)}
                className="text-xs font-mono font-bold uppercase text-[#FF8C42] hover:text-[#FF6200]"
                data-cursor="hover"
              >
                Close Preview [Esc]
              </button>
            </div>
            
            {/* Main Visual Image container */}
            <div className="flex-grow flex items-start justify-center max-w-6xl mx-auto w-full pb-10" onClick={(e)=>e.stopPropagation()}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                className="relative w-full border border-[#2E2E2E] rounded-xl overflow-hidden shadow-2xl bg-black"
              >
                <img
                  src={selectedWebImage}
                  alt="Full-resolution display visual"
                  className="w-full h-auto object-top block"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
