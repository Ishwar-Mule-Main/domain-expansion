"use client";

import { motion } from "framer-motion";

export function WhatsAppButton() {
  const arattaiUrl = "https://aratt.ai/user/@ishwarmule";

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center justify-end">
      {/* Tooltip on hover */}
      <div className="group relative">
        <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 rounded bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap border border-[#2E2E2E]">
          Chat on Arattai
          <div className="absolute left-full top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#1A1A1A] border-r border-t border-[#2E2E2E]" />
        </div>

        {/* Pulsing ring animation backdrop */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-brand-orange"
        />

        {/* Action Button */}
        <motion.a
          href={arattaiUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6200] to-[#8B5CF6] text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-[#0D0D0D]"
          aria-label="Contact us on Arattai"
        >
          {/* Message Square SVG Icon */}
          <svg
            className="h-6 w-6 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
