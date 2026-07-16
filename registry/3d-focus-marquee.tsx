"use client";
import React, { useRef, useMemo } from "react";
import { useAnimationFrame } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface FocusMarqueeProps {
  items: React.ReactNode[];
  speed?: number;
  itemWidth?: number;
  className?: string;
}

export const FocusMarquee3D = ({
  items,
  speed = 1.5,
  itemWidth = 180, // Generous spacing
  className,
}: FocusMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a massive track to ensure seamless infinite looping on ultra-wide screens
  const duplicatedItems = useMemo(() => {
    return [...items, ...items, ...items, ...items, ...items, ...items];
  }, [items]);

  // Total width of exactly one single logical set of items
  const rowWidth = items.length * itemWidth;
  const xPos = useRef(0);

  // Pause state tracking
  const isPaused = useRef(false);
  const pauseTime = useRef(0);

  useAnimationFrame((time, delta) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const centerPoint = containerWidth / 2;
    const children = containerRef.current.children;

    // Check if we are currently paused
    if (isPaused.current) {
      if (time - pauseTime.current > 500) {
        isPaused.current = false;
      }
    }

    if (!isPaused.current) {
      const previousXPos = xPos.current;

      // Move track left dynamically
      // Using delta multiplier to be completely frame-rate independent
      xPos.current -= (speed * delta) / 16;

      // Detect if any item crossed the exact center in this frame
      for (let i = 0; i < children.length; i++) {
        const prevAbsX = previousXPos + (i * itemWidth);
        const currentAbsX = xPos.current + (i * itemWidth);

        // If the item crossed the center point (moving left, so prev > center && current <= center)
        if (prevAbsX > centerPoint && currentAbsX <= centerPoint) {
          // Snap exactly to center
          xPos.current = centerPoint - (i * itemWidth);
          isPaused.current = true;
          pauseTime.current = time;
          break; // One item centered is enough
        }
      }

      // Reset position mathematically when a full original array passes
      if (xPos.current <= -rowWidth) {
        xPos.current += rowWidth;
      }
    }

    // High-performance direct DOM manipulation bypassing React render cycle
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLDivElement;

      // Exact pixel position calculation
      const absoluteX = xPos.current + (i * itemWidth);

      // Physical center of this exact block (now equal to absoluteX because of perfectly centered transform)
      const itemCenter = absoluteX;

      // Distance to the absolute center of the viewport
      const distanceToCenter = Math.abs(centerPoint - itemCenter);

      // Cinematic Depth of Field Math
      const effectRange = centerPoint * 0.8; // Scales effect range based on screen width

      // Scale math: Largest in middle, smaller on edges
      let scale = 1.3 - (distanceToCenter / effectRange) * 0.7;
      if (scale < 0.4) scale = 0.4;
      if (scale > 1.3) scale = 1.3;

      // Opacity math: Brightest in middle, fades into distance
      let opacity = 1 - (distanceToCenter / effectRange) * 0.9;
      if (opacity < 0.2) opacity = 0.2;
      if (opacity > 1) opacity = 1;

      // Apply Native 3D Transforms (Translate X and Y perfectly center the element on absoluteX)
      child.style.transform = `translate(calc(${absoluteX}px - 50%), -50%) scale(${scale})`;
      child.style.opacity = opacity.toString();
      // Z-index calculation to physically stack closer objects on top
      child.style.zIndex = Math.round(scale * 100).toString();
    }
  });

  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden flex items-center", className)}
      style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>

      {/* Central Kinetic Sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primarylw rounded-full z-0 transition-opacity" />

      {/* Cinematic Focusing Brackets */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-300 dark:border-blue-400 rounded-tl-2xl shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-300 dark:border-blue-400 rounded-tr-2xl shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-300 dark:border-blue-400 rounded-bl-2xl shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-300 dark:border-blue-400 rounded-br-2xl shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
      </div>

      {/* High-Performance Marquee Track */}
      <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none w-full h-full">
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="absolute top-1/2 left-0 pointer-events-auto origin-center transition-none will-change-transform">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
