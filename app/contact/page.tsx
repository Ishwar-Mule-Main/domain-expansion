"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, CheckCircle2, Loader2, Plus, Minus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { JsonLd } from "@/components/ui/JsonLd";
import * as ga from "@/lib/analytics";



// Form input structure matching Zod schema in leads API
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
  website: string; // Honeypot field
}

// Pre-engagement FAQs
const faqs = [
  {
    q: "What is the minimum budget requirement for a project?",
    a: "Our minimum budget for custom design, development, or search engine campaigns starts at ₹50,000. For custom AI automation frameworks, initial scopes begin at ₹30,000 depending on integration complexity."
  },
  {
    q: "Do you work with clients outside of India?",
    a: "Yes, we collaborate with international brands across the US, UK, Europe, and Southeast Asia. We align timezone schedules and operate via async communication protocols (Slack, WhatsApp, Notion)."
  },
  {
    q: "How long does a typical website design & build take?",
    a: "A standard 6-section website project takes 3 to 5 weeks from initial strategy audit to deployment. Complex SaaS platforms or multi-pillar campaigns run on structured 8 to 12-week sprints."
  },
  {
    q: "Do you work on monthly retainers or fixed prices?",
    a: "We offer both. Web applications and design systems are scoped at flat-fee milestones, while organic search, growth ads, and AI workflow maintenance operate on monthly retainers."
  },
  {
    q: "What happens after I submit my contact form?",
    a: "Ishwar Mule (Founder) reviews your briefing questionnaire within 12 business hours. You'll receive a calendar link to select a slot for a free 30-minute discovery call."
  }
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    defaultValues: {
      service: "Marketing Expansion",
      budget: "₹50,000 - ₹2,00,000",
      website: ""
    }
  });

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        // Trigger GA4 event tracking
        ga.event({
          action: "form_submit",
          category: "Lead Capture",
          label: `Service: ${data.service} | Budget: ${data.budget}`,
          value: 1,
          lead_email: data.email,
          lead_service: data.service,
          lead_budget: data.budget,
        });

        setSuccess(true);
        reset();
      } else {
        setErrorMsg(result.message || "Failed to submit lead inquiry.");
      }
    } catch (err) {
      console.error("Submit inquiry error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactFaqSchema = {
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
      <JsonLd schema={contactFaqSchema} />


      {/* SECTION 1 — Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 border-b border-[#2E2E2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/4_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-[10px] font-mono tracking-widest uppercase text-[#FF8C42]">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            Let's Build Something <span className="text-gradient-orange">Great Together</span>
          </h1>
          <p className="text-sm sm:text-base text-[#ACACB8] max-w-xl leading-relaxed">
            Tell us about your project or growth goals. We will reply with a technical blueprint, not a sales pitch.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Form & Info (2-Column) */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left 60% Form */}
            <div className="lg:col-span-7 bg-[#141414]/30 border border-[#2E2E2E] rounded-2xl p-6 sm:p-10 relative">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col gap-1">
                      <h2 className="font-display text-xl font-bold text-white">Project Inquiry Brief</h2>
                      <p className="text-xs text-[#888898]">Logged submissions receive a detailed response within 24 business hours.</p>
                    </div>

                    {/* Honeypot Bot Trap */}
                    <input
                      type="text"
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        error={errors.name?.message}
                        {...register("name", { required: "Name is required" })}
                      />
                      <Input
                        label="Email Address"
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number (Optional)"
                        placeholder="e.g. +91 99999 99999"
                        {...register("phone")}
                      />
                      <Input
                        label="Company Name (Optional)"
                        placeholder="e.g. Acme Corp"
                        {...register("company")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Select
                        label="Service Pillar"
                        options={[
                          { label: "Marketing Expansion", value: "Marketing Expansion" },
                          { label: "Development Expansion", value: "Development Expansion" },
                          { label: "Design Expansion", value: "Design Expansion" },
                          { label: "AI Expansion", value: "AI Expansion" },
                          { label: "Multiple Pillars", value: "Multiple Pillars" }
                        ]}
                        {...register("service")}
                      />
                      <Select
                        label="Monthly Budget"
                        options={[
                          { label: "Under ₹50,000", value: "Under ₹50,000" },
                          { label: "₹50,000 - ₹2,00,000", value: "₹50,000 - ₹2,00,000" },
                          { label: "₹2,00,000 - ₹5,00,000", value: "₹2,00,000 - ₹5,00,000" },
                          { label: "₹5,00,000+", value: "₹5,00,000+" },
                          { label: "Let's Discuss", value: "Let's Discuss" }
                        ]}
                        {...register("budget")}
                      />
                    </div>

                    <Textarea
                      label="Project Description"
                      placeholder="Briefly summarize what you're building, target channels, or current bottlenecks..."
                      error={errors.message?.message}
                      {...register("message", {
                        required: "Project details are required",
                        minLength: {
                          value: 10,
                          message: "Details must be at least 10 characters long"
                        }
                      })}
                    />



                    {errorMsg && (
                      <span className="text-xs font-semibold text-[#EF4444] text-center">
                        {errorMsg}
                      </span>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      variant="primary"
                      className="py-4 text-xs font-bold uppercase tracking-wider mt-2 flex items-center justify-center gap-2 w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting Briefing...
                        </>
                      ) : (
                        "Send My Inquiry"
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-box"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-12 gap-5"
                  >
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 stroke-[1.5]" />
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-2xl font-bold text-white">Inquiry Logged Successfully!</h3>
                      <p className="text-xs text-[#888898] max-w-sm leading-relaxed">
                        Thank you for submitting your project parameters. A confirmation email has been dispatched. Ishwar Mule will contact you to schedule our discovery call within 12 business hours.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSuccess(false)}
                      variant="outline"
                      className="mt-4 px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                    >
                      Log Another Inquiry
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right 40% Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-brand-orange uppercase tracking-wider font-bold">Direct Channels</span>
                <h2 className="font-display text-2xl font-bold">Connect With Us Directly</h2>
              </div>

              {/* Email Click-To-Copy Card */}
              <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex justify-between items-center group">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#888898] uppercase">Inquiries & Briefs</span>
                  <span className="font-display text-sm sm:text-base font-bold text-white">info@domainexpansion.in</span>
                </div>
                <button
                  onClick={() => handleCopy("info@domainexpansion.in", "email")}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] hover:border-brand-orange text-[#888898] hover:text-white transition-all"
                  aria-label="Copy Email"
                >
                  {copiedText === "email" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* Arattai Direct Chat Card */}
              <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex justify-between items-center group">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#888898] uppercase">Instant Chat Support</span>
                  <span className="font-display text-sm sm:text-base font-bold text-white">Chat on Arattai</span>
                </div>
                <Link
                  href="https://aratt.ai/user/@ishwarmule"
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] hover:border-brand-orange text-[#888898] hover:text-white transition-all"
                  aria-label="Arattai Chat"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                </Link>
              </div>

              {/* Founder Social Link */}
              <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex justify-between items-center group">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#888898] uppercase">LinkedIn Networking</span>
                  <span className="font-display text-sm sm:text-base font-bold text-white">@domainexpansion</span>
                </div>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] hover:border-brand-orange text-[#888898] hover:text-white transition-all"
                  aria-label="LinkedIn Account"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Link>
              </div>

              <div className="p-4 rounded-lg bg-brand-orange/5 border border-brand-orange/10 text-[11px] text-[#ACACB8] leading-relaxed">
                🛡️ **Privacy Guarantee**: We secure all inquiries under active non-disclosure protocols. Your information is strictly utilized to analyze your digital footprint and plan the consultation session.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Book a Discovery Call */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center flex flex-col items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-wider font-bold">Instant Scheduling</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Book a 30-Minute Discovery Call</h2>
            <p className="text-xs sm:text-sm text-[#ACACB8] max-w-lg mx-auto">
              Select a slot directly to map out your digital footprint and review how the 4 pillars can scale your acquisition.
            </p>
          </div>

          {/* Styled Calendly/Cal.com Embedded Container */}
          <div className="w-full h-[600px] border border-[#2E2E2E] bg-[#141414] rounded-2xl overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#141414] z-0">
              <Loader2 className="h-8 w-8 text-brand-orange animate-spin" />
              <span className="text-xs font-mono text-[#888898]">Loading Interactive Scheduler...</span>
            </div>
            {/* Real iframe calendar embed placeholder */}
            <iframe
              src="https://calendly.com/connect-domainexpansion/30min"
              title="Calendly Scheduler"
              className="w-full h-full border-none relative z-10"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 — FAQ Accordions */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="text-center flex flex-col gap-3 mb-16">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">Answers</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">Pre-Engagement FAQs</h2>
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

      {/* SECTION 5 — Trust Signals */}
      <section className="py-20 bg-[#141414]/30">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center flex flex-col gap-10">
          <span className="font-mono text-[9px] font-bold text-[#888898] uppercase tracking-widest">
            Outcome Agreements & SLAs
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-3xl font-extrabold text-brand-orange">24h</span>
              <span className="text-xs font-bold text-white">Inquiry Response SLA</span>
              <p className="text-[10px] text-[#888898]">Guaranteed response to all form submissions within 24 business hours.</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-3xl font-extrabold text-[#8B5CF6]">50+</span>
              <span className="text-xs font-bold text-white">Delivered Deployments</span>
              <p className="text-[10px] text-[#888898]">Proven track record scaling designs and Next.js applications.</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
              <span className="font-display text-3xl font-extrabold text-brand-orange">100%</span>
              <span className="text-xs font-bold text-white">IP & Code Protection</span>
              <p className="text-[10px] text-[#888898]">Full NDA protocols applied to protect brand credentials.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
