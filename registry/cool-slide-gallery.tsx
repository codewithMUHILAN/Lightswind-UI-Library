"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CoolSlideGallerySlide {
  /** Image source URL */
  src: string;
  /** Optional alt text for accessibility */
  alt?: string;
  /** Optional title rendered as an overlay on the card */
  title?: string;
  /** Optional subtitle text shown below the title */
  subtitle?: string;
  /** Optional custom badge text */
  badge?: string;
}

export type TitlePosition = "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";
export type EasingPreset = "smooth" | "spring" | "bouncy" | "snappy";

export interface CoolSlideGalleryProps {
  /** Array of slides to display */
  slides: CoolSlideGallerySlide[];
  /** Card width in pixels */
  cardWidth?: number;
  /** Card height in pixels */
  cardHeight?: number;
  /** Border radius scale 0–20 (maps to pixel radius relative to card size) */
  radius?: number;
  /** Y-rotation angle (degrees) applied to side cards */
  tilt?: number;
  /** Z-rotation (degrees) applied to side cards for slight lean */
  sideTilt?: number;
  /** Horizontal gap multiplier between cards */
  gap?: number;
  /** Dim intensity (0–100) applied to non-active cards */
  dimOpacity?: number;
  /** Whether to enable autoplay */
  autoplay?: boolean;
  /** Direction of autoplay progression */
  autoplayDirection?: "left-to-right" | "right-to-left";
  /** Delay in seconds between autoplay slides */
  autoplayDelay?: number;
  /** Animation duration in seconds for slide transitions */
  animationDuration?: number;
  /** Easing preset for the slide animation */
  easing?: EasingPreset;
  /** Whether to show slide titles */
  showTitle?: boolean;
  /** Position of the title overlay */
  titlePosition?: TitlePosition;
  /** Whether to show navigation arrow buttons */
  showArrows?: boolean;
  /** Whether to show dot indicators */
  showDots?: boolean;
  /** Whether to show a slide counter */
  showCounter?: boolean;
  /** Whether to show badge labels */
  showBadge?: boolean;
  /** Whether click on side cards navigates to them */
  clickable?: boolean;
  /** Whether drag/swipe is enabled */
  draggable?: boolean;
  /** Minimum drag distance in px to trigger a slide change */
  dragThreshold?: number;
  /** Whether keyboard navigation is enabled */
  keyboardNavigation?: boolean;
  /** Number of side cards visible on each side */
  maxVisible?: number;
  /** Depth (z-translate in px) applied per offset position */
  depth?: number;
  /** Scale reduction per offset step from center */
  scaleStep?: number;
  /** Perspective value for the 3D scene */
  perspective?: number;
  /** Additional CSS classes on the root wrapper */
  className?: string;
  /** Callback fired when the active index changes */
  onSlideChange?: (index: number, slide: CoolSlideGallerySlide) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Defaults
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SLIDES: CoolSlideGallerySlide[] = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    alt: "Mountain peaks at golden hour",
    title: "Alpine Summit",
    subtitle: "Swiss Alps, 2024",
    badge: "Featured",
  },
  {
    src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&auto=format&fit=crop",
    alt: "Misty forest trail",
    title: "Forest Trail",
    subtitle: "Oregon, USA",
    badge: "Nature",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
    alt: "Starry night over mountains",
    title: "Midnight Sky",
    subtitle: "Patagonia, Chile",
    badge: "Astro",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    alt: "Desert dunes at sunset",
    title: "Sand Waves",
    subtitle: "Sahara Desert",
    badge: "Desert",
  },
  {
    src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop",
    alt: "Tropical ocean shore",
    title: "Ocean Horizon",
    subtitle: "Maldives",
    badge: "Ocean",
  },
];

const EASING_MAP: Record<EasingPreset, [number, number, number, number]> = {
  smooth: [0.22, 1, 0.36, 1],
  spring: [0.34, 1.56, 0.64, 1],
  bouncy: [0.5, 1.7, 0.5, 1],
  snappy: [0.16, 1, 0.3, 1],
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility: title position styles
// ─────────────────────────────────────────────────────────────────────────────

function getTitleStyles(position: TitlePosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };
  switch (position) {
    case "bottom-left":
      return { ...base, bottom: 0, left: 0, right: 0 };
    case "bottom-right":
      return { ...base, bottom: 0, right: 0, textAlign: "right" };
    case "top-left":
      return { ...base, top: 0, left: 0, right: 0 };
    case "top-right":
      return { ...base, top: 0, right: 0, textAlign: "right" };
    case "center":
      return {
        ...base,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        width: "100%",
      };
    default:
      return { ...base, bottom: 0, left: 0, right: 0 };
  }
}

function getGradientForPosition(position: TitlePosition): string {
  switch (position) {
    case "top-left":
    case "top-right":
      return "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 60%)";
    case "center":
      return "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)";
    case "bottom-left":
    case "bottom-right":
    default:
      return "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 65%)";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CoolSlideGallery Component
// ─────────────────────────────────────────────────────────────────────────────

const CoolSlideGallery: React.FC<CoolSlideGalleryProps> = ({
  slides: slidesProp,
  cardWidth = 380,
  cardHeight = 440,
  radius = 10,
  tilt = 14,
  sideTilt = 6,
  gap = 8,
  dimOpacity = 55,
  autoplay = false,
  autoplayDirection = "right-to-left",
  autoplayDelay = 2.8,
  animationDuration = 0.6,
  easing = "smooth",
  showTitle = true,
  titlePosition = "bottom-left",
  showArrows = true,
  showDots = true,
  showCounter = false,
  showBadge = true,
  clickable = true,
  draggable = true,
  dragThreshold = 45,
  keyboardNavigation = true,
  maxVisible = 2,
  depth = 230,
  scaleStep = 0.15,
  perspective = 1500,
  className,
  onSlideChange,
}) => {
  const slides = slidesProp && slidesProp.length > 0 ? slidesProp : DEFAULT_SLIDES;
  const n = slides.length;

  const [active, setActive] = useState(0);
  const lockRef = useRef(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // ── Locking ──────────────────────────────────────────────────────────────
  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, Math.max(50, animationDuration * 1000));
  }, [animationDuration]);

  // ── Step ─────────────────────────────────────────────────────────────────
  const step = useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return;
      lock();
      setActive((a) => {
        const next = (((a + dir) % n) + n) % n;
        onSlideChange?.(next, slides[next]);
        return next;
      });
    },
    [n, lock, onSlideChange, slides]
  );

  const goTo = useCallback(
    (i: number) => {
      if (lockRef.current || i === active) return;
      lock();
      setActive(i);
      onSlideChange?.(i, slides[i]);
    },
    [active, lock, onSlideChange, slides]
  );

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!keyboardNavigation) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, keyboardNavigation]);

  // ── Autoplay ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoplay || n < 2) return;
    const ms = Math.max(300, autoplayDelay * 1000);
    const dir: 1 | -1 = autoplayDirection === "left-to-right" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayDirection, autoplayDelay, n, step]);

  // ── Pointer drag ─────────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable || lockRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > dragThreshold) {
      step(delta > 0 ? -1 : 1);
    }
  };

  // ── Touch ─────────────────────────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > dragThreshold) step(delta > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  // ── Animation bezier ─────────────────────────────────────────────────────
  const [x1, y1, x2, y2] = EASING_MAP[easing];
  const transition = {
    type: "tween" as const,
    duration: animationDuration,
    ease: [x1, y1, x2, y2] as [number, number, number, number],
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(cardWidth, cardHeight) / 2);
  const dimValue = 1 - Math.max(0, Math.min(100, dimOpacity)) / 100;

  const isTopPosition = titlePosition === "top-left" || titlePosition === "top-right";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full select-none",
        "overflow-hidden",
        className
      )}
      style={{
        minHeight: cardHeight + 80,
        perspective: `${perspective}px`,
        touchAction: "none",
        cursor: draggable ? "grab" : "default",
      }}
      tabIndex={keyboardNavigation ? 0 : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label="Cool Slide Gallery"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── 3D Stage ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        {slides.map((slide, i) => {
          let rel = i - active;
          // Wrap for infinite loop
          if (rel > n / 2) rel -= n;
          if (rel < -n / 2) rel += n;

          const ax = Math.abs(rel);
          const visible = ax <= maxVisible;
          const isActive = rel === 0;
          const sc = Math.max(0.3, 1 - ax * scaleStep);
          const tx = rel * (gap * 30);
          const tz = -ax * depth;
          const ry = -rel * tilt;
          const rz = rel * sideTilt;

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: cardWidth,
                height: cardHeight,
                borderRadius: effectiveRadius,
                overflow: "hidden",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                pointerEvents: visible && !autoplay ? "auto" : "none",
                willChange: "transform, opacity",
                cursor: clickable && visible && !isActive ? "pointer" : "default",
              }}
              animate={{
                x: `calc(-50% + ${tx}px)`,
                y: "-50%",
                translateZ: tz,
                rotateY: ry,
                rotateZ: rz,
                scale: sc,
                opacity: visible ? 1 : 0,
              }}
              transition={transition}
              onClick={() => {
                if (clickable && !isDragging.current && !isActive && visible) {
                  goTo(i);
                }
              }}
              aria-label={slide.title ?? slide.alt ?? `Slide ${i + 1}`}
              aria-hidden={!visible}
            >
              {/* Image */}
              <img
                src={slide.src}
                alt={slide.alt ?? slide.title ?? `Slide ${i + 1}`}
                draggable={false}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                loading="lazy"
              />

              {/* Title overlay */}
              {showTitle && (slide.title || slide.subtitle) && (
                <>
                  {/* Gradient veil */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: getGradientForPosition(titlePosition),
                      pointerEvents: "none",
                    }}
                  />

                  {/* Text content */}
                  <div
                    style={{
                      ...getTitleStyles(titlePosition),
                      padding: "20px 22px",
                    }}
                  >
                    {slide.badge && showBadge && (
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2",
                          "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                        )}
                      >
                        {slide.badge}
                      </span>
                    )}
                    {slide.title && (
                      <p
                        className="text-white font-bold leading-tight text-shadow"
                        style={{
                          fontSize: "clamp(18px, 2.5vw, 26px)",
                          letterSpacing: "-0.02em",
                          lineHeight: "1.15",
                          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {slide.title}
                      </p>
                    )}
                    {slide.subtitle && (
                      <p
                        className="text-white/75 font-medium mt-1"
                        style={{
                          fontSize: "clamp(11px, 1.2vw, 14px)",
                          letterSpacing: "0.01em",
                          textShadow: "0 1px 6px rgba(0,0,0,0.4)",
                        }}
                      >
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Dim overlay on non-active cards */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000000",
                  pointerEvents: "none",
                }}
                animate={{ opacity: isActive ? 0 : dimValue }}
                transition={transition}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── Controls bar ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-3 mt-6 px-4 py-2 rounded-full",
          "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10",
          "backdrop-blur-md"
        )}
        style={{ pointerEvents: "all" }}
      >
        {/* Prev */}
        {showArrows && (
          <motion.button
            aria-label="Previous slide"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className={cn(
              "p-2 rounded-full transition-colors",
              "text-foreground/60 hover:text-foreground hover:bg-foreground/10"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        )}

        {/* Dots */}
        {showDots && (
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <motion.button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="rounded-full bg-foreground/60 dark:bg-foreground/50 cursor-pointer transition-colors hover:bg-foreground"
                animate={{
                  width: active === i ? 24 : 6,
                  height: 6,
                  opacity: active === i ? 1 : 0.4,
                }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.45 }}
                style={{ minWidth: 6 }}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {showCounter && (
          <span className="text-xs font-semibold tabular-nums text-foreground/50 px-1">
            {active + 1} / {n}
          </span>
        )}

        {/* Next */}
        {showArrows && (
          <motion.button
            aria-label="Next slide"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className={cn(
              "p-2 rounded-full transition-colors",
              "text-foreground/60 hover:text-foreground hover:bg-foreground/10"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CoolSlideGallery;
