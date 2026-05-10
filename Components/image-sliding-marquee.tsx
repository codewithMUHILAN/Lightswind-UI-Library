import React, { useRef, useEffect } from "react";
import { motion, useAnimationFrame, useInView } from "framer-motion";
import Image from "next/image";

interface MarqueeItem {
  id: string;
  src: string;
  link: string;
  alt: string;
}

interface ImageMarqueeProps {
  items: MarqueeItem[];
  speed?: number; // pixels per second
  direction?: "left" | "right";
  imageWidth?: string; // Tailwind class for the width of the *card div*
  imageHeight?: string; // Tailwind class for the height of the *card div*
  imageMarginX?: string; // Tailwind class for horizontal margin of the *card div*
}

const ImageMarquee: React.FC<ImageMarqueeProps> = ({
  items,
  speed = 50, // speed in pixels per second
  direction = "left",
  // Default Tailwind width for the card div, now responsive
  imageWidth = "w-[240px] sm:w-[300px] md:w-[360px]",
  // Default Tailwind height for the card div, now responsive
  imageHeight = "h-[160px] sm:h-[200px] md:h-[240px]",
  // Default Tailwind horizontal margin for the card div, now responsive
  imageMarginX = "mx-1 sm:mx-2",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useRef(0); // This will store the translateX value
  const [isHovered, setIsHovered] = React.useState(false);
  const isInView = useInView(containerRef, { margin: "20%" });

  // Initialize x.current based on direction for seamless start
  useEffect(() => {
    if (containerRef.current) {
      const initialScrollWidth = containerRef.current.scrollWidth;
      if (initialScrollWidth > 0) {
        const singleSetWidth = initialScrollWidth / 2;
        if (direction === "right") {
          x.current = -singleSetWidth;
        } else {
          x.current = 0;
        }
        // Apply initial transform immediately
        containerRef.current.style.transform = `translateX(${x.current}px)`;
      }
    }
  }, [direction, items]); // Re-run if direction or items change

  useAnimationFrame((t, delta) => {
    if (!isInView || isHovered) return;

    if (containerRef.current) {
      const fullContentWidth = containerRef.current.scrollWidth;
      // If fullContentWidth is 0, the content hasn't rendered or has no width yet.
      // Exit early to prevent division by zero or incorrect calculations.
      if (fullContentWidth === 0) return;

      const singleSetWidth = fullContentWidth / 2;
      const moveBy = (speed * delta) / 1000;

      if (direction === "left") {
        x.current -= moveBy;
        // If scrolled past the first set to the left, reset to show start of second set
        if (x.current <= -singleSetWidth) {
          x.current = 0;
        }
      } else {
        // direction === "right"
        x.current += moveBy;
        // If scrolled past the end of the second set to the right (i.e., x.current becomes 0 or positive)
        // reset to show the start of the first set again by pulling back.
        if (x.current >= 0) {
          x.current = -singleSetWidth;
        }
      }

      containerRef.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  const allItems = [...items, ...items]; // Duplicate items for seamless scroll

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className="flex w-max" // w-max ensures the flex container takes the width of all its children
        style={{
          willChange: "transform", // Optimize for animation
        }}
      >
        {allItems.map((item, idx) => (
          <a
            key={`${item.id}-${idx}`}
            href={item.link}
            className={`${imageWidth} ${imageHeight} ${imageMarginX} flex-shrink-0 
    transform hover:scale-125 transition-transform duration-300 
    border border-white/20 hover:border-primarylw/40 p-2 
    rounded-xl shadow-lg backdrop-blur-md 
    bg-gray-200/60 dark:bg-white/5 cursor-pointer block relative z-0 hover:z-50`}
          >
            <div className="relative w-full h-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 360px"
                className="object-contain rounded-xl shadow-lg bg-black pointer-events-none"
                draggable={false}
                loading="lazy"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ImageMarquee;
