import { motion, useTransform, useScroll } from "framer-motion";
import React, { useRef, ReactNode } from "react";

interface CarouselItem {
  id: string | number;
  content: ReactNode;
  contentid: ReactNode;
}

interface HorizontalCarouselProps {
  items: CarouselItem[];
  itemWidth?: string;
  itemHeight?: string;
  gap?: string;
  scrollLength?: string;
  initialXOffset?: string;
  finalXOffset?: string;
  children?: ReactNode;
  afterCarouselContent?: ReactNode;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  items,
  itemWidth = "90vw",
  itemHeight = "450px",
  gap = "1rem",
  scrollLength = "150vh",
  initialXOffset = "80%", // Start far off-screen
  finalXOffset = "-95%", // End fully off-screen left
  children,
  afterCarouselContent,
}) => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Delay entrance even more (start at 20% scroll progress)
  const x = useTransform(
    scrollYProgress,
    [0.2, 1],
    [initialXOffset, finalXOffset]
  );

  return (
    <section
      ref={targetRef}
      className="relative bg-background"
      style={{ height: scrollLength }}
    >
      {children && (
        <div className="flex h-48 items-center justify-center">{children}</div>
      )}

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x, gap }} className="flex">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center justify-center">
                <div
                  className="group relative overflow-hidden bg-background 
        flex items-center justify-center"
                  style={{ width: itemWidth, height: itemHeight }}
                >
                  {item.content}
                </div>
                <h2 className="my-4 text-3xl font-bold">
                  {String(item.contentid)
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h2>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {afterCarouselContent && (
        <div className="flex h-48 items-center justify-center">
          {afterCarouselContent}
        </div>
      )}
    </section>
  );
};

export default HorizontalCarousel;
