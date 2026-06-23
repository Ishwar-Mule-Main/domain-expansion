import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Newspaper, Sparkles } from "lucide-react";
import { blogPosts, BlogPost } from "@/lib/data/blog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShareBar } from "@/components/blog/ShareBar";
import { JsonLd } from "@/components/ui/JsonLd";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({
    slug: p.slug,
  }));
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find 3 related blog posts
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 3;
      if (p.popular) score += 1;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post);

  // Return contextual CTA details based on category
  const getContextualCTA = (category: BlogPost["category"]) => {
    switch (category) {
      case "marketing":
        return {
          title: "Scale Your Organic Traffic & GEO Visibility",
          description: "Let us review your Core Web Vitals, construct target topic clusters, and ensure your brand ranks in AI search results.",
          buttonLabel: "Request Marketing Audit",
          service: "Marketing Expansion"
        };
      case "development":
        return {
          title: "Build High-Performance Next.js Architectures",
          description: "Ditch slow templates. Connect with our development team to build fast storefronts and responsive mobile applications.",
          buttonLabel: "Consult Web Engineers",
          service: "Development Expansion"
        };
      case "design":
        return {
          title: "Design a Branded Premium Visual System",
          description: "Construct reusable design assets, A/B creative testing matrices, and visual feeds that boost saves and shares.",
          buttonLabel: "Consult Creative Director",
          service: "Design Expansion"
        };
      case "ai":
        return {
          title: "Automate Customer Acquisition via n8n & LLMs",
          description: "Audit your lead intake flows. We build self-qualifying pipelines, automated database records, and instant routing tools.",
          buttonLabel: "Configure AI Workflows",
          service: "AI Expansion"
        };
      default: // agency
        return {
          title: "Get Early Access to TechGuild Marketplace",
          description: "Join the verified agency waitlist to secure 3 months free and access qualified B2B client briefs.",
          buttonLabel: "Join TechGuild Waitlist",
          service: "TechGuild Waitlist"
        };
    }
  };

  const cta = getContextualCTA(post.category);

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
        "name": "Blog",
        "item": "https://domainexpansion.in/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://domainexpansion.in/blog/${slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": new Date(post.date).toISOString().split('T')[0], // parse "June 18, 2026"
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Domain Expansion",
      "logo": {
        "@type": "ImageObject",
        "url": "https://domainexpansion.in/og/home.png"
      }
    },
    "mainEntityOfPage": `https://domainexpansion.in/blog/${slug}`
  };

  return (
    <main className="min-h-screen bg-white text-[#0D0D0D]">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={articleSchema} />
      {/* SECTION 1 — Article Hero */}
      <section className="relative pt-24 pb-16 border-b border-[#E5E5E5] bg-[#F8F8F8]">
        <div className="mx-auto max-w-4xl px-6 md:px-8 relative z-10 text-left">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#5A5A6A] hover:text-[#FF6200] mb-8 transition-colors"
            data-cursor="hover"
          >
            <ArrowLeft className="h-4 w-4" /> Back to NewsRoom
          </Link>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Badge variant="orange">{post.categoryLabel}</Badge>
              <span className="text-[10px] font-mono text-[#888898] uppercase">Official Practitioner insights</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0D0D0D] leading-tight max-w-4xl">
              {post.title}
            </h1>

            {/* Author byline row */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-[#E5E5E5] bg-[#F8F8F8] overflow-hidden flex items-center justify-center">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#0D0D0D]">{post.author}</span>
                  <span className="text-[10px] text-[#888898]">{post.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#888898] font-mono">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Columns Content (Sticky Share Left, Body Right) */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sticky Share Bar column */}
            <div className="lg:col-span-2 lg:sticky lg:top-36 flex lg:flex-col items-center">
              <ShareBar title={post.title} slug={post.slug} />
            </div>

            {/* Main Long-form Article Body */}
            <div className="lg:col-span-8 text-left">
              {/* Article cover visual frame */}
              <div className={`aspect-video rounded-xl bg-gradient-to-br ${post.coverGradient} p-6 sm:p-10 flex flex-col justify-end text-white relative overflow-hidden mb-12 shadow-sm`}>
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}
                <div className="absolute inset-0 bg-black/35 z-10" />
                <div className="relative z-20 flex items-center gap-2">
                  <Newspaper className="h-6 w-6 text-[#FF8C42]" />
                  <span className="font-mono text-[10px] tracking-wider uppercase bg-white/10 px-2 py-0.5 rounded border border-white/20">
                    Domain Expansion NewsRoom
                  </span>
                </div>
              </div>

              {/* Parsed Blog Body HTML styling */}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
              />

              {/* Author Box card */}
              <div className="mt-16 p-6 sm:p-8 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="h-16 w-16 rounded-full border border-[#E5E5E5] bg-[#F8F8F8] overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-left gap-2">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#0D0D0D]">{post.author}</h4>
                    <span className="text-[10px] text-[#888898] font-mono uppercase tracking-wider">{post.authorRole}</span>
                  </div>
                  <p className="text-xs text-[#5A5A6A] leading-relaxed">
                    Ishwar Mule is the Founder and Chief Strategist of Domain Expansion. He architects digital marketing campaigns, reputation-safe high-volume email streams, and scalable Next.js interfaces for local and international brands.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/ishwarmule/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-[#FF6200] hover:text-[#E55700] transition-colors mt-2"
                  >
                    Connect on LinkedIn ↗
                  </a>
                </div>
              </div>

              {/* Section 5 — Contextual Lead Form CTA */}
              <div className="mt-12 p-8 sm:p-12 rounded-xl border border-brand-orange/30 bg-gradient-to-br from-[#FF6200]/5 to-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#FF6200]/10 rounded-bl-full pointer-events-none" />
                <div className="text-left max-w-xl relative z-10">
                  <span className="text-[10px] font-mono text-[#FF6200] uppercase tracking-wider font-bold block mb-2">Recommended Operational Audit</span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D0D0D] mb-2">{cta.title}</h3>
                  <p className="text-xs sm:text-sm text-[#5A5A6A] leading-relaxed">{cta.description}</p>
                </div>
                <div className="shrink-0 w-full md:w-auto relative z-10">
                  <Link href={`/contact?service=${encodeURIComponent(cta.service)}`}>
                    <Button variant="primary" className="py-3 px-6 text-xs font-mono tracking-wider uppercase text-white flex items-center justify-center gap-2 w-full">
                      {cta.buttonLabel} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION Related Articles */}
      <section className="py-16 border-t border-[#E5E5E5] bg-[#F8F8F8]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex justify-between items-end mb-10">
            <div className="text-left">
              <span className="text-[10px] font-mono text-[#FF6200] uppercase tracking-widest font-bold">More Insights</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D0D0D] mt-2">Recommended Reads</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A6A] hover:text-[#0D0D0D] transition-colors"
              data-cursor="hover"
            >
              All Articles <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group p-6 rounded-xl border border-[#E5E5E5] bg-white hover:border-[#FF6200]/40 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono text-[#FF6200] uppercase font-bold tracking-wider mb-2 block">{p.categoryLabel}</span>
                  <h4 className="font-display text-sm font-bold text-[#0D0D0D] group-hover:text-[#FF6200] transition-colors mb-2 leading-snug">{p.title}</h4>
                  <p className="text-[11px] text-[#5A5A6A] line-clamp-2 leading-relaxed mb-4">{p.excerpt}</p>
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-[#E5E5E5] pt-4">
                  <span className="text-[9px] font-mono text-[#888898]">{p.date}</span>
                  <span className="text-[10px] font-bold text-[#0D0D0D] flex items-center gap-1">Read <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
