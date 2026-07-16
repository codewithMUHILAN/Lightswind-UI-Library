"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "@/components/lib/utils";

export interface ScrollPara3DProps {
  /**
   * The text lines to reveal in 3D space.
   */
  lines: string[];
  className?: string;
  containerClassName?: string;
  textClassName?: string;
  /**
   * The perspective depth distance in pixels.
   * Less = more extreme 3D depth/stretch.
   * @default 600
   */
  perspective?: number;
  /**
   * The tilt angle of the text floor plane (rotateX degrees).
   * @default 50
   */
  angle?: number;
  /**
   * How much extra scrolling space to pin for the animation.
   * Multiplier based on content height.
   * @default 1.2
   */
  scrubSpeed?: number;
  /**
   * Font size in rem for each text line.
   * @default 3.5
   */
  fontSize?: number;
}

export function ScrollPara3D({
  lines,
  className,
  containerClassName,
  textClassName,
  perspective = 600,
  angle = 50,
  scrubSpeed = 1.2,
  fontSize = 3.5,
}: ScrollPara3DProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      if (!contentRef.current || !sectionRef.current) return;

      const contentHeight = contentRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${contentHeight * scrubSpeed}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Start just below so text is immediately visible on scroll
      tl.fromTo(
        contentRef.current,
        { y: windowHeight * 0.3 },
        { y: -contentHeight, ease: "none" }
      );

      return () => { tl.kill(); };
    },
    { dependencies: [lines.length, perspective, angle, scrubSpeed, fontSize] }
  );

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative w-full h-screen overflow-hidden bg-background",
        className
      )}
      style={{ perspective: `${perspective}px` }}
    >
      {/* Top/bottom fade overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 15%, transparent 85%, var(--background) 100%)",
        }}
      />

      {/*
        Tilted floor plane.
        We use transformOrigin "center bottom" so the rotation pivots
        at the bottom center of the plane → text crawls toward viewer naturally.
        Width is 100% of the section.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          transform: `rotateX(${angle}deg)`,
          transformOrigin: "center bottom",
        }}
      >
        {/* Scrolling content strip */}
        <div
          ref={contentRef}
          className={cn(
            "w-full flex flex-col items-center justify-start",
            containerClassName
          )}
          style={{ willChange: "transform" }}
        >
          {lines.map((line, i) => (
            <p
              key={i}
              className={cn(
                "w-full text-center font-black uppercase text-primary tracking-tighter leading-tight",
                textClassName
              )}
              style={{ fontSize: `${fontSize}rem` }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
