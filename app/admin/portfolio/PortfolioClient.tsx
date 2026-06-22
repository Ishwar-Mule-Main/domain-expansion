"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { FolderGit2, ShieldAlert } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  slug: string;
  categories: string[];
  metricHeadline: string;
  published: boolean;
  featured: boolean;
}

interface PortfolioClientProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioClient({ initialItems }: PortfolioClientProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);

  // Syncing database status updates client-side
  const handleToggle = async (itemId: string, field: "published" | "featured", currentValue: boolean) => {
    const newValue = !currentValue;

    // Optimistic state update
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, [field]: newValue } : item))
    );

    try {
      const response = await fetch(`/api/admin/portfolio/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newValue }),
      });

      const result = await response.json();
      if (!result.success) {
        alert(result.message || "Failed to update item.");
        setItems(initialItems); // Revert on failure
      }
    } catch (err) {
      console.error("Portfolio update error:", err);
      alert("Network error. Reverting change.");
      setItems(initialItems);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Title Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Portfolio Visibility controls</h1>
        <p className="text-xs text-[#888898] mt-1">Configure publishing indicators and featured status for marketing pages.</p>
      </div>

      {/* Portfolio Table Panel */}
      <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#2E2E2E]/60 text-[#888898] font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Project Details</th>
                <th className="pb-3 font-semibold">Pillar categories</th>
                <th className="pb-3 font-semibold">Primary Metric</th>
                <th className="pb-3 font-semibold text-center">Published</th>
                <th className="pb-3 text-center font-semibold">Featured status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]/40 text-[#ACACB8]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/2 transition-colors align-middle">
                  <td className="py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-white text-sm">{item.clientName}</span>
                      <span className="text-[10px] text-[#FF8C42] font-mono">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.categories.map((c) => (
                        <span key={c} className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-white/5 border border-white/10 text-white/55">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 font-mono font-bold text-white">
                    {item.metricHeadline}
                  </td>
                  <td className="py-4 text-center">
                    <input
                      type="checkbox"
                      checked={item.published}
                      onChange={() => handleToggle(item.id, "published", item.published)}
                      className="h-4.5 w-4.5 rounded border-[#2E2E2E] bg-black/40 text-[#FF6200] focus:ring-0 cursor-none"
                    />
                  </td>
                  <td className="py-4 text-center">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={() => handleToggle(item.id, "featured", item.featured)}
                      className="h-4.5 w-4.5 rounded border-[#2E2E2E] bg-black/40 text-[#FF6200] focus:ring-0 cursor-none"
                    />
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5A5A6A]">
                    <div className="flex flex-col items-center gap-3">
                      <FolderGit2 className="h-8 w-8 text-[#5A5A6A]" />
                      <span className="font-mono">No portfolio items are currently seeded in the Postgres database.</span>
                    </div>
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
