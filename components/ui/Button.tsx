"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  magnetic?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", magnetic = false, className = "", children, ...props }, ref) => {
    // Magnetic mouse positioning springs
    const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
    const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || props.disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - (rect.left + width / 2);
      const mouseY = e.clientY - (rect.top + height / 2);
      x.set(mouseX * 0.35);
      y.set(mouseY * 0.35);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "secondary":
          return "bg-[#1A1A1A] text-white border border-[#2E2E2E] hover:bg-[#222222]";
        case "outline":
          return "bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/5";
        case "text":
          return "bg-transparent text-[#ACACB8] hover:text-white px-0 py-0 rounded-none";
        default: // primary
          return "bg-[#FF6200] text-white hover:bg-[#E55700] shadow-[0_0_20px_rgba(255,98,0,0.15)] hover:shadow-[0_0_25px_rgba(255,98,0,0.3)]";
      }
    };

    const baseClasses =
      "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:ring-offset-2 focus:ring-offset-[#0D0D0D] disabled:pointer-events-none disabled:opacity-50 cursor-none";

    const componentClasses = `${baseClasses} ${getVariantClasses()} ${className}`;

    if (magnetic) {
      return (
        <motion.button
          ref={ref as any}
          style={{ x, y }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileTap={{ scale: 0.96 }}
          className={componentClasses}
          data-cursor="hover"
          {...(props as any)}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={componentClasses} data-cursor="hover" {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
