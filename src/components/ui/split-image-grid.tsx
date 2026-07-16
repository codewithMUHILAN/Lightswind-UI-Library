"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/components/lib/utils";

// --- Types ---

export interface SplitImageTile {
  /** Column index (0-based) — used for stagger grouping */
  col: number;
  /** Left offset in pixels from the grid container origin */
  x: number;
  /** Top offset in pixels from the grid container origin */
  y: number;
}

export interface SplitImageGridProps {
  /** The image URL to split across tiles */
  image: string;
  /** Alt text for screen readers */
  alt?: string;
  /** Additional CSS classes for the outer wrapper */
  className?: string;
  /** Width of each tile in pixels (default: 100) */
  tileWidth?: number;
  /** Height of each tile in pixels (default: 130) */
  tileHeight?: number;
  /** Total width of the image/grid canvas in pixels (default: 430) */
  containerWidth?: number;
  /** Total height of the image/grid canvas in pixels (default: 580) */
  containerHeight?: number;
  /** Border radius for each tile in pixels (default: 16) */
  borderRadius?: number;
  /** Width of the gap/border between tiles in pixels (default: 4) */
  gapSize?: number;
  /**
   * CSS color used for the gap border in light mode.
   * Defaults to "#d0d0d0" (visible gray).
   */
  gapColor?: string;
  /**
   * CSS color used for the gap border in dark mode.
   * Defaults to "#2a2a2a" (dark border, barely visible).
   */
  darkGapColor?: string;
  /** Enable 3D lift hover effect on tiles (default: true) */
  hoverEffect?: boolean;
  /** Play entrance slide-in animation when the component mounts (default: true) */
  animateIn?: boolean;
  /**
   * Custom tile layout. If omitted, a built-in staggered 4-column layout is used.
   * Each tile needs: col (column index), x (pixel offset), y (pixel offset).
   */
  tiles?: SplitImageTile[];
  /**
   * Enable column parallax scroll effect — each column drifts at a different speed (default: true).
   * Uses IntersectionObserver + scroll events (no external lib needed).
   */
  scrollParallax?: boolean;
  /** Overall scale of the component (default: 1) */
  scale?: number;
}

// Built-in staggered 4-column layout (mirrors the original CodePen design)
const DEFAULT_TILES: SplitImageTile[] = [
  // col-0  (2 tiles — tallest offset, balanced look)
  { col: 0, x: 0, y: 190 },
  { col: 0, x: 0, y: 330 },
  // col-1  (4 tiles — starts high)
  { col: 1, x: 110, y: 30 },
  { col: 1, x: 110, y: 170 },
  { col: 1, x: 110, y: 310 },
  { col: 1, x: 110, y: 450 },
  // col-2  (4 tiles — starts at very top)
  { col: 2, x: 220, y: 0 },
  { col: 2, x: 220, y: 140 },
  { col: 2, x: 220, y: 280 },
  { col: 2, x: 220, y: 420 },
  // col-3  (2 tiles — balanced with col-0)
  { col: 3, x: 330, y: 180 },
  { col: 3, x: 330, y: 320 },
];

// Parallax direction per column (px to drift on full scroll through viewport)
const PARALLAX_BY_COL: Record<number, number> = {
  0: -40,
  1: 30,
  2: -20,
  3: 50,
};

export const SplitImageGrid: React.FC<SplitImageGridProps> = ({
  image,
  alt = "Split image grid",
  className,
  tileWidth = 100,
  tileHeight = 130,
  containerWidth = 430,
  containerHeight = 580,
  borderRadius = 16,
  gapSize = 4,
  gapColor = "#d0d0d0",
  darkGapColor = "#2a2a2a",
  hoverEffect = true,
  animateIn = true,
  tiles,
  scrollParallax = true,
  scale = 1,
}) => {
  const activeTiles = tiles && tiles.length > 0 ? tiles : DEFAULT_TILES;
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hover state per tile index
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Entrance animation progress (0 → 1)
  const [mounted, setMounted] = useState(false);

  // Dark mode detection (watches .dark class on <html>)
  const [isDark, setIsDark] = useState(false);

  // Per-column parallax offset (px)
  const [colOffsets, setColOffsets] = useState<Record<number, number>>({
    0: 0, 1: 0, 2: 0, 3: 0,
  });

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Dark mode detector — watches .dark class on <html>
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Scroll-based parallax using IntersectionObserver + scroll event
  useEffect(() => {
    if (!scrollParallax || !wrapperRef.current) return;

    const el = wrapperRef.current;
    let rafId: number;

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress 0 (top of el at bottom of viewport) → 1 (bottom of el at top of viewport)
      const progress = 1 - (rect.bottom / (viewH + rect.height));
      const clamped = Math.max(0, Math.min(1, progress));

      const newOffsets: Record<number, number> = {};
      Object.keys(PARALLAX_BY_COL).forEach((k) => {
        const col = Number(k);
        newOffsets[col] = PARALLAX_BY_COL[col] * clamped;
      });
      setColOffsets(newOffsets);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [scrollParallax]);

  // Stagger delay per tile for entrance animation
  const tileDelay = (index: number) => {
    // Sort by distance from center for "pop from center" feel
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const tile = activeTiles[index];
    const dx = tile.x + tileWidth / 2 - centerX;
    const dy = tile.y + tileHeight / 2 - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return `${(dist / 800) * 0.6}s`;
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative flex items-center justify-center w-full", className)}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: containerWidth * scale,
          height: containerHeight * scale,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {activeTiles.map((tile, idx) => {
          const isHovered = hoveredIdx === idx;
          const parallaxY = colOffsets[tile.col] ?? 0;

          return (
            <div
              key={idx}
              onMouseEnter={() => hoverEffect && setHoveredIdx(idx)}
              onMouseLeave={() => hoverEffect && setHoveredIdx(null)}
              style={{
                position: "absolute",
                left: tile.x,
                top: tile.y,
                width: tileWidth,
                height: tileHeight,
                backgroundImage: `url("${image}")`,
                backgroundSize: `${containerWidth}px ${containerHeight}px`,
                backgroundPosition: `calc(-1 * ${tile.x}px) calc(-1 * ${tile.y}px)`,
                borderRadius: borderRadius,
                border: `${gapSize}px solid ${isDark ? darkGapColor : gapColor}`,
                cursor: "pointer",
                // Theme-aware clay / neumorphic shadows
                boxShadow: isDark
                  ? isHovered
                    ? `10px 10px 28px rgba(0,0,0,0.55), -4px -4px 12px rgba(255,255,255,0.04)`
                    : `6px 6px 18px rgba(0,0,0,0.45), -3px -3px 8px rgba(255,255,255,0.02)`
                  : isHovered
                    ? `20px 20px 40px rgba(0,0,0,0.15), -15px -15px 30px rgba(255,255,255,0.9)`
                    : `15px 15px 30px rgba(0,0,0,0.08), -10px -10px 20px rgba(255,255,255,0.8)`,
                // Entrance animation
                opacity: animateIn ? (mounted ? 1 : 0) : 1,
                transform: `${animateIn && !mounted ? "translateY(80px) scale(0.8)" : `translateY(${parallaxY}px) scale(${isHovered ? 1.08 : 1})`}`,
                transition: animateIn && !mounted
                  ? `opacity 0.7s ease ${tileDelay(idx)}, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${tileDelay(idx)}`
                  : `transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, opacity 0.7s ease`,
                zIndex: isHovered ? 10 : 1,
              }}
            >
              {/* Inset highlight overlay — theme-aware clay inner glow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: borderRadius - gapSize,
                  boxShadow: isDark
                    ? "inset 2px 2px 6px rgba(255,255,255,0.05), inset -2px -2px 6px rgba(0,0,0,0.4)"
                    : "inset 4px 4px 10px rgba(255,255,255,0.6), inset -4px -4px 10px rgba(0,0,0,0.05)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
              {/* Subtle matte overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: borderRadius - gapSize,
                  backdropFilter: "contrast(0.95)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SplitImageGrid;
