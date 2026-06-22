"use client";

import { useState, useMemo } from "react";
import { Calendar, Download, Mail, Phone, Search, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface WaitlistEntry {
  id: string;
  email: string;
  role: "AGENCY" | "CLIENT";
  company?: string;
  phone?: string;
  position: number;
  createdAt: string;
}

interface WaitlistClientProps {
  initialWaitlist: WaitlistEntry[];
}

export default function WaitlistClient({ initialWaitlist }: WaitlistClientProps) {
  const [waitlist] = useState<WaitlistEntry[]>(initialWaitlist);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtering
  const filteredList = useMemo(() => {
    return waitlist.filter((w) => {
      const matchesRole = roleFilter === "all" || w.role === roleFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        w.email.toLowerCase().includes(q) ||
        (w.company || "").toLowerCase().includes(q) ||
        (w.phone || "").toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [waitlist, roleFilter, searchQuery]);

  // Pagination bounds
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // CSV Compiler
  const handleExportCSV = () => {
    const headers = ["Position", "Email", "Role", "Company", "Phone", "JoinedTime"];
    const rows = filteredList.map((w) => [
      w.position,
      `"${w.email}"`,
      `"${w.role}"`,
      `"${(w.company || "").replace(/"/g, '""')}"`,
      `"${w.phone || ""}"`,
      `"${new Date(w.createdAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `domain_expansion_techguild_waitlist_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">TechGuild Waitlist Directory</h1>
          <p className="text-xs text-[#888898] mt-1">Review pre-registered agencies and clients queue profiles.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={filteredList.length === 0}
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
            placeholder="Search email, company name, phone..."
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
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white bg-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF6200] cursor-none"
          >
            <option value="all" className="bg-[#141414] text-white">All Roles</option>
            <option value="AGENCY" className="bg-[#141414] text-white">Agencies Only</option>
            <option value="CLIENT" className="bg-[#141414] text-white">Clients Only</option>
          </select>
        </div>
      </div>

      {/* Waitlist Table Panel */}
      <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#2E2E2E]/60 text-[#888898] font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Position</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Market Role</th>
                <th className="pb-3 font-semibold">Company Profile</th>
                <th className="pb-3 font-semibold">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]/40 text-[#ACACB8]">
              {currentItems.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/2 transition-colors align-middle">
                  <td className="py-4 font-mono font-bold text-[#FF8C42] text-sm">
                    #{entry.position}
                  </td>
                  <td className="py-4 font-mono">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[#888898]" /> {entry.email}</span>
                  </td>
                  <td className="py-4">
                    <Badge variant={entry.role === "AGENCY" ? "orange" : "violet"}>
                      {entry.role}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-bold">{entry.company || "—"}</span>
                      {entry.phone && <span className="text-[10px] text-[#888898] flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3 text-[#5A5A6A]" /> {entry.phone}</span>}
                    </div>
                  </td>
                  <td className="py-4 font-mono text-[10px]">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#888898]" /> {new Date(entry.createdAt).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-mono text-[#5A5A6A]">
                    No waitlist entries match your filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
