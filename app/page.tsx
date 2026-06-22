import { HeroSection } from "@/components/sections/home/HeroSection";
import { ClientTicker } from "@/components/sections/home/ClientTicker";
import { PillarsGrid } from "@/components/sections/home/PillarsGrid";
import { StatsShowcase } from "@/components/sections/home/StatsShowcase";
import { PortfolioGrid } from "@/components/sections/home/PortfolioGrid";
import { Differentiators } from "@/components/sections/home/Differentiators";
import { ProcessFlow } from "@/components/sections/home/ProcessFlow";
import { CaseStudiesShowcase } from "@/components/sections/home/CaseStudiesShowcase";
import { TechGuildPromo } from "@/components/sections/home/TechGuildPromo";
import { BlogPreview } from "@/components/sections/home/BlogPreview";
import { JsonLd } from "@/components/ui/JsonLd";

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Domain Expansion",
    "url": "https://domainexpansion.in",
    "slogan": "Think Outside The Box",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Ishwar B. Mule",
      "jobTitle": "Founder & CEO"
    },
    "email": "Info@domainexpansion.in",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Remote",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/company/domainexpansion",
      "https://www.instagram.com/domainexpansion.in",
      "https://www.facebook.com/domainexpansion.in"
    ],
    "description": "Remote, results-driven digital agency offering Marketing, Development, Design, and AI Expansion services."
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Domain Expansion",
    "image": "https://domainexpansion.in/og/home.png",
    "url": "https://domainexpansion.in",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Remote",
      "addressCountry": "IN"
    },
    "priceRange": "$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-transparent">
      <JsonLd schema={orgSchema} />
      <JsonLd schema={localBusinessSchema} />

      {/* 1. WebGL Hero Section */}
      <HeroSection />

      {/* 2. Client Trust Marquee */}
      <ClientTicker />

      {/* 3. Four Pillars Staircase Layout */}
      <PillarsGrid />

      {/* 4. Odometer Statistics Counter */}
      <StatsShowcase />

      {/* 5. Filterable Portfolio Masonry Grid */}
      <PortfolioGrid />

      {/* 6. Why Domain Expansion Differentiators */}
      <Differentiators />

      {/* 7. Pinned Horizontal Process Timeline */}
      <ProcessFlow />

      {/* 8. 3-Up Outcome-Focused Case Studies */}
      <CaseStudiesShowcase />

      {/* 9. TechGuild Teaser Strip */}
      <TechGuildPromo />

      {/* 10. Blog previews and Consult Form */}
      <BlogPreview />
    </div>
  );
}

