"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Clock, Mail, Search, Sparkles, TrendingUp } from "lucide-react";
import { blogPosts, BlogPost } from "@/lib/data/blog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const categories = [
  { id: "all", label: "All Insights" },
  { id: "marketing", label: "SEO & Marketing" },
  { id: "development", label: "Development" },
  { id: "design", label: "Design Systems" },
  { id: "ai", label: "AI & Automation" },
  { id: "agency", label: "Agency News" },
] as const;

export default function BlogArchivePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  // The primary SEO case study is featured at the top
  const featuredPost = blogPosts.find((p) => p.slug === "seo-geo-marketing-ai-blueprint") || blogPosts[0];

  useEffect(() => {
    // Filter by category and search query
    let list = blogPosts;

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(list);
    setCurrentPage(1); // reset to page 1 on filter
  }, [activeCategory, searchQuery]);

  // Compute category counts dynamically
  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat.id === "all") {
      acc[cat.id] = blogPosts.length;
    } else {
      acc[cat.id] = blogPosts.filter((p) => p.category === cat.id).length;
    }
    return acc;
  }, {} as Record<string, number>);

  // Popular posts filter (labeled as popular)
  const popularPosts = blogPosts.filter((p) => p.popular);

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0D0D0D]">
      {/* SECTION 1 — Hero */}
      <section className="relative pt-24 pb-16 border-b border-[#E5E5E5] bg-[#F8F8F8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,98,0,0.03)_0%,transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center relative z-10 flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6200]/20 bg-[#FF6200]/5 text-[10px] font-mono tracking-widest uppercase text-[#FF6200] font-bold">
            <Sparkles className="h-3 w-3 text-[#FF6200]" /> Practicing Experts
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#0D0D0D] max-w-3xl leading-tight">
            Domain Expansion <span className="text-[#FF6200]">Insights & News</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5A5A6A] max-w-2xl leading-relaxed">
            Written by our developers, design leads, and growth strategists. We share technical breakdowns, search algorithms, and client operations templates.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Featured Post Showcase */}
      {featuredPost && (
        <section className="py-16 border-b border-[#E5E5E5] bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <span className="text-[10px] font-mono text-[#FF6200] uppercase tracking-widest font-bold mb-6 block text-left">
              ✦ Highlighted Feature Article
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] overflow-hidden p-6 sm:p-10">
              {/* Image Gradient representation */}
              <div className="lg:col-span-5 h-[280px] sm:h-[350px] rounded-xl bg-gradient-to-tr from-[#FF6200] to-[#6D28D9] p-8 flex flex-col justify-between text-white relative overflow-hidden group">
                {featuredPost.featuredImage && (
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 z-10" />
                <div className="relative z-20 flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {featuredPost.categoryLabel}
                  </span>
                  <span className="text-[9px] font-mono">{featuredPost.readTime}</span>
                </div>
                <div className="relative z-20 text-left">
                  <h3 className="font-display text-2xl font-bold leading-tight mb-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </div>

              {/* Summary Details */}
              <div className="lg:col-span-7 flex flex-col justify-between text-left h-full py-4">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-mono font-bold text-[#FF6200]">
                    {featuredPost.categoryLabel}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0D0D0D] hover:text-[#FF6200] transition-colors leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-[#5A5A6A] leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="h-9 w-9 rounded-full border border-[#E5E5E5] bg-[#F8F8F8] overflow-hidden flex items-center justify-center">
                      <img
                        src={featuredPost.authorImage}
                        alt={featuredPost.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#0D0D0D]">{featuredPost.author}</span>
                      <span className="text-[10px] text-[#888898]">{featuredPost.authorRole}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex justify-between items-center">
                  <span className="text-xs text-[#888898] font-mono">{featuredPost.date}</span>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button variant="primary" className="py-2 px-5 text-xs tracking-wider uppercase font-bold text-white flex items-center gap-2">
                      Read Article <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3 — Search & Filtering Interface */}
      <section className="border-b border-[#E5E5E5] bg-[#F8F8F8] py-6 sticky top-20 z-40">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all border ${
                    isActive
                      ? "border-[#FF6200] text-[#FF6200] bg-[#FF6200]/5"
                      : "border-[#E5E5E5] text-[#5A5A6A] hover:text-[#0D0D0D] hover:border-[#888898]"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888898]">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E5E5E5] rounded-full text-xs text-[#0D0D0D] placeholder-[#888898] focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-[#FF6200] bg-white transition-all"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 & 5 — Grid & Sidebar Column Split */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left 67%: Articles Grid */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                <AnimatePresence mode="popLayout">
                  {currentPosts.map((post) => (
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.25 }}
                      key={post.slug}
                      className="group flex flex-col justify-between p-6 rounded-xl border border-[#E5E5E5] bg-white hover:border-[#FF6200]/40 transition-all duration-300 shadow-sm"
                    >
                      <div>
                        {/* Header Image Gradient Mock */}
                        <div className={`h-40 rounded-lg bg-gradient-to-br ${post.coverGradient} flex flex-col justify-between p-4 mb-4 text-white relative overflow-hidden`}>
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/25 z-10" />
                          <span className="relative z-20 self-start text-[9px] font-mono uppercase bg-black/40 px-2 py-0.5 rounded border border-white/10">
                            {post.categoryLabel}
                          </span>
                          <span className="relative z-20 self-end text-[9px] font-mono">{post.readTime}</span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-[#888898]">{post.date}</span>
                          {post.popular && (
                            <Badge variant="orange" className="text-[8px] px-1.5 py-0.5">Popular</Badge>
                          )}
                        </div>

                        <h3 className="font-display text-lg font-bold text-[#0D0D0D] group-hover:text-[#FF6200] transition-colors mb-2 leading-tight">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-[#5A5A6A] leading-relaxed line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full border border-[#E5E5E5] bg-white overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#0D0D0D]">{post.author}</span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#FF6200] hover:text-[#E55700] transition-colors"
                          data-cursor="hover"
                        >
                          Read <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredPosts.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <span className="text-xs font-mono text-[#888898]">No blog posts match your filter criteria.</span>
                  <Button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    variant="outline"
                    className="py-2 text-xs font-mono"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* SECTION 6 — Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-[#FF6200] text-white"
                            : "border border-[#E5E5E5] text-[#5A5A6A] hover:border-[#FF6200]/40"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 33%: Sidebar */}
            <aside className="lg:col-span-4 flex flex-col gap-10">
              
              {/* Popular Articles Widget */}
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-left">
                <h4 className="font-display text-sm font-bold text-[#0D0D0D] border-b border-[#E5E5E5] pb-3 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#FF6200]" /> Popular Insights
                </h4>
                <div className="flex flex-col gap-4">
                  {popularPosts.map((post) => (
                    <div key={post.slug} className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-[#FF6200] uppercase font-bold">{post.categoryLabel}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-[#0D0D0D] hover:text-[#FF6200] transition-colors leading-tight"
                      >
                        {post.title}
                      </Link>
                      <span className="text-[9px] text-[#888898]">{post.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Categories List Widget */}
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-left">
                <h4 className="font-display text-sm font-bold text-[#0D0D0D] border-b border-[#E5E5E5] pb-3 mb-4">
                  Categories
                </h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => {
                    const count = categoryCounts[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex justify-between items-center w-full text-xs py-1.5 transition-colors ${
                          activeCategory === cat.id
                            ? "font-bold text-[#FF6200]"
                            : "text-[#5A5A6A] hover:text-[#0D0D0D]"
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[9px] text-[#888898]">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Newsletter Block Widget */}
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FF6200]/5 text-left flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-[#FF6200]/10 rounded-bl-full pointer-events-none" />
                <h4 className="font-display text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#FF6200]" /> Operational Newsletters
                </h4>
                <p className="text-xs text-[#5A5A6A] leading-relaxed">
                  Join 300+ founders and CTOs. We share search algorithm updates and frontend optimization blueprints.
                </p>

                <AnimatePresence mode="wait">
                  {!newsletterSubscribed ? (
                    <motion.form
                      key="news-form"
                      onSubmit={handleNewsletterSubmit}
                      className="flex flex-col gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <input
                        type="email"
                        required
                        placeholder="Enter your work email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6200] bg-white"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        className="py-2.5 text-xs font-mono uppercase tracking-wider text-white"
                      >
                        Join Newsletter
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="news-success"
                      className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg font-medium leading-relaxed text-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ✓ Subscription recorded successfully.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
