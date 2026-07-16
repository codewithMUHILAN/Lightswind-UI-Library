"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ArcCarouselItem {
  image: string;
  title: string;
  description: string;
  tag?: string;
}

export interface ThreeDArcCarouselProps {
  items: ArcCarouselItem[];
  radius?: number; // Custom circle radius distance (default: 700px on desktop)
  cardWidth?: number; // Custom card width in px
  cardHeight?: number; // Custom card height in px
  angleStep?: number; // Custom separation angle in degrees
  autoPlay?: boolean;
  autoPlayInterval?: number;
  enableWheel?: boolean;
  enableKeys?: boolean;
  enableDrag?: boolean;
  className?: string;
}

export const ThreeDArcCarousel: React.FC<ThreeDArcCarouselProps> = ({
  items,
  radius: customRadius,
  cardWidth: customCardWidth,
  cardHeight: customCardHeight,
  angleStep = 20,
  autoPlay = false,
  autoPlayInterval = 5000,
  enableWheel = true,
  enableKeys = true,
  enableDrag = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef(0);
  const dragStartPos = useRef<number | null>(null);

  // Responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine actual dimensions
  const cardW = customCardWidth ?? (isMobile ? 150 : 210);
  const cardH = customCardHeight ?? (isMobile ? 220 : 310);
  const radius = customRadius ?? (isMobile ? 420 : 700);

  // Center index on first load
  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(Math.floor(items.length / 2));
    }
  }, [items.length]);

  const move = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + direction;
        if (nextIndex >= 0 && nextIndex < items.length) {
          return nextIndex;
        }
        // Wrap around loop behavior
        if (nextIndex < 0) return items.length - 1;
        if (nextIndex >= items.length) return 0;
        return prev;
      });
    },
    [items.length]
  );

  // Autoplay handler
  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        move(1);
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, autoPlayInterval, move]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeys) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeys, move]);

  // Wheel navigation with throttle
  const handleWheel = (e: React.WheelEvent) => {
    if (!enableWheel) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 600) return;
    lastScrollTime.current = now;
    move(e.deltaY > 0 ? 1 : -1);
  };

  // Drag and Swipe handlers
  const handleDragStart = (clientX: number) => {
    if (!enableDrag) return;
    dragStartPos.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!enableDrag || dragStartPos.current === null) return;
    const diff = dragStartPos.current - clientX;
    if (Math.abs(diff) > 60) {
      move(diff > 0 ? 1 : -1);
      dragStartPos.current = null; // Reset until released
    }
  };

  const handleDragEnd = () => {
    dragStartPos.current = null;
  };

  return (
    <div
      onWheel={handleWheel}
      className={`relative w-full h-[650px] md:h-[750px] flex flex-col justify-between items-center overflow-hidden bg-transparent select-none ${className}`}
    >
      {/* 3D Curved Arc Stage */}
      <div
        className="relative w-full flex-1 flex justify-center items-center pointer-events-auto"
        style={{ perspective: "1500px" }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Carousel Track */}
        <div
          className="absolute transform-style-3d transition-transform duration-700 ease-out"
          style={{
            top: isMobile ? "22%" : "18%",
            width: `${cardW}px`,
            height: `${cardH}px`,
            transform: `rotateY(0deg)`,
          }}
        >
          {items.map((item, idx) => {
            const cardRotation = (idx - currentIndex) * angleStep;
            const isActive = idx === currentIndex;
            const distance = Math.abs(idx - currentIndex);
            const zIndex = items.length - distance;

            return (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`absolute inset-0 rounded-[20px] md:rounded-[26px] bg-cover bg-center cursor-pointer border border-white/10 dark:border-white/5 transition-all duration-700 ease-[cubic-bezier(0.2,0.85,0.25,1)] ${
                  isActive ? "brightness-100 scale-105 z-20" : "brightness-[0.45] scale-90 blur-[0.5px]"
                }`}
                style={{
                  backgroundImage: `url(${item.image})`,
                  transformOrigin: `50% ${radius}px`,
                  transform: `rotate(${cardRotation}deg)`,
                  zIndex: zIndex,
                }}
              >
                {/* Visual Glow overlay on active card */}
                {isActive && (
                  <div className="absolute inset-0 rounded-[20px] md:rounded-[26px] bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Metadata Display Panel */}
      <div className="relative z-30 text-center max-w-[90%] md:max-w-xl flex flex-col items-center gap-3 px-6 pb-12 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col gap-2"
          >
            {items[currentIndex]?.tag && (
              <span className="self-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80">
                {items[currentIndex].tag}
              </span>
            )}
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              {items[currentIndex]?.title}
            </h2>
            <p className="text-[12px] md:text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {items[currentIndex]?.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Control Buttons */}
        <div className="flex justify-center items-center gap-6 mt-4">
          <button
            onClick={() => move(-1)}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-1.5 text-xs text-zinc-400 font-mono select-none">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{currentIndex + 1}</span>
            <span>/</span>
            <span>{items.length}</span>
          </div>

          <button
            onClick={() => move(1)}
            disabled={currentIndex === items.length - 1}
            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
