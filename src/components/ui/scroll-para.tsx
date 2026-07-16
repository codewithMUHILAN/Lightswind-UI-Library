"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "@/components/lib/utils";

export interface ScrollParaProps {
  /**
   * The text lines or paragraphs to reveal.
   */
  paragraphs: string[];
  /**
   * The animation direction for each paragraph revealing.
   * @default "bottom"
   */
  direction?: "bottom" | "top" | "left" | "right" | "none";
  /**
   * The blur amount in pixels when the element starts entering.
   * @default 10
   */
  startBlur?: number;
  /**
   * The offset amount in pixels for the enter animation.
   * @default 50
   */
  offset?: number;
  className?: string;
  containerClassName?: string;
  textClassName?: string;
  /**
   * Opacity starting value.
   * @default 0.1
   */
  startOpacity?: number;
  /**
   * Delay before the next line starts revealing.
   * @default 0.5
   */
  stagger?: number;
}

export function ScrollPara({
  paragraphs,
  direction = "bottom",
  startBlur = 10,
  offset = 50,
  className,
  containerClassName,
  textClassName,
  startOpacity = 0.1,
  stagger = 0.5,
}: ScrollParaProps) {
  const container = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const elements = textRefs.current.filter(Boolean);
      const totalElements = elements.length;

      if (totalElements === 0) return;

      const getInitialTransform = () => {
        switch (direction) {
          case "top":
            return { y: -offset, x: 0 };
          case "left":
            return { x: -offset, y: 0 };
          case "right":
            return { x: offset, y: 0 };
          case "bottom":
            return { y: offset, x: 0 };
          case "none":
          default:
            return { x: 0, y: 0 };
        }
      };

      // Set initial state
      elements.forEach((el) => {
        gsap.set(el, {
          ...getInitialTransform(),
          opacity: startOpacity,
          filter: `blur(${startBlur}px)`,
        });
      });

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${window.innerHeight * totalElements * 0.8}`, // Extended scroll duration based on items
          pin: true,
          scrub: 1,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      elements.forEach((el, index) => {
        scrollTimeline.to(
          el,
          {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
          },
          index * stagger
        );
      });

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
      };
    },
    {
      scope: container,
      dependencies: [direction, paragraphs.length, startOpacity, startBlur, offset, stagger],
    }
  );

  return (
    <div className={cn("relative w-full min-h-[100vh]", className)} ref={container}>
      <div className="relative flex h-[100vh] w-full items-center justify-center overflow-hidden p-6 md:p-12">
        <div
          className={cn(
            "relative w-full max-w-5xl flex flex-col gap-6 md:gap-10",
            containerClassName
          )}
        >
          {paragraphs.map((text, i) => (
            <p
              key={i}
              className={cn(
                "text-2xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-foreground will-change-transform",
                textClassName
              )}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
