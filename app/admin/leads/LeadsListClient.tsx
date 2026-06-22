"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Calendar, Download, Mail, Phone, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "PROPOSAL_SENT" | "CONVERTED" | "LOST" | "SPAM";
  createdAt: string;
}

interface LeadsListClientProps {
  initialLeads: Lead[];
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "NEW", label: "NEW" },
  { value: "CONTACTED", label: "CONTACTED" },
  { value: "IN_PROGRESS", label: "IN PROGRESS" },
  { value: "PROPOSAL_SENT", label: "PROPOSAL SENT" },
  { value: "CONVERTED", label: "CONVERTED" },
  { value: "LOST", label: "LOST" },
  { value: "SPAM", label: "SPAM" }
] as const;

export default function LeadsListClient({ initialLeads }: LeadsListClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const leadsPerPage = 10;

  // Syncing database status updates client-side
  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    // Optimistic state update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (!result.success) {
        alert(result.message || "Failed to update lead status.");
        setLeads(initialLeads); // Revert on failure
      }
    } catch (err) {
      console.error("Lead status update error:", err);
      alert("Network error. Reverting status.");
      setLeads(initialLeads);
    }
  };

  // Client-side filtering
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company || "").toLowerCase().includes(q) ||
        lead.service.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  // Pagination bounds
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Client-side CSV compiler
  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "ServiceRequested", "BudgetTier", "MessageBody", "StatusState", "LoggedTime"];
    const rows = filteredLeads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone || ""}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${l.service}"`,
      `"${l.budget || ""}"`,
      `"${l.message.replace(/\n/g, " ").replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `domain_expansion_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Inbound Lead Briefs</h1>
          <p className="text-xs text-[#888898] mt-1">Review parameters, budget segments, and adjust operational follow-ups.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={filteredLeads.length === 0}
          variant="outline"
          className="text-xs font-mono uppercase tracking-wider py-2.5 px-4 flex items-center gap-2"
        >
          <Download className="h-3.5 w-3.5 text-[#FF6200]" /> Export CSV
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#141414] border border-[#2E2E2E] p-4 rounded-xl">
        {/* Search */}
        <div className="relative flex-grow w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888898]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search leads name, email, company, pillar..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white placeholder-[#888898] focus:outline-none focus:ring-1 focus:ring-[#FF6200] focus:border-[#FF6200] bg-black/40 transition-all"
          />
        </div>

        {/* Dropdown status */}
        <div className="w-full sm:w-48 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white bg-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF6200] cursor-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#141414] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lead Table Panel */}
      <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2E2E2E]/60 text-[#888898] font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Logged Date</th>
                <th className="pb-3 font-semibold">Prospect Details</th>
                <th className="pb-3 font-semibold">Service requested</th>
                <th className="pb-3 font-semibold">Budget & Details</th>
                <th className="pb-3 font-semibold">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]/40 text-[#ACACB8]">
              {currentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/2 transition-colors align-top">
                  {/* Logged Date */}
                  <td className="py-4 font-mono text-[10px] w-28 shrink-0">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#888898]" /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                    <span className="text-[9px] text-[#5A5A6A] mt-1 block">{new Date(lead.createdAt).toLocaleTimeString()}</span>
                  </td>

                  {/* Prospect Details */}
                  <td className="py-4 max-w-xs">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="font-bold text-white text-sm">{lead.name}</span>
                      {lead.company && <span className="text-[10px] text-[#FF8C42] font-mono uppercase">{lead.company}</span>}
                      <span className="flex items-center gap-1 text-[10px] mt-1"><Mail className="h-3 w-3 text-[#5A5A6A]" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1 text-[10px]"><Phone className="h-3 w-3 text-[#5A5A6A]" /> {lead.phone}</span>}
                    </div>
                  </td>

                  {/* Service Requested */}
                  <td className="py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-white">
                        {lead.service.replace(" Expansion", "")}
                      </span>
                    </div>
                  </td>

                  {/* Budget & Details */}
                  <td className="py-4 max-w-sm">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="font-mono text-emerald-500 font-bold">{lead.budget || "Let's Discuss"}</span>
                      <p className="text-[11px] text-[#888898] leading-relaxed mt-1 whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all">
                        {lead.message}
                      </p>
                    </div>
                  </td>

                  {/* Status inline modifier */}
                  <td className="py-4 w-44">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                      className="px-2.5 py-1.5 border border-[#2E2E2E] rounded bg-[#0D0D0D] text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#FF6200] cursor-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="LOST">LOST</option>
                      <option value="SPAM">SPAM</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-mono text-[#5A5A6A]">
                    No leads match your filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-[#2E2E2E]/60">
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
                      : "border border-[#2E2E2E] text-[#ACACB8] hover:border-[#FF6200]/40"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
