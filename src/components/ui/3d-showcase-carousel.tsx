"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/components/lib/utils";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";

export interface ShowcaseCard {
  name: string;
  image: string;
  price?: string;
  type?: string;
  tech?: string[];
  desc?: string;
  link?: string;
  published?: string;
}

export interface ThreeDShowcaseCarouselProps {
  className?: string;
  items?: ShowcaseCard[];
  title?: string;
  bgTransparent?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number; // duration of one full rotation in seconds
  interactiveMouse?: boolean;
  radiusOffset?: number; // Adjust cylinder radius multiplier (default 65px)
  scale?: number; // Cylinder scale factor (default 1.2)
}

export const ThreeDShowcaseCarousel: React.FC<ThreeDShowcaseCarouselProps> = ({
  className,
  items,
  title = "PRODUCTS",
  bgTransparent = true,
  autoplay = true,
  autoplaySpeed,
  interactiveMouse = true,
  radiusOffset = 65,
  scale = 1.2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Use refs for tilt to avoid re-renders on every mouse move
  const tiltRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const isAnimatingTilt = useRef(false);

  const [clickedItem, setClickedItem] = useState<ShowcaseCard | null>(null);
  const [hovered, setHovered] = useState(false);

  const defaultItems: ShowcaseCard[] = [
    {
      name: "Vitamin C Glow Serum",
      price: "$39.00",
      type: "Brightening Treatment",
      tech: ["vit-c", "ha", "ferulic"],
      desc: "High-potency 15% Vitamin C complex designed to illuminate skin tone, fade dark spots, and neutralize free radical damage.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      link: "https://dermalhealth.store/",
      published: "Morning routine",
    },
    {
      name: "Hyaluronic Acid Hydrator",
      price: "$29.00",
      type: "Moisture Gel Cream",
      tech: ["ha", "b5", "ceramides"],
      desc: "Multi-molecular weight hyaluronic acid infusing deep hydration across skin layers while reinforcing the moisture barrier.",
      image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80",
      link: "https://dermalhealth.store/",
      published: "Morning & Night",
    },
    {
      name: "Retinol Repair Oil",
      price: "$49.00",
      type: "Overnight Treatment",
      tech: ["retinol", "squalane", "rosehip"],
      desc: "Advanced 1% pure retinol in squalane base to visibly reduce fine lines, refine pore structure, and accelerate skin renewal.",
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      link: "https://dermalhealth.store/",
      published: "Night routine",
    },
    {
      name: "Niacinamide Pore Serum",
      price: "$24.00",
      type: "Barrier Support",
      tech: ["nia10", "zinc1", "green-tea"],
      desc: "Clinical strength 10% Niacinamide and 1% Zinc PCA to regulate sebum production, minimize large pores, and calm breakouts.",
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      link: "https://dermalhealth.store/",
      published: "Morning & Night",
    },
    {
      name: "Ceramide Barrier Balm",
      price: "$34.00",
      type: "Recovery Cream",
      tech: ["ceramides", "panthenol", "cica"],
      desc: "Intensive recovery cream with 5 essential ceramides and Centella Asiatica to restore dry, compromised skin barriers.",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80",
      link: "https://dermalhealth.store/",
      published: "Night routine",
    },
  ];

  const activeItems = items && items.length > 0 ? items : defaultItems;
  const count = activeItems.length;

  // Apply tilt directly to the DOM via RAF — zero React re-renders
  const applyTilt = useCallback(() => {
    if (!ringRef.current) return;
    const { x, y } = tiltRef.current;
    ringRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }, []);

  useEffect(() => {
    if (!interactiveMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      tiltRef.current = {
        x: -(y / (rect.height / 2)) * 15,
        y: (x / (rect.width / 2)) * 15,
      };

      if (!isAnimatingTilt.current) {
        isAnimatingTilt.current = true;
        rafRef.current = requestAnimationFrame(() => {
          applyTilt();
          isAnimatingTilt.current = false;
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [interactiveMouse, applyTilt]);

  // Snap tilt back on mouse leave
  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = false;
    setHovered(false);
    tiltRef.current = { x: 0, y: 0 };
    applyTilt();
  }, [applyTilt]);

  const handleMouseEnter = useCallback(() => {
    hoveredRef.current = true;
    setHovered(true);
  }, []);

  const handleTileClick = useCallback((item: ShowcaseCard) => {
    setClickedItem(prev => prev?.name === item.name ? null : item);
  }, []);

  const getTechIconUrl = (techKey: string) => {
    if (techKey.startsWith("http://") || techKey.startsWith("https://")) {
      return techKey;
    }
    return `https://cdn.shopify.com/s/files/1/0614/4727/4655/files/${techKey}-w.svg`;
  };

  const animationDuration = autoplaySpeed || count * 3;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-[420px] md:min-h-[480px] overflow-hidden flex flex-col items-center justify-center select-none font-sans",
        bgTransparent
          ? "bg-transparent"
          : "bg-radial-gradient(circle_at_bottom_center,_#3c3c3c,_#070707) dark:bg-zinc-950",
        className
      )}
      style={{
        perspective: `${count * 80}px`,
        perspectiveOrigin: "center 45%",
      }}
    >
      {/* Static Tile Detail Overlay (Magnified Modal) */}
      <div
        className={cn(
          "absolute z-30 w-[300px] md:w-[360px] p-5 rounded-[24px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/40 shadow-2xl transition-[transform,opacity] duration-500 flex flex-col justify-between",
          clickedItem ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          transform: clickedItem ? "translateY(-40px) scale(1.08)" : "translateY(0) scale(0.6)",
          willChange: "transform, opacity",
        }}
      >
        {clickedItem && (
          <div className="flex flex-col h-full text-zinc-800 dark:text-white">
            {/* Header info */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                  {clickedItem.name}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
                  {clickedItem.type}
                </span>
              </div>
              <button
                onClick={() => setClickedItem(null)}
                className="p-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image section */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-zinc-200 dark:border-zinc-800">
              <img
                src={clickedItem.image}
                alt={clickedItem.name}
                className="w-full h-full object-cover p-2"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Description */}
            {clickedItem.desc && (
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                {clickedItem.desc}
              </p>
            )}

            {/* Tech badges */}
            {clickedItem.tech && clickedItem.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mr-1">
                  Actives:
                </span>
                {clickedItem.tech?.map((t, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[8px] font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/30 flex items-center justify-center min-w-[24px]"
                    title={t}
                  >
                    <span className="uppercase text-[8px] tracking-wide">{t}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Footer detail */}
            <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                Time: {clickedItem.published || "Daily"}
              </span>
              {clickedItem.link && (
                <Link
                  href={clickedItem.link}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  Shop <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3D Rotating cylinder Ring */}
      <div
        ref={ringRef}
        className={cn(
          "relative z-10 w-[240px] h-[340px] [transform-style:preserve-3d] select-none"
        )}
        style={{
          transform: "rotateX(0deg) rotateY(0deg)",
          animation:
            autoplay && !hovered && !clickedItem
              ? `showcase-rotate ${animationDuration}s linear infinite`
              : "none",
          scale: scale,
          willChange: "transform",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {activeItems.map((item, index) => {
          const isClicked = clickedItem?.name === item.name;
          const isAnyClicked = clickedItem !== null;

          return (
            <div
              key={index}
              className={cn(
                "absolute top-0 left-0 w-full h-full [backface-visibility:hidden] [transform-style:preserve-3d] cursor-pointer origin-center",
                isClicked && "pointer-events-auto",
                isAnyClicked && !isClicked && "pointer-events-none"
              )}
              style={{
                transform: `rotateY(${(index * 360) / count}deg) translateZ(-${count * radiusOffset}px)`,
                opacity: isAnyClicked && !isClicked ? 0.2 : 1,
                scale: isClicked ? "1.05" : isAnyClicked ? "0.95" : "1",
                transition: "opacity 0.5s ease, scale 0.5s ease",
                willChange: "transform",
              }}
              onClick={() => handleTileClick(item)}
            >
              {/* Card Container */}
              <div className="w-[240px] h-[340px] rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/60 overflow-hidden flex flex-col text-zinc-800 dark:text-white shadow-xl">
                {/* Full-bleed product image */}
                <div className="relative w-full flex-1 p-2 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Bottom info strip */}
                <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/50 shrink-0">
                  <h4 className="text-[11px] font-bold tracking-tight leading-tight text-zinc-800 dark:text-zinc-100 truncate max-w-[140px]">
                    {item.name}
                  </h4>
                  {item.price && (
                    <span className="text-[12px] font-black text-zinc-900 dark:text-white ml-2 shrink-0">
                      {item.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cylinder rotating keyframe styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes showcase-rotate {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to   { transform: rotateX(0deg) rotateY(360deg); }
        }
      `}} />
    </div>
  );
};

export default ThreeDShowcaseCarousel;
