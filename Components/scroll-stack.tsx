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
  cardHeight?: number;
  scrollPerCard?: number;
  className?: string;
}

const defaultBgs = [
  "https://images.pexels.com/photos/6985136/pexels-photo-6985136.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/6985128/pexels-photo-6985128.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

const ScrollStack: React.FC<ScrollStackProps> = ({
  cards,
  cardHeight = 420,
  scrollPerCard = 300,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyPanelRef = useRef<HTMLDivElement>(null); // NEW: Ref for direct DOM manipulation
  const [scrolled, setScrolled] = useState(0);
  const [vpH, setVpH] = useState(600);

  // Stable refs — measured once on mount / resize
  const scrollParentRef = useRef<Element | null>(null);
  const containerOffsetRef = useRef(0);

  const list = cards.slice(0, 5);
  const N = list.length;
  const totalScrollZone = N * scrollPerCard;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ── 1. Find scroll parent ────────────────────────────────────────────────
    let scrollParent: Element | null = null;
    let node: Element | null = el.parentElement;
    while (node) {
      const s = window.getComputedStyle(node);
      if (/auto|scroll/.test(s.overflow) || /auto|scroll/.test(s.overflowY)) {
        scrollParent = node;
        break;
      }
      node = node.parentElement;
    }
    scrollParentRef.current = scrollParent;

    // ── 2. Measure stable offset in CONTENT SPACE ───────────────────────────
    const measure = () => {
      const sp = scrollParentRef.current;
      const elRect = el.getBoundingClientRect();
      if (sp) {
        const spRect = sp.getBoundingClientRect();
        containerOffsetRef.current = elRect.top - spRect.top + sp.scrollTop;
        setVpH(sp.clientHeight);
      } else {
        containerOffsetRef.current = elRect.top + window.scrollY;
        setVpH(window.innerHeight);
      }
    };

    // Slight delay ensures the DOM/Preview div is fully rendered before measuring
    setTimeout(measure, 100);

    // ── 3. Hot scroll handler (Direct DOM + React State) ────────────────────
    let animId: number | null = null;
    const update = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        const sp = scrollParentRef.current;
        const scrollTop = sp ? sp.scrollTop : window.scrollY;
        const currentScrolled = Math.max(0, scrollTop - containerOffsetRef.current);

        // DIRECT DOM MANIPULATION: 
        // Moves the panel synchronously with the scrollbar, ensuring zero jitter 
        // and bypassing any CSS overflow: hidden bugs in parent containers.
        if (stickyPanelRef.current) {
          const innerTop = Math.min(currentScrolled, totalScrollZone);
          stickyPanelRef.current.style.transform = `translateY(${innerTop}px)`;
        }

        // Update React state strictly for card animations (opacity/scale)
        setScrolled(currentScrolled);
      });
    };

    // ── 4. Collect ALL scroll ancestors ─────────────────────────────────────
    const targets: (Element | Window)[] = [window];
    let n: Element | null = el.parentElement;
    while (n) {
      const s = window.getComputedStyle(n);
      if (/auto|scroll/.test(s.overflow) || /auto|scroll/.test(s.overflowY)) {
        targets.push(n);
      }
      n = n.parentElement;
    }

    targets.forEach((t) => t.addEventListener("scroll", update, { passive: true }));
    window.addEventListener("resize", () => { measure(); update(); }, { passive: true });
    update();

    return () => {
      targets.forEach((t) => t.removeEventListener("scroll", update));
      if (animId) cancelAnimationFrame(animId);
    };
  }, [totalScrollZone]);

  const h = vpH || 600;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: h + totalScrollZone }}
    >
      {/* Bulletproof GSAP-style sticky panel */}
      <div
        ref={stickyPanelRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform", // Hardware acceleration for buttery smoothness
        }}
      >
        {/* Card stack — centered */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "56rem",
            margin: "0 auto",
            padding: "0 1rem",
            height: cardHeight,
          }}
        >
          {list.map((card, index) => {
            const bg = card.backgroundImage ?? defaultBgs[index % defaultBgs.length];
            const revealAt = index * scrollPerCard;
            const isVisible = scrolled >= revealAt;

            const above = Math.max(
              0,
              Math.min(N - 1 - index, Math.floor((scrolled - revealAt) / scrollPerCard))
            );

            const entryProgress = isVisible ? Math.min(1, (scrolled - revealAt) / 80) : 0;
            const entryY = (1 - entryProgress) * 80;
            const pushY = above * 12;
            const scale = 1 - above * 0.03;
            const opacity = isVisible ? Math.max(0.6, 1 - above * 0.1) : 0;

            return (
              <div
                key={index}
                className="absolute inset-x-0 overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  height: cardHeight,
                  top: 0,
                  zIndex: 10 + index,
                  transform: `translateY(${entryY - pushY}px) scale(${scale})`,
                  opacity,
                  transition:
                    "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",
                  willChange: "transform, opacity",
                  transformOrigin: "center top",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${bg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {card.badge && (
                  <div className="absolute top-5 right-5 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium border border-white/30">
                      {card.badge}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-end p-6 sm:p-10 z-10">
                  {card.content ?? (
                    <div className="max-w-lg">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-3">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-5 right-6 z-10 text-white/40 text-xs font-mono tracking-widest">
                  {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-50">
          {list.map((_, i) => {
            const active = scrolled >= i * scrollPerCard;
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active ? 8 : 5,
                  height: active ? 8 : 5,
                  background: active ? "rgba(255,255,255,0.9)" : "rgba(120,120,120,0.4)",
                  boxShadow: active ? "0 0 6px rgba(255,255,255,0.5)" : "none",
                }}
              />
            );
          })}
        </div>

        {scrolled < 20 && (
          <div className="absolute bottom-8 inset-x-0 flex justify-center z-50 pointer-events-none">
            <p className="text-xs text-white/40 tracking-[0.2em] uppercase animate-bounce">
              scroll to explore
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollStack;
