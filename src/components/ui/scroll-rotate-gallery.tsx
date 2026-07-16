"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrollRotateGalleryItem {
  /** Image URL for this card */
  src: string;
  /** Alt text for the image */
  alt?: string;
}

export interface ScrollRotateGalleryTextItem {
  /** Heading shown in the side panel */
  title: string;
  /** Body copy shown in the side panel */
  description: string;
}

export interface ScrollRotateGalleryProps {
  /** Array of image objects to display on the sphere */
  items?: ScrollRotateGalleryItem[];
  /**
   * Array of text content panels that cycle as the user scrolls.
   * Defaults to four built-in demo entries.
   */
  textItems?: ScrollRotateGalleryTextItem[];
  /**
   * Total number of cards placed on the sphere.
   * Items are duplicated/sliced to fill this count.
   * @default 24
   */
  cardCount?: number;
  /**
   * Radius of the sphere in pixels.
   * Automatically halved on screens narrower than `mobileBreakpoint`.
   * @default 380
   */
  radius?: number;
  /**
   * Viewport width (px) below which the mobile radius is used.
   * @default 768
   */
  mobileBreakpoint?: number;
  /**
   * How many full Y-axis rotations the sphere completes during the entire
   * scroll span of the gallery container.
   * @default 2
   */
  rotations?: number;
  /**
   * Slight X-axis tilt applied during the scroll animation (degrees).
   * @default 45
   */
  tiltX?: number;
  /**
   * Aspect ratio of each card (height / width).
   * @default 1.375  (= 220/160)
   */
  cardAspectRatio?: number;
  /**
   * Width of each card in pixels.
   * @default 160
   */
  cardWidth?: number;
  /**
   * Extra CSS classes applied to the outermost wrapper `<section>`.
   * Useful for overriding height or background.
   */
  className?: string;
  /**
   * Extra CSS classes applied to each gallery card.
   */
  cardClassName?: string;
  /**
   * Extra CSS classes applied to the side text panel container.
   */
  textPanelClassName?: string;
  /**
   * GSAP scrub value for the scroll animation. Higher = smoother but laggier.
   * @default 1
   */
  scrub?: number;
  /**
   * Number of cards around the focus point that receive the "active" highlight.
   * @default 2
   */
  highlightRadius?: number;
  /** Called whenever the active text panel index changes. */
  onTextChange?: (index: number) => void;
  /** Called whenever the scroll progress updates (0–1). */
  onProgressChange?: (progress: number) => void;
  /**
   * Optional custom scroll container selector or element.
   * If not provided, it will automatically search for the closest scrollable parent
   * (with overflow-y: scroll or auto) or fallback to window.
   */
  scroller?: string | HTMLElement | React.RefObject<HTMLElement> | null;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_IMAGES: ScrollRotateGalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    alt: "Modern minimalist residence with clean concrete lines",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80",
    alt: "Architectural arches featuring warm, natural lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=80",
    alt: "Minimalist living space with tactile plaster finishes",
  },
  {
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    alt: "Exterior view of brutalist architecture under bright sky",
  },
  {
    src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80",
    alt: "Geometric concrete staircase casting dramatic shadows",
  },
  {
    src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&auto=format&fit=crop&q=80",
    alt: "Symmetrical courtyard showing structural terracotta grids",
  },
  {
    src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80",
    alt: "Brutalist monument emphasizing volume and raw texture",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80",
    alt: "Morning light filtering through floor-to-ceiling windows",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&auto=format&fit=crop&q=80",
    alt: "Sleek kitchen interior showing natural stone surfaces",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&auto=format&fit=crop&q=80",
    alt: "Curved white concrete canopy blending into the horizon",
  },
  {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80",
    alt: "Luxury mid-century modern pavilion at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    alt: "Contemporary skyscraper facade reflecting dynamic clouds",
  },
];

const DEFAULT_TEXT_ITEMS: ScrollRotateGalleryTextItem[] = [
  {
    title: "Brutalist Monoliths",
    description:
      "Exploring the raw beauty of exposed concrete, where structural honesty meets minimalist geometries. These monumental forms redefine urban landscapes with silent authority.",
  },
  {
    title: "Kinetic Light & Shadow",
    description:
      "An investigation into how sunlight interacts with plaster and concrete throughout the day, transforming static structural lines into dynamic canvas elements.",
  },
  {
    title: "Organic Contours",
    description:
      "Bridging the gap between natural terrain and human design. Fluid, sweeping curves emulate the wind-swept desert dunes, softening the industrial landscape.",
  },
  {
    title: "Architectural Ribs",
    description:
      "Rhythmic repetition of steel, timber, or concrete beams. This structural patterning creates depth, guiding the observer's eye through perspective.",
  },
  {
    title: "Tactile Minimalism",
    description:
      "Focusing on the quiet elegance of material textures. Rough sandstone, micro-cement, and matte metal details engage the senses in silent luxury.",
  },
  {
    title: "Volumetric Voids",
    description:
      "Designing the space between. How open air, negative space, and empty courtyards bring breathing room and cosmic alignment to architectural plans.",
  },
];

// ─── Card position helper ──────────────────────────────────────────────────────

function fibonacciSphereCard(
  index: number,
  total: number,
  radius: number,
  cardW: number,
  cardH: number
): { x: number; y: number; z: number; rotX: number; rotY: number } {
  const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;

  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);

  // Rotate each card to face outward from the sphere centre
  const rotY = Math.atan2(x, z) * (180 / Math.PI);
  const rotX = Math.asin(-y / radius) * (180 / Math.PI);

  return { x, y, z, rotX, rotY };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScrollRotateGallery({
  items,
  textItems = DEFAULT_TEXT_ITEMS,
  cardCount = 24,
  radius = 380,
  mobileBreakpoint = 768,
  rotations = 2,
  tiltX = 45,
  cardAspectRatio = 1.375,
  cardWidth = 160,
  className,
  cardClassName,
  textPanelClassName,
  scrub = 1,
  highlightRadius = 2,
  onTextChange,
  onProgressChange,
  scroller,
}: ScrollRotateGalleryProps) {
  // Resolve gallery images — duplicate to fill cardCount
  const galleryImages = useMemo<ScrollRotateGalleryItem[]>(() => {
    const src = items && items.length > 0 ? items : DEFAULT_IMAGES;
    const result: ScrollRotateGalleryItem[] = [];
    while (result.length < cardCount) {
      result.push(...src);
    }
    return result.slice(0, cardCount);
  }, [items, cardCount]);

  const cardHeight = cardWidth * cardAspectRatio;

  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  // State
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [titleText, setTitleText] = useState(textItems[0]?.title ?? "");
  const [descText, setDescText] = useState(textItems[0]?.description ?? "");
  const [textVisible, setTextVisible] = useState(true);
  const [effectiveRadius, setEffectiveRadius] = useState(radius);
  const [viewportHeight, setViewportHeight] = useState<string>("100vh");

  // ── Responsive radius ──────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      setEffectiveRadius(
        window.innerWidth < mobileBreakpoint ? radius / 2 : radius
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [radius, mobileBreakpoint]);

  // ── Text crossfade ─────────────────────────────────────────────────────────
  const transitionText = useCallback(
    (newIndex: number) => {
      if (newIndex === textIndex) return;
      setTextVisible(false);
      setTimeout(() => {
        setTextIndex(newIndex);
        setTitleText(textItems[newIndex]?.title ?? "");
        setDescText(textItems[newIndex]?.description ?? "");
        setTextVisible(true);
        onTextChange?.(newIndex);
      }, 200);
    },
    [textIndex, textItems, onTextChange]
  );

  // ── GSAP scroll animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    let gsapLib: any;
    let scrollTriggerLib: any;
    let trigger: any;
    let resizeListener: (() => void) | null = null;

    const init = async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");

      gsapLib = gsapMod.gsap ?? (gsapMod as any).default;
      scrollTriggerLib = stMod.ScrollTrigger;

      gsapLib.registerPlugin(scrollTriggerLib);

      if (!sphereRef.current || !containerRef.current) return;

      // Find the closest scroll parent
      let resolvedScroller: any = window;
      if (scroller) {
        if (typeof scroller === "string") {
          resolvedScroller = document.querySelector(scroller) || window;
        } else if (scroller instanceof HTMLElement) {
          resolvedScroller = scroller;
        } else if (scroller && "current" in scroller) {
          resolvedScroller = scroller.current || window;
        }
      } else {
        let parent = containerRef.current.parentElement;
        while (parent) {
          const overflowY = window.getComputedStyle(parent).overflowY;
          if (overflowY === "auto" || overflowY === "scroll") {
            resolvedScroller = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }

      if (resolvedScroller !== window) {
        setViewportHeight(`${resolvedScroller.clientHeight}px`);
        resizeListener = () => {
          setViewportHeight(`${resolvedScroller.clientHeight}px`);
        };
        window.addEventListener("resize", resizeListener);
      } else {
        setViewportHeight("100vh");
      }

      trigger = gsapLib.to(sphereRef.current, {
        rotateY: 360 * rotations,
        rotateX: tiltX,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub,
          scroller: resolvedScroller,
          onUpdate: (self: any) => {
            const progress: number = self.progress;
            progressRef.current = progress;
            onProgressChange?.(progress);

            // Highlight cards near focus point
            const focusIndex = Math.floor(progress * cardCount);
            setActiveCardIndex(focusIndex);

            // Switch text panel
            const newTextIdx =
              Math.floor(progress * textItems.length) % textItems.length;
            transitionText(newTextIdx);
          },
        },
      });
    };

    init();

    return () => {
      trigger?.scrollTrigger?.kill();
      trigger?.kill();
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
      }
    };
  }, [
    rotations,
    tiltX,
    scrub,
    cardCount,
    textItems.length,
    scroller,
    transitionText,
    onProgressChange,
  ]);

  // ── Pre-compute card positions ─────────────────────────────────────────────
  const cardPositions = useMemo(
    () =>
      galleryImages.map((_, i) =>
        fibonacciSphereCard(i, cardCount, effectiveRadius, cardWidth, cardHeight)
      ),
    [galleryImages, cardCount, effectiveRadius, cardWidth, cardHeight]
  );

  const isActive = (i: number) =>
    Math.abs(i - activeCardIndex) < highlightRadius;

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full",
        "h-[300vh]", // ← scroll runway; override via className if needed
        className
      )}
    >
      {/* ── Sticky viewport ──────────────────────────────────────────────── */}
      <div 
        className="sticky top-0 w-full overflow-hidden flex items-center justify-center"
        style={{ height: viewportHeight }}
      >



        {/* ── Side text panel ───────────────────────────────────────────── */}
        <div
          className={cn(
            "absolute left-6 top-1/2 z-10 -translate-y-1/2 w-[260px] lg:w-[300px]",
            "hidden md:block",
            textPanelClassName
          )}
        >
          <AnimatePresence mode="wait">
            {textVisible && (
              <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight leading-tight mb-3 text-foreground">
                  {titleText}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {descText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 3-D Sphere stage ─────────────────────────────────────────── */}
        <div
          className="relative"
          style={{
            perspective: "1200px",
            width: 0,
            height: 0,
          }}
        >
          {/* Sphere pivot */}
          <div
            ref={sphereRef}
            style={{ transformStyle: "preserve-3d", position: "relative" }}
          >
            {galleryImages.map((item, i) => {
              const pos = cardPositions[i];
              if (!pos) return null;
              const active = isActive(i);

              return (
                <div
                  key={i}
                  className={cn(
                    // Clay card base
                    "absolute rounded-2xl p-[6px] border overflow-hidden",
                    "transition-[filter,box-shadow] duration-500",
                    // Light mode
                    "border-black/[0.06] bg-white",
                    // Dark mode
                    "dark:border-white/[0.03] dark:bg-[#18181b]",
                    // Active highlight
                    active
                      ? "drop-shadow-[0_0_18px_rgba(255,255,255,0.14)] dark:drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]"
                      : "drop-shadow-none",
                    cardClassName
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    // Centre card on the sphere pivot
                    left: -cardWidth / 2,
                    top: -cardHeight / 2,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "visible",
                    transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) rotateY(${pos.rotY}deg) rotateX(${pos.rotX}deg)`,
                    // Clay shadow
                    boxShadow: active
                      ? "8px 8px 20px rgba(0,0,0,0.85), inset 2px 2px 5px rgba(255,255,255,0.05)"
                      : "6px 6px 14px rgba(0,0,0,0.8), inset 2px 2px 4px rgba(255,255,255,0.03)",
                  }}
                >
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={item.alt ?? `Gallery image ${i + 1}`}
                    loading="lazy"
                    draggable={false}
                    className={cn(
                      "w-full h-full object-cover rounded-xl select-none",
                      "transition-[filter] duration-500",
                      active
                        ? "grayscale-0 brightness-100"
                        : "grayscale-[80%] brightness-[0.55] dark:brightness-[0.45]"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile text panel (bottom) ────────────────────────────────── */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center md:hidden px-6 z-10">
          <AnimatePresence mode="wait">
            {textVisible && (
              <motion.div
                key={`mobile-${textIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-xs"
              >
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                  {titleText}
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {descText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </div>
    </section>
  );
}

export default ScrollRotateGallery;
