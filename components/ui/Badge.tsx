import React from "react";

interface BadgeProps {
  variant?: "orange" | "dark" | "success" | "violet";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "orange", children, className = "" }: BadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "dark":
        return "bg-[#1A1A1A] text-[#ACACB8] border border-[#2E2E2E]";
      case "success":
        return "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30";
      case "violet":
        return "bg-[#6D28D9]/15 text-[#8B5CF6] border border-[#6D28D9]/30";
      default: // orange
        return "bg-[#FF6200]/15 text-[#FF6200] border border-[#FF6200]/30";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getVariantClasses()} ${className}`}
    >
      {children}
    </span>
  );
}
