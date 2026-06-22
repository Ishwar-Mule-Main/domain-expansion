"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Marketing Expansion", path: "/services/marketing-expansion" },
    { name: "Development Expansion", path: "/services/development-expansion" },
    { name: "Design Expansion", path: "/services/design-expansion" },
    { name: "AI Expansion", path: "/services/ai-expansion" },
  ];

  const company = [
    { name: "About Us", path: "/about" },
    { name: "Featured Portfolio", path: "/portfolio" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Blog & Newsroom", path: "/blog" },
  ];

  const platform = [
    { name: "TechGuild Marketplace", path: "/techguild" },
    { name: "Agency Registration", path: "/techguild#signup" },
    { name: "Post a Project", path: "/techguild#signup" },
    { name: "Platform Terms", path: "/terms#techguild" },
  ];

  return (
    <footer className="border-t border-[#2E2E2E] bg-[#0D0D0D] text-[#ACACB8]">
      {/* Main Grid Section */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center group">
              <img
                src="/Domain Expansion New Logo.png"
                alt="Domain Expansion Logo"
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-xs text-[#888898] leading-relaxed">
              We help businesses Think Outside The Box by combining creative strategy, precision execution, and AI-powered innovation.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href="https://linkedin.com/company/domainexpansion"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors p-1"
                aria-label="LinkedIn"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/domainexpansion.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors p-1"
                aria-label="Instagram"
              >
                <svg className="h-4.5 w-4.5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com/domainexpansion.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors p-1"
                aria-label="Facebook"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              {services.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.path} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              {company.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.path} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: TechGuild */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">
              TechGuild
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              {platform.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.path} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Details */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">
              Contact
            </h4>
            <ul className="flex flex-col gap-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <a href="mailto:info@domainexpansion.in" className="hover:text-white transition-colors">
                  info@domainexpansion.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                <span>Remote</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2E2E2E] bg-[#0A0A0A] py-8 text-center text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {currentYear} Domain Expansion. All rights reserved.</p>
          <div className="flex gap-6 text-[#888898]">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
