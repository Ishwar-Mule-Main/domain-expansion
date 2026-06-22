"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";

export interface MediaItem {
  src: string;
  alt: string;
  title: string;
  description?: string;
  aspectRatio?: "square" | "video" | "auto";
}

interface PortfolioMediaGridProps {
  items: MediaItem[];
  columns?: 2 | 3 | 4;
}

export function PortfolioMediaGrid({ items, columns = 3 }: PortfolioMediaGridProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Close lightbox on Escape key and navigate with Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, items]);

  // Helper to extract Brand Name and Image Type from title
  const parseTitle = (title: string) => {
    const cleanTitle = title.replace(/\s*#\d+$/, "");
    const types = [
      "Social Post",
      "Campaign Ad",
      "Valentine Campaign",
      "B2B Post",
      "Post",
      "Wellness",
      "Social Graphic",
      "Event Invite",
      "Lead Gen Ad",
      "Outdoor Banner",
      "Logo Design",
      "Print Collateral Asset",
      "Campaign Landing Page",
      "Paid Ad"
    ];
    for (const t of types) {
      if (cleanTitle.toLowerCase().includes(t.toLowerCase())) {
        const idx = cleanTitle.toLowerCase().indexOf(t.toLowerCase());
        const brand = cleanTitle.substring(0, idx).trim();
        const typeName = cleanTitle.substring(idx).trim();
        return {
          brand: brand || "Domain Expansion",
          type: typeName
        };
      }
    }
    return {
      brand: cleanTitle,
      type: "Creative Design"
    };
  };

  const masonryCols = {
    2: "columns-1 md:columns-2",
    3: "columns-1 sm:columns-2 lg:columns-3",
    4: "columns-1 sm:columns-2 md:columns-3 lg:columns-4",
  }[columns];

  return (
    <div className="w-full">
      {/* Masonry Layout using CSS columns */}
      <div className={`${masonryCols} gap-6 md:gap-8 [column-fill:_balance]`}>
        {items.map((item, idx) => {
          const { brand, type } = parseTitle(item.title);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setSelectedIdx(idx)}
              className="inline-block w-full break-inside-avoid mb-6 md:mb-8 group relative cursor-pointer overflow-hidden rounded-xl border border-[#2E2E2E] bg-[#141414]/40 hover:bg-[#141414] hover:border-[#FF6200]/40 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,98,0,0.06)]"
              data-cursor="hover"
            >
              {/* Natural aspect ratio image wrapper */}
              <div className="relative overflow-hidden bg-[#0D0D0D] w-full">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Premium hover overlay showing Brand Name and Image Type only */}
                <div className="absolute inset-0 bg-[#0D0D0D]/85 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-[9px] font-mono text-[#FF8C42] uppercase tracking-[0.2em] mb-1.5 animate-pulse">
                    {type}
                  </span>
                  <h4 className="font-display text-base md:text-lg font-bold text-white tracking-tight leading-snug px-2 line-clamp-2">
                    {brand}
                  </h4>
                  <div className="mt-4 h-8 w-8 rounded-full bg-[#FF6200] flex items-center justify-center text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0D0D]/95 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 z-[10000] rounded-full bg-[#1A1A1A]/80 p-3 text-[#ACACB8] hover:text-white border border-[#2E2E2E] hover:border-[#FF6200]/40 transition-all shadow-lg"
              data-cursor="hover"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
              }}
              className="absolute left-4 md:left-8 z-[10000] rounded-full bg-[#1A1A1A]/80 p-3 text-[#ACACB8] hover:text-white border border-[#2E2E2E] hover:border-[#FF6200]/40 transition-all shadow-lg"
              data-cursor="hover"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 md:right-8 z-[10000] rounded-full bg-[#1A1A1A]/80 p-3 text-[#ACACB8] hover:text-white border border-[#2E2E2E] hover:border-[#FF6200]/40 transition-all shadow-lg"
              data-cursor="hover"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Visual Image Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-h-[75vh] w-full max-w-5xl aspect-video overflow-hidden rounded-xl border border-[#2E2E2E] shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[selectedIdx].src}
                alt={items[selectedIdx].alt}
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>

            {/* Image Details Caption */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mt-6 text-center max-w-2xl px-4 flex flex-col gap-1.5 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold text-white">
                {items[selectedIdx].title}
              </h3>
              {items[selectedIdx].description && (
                <p className="text-sm text-[#ACACB8] leading-relaxed">
                  {items[selectedIdx].description}
                </p>
              )}
              <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider mt-2">
                Item {selectedIdx + 1} of {items.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
