"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, ChevronRight, Coins, Layers, Loader2, MessageSquare, Minus, Plus, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import * as ga from "@/lib/analytics";



interface WaitlistFormData {
  email: string;
  role: "AGENCY" | "CLIENT";
  company?: string;
  phone?: string;
  website: string; // Honeypot
}

const pricingPlans = [
  {
    name: "Starter",
    price: "₹0",
    period: "forever",
    description: "Ideal for agencies testing B2B marketplaces.",
    features: [
      "1 Active proposal at any time",
      "Standard agency verification profile",
      "Full search access to client briefs",
      "Standard communication dashboard"
    ],
    cta: "Join Waitlist",
    highlight: false
  },
  {
    name: "Growth",
    price: "₹2,999",
    period: "month",
    description: "For scaling agencies needing direct inbound pipelines.",
    features: [
      "5 Active proposals at any time",
      "Priority verification listing tag",
      "Ranked listing in search directories",
      "Direct chat with qualified clients",
      "Dynamic response analytics log"
    ],
    cta: "3 Months Free on Waitlist",
    highlight: true
  },
  {
    name: "Pro",
    price: "₹7,999",
    period: "month",
    description: "For mature firms looking to dominate B2B placements.",
    features: [
      "Unlimited proposals & briefs bids",
      "Featured agency slot listings",
      "Verified marketplace certification",
      "Dedicated agency account manager",
      "Early access to escrow briefs"
    ],
    cta: "3 Months Free on Waitlist",
    highlight: false
  }
];

const faqs = [
  {
    q: "Is this platform open for individual freelancers?",
    a: "No. TechGuild is built exclusively for verified digital agencies (LLPs, Private Limited entities, or structured partnerships) to maintain clean SLAs, professional project management, and complete IP protection for clients."
  },
  {
    q: "How are agencies verified?",
    a: "We audit credentials, check company registration details (GSTIN/CIN), run reference audits on past client projects, and review developer and campaign case metrics before activation."
  },
  {
    q: "What types of projects can be posted?",
    a: "Any digital service project mapping to our core pillars: Marketing Campaigns, Software & App Development, Brand Design Systems, and custom AI/automation workflows."
  },
  {
    q: "Can agencies outside India register?",
    a: "Yes. TechGuild supports agencies and clients across South Asia, Southeast Asia, the United Kingdom, Europe, and North America, offering cross-border payments."
  },
  {
    q: "When does the platform officially launch?",
    a: "TechGuild is scheduled for Q3 2026. The waitlist program is active to pre-verify agencies and list early client briefs ahead of launch day."
  },
  {
    q: "Is there any fee to join the waitlist?",
    a: "None. Joining the waitlist is completely free. Early waitlist members also receive 3 months of premium pricing plans free at launch."
  },
  {
    q: "How does TechGuild differ from Upwork or Freelancer?",
    a: "By excluding individual freelancers, we remove the reliability gap. Clients receive predictable project management and corporate SLAs, while agencies bid against qualified budgets instead of matching lowest prices."
  },
  {
    q: "How many agencies will be allowed at launch?",
    a: "We are targeting 50 hand-verified launch agencies across service pillars to maintain premium quality and ensure high contract volumes."
  }
];

export default function TechGuildPage() {
  const [activeTab, setActiveTab] = useState<"client" | "agency">("client");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    // Set launch target to exactly 30 days from June 21, 2026 10:47:07 AM IST
    const target = new Date("2026-07-21T10:47:07+05:30").getTime();

    const calculateTime = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      return { days: d, hours: h, minutes: m, seconds: s };
    };

    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<WaitlistFormData>({
    defaultValues: {
      role: "AGENCY",
      website: ""
    }
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: WaitlistFormData) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/techguild-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        // Trigger GA4 event tracking
        ga.event({
          action: "form_submit",
          category: "TechGuild Waitlist",
          label: `Role: ${data.role} | Company: ${data.company}`,
          value: 1,
          waitlist_email: data.email,
          waitlist_role: data.role,
          waitlist_company: data.company,
        });

        setSuccess(true);
        setWaitlistPosition(result.position);
        reset();
      } else {
        setErrorMsg(result.message || "Failed to join waitlist.");
      }
    } catch (err) {
      console.error("Waitlist submit error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const techguildFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd schema={techguildFaqSchema} />


      {/* SECTION 1 — Hero */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 border-b border-[#2E2E2E] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.12)_0%,rgba(255,98,0,0.03)_60%,transparent_100%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-[10px] font-mono tracking-widest uppercase text-violet-400 font-bold">
            <Zap className="h-3.5 w-3.5 text-violet-400" /> Introducing TechGuild • Q3 2026
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
            Where Great Agencies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6200] to-[#8B5CF6]">Meet Great Clients</span>
          </h1>
          <p className="text-sm sm:text-base text-[#ACACB8] max-w-2xl leading-relaxed">
            The first verified B2B marketplace built exclusively for digital agencies. No freelancers. No budget guessing. Secure escrow-protected milestone agreements.
          </p>

          {/* Countdown Timer */}
          <div className="my-6 flex items-center justify-center gap-2 sm:gap-4 select-none">
            {/* Days Card */}
            <div className="bg-[#141414]/60 border border-[#2E2E2E] rounded-xl px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md min-w-[70px] sm:min-w-[90px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FF6200]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <span className="font-display text-2xl sm:text-4xl font-extrabold text-[#FF6200] tabular-nums tracking-tight">
                {mounted ? formatNumber(timeLeft.days) : "30"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#888898] uppercase mt-1 font-semibold">
                Days
              </span>
            </div>

            {/* Separator */}
            <span className="text-lg sm:text-2xl font-bold text-violet-500/40 self-center animate-pulse mt-[-15px] sm:mt-[-20px]">:</span>

            {/* Hours Card */}
            <div className="bg-[#141414]/60 border border-[#2E2E2E] rounded-xl px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md min-w-[70px] sm:min-w-[90px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FF6200]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <span className="font-display text-2xl sm:text-4xl font-extrabold text-[#FF6200] tabular-nums tracking-tight">
                {mounted ? formatNumber(timeLeft.hours) : "00"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#888898] uppercase mt-1 font-semibold">
                Hours
              </span>
            </div>

            {/* Separator */}
            <span className="text-lg sm:text-2xl font-bold text-violet-500/40 self-center animate-pulse mt-[-15px] sm:mt-[-20px]">:</span>

            {/* Minutes Card */}
            <div className="bg-[#141414]/60 border border-[#2E2E2E] rounded-xl px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md min-w-[70px] sm:min-w-[90px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#FF6200]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <span className="font-display text-2xl sm:text-4xl font-extrabold text-[#FF6200] tabular-nums tracking-tight">
                {mounted ? formatNumber(timeLeft.minutes) : "00"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#888898] uppercase mt-1 font-semibold">
                Mins
              </span>
            </div>

            {/* Separator */}
            <span className="text-lg sm:text-2xl font-bold text-violet-500/40 self-center animate-pulse mt-[-15px] sm:mt-[-20px]">:</span>

            {/* Seconds Card */}
            <div className="bg-[#141414]/60 border border-[#2E2E2E] rounded-xl px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md min-w-[70px] sm:min-w-[90px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-violet-500/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <span className="font-display text-2xl sm:text-4xl font-extrabold text-violet-400 tabular-nums tracking-tight animate-none">
                {mounted ? formatNumber(timeLeft.seconds) : "00"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#888898] uppercase mt-1 font-semibold">
                Secs
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <a href="#waitlist-form" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full justify-center bg-gradient-to-r from-[#FF6200] to-[#6D28D9] border-none text-xs uppercase tracking-wider font-bold">
                Join Agency Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#waitlist-form" className="w-full sm:w-auto" onClick={() => setValue("role", "CLIENT")}>
              <Button variant="outline" className="w-full justify-center text-xs uppercase tracking-wider font-bold">
                Post Project Brief
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — The Problem We're Solving (Split Panels) */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Market Diagnostics</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Solving B2B Sourcing Gaps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
            {/* Left: Client pain points */}
            <div className="p-8 rounded-2xl border border-[#2E2E2E] bg-red-950/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-red-500/5 rounded-bl-full pointer-events-none" />
              <h3 className="font-display text-lg font-bold text-red-400 mb-6">For Client Companies</h3>
              <ul className="flex flex-col gap-4 text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-red-500 shrink-0 font-bold font-mono">✕</span>
                  <span><strong>Burned by Freelancers:</strong> High rates of missed delivery timelines, code shifts, and lack of professional liability.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 shrink-0 font-bold font-mono">✕</span>
                  <span><strong>Dry Agency Discovery:</strong> Finding reliable LLPs requires weeks of manual directories searches and cold review inquiries.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 shrink-0 font-bold font-mono">✕</span>
                  <span><strong>Unsecure Payments:</strong> Paying upfront carries delivery risks, while backend billing terms drag down starting paces.</span>
                </li>
              </ul>
            </div>

            {/* Right: Agency pain points */}
            <div className="p-8 rounded-2xl border border-[#2E2E2E] bg-violet-950/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-violet-500/5 rounded-bl-full pointer-events-none" />
              <h3 className="font-display text-lg font-bold text-violet-400 mb-6">For Digital Agencies</h3>
              <ul className="flex flex-col gap-4 text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-violet-400 shrink-0 font-bold font-mono">✕</span>
                  <span><strong>High Acquisition Overhead:</strong> Spending 30-50% of monthly revenues on cold ads and sales pipelines instead of build sprints.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet-400 shrink-0 font-bold font-mono">✕</span>
                  <span><strong>Freelancer Price Wars:</strong> Competing in general bidding feeds where clients compare agencies directly with low-cost freelancers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet-400 shrink-0 font-bold font-mono">✕</span>
                  <span><strong>Inconsistent Cashflow:</strong> Unpredictable B2B brief volumes leave developers and designers benched between client scopes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — How It Works (Tabbed Switch) */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/20">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center flex flex-col items-center">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-12">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Operational Flows</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">The Marketplace Ecosystem</h2>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-[#2E2E2E] bg-black/40 mb-16">
            <button
              onClick={() => setActiveTab("client")}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                activeTab === "client" ? "bg-violet-600 text-white" : "text-[#ACACB8] hover:text-white"
              }`}
            >
              For Client Companies
            </button>
            <button
              onClick={() => setActiveTab("agency")}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                activeTab === "agency" ? "bg-[#FF6200] text-black" : "text-[#ACACB8] hover:text-white"
              }`}
            >
              For Digital Agencies
            </button>
          </div>

          {/* Tab content wrapper */}
          <div className="max-w-4xl w-full text-left">
            <AnimatePresence mode="wait">
              {activeTab === "client" ? (
                <motion.div
                  key="client-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative">
                    <span className="absolute top-4 right-6 text-3xl font-display font-extrabold text-[#2E2E2E]">01</span>
                    <h4 className="font-display text-sm font-bold text-white mb-3">Post Project Brief</h4>
                    <p className="text-xs text-[#ACACB8] leading-relaxed">
                      Upload your technical scope, campaign target channels, budget bracket, and timeline parameters to our marketplace.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative">
                    <span className="absolute top-4 right-6 text-3xl font-display font-extrabold text-[#2E2E2E]">02</span>
                    <h4 className="font-display text-sm font-bold text-white mb-3">Review Agency Bids</h4>
                    <p className="text-xs text-[#ACACB8] leading-relaxed">
                      Receive structured proposals from hand-verified digital agencies within 48 hours. Review past performance data.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative">
                    <span className="absolute top-4 right-6 text-3xl font-display font-extrabold text-[#2E2E2E]">03</span>
                    <h4 className="font-display text-sm font-bold text-white mb-3">Hire with Confidence</h4>
                    <p className="text-xs text-[#ACACB8] leading-relaxed">
                      Lock contract terms via milestone escrow frameworks. Funds are disbursed to the agency only after passing criteria.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="agency-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative">
                    <span className="absolute top-4 right-6 text-3xl font-display font-extrabold text-[#2E2E2E]">01</span>
                    <h4 className="font-display text-sm font-bold text-white mb-3">Create Verified Profile</h4>
                    <p className="text-xs text-[#ACACB8] leading-relaxed">
                      Register your company LLP/CIN and showcase past case study metrics. Pass our manual audit criteria to list.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative">
                    <span className="absolute top-4 right-6 text-3xl font-display font-extrabold text-[#2E2E2E]">02</span>
                    <h4 className="font-display text-sm font-bold text-white mb-3">Browse Briefings</h4>
                    <p className="text-xs text-[#ACACB8] leading-relaxed">
                      Access pre-qualified project briefings directly in your client dashboard. Skip expensive lead ads and cold outreach.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] relative">
                    <span className="absolute top-4 right-6 text-3xl font-display font-extrabold text-[#2E2E2E]">03</span>
                    <h4 className="font-display text-sm font-bold text-white mb-3">Secure High-Value Contracts</h4>
                    <p className="text-xs text-[#ACACB8] leading-relaxed">
                      Submit structured bids directly to client CTOs. Deliver milestones and draw funds safely from the escrow account.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Platform Features (6 Cards) */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Market Features</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Built for Operational Safety</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            
            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-violet-500/30 transition-all duration-300">
              <ShieldCheck className="h-8 w-8 text-violet-400 mb-4" />
              <h4 className="font-display text-sm font-bold text-white mb-2">Agency Verification System</h4>
              <p className="text-xs text-[#ACACB8] leading-relaxed">
                Every agency profile passes a manual credentials audit, verifying CIN registrations and past client results.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-[#FF6200]/30 transition-all duration-300">
              <Layers className="h-8 w-8 text-[#FF6200] mb-4" />
              <h4 className="font-display text-sm font-bold text-white mb-2">Structured Proposal Engine</h4>
              <p className="text-xs text-[#ACACB8] leading-relaxed">
                Standardized bidding templates eliminate vague tags and outline milestones, deliverables, and SLAs.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-violet-500/30 transition-all duration-300">
              <Coins className="h-8 w-8 text-violet-400 mb-4" />
              <h4 className="font-display text-sm font-bold text-white mb-2">Milestone Escrow Accounts</h4>
              <p className="text-xs text-[#ACACB8] leading-relaxed">
                Client funds are held in secure escrow gates, routing to agencies automatically when milestone conditions pass.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-[#FF6200]/30 transition-all duration-300">
              <CheckCircle2 className="h-8 w-8 text-[#FF6200] mb-4" />
              <h4 className="font-display text-sm font-bold text-white mb-2">Quality Tracking SLAs</h4>
              <p className="text-xs text-[#ACACB8] leading-relaxed">
                Embedded tracking nodes monitor code checkins and campaign triggers to verify deliverables against criteria.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-violet-500/30 transition-all duration-300">
              <MessageSquare className="h-8 w-8 text-violet-400 mb-4" />
              <h4 className="font-display text-sm font-bold text-white mb-2">Direct In-Platform Chat</h4>
              <p className="text-xs text-[#ACACB8] leading-relaxed">
                Connect and coordinate directly inside verified channels, archiving brief updates and contracts safely.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-[#FF6200]/30 transition-all duration-300">
              <Zap className="h-8 w-8 text-[#FF6200] mb-4" />
              <h4 className="font-display text-sm font-bold text-white mb-2">Weighted Rating Systems</h4>
              <p className="text-xs text-[#ACACB8] leading-relaxed">
                Agency ratings are weighted based on contract sizes and validated SLA adherence, preventing fake score boosts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 — Pricing Plans (3 Columns) */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Agency Pricing</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Simple Operational Plans</h2>
            <p className="text-xs sm:text-sm text-[#ACACB8]">
              No placement fees or commission percentages. Agencies pay flat subscription fees to access briefings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left items-stretch">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? "border-[#FF6200] bg-[#FF6200]/5 shadow-[0_0_30px_rgba(255,98,0,0.06)]"
                    : "border-[#2E2E2E] bg-[#141414]"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-display text-sm font-mono uppercase tracking-wider text-white">
                      {plan.name}
                    </h4>
                    {plan.highlight && (
                      <Badge variant="orange" className="text-[9px] font-mono">Most Popular</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-[#888898]">/{plan.period}</span>
                  </div>

                  <p className="text-xs text-[#ACACB8] mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="flex flex-col gap-3 border-t border-[#2E2E2E] pt-6 mb-8 text-xs text-[#ACACB8]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2.5 items-center">
                        <Check className="h-3.5 w-3.5 text-[#FF6200] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href="#waitlist-form" className="w-full mt-auto">
                  <Button
                    variant={plan.highlight ? "primary" : "outline"}
                    className="w-full py-3 text-xs tracking-wider uppercase font-bold"
                  >
                    {plan.cta}
                  </Button>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-violet-600/5 border border-violet-500/10 text-[11px] text-[#ACACB8] inline-block max-w-lg">
            🎁 **Waitlist Guarantee**: Registering during the pre-launch phase guarantees **3 months of free access** on any paid plan.
          </div>
        </div>
      </section>

      {/* SECTION 6 — Pre-launch FAQ (8 Accordions) */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="text-center flex flex-col gap-3 mb-16">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Answers</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">TechGuild Pre-Launch FAQs</h2>
          </div>

          <div className="flex flex-col gap-4 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#2E2E2E] bg-[#141414]/40 hover:bg-[#141414] transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex justify-between items-center w-full p-5 font-display text-sm font-bold text-white hover:text-brand-orange text-left"
                  >
                    <span>{faq.q}</span>
                    <span className="text-brand-orange shrink-0 ml-4">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-[#ACACB8] leading-relaxed border-t border-[#2E2E2E]/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Waitlist Signup Form */}
      <section id="waitlist-form" className="py-24 relative overflow-hidden bg-[#141414]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-3xl px-6 md:px-8 relative z-10">
          <div className="bg-[#0d0d0d]/80 border border-[#2E2E2E] rounded-2xl p-6 sm:p-10 relative">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="waitlist-form-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2 text-center items-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-violet-600/10 border border-violet-500/20 text-violet-400">
                      Market Access Form
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">Join the TechGuild Waitlist</h3>
                    <p className="text-xs text-[#888898] max-w-sm">
                      Secure early priority placement, pre-verify your credentials, and get 3 months of premium packages free.
                    </p>
                  </div>

                  {/* Honeypot Bot Trap */}
                  <input
                    type="text"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />

                  {/* Role Selector Toggle */}
                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">I am registering as:</span>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setValue("role", "AGENCY")}
                        className={`py-3 rounded-lg border text-xs font-mono font-bold uppercase transition-all ${
                          selectedRole === "AGENCY"
                            ? "border-[#FF6200] bg-[#FF6200]/5 text-[#FF6200]"
                            : "border-[#2E2E2E] bg-black/40 text-[#888898] hover:text-white"
                        }`}
                      >
                        Digital Agency
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue("role", "CLIENT")}
                        className={`py-3 rounded-lg border text-xs font-mono font-bold uppercase transition-all ${
                          selectedRole === "CLIENT"
                            ? "border-violet-500 bg-violet-600/5 text-violet-400"
                            : "border-[#2E2E2E] bg-black/40 text-[#888898] hover:text-white"
                        }`}
                      >
                        Client / Enterprise
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <Input
                      label="Work Email Address"
                      type="email"
                      placeholder="Enter your work email"
                      error={errors.email?.message}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email format"
                        }
                      })}
                    />
                    <Input
                      label="Company Name"
                      placeholder="e.g. Acme Agency"
                      error={errors.company?.message}
                      {...register("company", { required: "Company name is required" })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <Input
                      label="Phone Number (WhatsApp Preferred)"
                      placeholder="e.g. +91 99999 99999"
                      {...register("phone")}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-black/40 border border-[#2E2E2E] text-[10px] text-[#888898] leading-relaxed text-left flex gap-3">
                    <input type="checkbox" id="waitlist-consent" required className="mt-1 h-3.5 w-3.5 accent-[#FF6200] cursor-none" />
                    <label htmlFor="waitlist-consent">
                      I authorize Domain Expansion to contact me via email or WhatsApp regarding TechGuild platform updates, escrow account verification checks, and marketplace briefs.
                    </label>
                  </div>

                  {errorMsg && (
                    <span className="text-xs font-semibold text-[#EF4444] text-center">
                      {errorMsg}
                    </span>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FF6200] to-[#6D28D9] border-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining Waitlist...
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="waitlist-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-6"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 stroke-[1.5]" />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-2xl font-bold text-white">You're on the List!</h3>
                    
                    {/* Waitlist position Counter card */}
                    <div className="my-4 px-6 py-4 rounded-xl border border-violet-500/20 bg-violet-600/5 inline-block">
                      <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block mb-1">Queue Position</span>
                      <span className="font-display text-3xl font-extrabold text-white tracking-wide">
                        #{waitlistPosition}
                      </span>
                    </div>

                    <p className="text-xs text-[#ACACB8] max-w-sm leading-relaxed mx-auto">
                      Thank you for joining. We have logged your request. A verification message has been sent to your inbox. Once verified, we will invite you to complete your credentials audit.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setWaitlistPosition(null);
                    }}
                    variant="outline"
                    className="mt-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                  >
                    Register Another Domain
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
