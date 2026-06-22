"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Create a spring animation for the scroll progress to make it feel smooth and premium
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[10000] h-[3px] origin-left bg-gradient-to-r from-[#FF6200] to-[#FF8C42]"
      style={{ scaleX }}
    />
  );
}
