"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [startExpand, setStartExpand] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Lock scroll during loading
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Set a minimum display time of 1.2s for the pulsing animation
    const minTime = setTimeout(() => {
      if (document.readyState === "complete") {
        setLoaded(true);
      } else {
        const handleLoad = () => {
          setLoaded(true);
        };
        window.addEventListener("load", handleLoad);
        return () => {
          window.removeEventListener("load", handleLoad);
        };
      }
    }, 1200);

    return () => {
      clearTimeout(minTime);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      setStartExpand(true);
      // Wait for expansion (850ms) + fade out (600ms) to complete before unmounting
      const hideTime = setTimeout(() => {
        setShowLoader(false);
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }, 1500);
      return () => clearTimeout(hideTime);
    }
  }, [loaded]);

  const dotVariants = {
    pulsing: {
      scale: [0.005, 0.0068, 0.005],
      transition: {
        duration: 1.8,
        ease: "easeInOut" as any,
        repeat: Infinity,
      },
    },
    expanding: {
      scale: 1.15,
      transition: {
        duration: 0.85,
        ease: [0.86, 0, 0.07, 1] as any,
      },
    },
  };

  if (!mounted || !showLoader) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D] overflow-hidden"
      style={{
        opacity: startExpand ? 0 : 1,
        pointerEvents: startExpand ? "none" : "auto",
        transition: "opacity 550ms cubic-bezier(0.25, 1, 0.5, 1)",
        transitionDelay: "700ms", // Wait for the expanding dot to fully cover the viewport
      }}
    >
      <motion.div
        variants={dotVariants}
        animate={startExpand ? "expanding" : "pulsing"}
        className="w-[250vmax] h-[250vmax] rounded-full absolute bg-[radial-gradient(circle,_#FF6200_0%,_#FF6200_82%,_rgba(255,98,0,0.35)_92%,_transparent_100%)]"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      />
    </div>
  );
}
