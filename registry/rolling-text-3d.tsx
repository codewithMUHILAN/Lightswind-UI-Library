"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/components/lib/utils";

interface RollingText3DProps {
  /**
   * The text to be animated.
   */
  text: string;
  /**
   * Font size of the text (e.g., "5vw", "48px").
   * Defaults to "8vw" for a professional hero look.
   */
  fontSize?: string;
  /**
   * Color of the text.
   */
  color?: string;
  /**
   * Additional tailwind classes for the container.
   */
  className?: string;
  /**
   * Duration of one full rotation cycle in seconds.
   */
  duration?: number;
  /**
   * Stagger delay between characters.
   */
  stagger?: number;
  /**
   * Perspective depth for the 3D effect.
   */
  perspective?: number;
  /**
   * Letter spacing.
   */
  letterSpacing?: string;
  /**
   * Number of duplicate lines in the "tube" (default is 4).
   */
  linesCount?: number;
}

/**
 * RollingText3D - A premium 3D text rotation component.
 * Replicates the "Tube" rotation effect using GSAP.
 */
export const RollingText3D = ({
  text,
  fontSize = "8vw",
  color = "currentColor",
  className,
  duration = 0.9,
  stagger = 0.08,
  perspective = 700,
  letterSpacing = "-0.05em",
  linesCount = 4,
}: RollingText3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !tubeRef.current) return;

    const container = containerRef.current;
    const lines = tubeRef.current.querySelectorAll(".rolling-line");
    
    // Set initial visibility
    gsap.set(container, { visibility: "visible" });

    // Manually split text into characters for each line
    // This allows us to avoid the paid GSAP SplitText plugin while keeping the effect.
    lines.forEach((line) => {
      const content = line.textContent || "";
      line.innerHTML = "";
      content.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.backfaceVisibility = "hidden";
        line.appendChild(span);
      });
    });

    const allLinesChars = Array.from(lines).map((line) => 
      Array.from(line.querySelectorAll("span"))
    );

    // 3D setup logic
    const update3D = () => {
      const width = window.innerWidth;
      const depth = -width / 8;
      const transformOrigin = `50% 50% ${depth}px`;

      gsap.set(lines, { perspective, transformStyle: "preserve-3d" });

      const tl = gsap.timeline({ repeat: -1 });

      allLinesChars.forEach((chars, index) => {
        tl.fromTo(
          chars,
          { rotationX: -90, opacity: 0 },
          { 
            rotationX: 90, 
            opacity: 1,
            stagger, 
            duration, 
            ease: "none", 
            transformOrigin 
          },
          index * (duration / 2) // staggered entry for each line
        );
      });

      return tl;
    };

    const timeline = update3D();

    // Handle resize
    const handleResize = () => {
      timeline.kill();
      update3D();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      timeline.kill();
    };
  }, [text, duration, stagger, perspective, linesCount]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center w-full h-full overflow-hidden select-none",
        className
      )}
      style={{ visibility: "hidden" }}
    >
      <div 
        ref={tubeRef} 
        className="relative w-full text-center"
        style={{ height: "1.2em" }} // Height based on line-height
      >
        {Array.from({ length: linesCount }).map((_, i) => (
          <h1
            key={i}
            className="rolling-line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 whitespace-nowrap"
            style={{
              fontSize,
              color,
              letterSpacing,
              lineHeight: 1,
            }}
          >
            {text}
          </h1>
        ))}
      </div>
    </div>
  );
};

