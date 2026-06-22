"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Calendar, Clock, X, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import * as ga from "@/lib/analytics";


const articles = [
  {
    category: "Search Engineering",
    title: "GEO vs SEO vs AIO: What's Different in 2026 Search?",
    excerpt: "Why traditional keyword optimization is dying and how to optimize your brand so LLMs (Gemini, Claude, ChatGPT) cite you as the source.",
    date: "June 12, 2026",
    readTime: "6 min read",
    slug: "geo-vs-seo-vs-aio",
  },
  {
    category: "AI & Automation",
    title: "How AI Automation Cut Our Client's Lead Acquisition Cost by 40%",
    excerpt: "A deep dive into n8n and Make workflow designs that qualify leads and automate instant SMS/WhatsApp scheduling alerts.",
    date: "June 08, 2026",
    readTime: "8 min read",
    slug: "ai-automation-cut-cac",
  },
  {
    category: "Growth Marketing",
    title: "How We Delivered 2.08 Million Emails and Kept Inbox Rates High",
    excerpt: "Lifecycle segmentation strategies and domain warming mechanics that protect your reputation on high-volume professional campaigns.",
    date: "May 29, 2026",
    readTime: "5 min read",
    slug: "email-deliverability-deep-dive",
  },
];

export function BlogPreview() {
  const [emailInput, setEmailInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lead Form States
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("Marketing Expansion");
  const [budget, setBudget] = useState("₹50,000 - ₹2,00,000");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot honeypot

  const handleCtaClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // Trigger GA4 event tracking for CTA click
    ga.event({
      action: "cta_click",
      category: "Home Consultation Banner",
      label: `Email Entered: ${emailInput}`,
    });

    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: emailInput,
          company,
          service,
          budget,
          message,
          website: honeypot, // Honeypot field
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Trigger GA4 event tracking for Form Submit
        ga.event({
          action: "form_submit",
          category: "Lead Capture",
          label: `Service: ${service} | Budget: ${budget}`,
          value: 1,
          lead_email: emailInput,
          lead_service: service,
          lead_budget: budget,
        });

        setSuccess(true);
        // Reset forms
        setName("");
        setCompany("");
        setMessage("");
        setEmailInput("");
      } else {
        setErrorMsg(result.message || "Failed to submit lead request.");
      }
    } catch (err) {
      console.error("Lead submit error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 py-32 bg-[#0D0D0D]">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        


        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-20">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-orange">
              Insights & News
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              From the Domain Expansion Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-xs font-bold text-white hover:text-brand-orange transition-colors duration-200"
            data-cursor="hover"
          >
            All Insights
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* 3-Column Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 rounded-2xl border border-[#2E2E2E] bg-[#141414]/30 hover:bg-[#141414] transition-all duration-300 group relative min-h-[320px]"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-[#888898] text-[10px] font-mono mb-6">
                  <span className="rounded-full bg-[#1A1A1A] border border-[#2E2E2E] px-2.5 py-0.5 font-bold uppercase text-[#FF8C42]">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-brand-orange transition-colors duration-200">
                  {article.title}
                </h3>

                {/* Article Excerpt */}
                <p className="text-xs text-[#888898] leading-relaxed mt-3 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              {/* Absolute overlay route link */}
              <Link
                href={`/blog/${article.slug}`}
                className="absolute inset-0 z-10 cursor-none"
                data-cursor="open"
                aria-label={`Read article: ${article.title}`}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA Consultation Strip */}
        <div className="relative p-8 md:p-14 rounded-3xl border border-[#2E2E2E] bg-[#141414] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex flex-col gap-4 max-w-xl text-left">
              <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Ready to Think Outside The Box?
              </h3>
              <p className="text-xs sm:text-sm text-[#888898] leading-relaxed">
                Log your email below. We'll set up a free 30-minute discovery call to analyze your current growth footprint and layout a custom performance plan.
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleCtaClick} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 items-stretch sm:items-center">
              <input
                type="email"
                required
                placeholder="Enter your work email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex h-[52px] w-full sm:w-72 rounded-full border border-[#2E2E2E] bg-[#0D0D0D] px-6 text-xs text-white placeholder-[#5A5A6A] outline-none transition-all duration-200 focus:border-brand-orange"
              />
              <Button type="submit" variant="primary" className="py-4 text-xs font-bold uppercase tracking-wider shrink-0 h-[52px]">
                Get Free Consultation
              </Button>
            </form>
          </div>

          <div className="mt-6 border-t border-[#2E2E2E]/60 pt-4 text-left">
            <p className="text-[10px] font-mono text-[#888898]">
              🛡️ No commitment · Zero obligation · Response logged within 24 business hours
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Consultation Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!loading) setModalOpen(false); }}
              className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-2xl border border-[#2E2E2E] bg-[#141414] p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="absolute top-4 right-4 text-[#888898] hover:text-white transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {!success ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-left">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-display text-xl font-bold text-white">
                      Complete Your Inquiry
                    </h4>
                    <p className="text-xs text-[#888898]">
                      Just a few quick details to prepare our founder, Ishwar Mule, for your discovery call.
                    </p>
                  </div>

                  {/* Honeypot Bot Trap */}
                  <input
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Form fields */}
                  <Input
                    label="Full Name"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    disabled
                    value={emailInput}
                  />

                  <Input
                    label="Company Name"
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Service interested in"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      options={[
                        { label: "Marketing Expansion", value: "Marketing Expansion" },
                        { label: "Development Expansion", value: "Development Expansion" },
                        { label: "Design Expansion", value: "Design Expansion" },
                        { label: "AI Expansion", value: "AI Expansion" },
                        { label: "Multiple Pillars", value: "Multiple Pillars" },
                      ]}
                    />

                    <Select
                      label="Monthly Budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      options={[
                        { label: "Under ₹50,000", value: "Under ₹50,000" },
                        { label: "₹50,000 - ₹2,00,000", value: "₹50,000 - ₹2,00,000" },
                        { label: "₹2,00,000 - ₹5,00,000", value: "₹2,00,000 - ₹5,00,000" },
                        { label: "₹5,00,000+", value: "₹5,00,000+" },
                        { label: "Let's Discuss", value: "Let's Discuss" },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Project Brief"
                    required
                    placeholder="Briefly describe what you're trying to solve..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                  <CheckCircle className="h-16 w-16 text-[#22C55E] stroke-[1.5]" />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-display text-2xl font-bold text-white">
                      Inquiry Logged!
                    </h4>
                    <p className="text-xs text-[#888898] max-w-sm leading-relaxed">
                      Thank you, {name}. We have successfully sent a confirmation email to <strong>{emailInput}</strong>. Our team will review your project brief and follow up within 24 hours.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setModalOpen(false);
                    }}
                    variant="secondary"
                    className="mt-6 px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                  >
                    Back to Homepage
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
