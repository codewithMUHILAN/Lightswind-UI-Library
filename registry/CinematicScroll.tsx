"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicScrollProps {
  children: React.ReactNode;
  className?: string;
  blurLayers?: number;
  blurMax?: number;
  blurSize?: number; // in pixels
  accentColor?: string;
  showScrollbar?: boolean;
}

export const CinematicScroll = ({
  children,
  className,
  blurLayers = 5,
  blurMax = 20,
  blurSize = 80,
  accentColor = "#3b82f6",
  showScrollbar = true,
}: CinematicScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: scrollerRef,
  });

  // Spring smooth progress for the custom bar
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-xl border border-border bg-background",
        className
      )}
      style={{
        "--blur-max": blurMax,
        "--blur-size": blurSize,
        "--accent": accentColor,
      } as React.CSSProperties}
    >
      {/* Top Blur Mask Layers */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden" style={{ height: blurSize }}>
        {[...Array(blurLayers)].map((_, i) => (
          <div
            key={`top-${i}`}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${Math.sin(((blurLayers - (i + 1)) / blurLayers) * Math.PI / 2) * blurMax}px) contrast(1.2) brightness(1.1)`,
              maskImage: `linear-gradient(to bottom, black, transparent ${((i + 1) / blurLayers) * 100}%)`,
              WebkitMaskImage: `linear-gradient(to bottom, black, transparent ${((i + 1) / blurLayers) * 100}%)`,
            }}
          />
        ))}
      </div>

      {/* Bottom Blur Mask Layers */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none overflow-hidden rotate-180" style={{ height: blurSize }}>
        {[...Array(blurLayers)].map((_, i) => (
          <div
            key={`bottom-${i}`}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${Math.sin(((blurLayers - (i + 1)) / blurLayers) * Math.PI / 2) * blurMax}px) contrast(1.2) brightness(1.1)`,
              maskImage: `linear-gradient(to bottom, black, transparent ${((i + 1) / blurLayers) * 100}%)`,
              WebkitMaskImage: `linear-gradient(to bottom, black, transparent ${((i + 1) / blurLayers) * 100}%)`,
            }}
          />
        ))}
      </div>

      {/* Custom Scrollbar */}
      {showScrollbar && (
        <div className="absolute top-2 right-2 bottom-2 w-1.5 z-40 pointer-events-none hidden sm:block">
          <motion.div
            className="w-full rounded-full origin-top"
            style={{
              scaleY,
              height: "100%",
              background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 0 10px ${accentColor}44`,
            }}
          />
        </div>
      )}

      {/* Main Scrollable Content */}
      <div
        ref={scrollerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{ scrollbarWidth: "none" }} // Hide default scrollbar
      >
        <div className="px-6 py-12">
          {children}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CinematicScroll;
