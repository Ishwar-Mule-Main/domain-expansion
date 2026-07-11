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
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  RefreshCw,
  Search,
  Globe
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

export default function BlogAgentDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [logs, setLogs] = useState<BlogAgentLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningPillar, setRunningPillar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="h-7 w-7 text-[#FF6200]" /> Blog Agent Operations
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
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Main Pillars Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pil) => {
          const isRunning = runningPillar === pil.id;
          const lastLog = logs.find(l => l.piller === pil.id);
          const totalPostsForPillar = posts.filter(p => p.category === pil.id).length;

          return (
            <div 
              key={pil.id} 
              className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex flex-col justify-between hover:border-[#FF6200]/30 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-[#ACACB8]">
                    {totalPostsForPillar} Articles
                  </span>
                  
                  {lastLog && (
                    <span className="flex items-center gap-1 text-[10px]">
                      {lastLog.status === "SUCCESS" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-500" />
                      )}
                    </span>
                  )}
                </div>

                <div className="text-left mt-2">
                  <h3 className="font-bold text-sm text-white group-hover:text-[#FF6200] transition-colors">{pil.label}</h3>
                  <p className="text-[11px] text-[#888898] leading-relaxed mt-1 min-h-[50px]">{pil.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E2E2E]/60 flex items-center justify-between relative z-10">
                <span className="text-[9px] text-[#5A5A6A] font-mono">
                  {lastLog ? `Last run: ${new Date(lastLog.createdAt).toLocaleDateString()}` : "Never executed"}
                </span>

                <Button
                  disabled={!!runningPillar}
                  onClick={() => triggerAgentRun(pil.id)}
                  className="font-mono text-[10px] tracking-wider uppercase py-1.5 px-3 flex items-center gap-1 bg-[#FF6200]/10 hover:bg-[#FF6200]/20 text-[#FF8C42] border border-[#FF6200]/20 cursor-none"
                >
                  {isRunning ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {isRunning ? "Running" : "Trigger"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Content: Logs Left, Articles Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Logs */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex flex-col gap-6 text-left">
          <div>
            <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-[#FF6200]" /> Agent Run logs
            </h2>
            <p className="text-[11px] text-[#888898] mt-1">Status logs of cron and manual agent executions.</p>
          </div>

          <div className="max-h-[480px] overflow-y-auto flex flex-col gap-3 pr-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 rounded-lg border border-[#2E2E2E]/60 bg-black/20 flex flex-col gap-2 hover:border-[#2E2E2E] transition-all text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white font-mono uppercase text-[10px]">
                    {log.piller}
                  </span>
                  <Badge variant={log.status === "SUCCESS" ? "success" : "dark"} className="text-[9px] font-mono py-0.5">
                    {log.status}
                  </Badge>
                </div>

                {log.status === "SUCCESS" && log.topicSelected && (
                  <p className="text-[#ACACB8] leading-relaxed text-[11px] italic font-medium">
                    &quot;{log.topicSelected}&quot;
                  </p>
                )}

                {log.status === "FAILED" && log.errorMessage && (
                  <p className="text-rose-400 font-mono text-[10px] bg-rose-950/20 p-2 rounded border border-rose-900/30 overflow-x-auto whitespace-pre-wrap">
                    {log.errorMessage}
                  </p>
                )}

                <div className="flex justify-between items-center text-[9px] text-[#5A5A6A] font-mono pt-2 border-t border-[#2E2E2E]/20 mt-1">
                  <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="py-12 text-center text-[#5A5A6A] font-mono">
                No logs recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Articles list */}
        <div className="lg:col-span-7 p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex flex-col gap-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-[#FF6200]" /> dynamic Publications
              </h2>
              <p className="text-[11px] text-[#888898] mt-1">Dynamic articles created by the agent and registered to the sitemap.</p>
            </div>
            
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#888898]">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search generated blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#2E2E2E] rounded-md text-[11px] text-white placeholder-[#888898] bg-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF6200]"
              />
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto flex flex-col gap-4 pr-1">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-4 rounded-lg border border-[#2E2E2E]/60 bg-black/20 hover:border-[#FF6200]/20 hover:bg-black/40 transition-all flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-[#FF6200]/10 border border-[#FF6200]/20 text-[#FF8C42]">
                      {post.category}
                    </span>
                    <span className="text-[9px] text-[#5A5A6A] font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date} · {post.readTime}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white leading-snug">{post.title}</h4>
                  <p className="text-[11px] text-[#888898] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#2E2E2E]/40 mt-1">
                  <span className="text-[9px] font-mono text-[#5A5A6A] flex items-center gap-1">
                    <Globe className="h-3 w-3 text-emerald-500" /> Dynamic URL indexed in Sitemap.xml
                  </span>
                  
                  <Link 
                    href={`/blog/${post.slug}`} 
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF8C42] hover:text-[#FF6200] transition-colors"
                  >
                    View Post <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="py-12 text-center text-[#5A5A6A] font-mono">
                No generated posts match your query.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
