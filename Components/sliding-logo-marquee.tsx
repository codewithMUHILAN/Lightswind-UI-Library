"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
// Import your actual utility
import { cn } from "../lib/utils"; // Assuming this is your actual path
import { Pause, Play } from "lucide-react";

// --- Interfaces (Kept for completeness) ---
export interface SlidingLogoMarqueeItem {
  id: string;
  content: React.ReactNode;
  href?: string;
}

export interface SlidingLogoMarqueeProps {
  items: SlidingLogoMarqueeItem[];
  speed?: number;
  pauseOnHover?: boolean;
  enableBlur?: boolean;
  blurIntensity?: number;
  height?: string;
  width?: string;
  gap?: string;
  scale?: number;
  direction?: "horizontal" | "vertical";
  autoPlay?: boolean;
  backgroundColor?: string;
  showGridBackground?: boolean;
  className?: string;
  onItemClick?: (item: SlidingLogoMarqueeItem) => void;
  enableSpillEffect?: boolean;
  animationSteps?: number;
  showControls?: boolean;
}

export function SlidingLogoMarquee({
  items,
  speed = 1,
  pauseOnHover = true,
  enableBlur = true,
  blurIntensity = 1,
  height = "100px",
  width = "100%",
  gap = "2rem",
  scale = 1,
  direction = "horizontal",
  autoPlay = true,
  backgroundColor = '!transparent',
  showGridBackground = false,
  className,
  onItemClick,
  enableSpillEffect = false,
  animationSteps = 8,
  showControls = true,
}: SlidingLogoMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // CORE FIX: Duplicating the items for a seamless loop
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  const handleItemClick = (item: SlidingLogoMarqueeItem) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
    onItemClick?.(item);
  };

  const togglePlayState = () => {
    setIsPlaying(!isPlaying);
  };

  const blurDivs = Array.from({ length: animationSteps }, (_, index) => (
    <div key={index} style={{ "--index": index } as React.CSSProperties} className="absolute inset-0 z-[var(--index)]" />
  ));

  const itemRenderer = (item: SlidingLogoMarqueeItem, index: number, isDuplicate: boolean) => (
    <li
      // Use original ID plus index/flag for unique keys
      key={`${item.id}-${index}-${isDuplicate ? 'dup' : 'orig'}`}
      className={cn(
        "sliding-marquee-item text-foreground",
        "grid place-items-center cursor-pointer transition-transform duration-200 ease-in-out",
        "hover:scale-[1.05] focus:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-primary",
        " backdrop-blur-sm",
      )}
      onClick={() => handleItemClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleItemClick(item);
        }
      }}
    >
      <div className="h-4/5 w-auto">{item.content}</div>
    </li>
  );

  return (
    <>
      <style>
        {`
        .sliding-marquee-container {
          --speed: ${speed};
          --gap: ${gap};
          --blur: ${blurIntensity};
          --blurs: ${animationSteps};
          /* Dynamic Duration: Higher speed (e.g., 60) results in a shorter duration */
          /* Use a large fixed distance (e.g., 200vw) divided by speed to control rate */
          --duration: calc(200s / var(--speed)); 
        }

        /* ------------------------------------------------ */
        /* --- CORE INFINITE LOOP FIX: Animating by -50% -- */
        /* ------------------------------------------------ */
        @keyframes marquee-horizontal {
          /* Translates the doubled content by exactly half its length to loop seamlessly */
          from { transform: translateX(0); }
          to { transform: translateX(-50%); } 
        }
        
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }

        .sliding-marquee-list {
          display: flex;
          flex-shrink: 0; 
          min-width: 200%;
          gap: var(--gap);
          height: 100%;
          align-items: center;
          list-style-type: none;
          padding-inline: 0;
          margin: 0;
          pointer-events: auto;
          animation: marquee-horizontal var(--duration) linear infinite paused;
          transform: translateZ(0); /* Add this for mobile GPU layer */
          will-change: transform;    /* Hint browser to optimize for animation */
        }

        /* Conditional Animation based on Direction */
        .sliding-marquee-resizable[data-direction="vertical"] .sliding-marquee-list {
            flex-direction: column;
            min-width: unset;
            min-height: 200%;
            width: 100%;
            animation: marquee-vertical var(--duration) linear infinite paused;
        }


        .sliding-marquee-item {
          /* Ensure item size is well-defined to calculate total list width accurately */
          min-width: clamp(100px, 15vw, 250px); 
          height: 80%;
          aspect-ratio: 16 / 9;
          font-size: clamp(1rem, 1vw + 0.5rem, 2rem);
        }
        
        /* Play State Controls */
        [data-play-state="running"] .sliding-marquee-list {
          animation-play-state: running !important;
        }
        [data-play-state="paused"] .sliding-marquee-list {
          animation-play-state: paused !important;
        }

        /* --- Layout & Effects (Tailwind-Ready/Hybrid) --- */
        .sliding-marquee-resizable {
          overflow: hidden;
          scale: var(--scale);
          width: 100%;
          height: ${height};
          position: relative;
        }

        .sliding-marquee-inner {
          height: 100%;
          width: 100%;
          position: relative;
          mask: linear-gradient(90deg, transparent, black 15% 85%, transparent);
          display: flex; 
          pointer-events: none;
        }

        /* The rest of the blur and spill effect CSS... */
        .sliding-marquee-blur { position: absolute; top: 0; bottom: 0; width: 25%; z-index: 2; pointer-events: none; }
        .sliding-marquee-blur--right { right: 0; }
        .sliding-marquee-blur--left { left: 0; rotate: 180deg; }
        .sliding-marquee-blur div {
            mask: linear-gradient(90deg,
                transparent calc(var(--index) * calc((100 / var(--blurs)) * 1%)),
                black calc((var(--index) + 1) * calc((100 / var(--blurs)) * 1%)),
                black calc((var(--index) + 2) * calc((100 / var(--blurs)) * 1%)),
                transparent calc((var(--index) + 3) * calc((100 / var(--blurs)) * 1%)));
            backdrop-filter: blur(calc((var(--index, 0) * var(--blur, 0)) * 1px));
        }
        .sliding-marquee-resizable[data-spill="true"] { container-type: size; }
        .sliding-marquee-resizable[data-spill="true"] .sliding-marquee-inner::after {
            content: ""; position: fixed; top: 50%; left: 50%; width: calc(var(--scale) * 10000vw); height: calc(var(--scale) * 10000vh);
            pointer-events: none; translate: -50% -50%;
            mask: linear-gradient(white, white) 50% 50% / 100% 100% no-repeat, linear-gradient(white, white) 50% 50% / 100cqi 100cqh no-repeat;
            mask-composite: exclude;
        }
        `}
      </style>

      <div
        ref={containerRef}
        className={cn("sliding-marquee-container relative", className)}
        style={{ width, background: backgroundColor, scale: scale }}
        onMouseEnter={() => pauseOnHover && setIsPlaying(false)}
        onMouseLeave={() => pauseOnHover && setIsPlaying(true)}
      >
        {showGridBackground && (
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="h-full w-full bg-[radial-gradient(#4b5563_1px,transparent_1px)]
             [background-size:16px_16px]"/>
          </div>
        )}

        <div
          className="sliding-marquee-resizable"
          data-direction={direction}
          data-blurring={enableBlur}
          data-play-state={isPlaying ? "running" : "paused"}
          data-spill={enableSpillEffect}
        >
          <div className="sliding-marquee-inner">
            {enableBlur && (
              <div className="sliding-marquee-blur sliding-marquee-blur--left">
                {blurDivs}
              </div>
            )}

            {/* Rendered Items: Original Set + Duplicate Set */}
            <ul className="sliding-marquee-list text-foreground" aria-hidden={false}>
              {items.map((item, index) => itemRenderer(item, index, false))}

              {/* Duplicate is key to the seamless loop */}
              {items.map((item, index) => itemRenderer(item, index, true))}
            </ul>

            {enableBlur && (
              <div className="sliding-marquee-blur sliding-marquee-blur--right">
                {blurDivs}
              </div>
            )}
          </div>
        </div>

        {showControls && (
          <button
            onClick={togglePlayState}
            className={cn(
              "absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-2 text-xs",
              "bg-gray-800/50 text-white",
              "rounded-full hover:bg-gray-700/70 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        )}
      </div>
    </>
  );
}

export default SlidingLogoMarquee;
