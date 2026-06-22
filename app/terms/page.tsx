"use client";

import { useState } from "react";
import Link from "next/link";

const sections = [
  { id: "agreement", title: "1. Agreement to Terms" },
  { id: "use", title: "2. Use of Website" },
  { id: "ip", title: "3. Intellectual Property" },
  { id: "client", title: "4. Client Engagements" },
  { id: "payment", title: "5. Payment & Retainers" },
  { id: "liability", title: "6. Limitation of Liability" },
  { id: "indemnify", title: "7. Indemnification" },
  { id: "techguild", title: "8. TechGuild Platform Terms" },
  { id: "disputes", title: "9. Dispute Resolution" },
  { id: "governing", title: "10. Governing Law" },
  { id: "changes", title: "11. Changes to Terms" },
  { id: "contact", title: "12. Contact Details" }
];

export default function TermsPage() {
  const [activeAnchor, setActiveAnchor] = useState("agreement");

  return (
    <main className="bg-white text-[#0D0D0D] min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* Breadcrumbs & Header */}
        <div className="border-b border-[#E5E5E5] pb-8 mb-12 text-left">
          <nav className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#888898] mb-4">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0D0D0D]">Terms & Conditions</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0D0D0D]">
            Terms & Conditions
          </h1>
          <p className="text-xs font-mono text-[#888898] mt-2">
            Last Updated: June 19, 2026 · Remote Operations
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

          {/* Terms Content (9 Columns) */}
          <article className="lg:col-span-9 prose prose-sm max-w-none text-left flex flex-col gap-10">
            
            <section id="agreement" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">1. Agreement to Terms</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                By accessing or using <Link href="/" className="text-brand-orange hover:underline font-semibold">domainexpansion.in</Link>, submitting lead briefs, or joining our TechGuild waitlist arrays, you agree to be bound by these Terms & Conditions. If you disagree with any segment, please terminate your access immediately.
              </p>
            </section>

            <section id="use" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">2. Use of Website</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                You agree to use this site strictly for lawful purposes and professional inquiries. You shall not:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1">
                <li>Deploy automated bots, scrapers, or scripts to flood our lead forms or waitlist endpoints.</li>
                <li>Attempt to bypass rate limiting (3 inquiries/hour per IP for leads) or upload malicious scripts.</li>
                <li>Engage in database injection attempts or reverse-engineer our Next.js or Prisma configurations.</li>
              </ul>
            </section>

            <section id="ip" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">3. Intellectual Property</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                The visual layout, design system tokens, source code, interactive 3D WebGL assets, logo variations, and custom copywriting on this site are the exclusive property of Domain Expansion. You may not copy, reproduce, or repurpose any content without our explicit written consent.
              </p>
            </section>

            <section id="client" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">4. Client Engagements</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Formal digital campaigns, software builds, or design works are governed by separate Master Services Agreements (MSA) signed between the parties. In case of discrepancies, the signed MSA takes precedence over these website terms.
              </p>
            </section>

            <section id="payment" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">5. Payment & Retainers</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Typical payment parameters for our service pillars are structured as follows:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1">
                <li>**Web & Software development**: 50% advance before project initiation, and remaining balances due upon milestone delivery or staging approvals.</li>
                <li>**Marketing & AI Retainers**: Paid in advance monthly retainers. Out-of-pocket expenses (ad spend, API call fees) are billed directly to client credit cards.</li>
                <li>**Invoices**: Billed via GST-registered invoices, due within seven (7) business days. Delay in payment may result in service suspension.</li>
              </ul>
            </section>

            <section id="liability" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">6. Limitation of Liability</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Domain Expansion is an outcome-focused agency, but we operate in evolving digital channels:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-1">
                <li>We do not guarantee specific keyword ranking positions on search engines, or exact customer conversion yields.</li>
                <li>We are not liable for operational interruptions caused by third-party API adjustments (Google algorithms or Meta ad policy changes).</li>
                <li>Our total aggregate liability is capped at the total amount paid by the client in the one (1) month preceding the event giving rise to the claim.</li>
              </ul>
            </section>

            <section id="indemnify" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">7. Indemnification</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                You agree to indemnify and hold harmless Domain Expansion, its founder Ishwar B. Mule, and contracted specialists against claims, damages, or legal costs arising from copyrights infringement related to media files, graphics, copy, or customer access databases supplied by you for our builds.
              </p>
            </section>

            <section id="techguild" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">8. TechGuild Platform Terms</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                TechGuild is a B2B SaaS marketplace operated by Domain Expansion. The following terms govern your usage of the platform as either a Digital Agency or a Client:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-[#5A5A6A] space-y-2">
                <li><strong>Intermediary Safe Harbor:</strong> TechGuild acts purely as an online intermediary facilitating the posting of project briefs, communications, and payments. We are not a party to the contract between the Client and the Agency. We do not guarantee, verify, or warrant the accuracy of project briefs, code deliverables, design layouts, or SLA commitments.</li>
                <li><strong>Auditing & Credentials Verification:</strong> We reserve the right to audit all registering digital agencies. This includes verifying CIN/GSTIN registrations, auditing past portfolios, and calling references. We hold absolute discretion in profile approvals, modifications, or suspension. Falsifying credentials or portfolio works will lead to immediate account termination.</li>
                <li><strong>Subscription Billing:</strong> Agencies opting for Growth or Pro tiers pay a flat monthly subscription. Auto-renewals are billed in advance. Cancellations take effect at the end of the current billing cycle. Waitlist members are guaranteed three (3) months of free access to paid tiers post-launch.</li>
                <li><strong>Milestone Escrow & Disputes:</strong> Project budgets are held in milestone-based escrow accounts. Funds are disbursed to the agency strictly upon client milestone sign-off. If a dispute arises over deliverables, both parties agree to submit to TechGuild's platform mediation and arbitration process before pursuing external legal recourse.</li>
              </ul>
            </section>

            <section id="disputes" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">9. Dispute Resolution</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                Any dispute, claim, or controversy arising out of these terms shall be referred to and resolved by arbitration under the Indian Arbitration and Conciliation Act, 1996. The arbitration seat shall be in Maharashtra, India. The proceedings shall be conducted in English.
              </p>
            </section>

            <section id="governing" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">10. Governing Law</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                These terms are governed by the laws of India. You agree that any legal action or proceeding not covered by arbitration shall be brought exclusively in the courts of India.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">11. Changes to Terms</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                We reserve the right to modify these terms at any time. We will provide at least 30 days notice for material changes by updating the last updated timestamp. Continued use of our site after edits constitute agreement to updated terms.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28 flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-[#0D0D0D] border-b border-[#E5E5E5]/60 pb-2">12. Contact Details</h2>
              <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">
                For questions or clarifications regarding these terms, reach us at:
              </p>
              <div className="p-5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-xs text-[#5A5A6A] leading-relaxed flex flex-col gap-1.5">
                <span className="font-bold text-[#0D0D0D]">Domain Expansion Legal Team</span>
                <span>Address: Remote only</span>
                <span>Email: <a href="mailto:info@domainexpansion.in" className="text-brand-orange hover:underline font-semibold font-mono">info@domainexpansion.in</a></span>
              </div>
            </section>

          </article>
        </div>

      </div>
    </main>
  );
}
