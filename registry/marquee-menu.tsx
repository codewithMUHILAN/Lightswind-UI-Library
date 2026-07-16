"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MarqueeMenuItemData {
  /** Display name shown in the menu list */
  name: string;
  /** Image URL shown in the scrolling marquee row */
  src: string;
  /** Image alt text (defaults to name) */
  alt?: string;
}

export interface MarqueeMenuProps {
  /** Items to display — each item gets one row in the menu and one marquee strip */
  items: MarqueeMenuItemData[];
  /** Zero-based index of the initially active item */
  defaultIndex?: number;
  /** Height of each row in pixels (menu row + marquee row are the same height) */
  rowHeight?: number;
  /** Width of each marquee image in pixels */
  imageWidth?: number;
  /** Gap between marquee elements in pixels */
  marqueeGap?: number;
  /** Marquee scroll duration in seconds (lower = faster) */
  marqueeDuration?: number;
  /** How many copies of the strip to render for seamless looping (min 2) */
  copies?: number;
  /** Additional className on the root wrapper */
  className?: string;
  /** Callback fired when the active item changes */
  onSelect?: (index: number, item: MarqueeMenuItemData) => void;
  /** Text alignment of menu labels */
  align?: "left" | "center" | "right";
  /** Whether to show a divider line between rows */
  showDividers?: boolean;
  /** Custom menu item class */
  menuItemClassName?: string;
  /** Marquee panel background colour (Tailwind class) */
  marqueeBg?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: a single infinitely-scrolling strip
// ─────────────────────────────────────────────────────────────────────────────

interface MarqueeRowProps {
  item: MarqueeMenuItemData;
  rowHeight: number;
  imageWidth: number;
  gap: number;
  duration: number;
  copies: number;
}

function MarqueeRow({ item, rowHeight, imageWidth, gap, duration, copies }: MarqueeRowProps) {
  const safeCount = Math.max(2, copies);

  // Render exactly 2 identical sets so the strip is 2× the visible content.
  // The CSS animation translates -50% → back to the start = seamless loop.
  const singleSet = Array.from({ length: safeCount });

  return (
    <div
      className="overflow-hidden w-full"
      style={{ height: rowHeight }}
      aria-hidden="true"
    >
      <div
        className="flex items-center w-max"
        style={{
          height: rowHeight,
          gap,
          paddingLeft: gap,
          animation: `marquee-lw ${duration}s linear infinite`,
        }}
      >
        {/* Two identical sets — .flatMap flattens into a single renderable array */}
        {[0, 1].flatMap((set) =>
          singleSet.map((_, i) => (
            <React.Fragment key={`${set}-${i}`}>
              <span
                className="text-sm sm:text-base font-semibold shrink-0 whitespace-nowrap text-foreground/70"
                style={{ fontFamily: "inherit" }}
              >
                {item.name}
              </span>
              <img
                src={item.src}
                alt={item.alt ?? item.name}
                draggable={false}
                loading="lazy"
                className="shrink-0 object-cover"
                style={{
                  width: imageWidth,
                  height: Math.round(rowHeight * 0.72),
                  aspectRatio: "3 / 1",
                  borderRadius: 9999,
                }}
              />
            </React.Fragment>
          ))
        )}


      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const MarqueeMenu = ({
  items = [],
  defaultIndex = 0,
  rowHeight = 72,
  imageWidth = 140,
  marqueeGap = 40,
  marqueeDuration = 12,
  copies = 4,
  className,
  onSelect,
  align = "center",
  showDividers = true,
  menuItemClassName,
  marqueeBg,
}: MarqueeMenuProps) => {
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, Math.min(defaultIndex, items.length - 1))
  );
  const groupId = useId();
  const total = items.length;

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onSelect?.(index, items[index]);
  };

  // ── Clip-path for the marquee overlay ────────────────────────────────────
  const topPct = (activeIndex / total) * 100;
  const bottomPct = ((activeIndex + 1) / total) * 100;
  const clipPath = `polygon(0 ${topPct}%, 100% ${topPct}%, 100% ${bottomPct}%, 0 ${bottomPct}%)`;

  const alignClass =
    align === "left"
      ? "justify-start text-left"
      : align === "right"
        ? "justify-end text-right"
        : "justify-center text-center";

  if (!items.length) return null;

  return (
    <>
      {/* Keyframe injection — scoped via class to avoid global conflicts */}
      <style>{`
        @keyframes marquee-lw {
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className={cn("relative select-none w-full max-w-lg mx-auto", className)}
        style={{ "--row-h": `${rowHeight}px` } as React.CSSProperties}
      >
        {/* ── MENU LABELS ──────────────────────────────────────────────────── */}
        <div className="relative z-10 w-full">
          {items.map((item, i) => (
            <label
              key={item.name}
              htmlFor={`${groupId}-${i}`}
              className={cn(
                "relative flex items-center cursor-pointer",
                "transition-colors",
                showDividers && "border-b border-border/60 last:border-b-0",
                alignClass,
                menuItemClassName
              )}
              style={{ height: rowHeight }}
            >
              <input
                id={`${groupId}-${i}`}
                type="radio"
                name={groupId}
                value={item.name}
                checked={activeIndex === i}
                onChange={() => handleSelect(i)}
                className="sr-only"
              />
              <motion.span
                className={cn(
                  "text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight transition-colors",
                  activeIndex === i
                    ? "text-foreground"
                    : "text-muted-foreground/60"
                )}
                animate={{ opacity: activeIndex === i ? 1 : 0.45 }}
                transition={{ duration: 0.25 }}
              >
                {item.name}
              </motion.span>
            </label>
          ))}
        </div>

        {/* ── MARQUEE OVERLAY ──────────────────────────────────────────────── */}
        <motion.div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 pointer-events-none z-20",
            marqueeBg ?? "bg-background"
          )}
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
          }}
          animate={{ clipPath }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.55 }}
        >
          {items.map((item) => (
            <MarqueeRow
              key={item.name}
              item={item}
              rowHeight={rowHeight}
              imageWidth={imageWidth}
              gap={marqueeGap}
              duration={marqueeDuration}
              copies={copies}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default MarqueeMenu;
