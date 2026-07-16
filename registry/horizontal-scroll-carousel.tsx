"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/components/lib/utils";

export interface HorizontalScrollCarouselProps {
  cards: React.ReactNode[] | string[];
  containerRef?: React.RefObject<any>;
}

export const HorizontalScrollCarousel = ({ cards, containerRef }: HorizontalScrollCarouselProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4 md:gap-8 px-4 md:px-8">
          {cards.map((card, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "group relative h-[400px] w-[300px] md:h-[500px] md:w-[450px] overflow-hidden rounded-2xl bg-muted/20 border border-border/50 shrink-0",
                  "flex items-center justify-center p-6 shadow-sm shadow-black/5"
                )}
              >
                {typeof card === "string" ? (
                  <img
                    src={card}
                    className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={`Carousel card ${index}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="z-10 h-full w-full">{card}</div>
                )}
                
                {typeof card === "string" && (
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
