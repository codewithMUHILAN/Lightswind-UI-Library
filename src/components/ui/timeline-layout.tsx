"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface TimelineEntry {
  title: string | React.ReactNode;
  content: React.ReactNode;
}

export interface TimelineLayoutProps {
  data: TimelineEntry[];
  containerClassName?: string;
  title?: string;
  description?: string;
}

/**
 * TimelineLayout
 * 
 * An ultra-premium scroll-driven layout that features a glowing vertical SVG 
 * path tracing the user's scroll depth across an array of nested content sections.
 */
export const TimelineLayout: React.FC<TimelineLayoutProps> = ({
  data,
  containerClassName,
  title,
  description,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (scrollTrackerRef.current) {
      const rect = scrollTrackerRef.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [scrollTrackerRef, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className={cn(
        "w-full bg-background font-sans md:px-10 py-10 rounded-2xl border border-border/50",
        containerClassName
      )}
      ref={containerRef}
    >
      {/* Optional Header Section */}
      {(title || description) && (
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {title && (
            <h2 className="text-3xl md:text-5xl mb-4 text-foreground font-bold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              {description}
            </p>
          )}
        </div>
      )}

      <div ref={scrollTrackerRef} className="relative max-w-7xl mx-auto pb-20 mt-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left Axis Marker */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-border border border-border/80" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground/30">
                {item.title}
              </h3>
            </div>

            {/* Right Content Payload */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground/50">
                {item.title}
              </h3>
              <div className="w-full relative rounded-2xl bg-card border border-border/40 p-6 md:p-8">
                {item.content}
              </div>
            </div>
          </div>
        ))}

        {/* The Animated Tracing Line Background */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border/50 dark:via-border/20 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {/* the dynamic scroll fill */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[4px] -ml-[1px] bg-gradient-to-t from-primary via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
