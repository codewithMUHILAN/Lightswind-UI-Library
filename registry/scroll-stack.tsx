"use client";
import React, { useEffect, useRef, useState } from "react";

export interface ScrollStackCard {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  content?: React.ReactNode;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  backgroundColor?: string;
  cardHeight?: string;
  animationDuration?: string;
  className?: string;
}

const defaultBackgrounds = [
  "https://images.pexels.com/photos/6985136/pexels-photo-6985136.jpeg",
  "https://images.pexels.com/photos/6985128/pexels-photo-6985128.jpeg",
  "https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg",
];

const ScrollStack: React.FC<ScrollStackProps> = ({
  cards,
  backgroundColor = "bg-transparent",
  cardHeight = "350px",
  animationDuration = "0.4s",
  className = "",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardCount = Math.min(cards.length, 5);

  const scrollAccumulator = useRef(0);
  const scrollThreshold = 250; // Scroll distance (px) to switch cards (increased for slower, more professional pacing)
  const touchStartY = useRef(0);

  const cardStyle = {
    height: cardHeight,
    maxHeight: "600px",
    borderRadius: "24px",
    transition: `transform ${animationDuration} cubic-bezier(0.16, 1, 0.3, 1), opacity ${animationDuration} cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: "transform, opacity",
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const containerCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;

      // Lock if component center is near viewport center (within 100px range)
      const isCentered = Math.abs(containerCenter - viewportCenter) < 100;

      if (isCentered) {
        // Scroll down
        if (e.deltaY > 0) {
          if (activeCardIndex < cardCount - 1) {
            e.preventDefault();
            scrollAccumulator.current += e.deltaY;
            if (scrollAccumulator.current >= scrollThreshold) {
              setActiveCardIndex((prev) => Math.min(prev + 1, cardCount - 1));
              scrollAccumulator.current = 0;
            }
          }
        }
        // Scroll up
        else if (e.deltaY < 0) {
          if (activeCardIndex > 0) {
            e.preventDefault();
            scrollAccumulator.current += e.deltaY;
            if (scrollAccumulator.current <= -scrollThreshold) {
              setActiveCardIndex((prev) => Math.max(prev - 1, 0));
              scrollAccumulator.current = 0;
            }
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [activeCardIndex, cardCount]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const containerCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const isCentered = Math.abs(containerCenter - viewportCenter) < 100;

      if (isCentered) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY.current - touchY;

        if (deltaY > 0) {
          if (activeCardIndex < cardCount - 1) {
            e.preventDefault();
            scrollAccumulator.current += deltaY * 2.5;
            if (scrollAccumulator.current >= scrollThreshold) {
              setActiveCardIndex((prev) => Math.min(prev + 1, cardCount - 1));
              scrollAccumulator.current = 0;
            }
            touchStartY.current = touchY;
          }
        } else if (deltaY < 0) {
          if (activeCardIndex > 0) {
            e.preventDefault();
            scrollAccumulator.current += deltaY * 2.5;
            if (scrollAccumulator.current <= -scrollThreshold) {
              setActiveCardIndex((prev) => Math.max(prev - 1, 0));
              scrollAccumulator.current = 0;
            }
            touchStartY.current = touchY;
          }
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activeCardIndex, cardCount]);

  const getCardTransform = (index: number) => {
    const isVisible = activeCardIndex >= index;
    const isPrevious = activeCardIndex > index;

    const baseScale = 0.95 + index * 0.015;
    const scale = isVisible ? (isPrevious ? baseScale - 0.025 : baseScale) : 0.9;

    let translateY = "100px";
    if (isVisible) {
      if (isPrevious) {
        translateY = `${-30 * (activeCardIndex - index)}px`;
      } else {
        translateY = "0px";
      }
    }

    return {
      transform: `translateY(${translateY}) scale(${scale})`,
      opacity: isVisible ? 1 : 0,
      zIndex: 10 + index * 10,
      pointerEvents: isVisible ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    <div
      ref={sectionRef}
      className={`relative w-full py-12 flex items-center justify-center overflow-visible ${backgroundColor} ${className}`}
    >
      <div className="container px-6 lg:px-8 mx-auto flex flex-col justify-center">
        <div
          ref={cardsContainerRef}
          className="relative w-full max-w-4xl mx-auto flex-shrink-0"
          style={{ height: cardHeight }}
        >
          {cards.slice(0, 5).map((card, index) => {
            const cardTransform = getCardTransform(index);
            const backgroundImage =
              card.backgroundImage ||
              defaultBackgrounds[index % defaultBackgrounds.length];

            return (
              <div
                key={index}
                className="absolute left-0 right-0 overflow-hidden shadow-2xl transition-all border border-white/10"
                style={{
                  ...cardStyle,
                  transform: cardTransform.transform,
                  opacity: cardTransform.opacity,
                  zIndex: cardTransform.zIndex,
                  pointerEvents: cardTransform.pointerEvents,
                }}
              >
                <div
                  className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 to-black/90"
                  style={{
                    backgroundImage: `url('${backgroundImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "overlay",
                  }}
                />

                {card.badge && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
                      <span className="text-xs font-semibold tracking-wider uppercase">
                        {card.badge}
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative z-10 p-6 sm:p-8 md:p-10 h-full flex items-center">
                  {card.content ? (
                    card.content
                  ) : (
                    <div className="max-w-lg text-left">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-sm md:text-base text-white/80 leading-relaxed">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScrollStack;
