"use client";

import { useState } from "react";
import Link from "next/link";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "collect", title: "2. Information We Collect" },
  { id: "use", title: "3. How We Use Information" },
  { id: "basis", title: "4. Legal Basis for Processing" },
  { id: "thirdparty", title: "5. Third Party Providers" },
  { id: "retention", title: "6. Data Retention" },
  { id: "rights", title: "7. Your Rights (GDPR & DPDP)" },
  { id: "cookies", title: "8. Cookies & Trackers" },
  { id: "transfers", title: "9. International Transfers" },
  { id: "children", title: "10. Children's Privacy" },
  { id: "changes", title: "11. Changes to Policy" },
  { id: "contact", title: "12. Contact Details" }
];

export default function PrivacyPage() {
  const [activeAnchor, setActiveAnchor] = useState("intro");

  return (
    <main className="bg-white text-[#0D0D0D] min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Breadcrumbs & Header */}
        <div className="border-b border-[#E5E5E5] pb-8 mb-12 text-left">
          <nav className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#888898] mb-4">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0D0D0D]">Privacy Policy</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0D0D0D]">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#888898] mt-2">
            Last Updated: June 19, 2026 · Compliant with DPDP Act 2023 & GDPR
          </p>
        </div>

        {/* 2-Column Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Table of Contents (3 Columns) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 text-left hidden lg:block border-r border-[#E5E5E5] pr-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888898] block mb-6">
              Table of Contents
            </span>
            <nav className="flex flex-col gap-3">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveAnchor(sec.id)}
                  className={`text-xs font-semibold hover:text-brand-orange transition-colors ${
                    activeAnchor === sec.id ? "text-brand-orange pl-2 border-l-2 border-brand-orange" : "text-[#5A5A6A]"
                  }`}
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Privacy Content (9 Columns) */}
          <article className="lg:col-span-9 prose prose-sm max-w-none text-left flex flex-col gap-10">
            
            <section id="intro" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">1. Introduction</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Domain Expansion ("we", "our", "us") values your privacy. This Privacy Policy details how we collect, store, and process personal data when you visit our website <Link href="/" className="text-brand-orange hover:underline">domainexpansion.in</Link>, interact with our API handlers (for lead submissions and the TechGuild waitlist), or engage with our digital services.
              </p>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We operate as a remote-first, remote-only digital agency. All operations and database pipelines are maintained in compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India, as well as the General Data Protection Regulation (GDPR) for international visitors.
              </p>
            </section>
            <section id="collect" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">2. Information We Collect</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We collect personal identifiers and corporate metadata that you voluntarily supply to us through our contact forms, Waitlist submissions, marketplace registration portal, and scheduling widgets. This data includes:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1.5">
                <li>**Identifiers**: First and last name, email address, phone number (WhatsApp preferred), and company name.</li>
                <li>**Verification & Corporate Records**: Incorporation certificates, CIN/GSTIN registrations, bank accounts, and portfolio case studies for agency audits.</li>
                <li>**Marketplace Parameters**: Project briefs, SLA configurations, bid/proposal documents, and escrow milestone records.</li>
                <li>**Communications**: Logs of in-platform chat messages and uploaded attachment assets between Clients and Agencies.</li>
                <li>**Network Details**: Client IP addresses (hashed for rate limiting), user agent metadata, referrers, and campaign UTM attributes.</li>
                <li>**Form Protection data**: Bot honeypot outputs.</li>
              </ul>
            </section>
 
            <section id="use" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">3. How We Use Information</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We use your personal parameters to fulfill commercial requests, operate our B2B marketplace, and scale digital systems:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1.5">
                <li>To evaluate your digital footprint and plan the 30-minute discovery consultation.</li>
                <li>To record waitlist positions, process agency audits, and compile marketplace directory listings.</li>
                <li>To facilitate marketplace operations, escrow payments routing, and subscription tier billing.</li>
                <li>To resolve project quality disputes or mediation briefs between Clients and Agencies.</li>
                <li>To dispatch automated transactional notifications and confirmation messages via Resend.</li>
                <li>To safeguard our web endpoints against DDoS or spamming attacks using rate limit thresholds.</li>
              </ul>
            </section>
 
            <section id="basis" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">4. Legal Basis for Processing</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Under relevant privacy frameworks, our processing relies on the following grounds:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1">
                <li>**Consent**: You explicitly grant consent by submitting our briefing forms or joining our Waitlist arrays.</li>
                <li>**Contractual Performance**: Processing is required to draft project quotes, sign service contracts, operate platform escrow accounts, and deliver custom code.</li>
                <li>**Legitimate Interests**: To verify authentic human users, maintain server configurations, and evaluate business metrics.</li>
              </ul>
            </section>
 
            <section id="thirdparty" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">5. Third Party Providers</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We do not sell, lease, or rent customer database coordinates. We transfer data strictly to secure third-party subprocessors for core infrastructure services:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1.5">
                <li>**Host & Database**: Vercel (frontend deployment) and Neon Serverless (PostgreSQL database engine).</li>
                <li>**Payment & Escrow Gateways**: Stripe / Razorpay (subscription processing, billing logs, and payout structures).</li>
                <li>**Transactional Emails**: Resend (SMTP transaction deliveries).</li>
                <li>**Analytics**: Google Analytics 4 (anonymous traffic tracking).</li>
                <li>**CMS**: Sanity (static article content rendering).</li>
              </ul>
            </section>

            <section id="retention" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">6. Data Retention</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We store lead parameters for exactly **one (1) year** following submission, unless you request earlier deletion. Active client contract files are retained for the duration of the commercial engagement to fulfill tax, legal, and billing parameters.
              </p>
            </section>

            <section id="rights" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">7. Your Rights (GDPR & DPDP)</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Depending on your geographic coordinates, you carry absolute legal rights regarding your personal records:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1">
                <li>**Access & Portability**: You may request copies of your personal variables in a readable structural format.</li>
                <li>**Correction & Erasure**: You carry the right to update outdated details or request complete database deletion.</li>
                <li>**Object to Processing**: You can oppose automated sorting filters or withdraw consent triggers.</li>
                <li>**Nomination (DPDP)**: The right to nominate another individual to manage your data in case of incapacity.</li>
              </ul>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                To trigger any of these rights, email us at <a href="mailto:info@domainexpansion.in" className="text-brand-orange hover:underline">info@domainexpansion.in</a> with subject "Data Rights Request".
              </p>
            </section>

            <section id="cookies" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">8. Cookies & Trackers</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We utilize essential cookies to secure inputs validation and prevent cross-site scripting (CSRF) attempts. Anonymous analytics cookies are deployed via Google Analytics 4 to track user scroll depth, session duration, and CTA clicks. You may configure your browser to block all cookies, though some form fields may lose dynamic responsiveness.
              </p>
            </section>

            <section id="transfers" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">9. International Transfers</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Your data is stored on Neon's secure cloud database nodes. By submitting your inquiry, you acknowledge that your variables will be processed in India. For EU/EEA citizens, we implement Standard Contractual Clauses (SCCs) to ensure equivalent data security.
              </p>
            </section>

            <section id="children" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">10. Children's Privacy</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Our digital services and waitlist arrays are intended exclusively for commercial entities. We do not knowingly collect personal identifiers from individuals under the age of 18.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">11. Changes to Policy</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We reserve the right to update this policy as legal and operational framework requirements evolve. All changes will be posted on this page with an updated timestamp.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">12. Contact Details</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                For questions, complaints, or deletion requests, contact our designated Data Protection Officer:
              </p>
              <div className="p-5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-xs text-[#5A5A6A] leading-relaxed flex flex-col gap-1.5">
                <span className="font-bold text-[#0D0D0D]">Data Protection Officer: Ishwar B. Mule</span>
                <span>Address: Remote only</span>
                <span>Email: <a href="mailto:info@domainexpansion.in" className="text-brand-orange hover:underline font-semibold">info@domainexpansion.in</a></span>
              </div>
            </section>

          </article>
        </div>

      </div>
    </main>
  );
}
