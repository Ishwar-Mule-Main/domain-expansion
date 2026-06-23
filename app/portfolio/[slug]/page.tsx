import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Quote, Sparkles } from "lucide-react";
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

export default async function ProjectDetailPage({ params }: PageProps) {
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
      // Overlapping categories
      p.categories.forEach((cat) => {
        if (project.categories.includes(cat)) {
          score += 2;
        }
      });
      // Same region
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
        "name": "Portfolio",
        "item": "https://domainexpansion.in/portfolio"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.clientName,
        "item": `https://domainexpansion.in/portfolio/${slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Scaling ${project.clientName} | ${project.title}`,
    "description": project.tagline,
    "image": "https://domainexpansion.in/og/home.png",
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
    "mainEntityOfPage": `https://domainexpansion.in/portfolio/${slug}`
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={articleSchema} />
      {/* SECTION 1 — Project Hero */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 border-b border-[#2E2E2E] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/6_0%,transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#ACACB8] hover:text-[#FF6200] mb-8 transition-colors"
            data-cursor="hover"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>

          <div className="flex flex-col gap-6 text-left max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="orange">{project.industry}</Badge>
              <Badge variant="dark">{project.region} Market</Badge>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Scaling {project.clientName}
            </h1>
            <p className="font-display text-xl sm:text-2xl text-[#FF8C42] font-semibold leading-relaxed">
              {project.title}
            </p>
            <p className="text-sm sm:text-base text-[#ACACB8] leading-relaxed max-w-3xl">
              {project.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Metadata Details Bar */}
      <section className="border-b border-[#2E2E2E] bg-[#141414]/30 py-6">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Duration</span>
              <span className="text-sm font-bold text-white">{project.duration}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Year</span>
              <span className="text-sm font-bold text-white">{project.year}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Service Focus</span>
              <span className="text-sm font-bold text-white capitalize">
                {project.categories.join(", ")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Deployment Tier</span>
              <span className="text-sm font-bold text-[#FF6200]">Premium Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — The Challenge */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left">
              <span className="text-[10px] font-mono text-brand-orange uppercase tracking-wider font-bold">Bottleneck Analysis</span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold mt-2 leading-tight">
                {project.challengeHeadline}
              </h2>
            </div>
            <div className="lg:col-span-7 text-left text-sm md:text-base text-[#ACACB8] leading-relaxed flex flex-col gap-6">
              <p>{project.challengeDescription}</p>
              <div className="p-5 rounded-xl bg-[#141414] border border-[#2E2E2E] border-l-4 border-l-[#FF6200]">
                <span className="text-[9px] font-mono text-[#888898] uppercase block mb-1">Context Outline</span>
                <span className="text-white font-medium">
                  We identified delivery friction points, conversion leaks, and structural speed caps that directly impacted client revenue.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — The Approach & Strategy */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/10">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left">
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase tracking-wider font-bold">Strategic Pivot</span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold mt-2 leading-tight">
                Engineered Strategy & Execution
              </h2>
            </div>
            <div className="lg:col-span-7 text-left text-sm md:text-base text-[#ACACB8] leading-relaxed flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Our Methodical Approach</h4>
                <p>{project.approachDescription}</p>
              </div>
              <div className="border-t border-[#2E2E2E] pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Technical Execution</h4>
                <p>{project.executionDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Metrics Grid */}
      <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#FF6200/3_0%,transparent_50%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 text-center">
          <span className="text-[10px] font-mono text-[#FF8C42] uppercase tracking-wider font-bold">Metrics Generated</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 mb-16">Campaign Impact Outcomes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {project.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-8 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:border-[#FF6200]/30 transition-all duration-300">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-orange">
                  {metric.value}
                </span>
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Visual Gallery (CSS Gradients & Details) */}
      <section className="py-24 border-b border-[#2E2E2E]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
          <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider font-bold">Visual Showcase</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 mb-12">Interface & Design Artifacts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Visual Frame 1 */}
            <div className="group relative aspect-video rounded-xl border border-[#2E2E2E] bg-gradient-to-tr from-[#FF6200]/20 to-[#6D28D9]/20 flex flex-col items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[#0D0D0D]/60 group-hover:bg-[#0D0D0D]/30 transition-all" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <span className="text-[9px] font-mono text-brand-orange uppercase bg-black/40 px-2 py-0.5 rounded border border-[#2E2E2E]">Client Dashboard</span>
                <h4 className="font-display text-base sm:text-lg font-bold">{project.clientName} Execution</h4>
                <p className="text-[10px] text-[#ACACB8] max-w-xs leading-relaxed">
                  Tailored web dashboard containing custom lead funnels, active metrics routing, and CMS databases.
                </p>
              </div>
            </div>

            {/* Visual Frame 2 */}
            <div className="group relative aspect-video rounded-xl border border-[#2E2E2E] bg-gradient-to-bl from-[#22C55E]/15 to-[#FF6200]/20 flex flex-col items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[#0D0D0D]/60 group-hover:bg-[#0D0D0D]/30 transition-all" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <span className="text-[9px] font-mono text-[#FF8C42] uppercase bg-black/40 px-2 py-0.5 rounded border border-[#2E2E2E]">System Architecture</span>
                <h4 className="font-display text-base sm:text-lg font-bold">Optimization Core</h4>
                <p className="text-[10px] text-[#ACACB8] max-w-xs leading-relaxed">
                  Fast Next.js structures built utilizing strict SEO tag parameters and optimized content schemas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Testimonial (Optional) */}
      {project.testimonial && (
        <section className="py-24 border-b border-[#2E2E2E] bg-[#141414]/30 relative">
          <div className="mx-auto max-w-4xl px-6 md:px-8 text-center flex flex-col items-center gap-6">
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

      {/* SECTION 8 — Related Projects */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <span className="text-[10px] font-mono text-[#FF8C42] uppercase tracking-wider font-bold">Related Cases</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2">More Outcomes We Scaled</h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ACACB8] hover:text-white transition-colors"
              data-cursor="hover"
            >
              All Work <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/${p.slug}`}
                className="group p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]/20 hover:border-brand-orange/40 hover:bg-[#141414]/60 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono text-[#888898] uppercase tracking-wider mb-2 block">{p.industry}</span>
                  <h4 className="font-display text-base font-bold text-white group-hover:text-brand-orange transition-colors mb-2">{p.clientName}</h4>
                  <p className="text-[11px] text-[#ACACB8] line-clamp-2 leading-relaxed mb-4">{p.tagline}</p>
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-[#2E2E2E]/60 pt-4">
                  <span className="text-[10px] font-bold text-[#FF8C42]">{p.metrics[0]?.value} {p.metrics[0]?.label.split(" ")[0]}</span>
                  <span className="text-[10px] font-bold text-white flex items-center gap-1">Details <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
