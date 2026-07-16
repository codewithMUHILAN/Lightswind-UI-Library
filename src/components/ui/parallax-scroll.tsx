"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/components/lib/utils";

export interface ParallaxScrollProps {
  images?: string[];
  items?: React.ReactNode[];
  className?: string;
  containerHeight?: string;
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  images,
  items,
  className,
  containerHeight = "h-[40rem]",
}) => {
  const gridRef = useRef<any>(null);
  
  // Create an array to map over, prioritizing items if passed, otherwise images
  const renderList = items || images || [];
  
  const { scrollYProgress } = useScroll({
    container: gridRef, 
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(renderList.length / 3);
  
  const firstPart = renderList.slice(0, third);
  const secondPart = renderList.slice(third, 2 * third);
  const thirdPart = renderList.slice(2 * third);

  return (
    <div
      className={cn(
        "items-start overflow-y-auto w-full hide-scrollbar",
        containerHeight,
        className
      )}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-8 py-20 px-8"
      >
        <div className="grid gap-8">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="w-full relative rounded-xl overflow-hidden shadow-sm border border-border/20 bg-muted/20"
            >
              {typeof el === "string" ? (
                <img
                  src={el}
                  className="h-full w-full object-cover rounded-xl border border-transparent"
                  alt="thumbnail"
                  loading="lazy"
                />
              ) : (
                el
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="grid gap-8">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={"grid-2" + idx}
              className="w-full relative rounded-xl overflow-hidden shadow-sm border border-border/20 bg-muted/20"
            >
              {typeof el === "string" ? (
                <img
                  src={el}
                  className="h-full w-full object-cover rounded-xl border border-transparent"
                  alt="thumbnail"
                  loading="lazy"
                />
              ) : (
                el
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="grid gap-8">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateThird }}
              key={"grid-3" + idx}
              className="w-full relative rounded-xl overflow-hidden shadow-sm border border-border/20 bg-muted/20"
            >
              {typeof el === "string" ? (
                <img
                  src={el}
                  className="h-full w-full object-cover rounded-xl border border-transparent"
                  alt="thumbnail"
                  loading="lazy"
                />
              ) : (
                el
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
