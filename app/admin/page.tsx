import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { ArrowRight, Database, ShieldAlert, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalLeads = 0;
  let totalWaitlist = 0;
  let conversionRate = "0.0%";
  let recentLeads: any[] = [];
  let databaseError = false;

  try {
    // Fetch statistics from Postgres
    totalLeads = await prisma.lead.count();
    totalWaitlist = await prisma.techGuildWaitlist.count();
    
    const convertedCount = await prisma.lead.count({
      where: { status: "CONVERTED" }
    });
    conversionRate = totalLeads > 0 
      ? ((convertedCount / totalLeads) * 100).toFixed(1) + "%"
      : "0.0%";

    recentLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    });
  } catch (err) {
    console.error("Dashboard database fetch failure:", err);
    databaseError = true;
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">System Operations</h1>
        <p className="text-xs text-[#888898] mt-1">Real-time leads acquisition and TechGuild waitlist directories.</p>
      </div>

      {databaseError && (
        <div className="p-4 rounded-lg bg-[#FF6200]/10 border border-[#FF6200]/20 text-[#FF8C42] text-xs flex gap-3 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>Note: Active database connection offline. Renders fallback static layout. Run Prisma seed tasks to initialize.</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Leads */}
        <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Total Leads Logged</span>
            <span className="font-display text-3xl font-extrabold text-white">{totalLeads}</span>
            <span className="text-[9px] text-[#888898] mt-2">Acquisition lead forms briefs</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-brand-orange/5 border border-brand-orange/10 flex items-center justify-center text-brand-orange">
            <Database className="h-5 w-5 text-[#FF6200]" />
          </div>
        </div>

        {/* Card 2: Waitlist */}
        <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Waitlist Registry</span>
            <span className="font-display text-3xl font-extrabold text-white">{totalWaitlist}</span>
            <span className="text-[9px] text-[#888898] mt-2">Verified agency marketplace signups</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-violet-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Conversion */}
        <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Conversion SLA</span>
            <span className="font-display text-3xl font-extrabold text-[#22C55E]">{conversionRate}</span>
            <span className="text-[9px] text-[#888898] mt-2">Leads converted to active contracts</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Recent Leads Table Panel */}
      <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-base font-bold text-white">Recent Inbound Briefs</h2>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF8C42] hover:text-[#FF6200] transition-colors"
          >
            Review All Leads <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2E2E2E]/60 text-[#888898] font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Contact Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Requested Pillar</th>
                <th className="pb-3 font-semibold">Budget Tier</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]/40 text-[#ACACB8]">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3.5 font-bold text-white">{lead.name}</td>
                  <td className="py-3.5 font-mono">{lead.email}</td>
                  <td className="py-3.5 capitalize">{lead.service.replace(" Expansion", "")}</td>
                  <td className="py-3.5">{lead.budget || "Let's Discuss"}</td>
                  <td className="py-3.5">
                    <Badge variant={lead.status === "NEW" ? "orange" : lead.status === "CONVERTED" ? "success" : "dark"}>
                      {lead.status}
                    </Badge>
                  </td>
                </tr>
              ))}

              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-mono text-[#5A5A6A]">
                    No inbound lead registrations logged in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
