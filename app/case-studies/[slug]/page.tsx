import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, HelpCircle, Lightbulb, Quote, TrendingUp } from "lucide-react";
import { projects, Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Find 3 related projects
  const relatedProjects = projects
    .filter((p) => p.slug !== project.slug)
    .map((p) => {
      let score = 0;
      p.categories.forEach((cat) => {
        if (project.categories.includes(cat)) {
          score += 2;
        }
      });
      if (p.region === project.region) score += 1;
      return { project: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.project);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://domainexpansion.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Case Studies",
        "item": "https://domainexpansion.in/case-studies"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.clientName,
        "item": `https://domainexpansion.in/case-studies/${slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `How Domain Expansion scaled ${project.clientName} | ${project.title}`,
    "about": {
      "@type": "Thing",
      "name": `${project.industry} case study`
    },
    "author": {
      "@type": "Organization",
      "name": "Domain Expansion",
      "url": "https://domainexpansion.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Domain Expansion",
      "logo": {
        "@type": "ImageObject",
        "url": "https://domainexpansion.in/og/home.png"
      }
    },
    "mainEntityOfPage": `https://domainexpansion.in/case-studies/${slug}`
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={articleSchema} />
      {/* SECTION 1 — Case Study Hero */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 border-b border-[#2E2E2E] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/6_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 text-left">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#ACACB8] hover:text-[#FF6200] mb-8 transition-colors"
            data-cursor="hover"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Case Studies
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/60">
                  Case Study Deep-Dive
                </span>
                <Badge variant="orange">{project.industry}</Badge>
                <Badge variant="violet">{project.region} Market</Badge>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                {project.clientName}
              </h1>
              <p className="font-display text-lg sm:text-xl text-[#FF8C42] font-semibold leading-relaxed">
                {project.title}
              </p>
              <p className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed max-w-2xl">
                {project.tagline}
              </p>
            </div>

            {/* Outlining 3 primary metrics directly on Hero */}
            <div className="lg:col-span-4 flex flex-col gap-4 bg-black/40 p-6 rounded-xl border border-[#2E2E2E]">
              <span className="text-[9px] font-mono text-[#888898] uppercase tracking-wider">Campaign Metrics</span>
              <div className="flex flex-col gap-4">
                {project.metrics.slice(0, 3).map((met, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-[#2E2E2E]/60 pb-2 last:border-b-0 last:pb-0">
                    <span className="text-[11px] text-[#ACACB8] font-medium leading-none">{met.label}</span>
                    <span className="font-display text-base font-extrabold text-[#FF8C42] leading-none">{met.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Context / Metadata Section */}
      <section className="border-b border-[#2E2E2E] bg-[#141414]/30 py-8">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Duration Scope</span>
              <span className="text-xs sm:text-sm font-bold text-white">{project.duration}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Release Year</span>
              <span className="text-xs sm:text-sm font-bold text-white">{project.year}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Category Pillars</span>
              <span className="text-xs sm:text-sm font-bold text-white capitalize">{project.categories.join(", ")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Service Region</span>
              <span className="text-xs sm:text-sm font-bold text-white">{project.region} Campaigns</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Problem Detail (The Diagnostic) */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-brand-orange uppercase tracking-wider font-bold">
                <HelpCircle className="h-4 w-4" /> 01 / Diagnostics
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight">
                {project.challengeHeadline}
              </h2>
            </div>
            <div className="lg:col-span-7 text-left text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
              <p className="mb-6">{project.challengeDescription}</p>
              <div className="p-5 rounded-xl bg-red-950/10 border border-red-900/30 text-red-400">
                <span className="text-[9px] font-mono uppercase block mb-1 font-bold">Identified Failure Loop</span>
                Unaddressed technical blockages were draining marketing budget, triggering spam filters, and blocking organic user discovery.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Strategy Plan */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#8B5CF6] uppercase tracking-wider font-bold">
                <Lightbulb className="h-4 w-4" /> 02 / Strategic Plan
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight">
                Engineered Solutions Architecture
              </h2>
            </div>
            <div className="lg:col-span-7 text-left text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
              <p>{project.approachDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Execution Steps */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#22C55E] uppercase tracking-wider font-bold">
                <CheckCircle2 className="h-4 w-4" /> 03 / Code & Campaign Sprint
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight">
                Technical Execution Lifecycle
              </h2>
            </div>
            <div className="lg:col-span-7 text-left text-xs sm:text-sm text-[#ACACB8] leading-relaxed">
              <p>{project.executionDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Results Analysis */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#FF6200/3_0%,transparent_50%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-brand-orange uppercase tracking-wider font-bold">
                <TrendingUp className="h-4 w-4" /> 04 / Impact Outcomes
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight">
                Blended ROI and Performance Lift
              </h2>
            </div>
            <div className="lg:col-span-7 text-left text-xs sm:text-sm text-[#ACACB8] leading-relaxed flex flex-col gap-8">
              <p>{project.resultsDescription}</p>
              
              {/* Highlight metrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="p-5 rounded-lg border border-[#2E2E2E] bg-black/40 text-center flex flex-col justify-center">
                    <span className="font-display text-2xl font-extrabold text-[#FF8C42] block">{metric.value}</span>
                    <span className="text-[9px] text-[#888898] uppercase font-bold tracking-wider mt-1">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Testimonial (Optional) */}
      {project.testimonial && (
        <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30 relative">
          <div className="mx-auto max-w-4xl px-6 md:px-8 text-center flex flex-col items-center gap-6 relative z-10">
            <Quote className="h-10 w-10 text-brand-orange/40 shrink-0" />
            <p className="font-display text-base sm:text-xl md:text-2xl text-[#F3F4F6] italic leading-relaxed max-w-3xl">
              "{project.testimonial.quote}"
            </p>
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-xs font-mono text-[#FF8C42] uppercase font-bold">
                {project.testimonial.author}
              </span>
              <span className="text-[10px] text-[#888898]">
                {project.testimonial.role} — {project.clientName}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8 — Key Lessons / Takeaways */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono text-[#FF8C42] uppercase tracking-wider font-bold">
                <BookOpen className="h-4 w-4" /> 05 / Key Takeaways
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight">
                Lessons & Insights Earned
              </h2>
            </div>
            <div className="lg:col-span-7 text-left flex flex-col gap-4">
              {project.lessons.map((lesson, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-xl border border-[#2E2E2E] bg-[#141414]/30 hover:border-[#FF6200]/25 transition-all">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6200]/10 text-brand-orange text-xs font-bold font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#ACACB8] leading-relaxed pt-0.5">
                    {lesson}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — Related Cases */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <span className="text-[10px] font-mono text-[#FF8C42] uppercase tracking-wider font-bold">More Proof</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2">Related Deep-Dives</h2>
            </div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ACACB8] hover:text-white transition-colors"
              data-cursor="hover"
            >
              All Cases <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/case-studies/${p.slug}`}
                className="group p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/20 hover:border-brand-orange/40 hover:bg-[#141414]/60 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono text-[#888898] uppercase tracking-wider mb-2 block">{p.industry}</span>
                  <h4 className="font-display text-base font-bold text-white group-hover:text-brand-orange transition-colors mb-2">{p.clientName}</h4>
                  <p className="text-[11px] text-[#ACACB8] line-clamp-2 leading-relaxed mb-4">{p.tagline}</p>
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-[#2E2E2E]/60 pt-4">
                  <span className="text-[10px] font-bold text-[#FF8C42]">{p.metrics[0]?.value} {p.metrics[0]?.label.split(" ")[0]}</span>
                  <span className="text-[10px] font-bold text-white flex items-center gap-1">Read Deep-Dive <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — Lead Consult CTA */}
      <section className="py-24 relative overflow-hidden border-t border-[#2E2E2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 md:px-8 relative z-10 text-center flex flex-col items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8C42] uppercase font-bold">Actionable Strategy</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Scale Your Acquisitions Safely</h2>
            <p className="text-xs sm:text-sm text-[#ACACB8] max-w-lg mx-auto leading-relaxed">
              Contact us to discuss how to run high-volume outreach, design responsive corporate portals, or configure automated data frameworks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button variant="primary" className="px-8 py-3 text-xs uppercase tracking-wider font-bold">
                Book Operational Review <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact#calendly">
              <Button variant="outline" className="px-8 py-3 text-xs uppercase tracking-wider font-bold">
                Select Calendar Slot
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
