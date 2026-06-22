"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [cursorType, setCursorType] = useState<"default" | "hover" | "media" | "drag">("default");
  
  // Position of the actual mouse cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Damped spring values for the lagging outer ring
  const ringX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  // Quick spring values for the inner dot
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 35 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 35 });

  useEffect(() => {
    // Only enable on desktop/devices with a fine pointer (mouse)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Find the closest parent with a data-cursor attribute
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("[data-cursor]") as HTMLElement | null;

      if (interactiveEl) {
        const type = interactiveEl.getAttribute("data-cursor-type") || "hover";
        const text = interactiveEl.getAttribute("data-cursor") || "";
        
        setCursorType(type as any);
        setCursorText(text);
      } else {
        setCursorType("default");
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  // Class mapping for different cursor states
  const getRingClassName = () => {
    switch (cursorType) {
      case "hover":
        return "h-14 w-14 border-[#FF6200] bg-[#FF6200]/10";
      case "media":
        return "h-16 w-16 border-white mix-blend-difference bg-white";
      case "drag":
        return "h-12 w-20 border-[#6D28D9] bg-[#6D28D9]/10 rounded-full";
      default:
        return "h-8 w-8 border-[#FF6200] bg-transparent";
    }
  };

  return (
    <>
      {/* Outer Lagging Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out ${getRingClassName()}`}
      >
        {cursorText && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF6200] mix-blend-normal">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner precise dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[#FF6200] transition-transform duration-200"
      />
    </>
  );
}
