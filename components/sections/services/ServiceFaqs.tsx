"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface ServiceFaqsProps {
  faqs: FaqItem[];
}

export function ServiceFaqs({ faqs }: ServiceFaqsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 text-left max-w-3xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = activeIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-xl border border-[#2E2E2E] bg-[#141414]/40 hover:bg-[#141414] transition-all duration-200 overflow-hidden"
          >
            <button
              onClick={() => setActiveIndex(isOpen ? null : idx)}
              className="flex justify-between items-center w-full p-5 font-display text-sm font-bold text-white hover:text-brand-orange text-left"
            >
              <span>{faq.q}</span>
              <span className="text-brand-orange shrink-0 ml-4">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-1 text-xs text-[#ACACB8] leading-relaxed border-t border-[#2E2E2E]/60">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
