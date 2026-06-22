import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "service" | "elevated" | "border-glow";
  children: React.ReactNode;
}

export function Card({ variant = "default", children, className = "", ...props }: CardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "service":
        return "bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#FF6200]/50 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,98,0,0.1)] group rounded-xl p-6 md:p-8";
      case "border-glow":
        return "bg-[#0D0D0D] border border-[#2E2E2E] hover:border-brand-orange/30 transition-all duration-300 rounded-xl p-6";
      case "elevated":
        return "bg-[#141414] border border-[#2E2E2E] shadow-2xl rounded-xl p-6";
      default:
        return "bg-[#1A1A1A]/40 border border-[#2E2E2E]/60 rounded-xl p-6";
    }
  };

  return (
    <div className={`overflow-hidden ${getVariantClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
}
