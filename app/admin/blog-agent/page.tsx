"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, 
  Clock, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  RefreshCw,
  Search,
  Globe,
  Plus,
  Trash2,
  BookOpen,
  Newspaper
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  date: string;
  readTime: string;
  featuredImage?: string;
  createdAt: string;
}

interface BlogAgentLog {
  id: string;
  piller: string;
  status: string;
  topicSelected?: string;
  errorMessage?: string;
  createdAt: string;
}

interface SitemapUrl {
  id: string;
  url: string;
  changeFrequency: string;
  priority: number;
  createdAt: string;
}

export default function BlogAgentDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "articles" | "sitemap" | "logs">("overview");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [logs, setLogs] = useState<BlogAgentLog[]>([]);
  const [sitemaps, setSitemaps] = useState<SitemapUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningPillar, setRunningPillar] = useState<string | null>(null);
  
  // Search & Filter state
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>("");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>("all");
  
  // Custom Sitemap registration form
  const [newSitemapUrl, setNewSitemapUrl] = useState<string>("");
  const [sitemapFreq, setSitemapFreq] = useState<string>("weekly");
  const [sitemapPriority, setSitemapPriority] = useState<number>(0.6);
  const [registeringSitemap, setRegisteringSitemap] = useState<boolean>(false);

  const pillars = [
    { id: "marketing", label: "Marketing Expansion", desc: "SEO, GEO, search engine authority content and paid strategy." },
    { id: "development", label: "Development Expansion", desc: "Next.js, system design, high-speed API engineering." },
    { id: "design", label: "Design Expansion", desc: "Premium styling systems, brand guidelines, UI/UX." },
    { id: "ai", label: "AI Expansion", desc: "LLM grounding, automated workflows, custom voice agents." }
  ];

  async function loadHistory() {
    try {
      const res = await fetch("/api/admin/blog/history");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setLogs(data.logs || []);
        setSitemaps(data.sitemaps || []);
      }
    } catch (err) {
      console.error("Failed to load blog agent history:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const triggerAgentRun = async (pillar: string) => {
    setRunningPillar(pillar);
    try {
      const res = await fetch("/api/admin/blog/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillar }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully generated blog article: "${data.post.title}"!`);
        await loadHistory();
      } else {
        alert(`Failed to run blog agent: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error triggering agent: ${err.message || String(err)}`);
    } finally {
      setRunningPillar(null);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? It will also be removed from the dynamic sitemap.")) return;
    try {
      const res = await fetch(`/api/admin/blog/history?type=post&id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Blog post successfully deleted.");
        await loadHistory();
      } else {
        alert(`Failed to delete blog post: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error deleting blog post: ${err.message || String(err)}`);
    }
  };

  const deleteAgentLog = async (id: string) => {
    if (!confirm("Delete this log entry?")) return;
    try {
      const res = await fetch(`/api/admin/blog/history?type=log&id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await loadHistory();
      } else {
        alert(`Failed to delete log: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error deleting log: ${err.message || String(err)}`);
    }
  };

  const clearAllLogs = async () => {
    if (!confirm("Are you sure you want to clear the entire agent run logs history?")) return;
    try {
      const res = await fetch("/api/admin/blog/history?type=all-logs", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("All history logs cleared.");
        await loadHistory();
      } else {
        alert(`Failed to clear logs: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error clearing logs: ${err.message || String(err)}`);
    }
  };

  const registerCustomSitemap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSitemapUrl) return;
    setRegisteringSitemap(true);
    try {
      const res = await fetch("/api/admin/sitemap/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newSitemapUrl,
          changeFrequency: sitemapFreq,
          priority: sitemapPriority
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Successfully registered custom URL in dynamic sitemap!");
        setNewSitemapUrl("");
        await loadHistory();
      } else {
        alert(`Failed to register URL: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error registering URL: ${err.message || String(err)}`);
    } finally {
      setRegisteringSitemap(false);
    }
  };

  const deleteSitemapUrl = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route from the sitemap?")) return;
    try {
      const res = await fetch(`/api/admin/sitemap/register?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Route removed from dynamic sitemap.");
        await loadHistory();
      } else {
        alert(`Failed to remove route: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error removing route: ${err.message || String(err)}`);
    }
  };

  // Filtered Posts
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                          p.slug.toLowerCase().includes(blogSearchQuery.toLowerCase());
    const matchesCategory = blogCategoryFilter === "all" || p.category === blogCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 text-left w-full">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-[#FF6200]" /> Blog AI & Sitemap Agent
          </h1>
          <p className="text-xs text-[#888898] mt-1">Autonomous content research, write-up syntheses, and sitemap registration agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="orange" className="font-mono text-[9px] py-1 px-2.5 flex items-center gap-1.5 bg-[#FF6200]/10 border border-[#FF6200]/20">
            <Clock className="h-3 w-3 text-[#FF6200]" /> Scheduled daily at 9:00 AM IST
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => { setLoading(true); loadHistory(); }}
            className="flex items-center gap-1.5 text-xs font-mono uppercase py-1.5 px-3"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#2E2E2E] bg-[#141414]">
          <span className="text-[10px] font-mono text-[#ACACB8] uppercase tracking-wider block">Total Dynamic Articles</span>
          <span className="text-3xl font-display font-bold text-white mt-1 block">{posts.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-[#2E2E2E] bg-[#141414]">
          <span className="text-[10px] font-mono text-[#ACACB8] uppercase tracking-wider block">Indexed Sitemap Paths</span>
          <span className="text-3xl font-display font-bold text-[#FF8C42] mt-1 block">{sitemaps.length}</span>
        </div>
        <div className="p-4 rounded-xl border border-[#2E2E2E] bg-[#141414]">
          <span className="text-[10px] font-mono text-[#ACACB8] uppercase tracking-wider block">Last Run Status</span>
          <span className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
            {logs.length > 0 ? (
              logs[0].status === "SUCCESS" ? (
                <>
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#22C55E]" />
                  <span className="text-[#22C55E]">SUCCESS ({logs[0].piller})</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4.5 w-4.5 text-red-500" />
                  <span className="text-red-500">FAILED ({logs[0].piller})</span>
                </>
              )
            ) : (
              <span className="text-[#888898] italic">NO LOGS AVAILABLE</span>
            )}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-[#2E2E2E] bg-[#141414]">
          <span className="text-[10px] font-mono text-[#ACACB8] uppercase tracking-wider block">Auto-Pilot Cron Scheduler</span>
          <span className="text-sm font-bold text-[#22C55E] mt-2 flex items-center gap-1.5 uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse"></span> Active
          </span>
        </div>
      </div>

      {/* Tabs Control Row */}
      <div className="flex border-b border-[#2E2E2E]">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "border-[#FF6200] text-white bg-white/5"
              : "border-transparent text-[#ACACB8] hover:text-white"
          }`}
        >
          <Cpu className="h-4 w-4" /> Overview & Triggers
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "articles"
              ? "border-[#FF6200] text-white bg-white/5"
              : "border-transparent text-[#ACACB8] hover:text-white"
          }`}
        >
          <BookOpen className="h-4 w-4" /> Generated Articles ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("sitemap")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "sitemap"
              ? "border-[#FF6200] text-white bg-white/5"
              : "border-transparent text-[#ACACB8] hover:text-white"
          }`}
        >
          <Globe className="h-4 w-4" /> Sitemap Manager ({sitemaps.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "logs"
              ? "border-[#FF6200] text-white bg-white/5"
              : "border-transparent text-[#ACACB8] hover:text-white"
          }`}
        >
          <Clock className="h-4 w-4" /> Agent Run History ({logs.length})
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#888898]">
          <RefreshCw className="h-8 w-8 animate-spin text-[#FF6200] mb-3" />
          <span className="font-mono text-xs uppercase tracking-widest">Loading Dashboard Data...</span>
        </div>
      ) : (
        <div className="w-full">
          {/* TAB 1: OVERVIEW & TRIGGERS */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
                <h3 className="text-sm font-mono uppercase text-white font-bold tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FF6200]" /> Grounded Multi-Pillar Research Engine
                </h3>
                <p className="text-xs text-[#ACACB8] leading-relaxed max-w-4xl">
                  Our autonomous blogging system loops over your services pillars to perform search-grounded news lookup using Gemini 2.0 Flash. It filters out common bot-like copywriting patterns, ensures opinionated human-practitioner expert insights (complying with the Google E-E-A-T framework), embeds dynamically generated Pollinations AI media headers, constructs dynamic JSON-LD schemas, and auto-registers URLs to the sitemap tree indexer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillars.map((pil) => {
                  const isRunning = runningPillar === pil.id;
                  const count = posts.filter(p => p.category === pil.id).length;
                  return (
                    <div 
                      key={pil.id} 
                      className="p-5 rounded-xl border border-[#2E2E2E] bg-[#141414] hover:border-[#FF6200]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="orange" className="font-mono text-[9px]">
                            {count} {count === 1 ? "article" : "articles"}
                          </Badge>
                          <span className="text-[10px] font-mono text-[#888898] uppercase">Pillar</span>
                        </div>
                        <h4 className="font-display font-bold text-white text-base mb-1">{pil.label}</h4>
                        <p className="text-xs text-[#ACACB8] leading-relaxed mb-6">{pil.desc}</p>
                      </div>

                      <Button
                        disabled={!!runningPillar}
                        onClick={() => triggerAgentRun(pil.id)}
                        className="w-full font-mono text-xs tracking-wider uppercase py-2 flex items-center justify-center gap-1.5 bg-[#FF6200]/10 hover:bg-[#FF6200]/20 text-[#FF8C42] border border-[#FF6200]/20 cursor-none"
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Running Research...
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Run AI Generator
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GENERATED ARTICLES */}
          {activeTab === "articles" && (
            <div className="flex flex-col gap-6">
              {/* Search & Filter bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#141414] border border-[#2E2E2E] p-4 rounded-xl">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888898]" />
                  <input
                    type="text"
                    value={blogSearchQuery}
                    onChange={(e) => setBlogSearchQuery(e.target.value)}
                    placeholder="Search articles by title, slug, summary..."
                    className="w-full pl-9 pr-4 py-2 bg-black/40 border border-[#2E2E2E] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6200] transition-colors"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={blogCategoryFilter}
                    onChange={(e) => setBlogCategoryFilter(e.target.value)}
                    className="bg-[#141414] text-xs text-white border border-[#2E2E2E] py-2 px-3 rounded-lg focus:outline-none focus:border-[#FF6200] transition-colors"
                  >
                    <option value="all">All Service Pillars</option>
                    <option value="marketing">Marketing</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="ai">AI & Automation</option>
                  </select>
                </div>
              </div>

              {/* Articles list */}
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center border border-[#2E2E2E] border-dashed rounded-xl text-[#888898]">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono">No dynamically generated articles found matching criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#2E2E2E] rounded-xl bg-[#141414]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#2E2E2E] bg-black/20 text-[#888898] font-mono uppercase tracking-wider text-[10px]">
                        <th className="p-4">Cover Image</th>
                        <th className="p-4">Title & Slug</th>
                        <th className="p-4">Pillar Category</th>
                        <th className="p-4">Read Time</th>
                        <th className="p-4">Creation Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2E2E2E]/60">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            {post.featuredImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={post.featuredImage} 
                                alt={post.title} 
                                className="h-10 w-16 object-cover rounded border border-[#2E2E2E]"
                              />
                            ) : (
                              <div className="h-10 w-16 rounded bg-gradient-to-br from-[#FF6200]/20 to-[#6D28D9]/20 border border-[#2E2E2E]" />
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            <span className="font-bold text-white block mb-0.5">{post.title}</span>
                            <span className="font-mono text-[9px] text-[#888898] tracking-tight block">/blog/{post.slug}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant={post.category === "ai" ? "violet" : "orange"} className="text-[9px]">
                              {post.categoryLabel}
                            </Badge>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-[#ACACB8]">
                            {post.readTime}
                          </td>
                          <td className="p-4 font-mono text-[10px] text-[#ACACB8]">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-1.5 rounded border border-[#2E2E2E] bg-black/20 text-[#ACACB8] hover:text-white hover:border-[#FF6200] transition-all"
                                title="View Live Blog Post"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => deleteBlogPost(post.id)}
                                className="p-1.5 rounded border border-[#2E2E2E] bg-black/20 text-red-400 hover:text-red-300 hover:border-red-500/50 hover:bg-red-950/20 transition-all"
                                title="Delete Blog Post"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SITEMAP MANAGER */}
          {activeTab === "sitemap" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Manual Form */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-[#2E2E2E] bg-[#141414] text-left flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-mono uppercase text-white font-bold tracking-wider flex items-center gap-1.5">
                    <Globe className="h-4.5 w-4.5 text-[#FF6200]" /> Manual Indexing
                  </h3>
                  <p className="text-[10px] text-[#888898] mt-1">Register dynamic page URLs into sitemap.xml dynamically.</p>
                </div>

                <form onSubmit={registerCustomSitemap} className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase text-[#ACACB8] font-bold">Relative Path URL</label>
                    <input
                      type="text"
                      required
                      value={newSitemapUrl}
                      onChange={(e) => setNewSitemapUrl(e.target.value)}
                      placeholder="e.g. /blog/dynamic-article-slug"
                      className="p-2.5 bg-black/40 border border-[#2E2E2E] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#FF6200]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase text-[#ACACB8] font-bold">Change Frequency</label>
                    <select
                      value={sitemapFreq}
                      onChange={(e) => setSitemapFreq(e.target.value)}
                      className="p-2.5 bg-[#141414] border border-[#2E2E2E] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#FF6200]"
                    >
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase text-[#ACACB8] font-bold">Priority ({sitemapPriority})</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={sitemapPriority}
                      onChange={(e) => setSitemapPriority(Number(e.target.value))}
                      className="w-full accent-[#FF6200]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={registeringSitemap}
                    className="w-full font-mono text-xs tracking-wider uppercase py-2.5 flex items-center justify-center gap-1.5 bg-[#FF6200] hover:bg-[#E55700] text-white border-transparent cursor-none mt-2"
                  >
                    {registeringSitemap ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Register Url
                  </Button>
                </form>
              </div>

              {/* Right Column: Sitemap URL Table */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="overflow-x-auto border border-[#2E2E2E] rounded-xl bg-[#141414]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#2E2E2E] bg-black/20 text-[#888898] font-mono uppercase tracking-wider text-[10px]">
                        <th className="p-4">URL path</th>
                        <th className="p-4">Freq</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2E2E2E]/60 font-mono text-[11px]">
                      {sitemaps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#888898] italic">
                            No custom database URLs registered in dynamic sitemap yet.
                          </td>
                        </tr>
                      ) : (
                        sitemaps.map((item) => (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-bold">{item.url}</td>
                            <td className="p-4 text-[#ACACB8]">{item.changeFrequency}</td>
                            <td className="p-4 text-[#FF8C42]">{item.priority}</td>
                            <td className="p-4 text-[#888898]">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => deleteSitemapUrl(item.id)}
                                className="p-1.5 rounded border border-[#2E2E2E] bg-black/20 text-red-400 hover:text-red-300 hover:border-red-500/50 hover:bg-red-950/20 transition-all"
                                title="Remove Route from Sitemap"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AGENT RUN LOGS */}
          {activeTab === "logs" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#888898] uppercase">Showing last 50 execution outputs</span>
                <Button
                  onClick={clearAllLogs}
                  disabled={logs.length === 0}
                  className="font-mono text-[10px] tracking-wider uppercase py-1.5 px-3 bg-red-950/30 hover:bg-red-950/50 text-red-400 border border-red-950/60 cursor-none flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear Run History Logs
                </Button>
              </div>

              <div className="flex flex-col gap-3 pr-1 max-h-[600px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="p-12 text-center border border-[#2E2E2E] border-dashed rounded-xl text-[#888898]">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-mono">No execution logs found.</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-4 rounded-lg border border-[#2E2E2E]/60 bg-black/20 flex flex-col gap-2 hover:border-[#2E2E2E] transition-all text-xs text-left"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white font-mono uppercase text-[10px]">
                          {log.piller}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-[#888898]">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                          <Badge variant={log.status === "SUCCESS" ? "success" : "dark"} className="text-[9px] font-mono py-0.5">
                            {log.status}
                          </Badge>
                          <button
                            onClick={() => deleteAgentLog(log.id)}
                            className="text-[#888898] hover:text-red-400 p-0.5 rounded hover:bg-white/5 transition-all ml-1.5"
                            title="Delete Log Entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {log.status === "SUCCESS" && log.topicSelected && (
                        <p className="text-[#ACACB8] leading-relaxed text-[11px] italic font-medium">
                          &quot;{log.topicSelected}&quot;
                        </p>
                      )}

                      {log.status === "FAILED" && log.errorMessage && (
                        <div className="mt-1 p-2.5 rounded bg-red-950/15 border border-red-500/10 text-[10px] font-mono text-red-400 leading-relaxed whitespace-pre-wrap">
                          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px] mb-1">
                            <AlertCircle className="h-3.5 w-3.5" /> Failure Trace:
                          </div>
                          {log.errorMessage}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
