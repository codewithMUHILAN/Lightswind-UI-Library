"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/components/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Interfaces
export interface CarouselCard {
  id: string | number;
  image: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface ThreeDCardsCarouselProps {
  className?: string;
  cards?: CarouselCard[];
}

export const ThreeDCardsCarousel: React.FC<ThreeDCardsCarouselProps> = ({
  className,
  cards,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const defaultCards: CarouselCard[] = [
    { id: 1, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/cc-dp.jpg?v=1764280792", title: "Daily Protection Cream", description: "Ultra-hydrating daily sunscreen shield SPF 50" },
    { id: 2, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/cc-serum.jpg?v=1764279474", title: "Retinol Serum Core", description: "Advanced overnight wrinkle repair treatment" },
    { id: 3, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/dermd-products.png?v=1753033534", title: "DermExcel Collection", description: "Dermatologist approved active skincare formulas" },
    { id: 4, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/exf-square-02.jpg?v=1750856965", title: "Exfoliating Scrub", description: "Deep pore renewing micro-peel polish" },
    { id: 5, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/fes-square-01.webp?v=1733996576", title: "Clarifying Cleanser", description: "Salicylic acid foaming wash for blemish control" },
    { id: 6, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/lit-square-03.webp?v=1733734767", title: "Vitamin C Glow Boost", description: "High concentration illuminating facial oil" },
    { id: 7, image: "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/lit-square-02.webp?v=1733734767", title: "Hyaluronic Acid Hydrator", description: "Instant moisture binding repair essence" }
  ];

  const activeCards = cards && cards.length > 0 ? cards : defaultCards;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;



    // 2. Horizontal Scroll translation
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = section.offsetWidth;
      return -(trackWidth - viewportWidth);
    };

    const scrollTween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "center center",
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // 3. Coverflow 3D Math Engine running inside ticker
    const updateCoverflow = () => {
      if (!track || !section) return;
      const sectionRect = section.getBoundingClientRect();
      const componentCenter = sectionRect.left + sectionRect.width / 2;
      const items = track.querySelectorAll(".carousel-item");

      items.forEach((item: any) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = itemCenter - componentCenter;

        const maxRotation = 45;
        let rotation = (distance / (sectionRect.width * 0.5)) * maxRotation;
        rotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));

        const scale = 1 - Math.abs(distance) / (sectionRect.width * 1.8);
        const clampedScale = Math.max(0.7, scale);
        const z = -Math.abs(distance) * 0.4;

        gsap.set(item, {
          rotationY: rotation,
          scale: clampedScale,
          z: z,
        });
      });
    };

    gsap.ticker.add(updateCoverflow);

    return () => {
      gsap.ticker.remove(updateCoverflow);
      scrollTween.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
      gsap.killTweensOf("*");
    };
  }, [activeCards]);

  return (
    <div className={cn("w-full bg-transparent text-slate-800 dark:text-zinc-100 font-sans overflow-x-hidden", className)}>
      {/* Main Coverflow Interactive Section */}
      <section
        ref={sectionRef}
        className="connect-section relative flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[70vh] pt-4 pb-8"
      >

        {/* 3D Coverflow Card track */}
        <div className="carousel-viewport w-full h-[380px] md:h-[460px] flex items-center overflow-hidden mb-6 [perspective:1200px] mask-image-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div
            ref={trackRef}
            style={{
              paddingLeft: "var(--track-pad)",
              paddingRight: "var(--track-pad)",
            } as React.CSSProperties}
            className="carousel-track flex items-center gap-8 md:gap-12 [transform-style:preserve-3d] [--track-pad:calc(50%-130px)] md:[--track-pad:calc(50%-175px)]"
          >
            {activeCards.map((card, i) => {
              const cardContent = (
                <div className="w-full h-full p-3 flex items-center justify-center bg-[#e6eef5] dark:bg-zinc-900 border-[3px] border-white/60 dark:border-zinc-800/40 rounded-[30px] shadow-[12px_12px_24px_#c6d5e3,-12px_-12px_24px_#ffffff,inset_3px_3px_6px_rgba(255,255,255,0.85),inset_-3px_-3px_6px_rgba(0,0,0,0.04)] dark:shadow-[12px_12px_24px_#09090b,-12px_-12px_24px_#27272a,inset_3px_3px_6px_rgba(255,255,255,0.04),inset_-3px_-3px_6px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:scale-[1.03]">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title || `Card image ${i}`}
                      className="w-full h-full object-cover filter saturate-[0.95] contrast-[1.05]"
                    />
                    
                    {/* Hover text glass panel overlay */}
                    {(card.title || card.description) && (
                      <div className="absolute inset-x-3 bottom-3 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-white/20 dark:border-zinc-800/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none">
                        {card.title && (
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                            {card.title}
                          </h4>
                        )}
                        {card.description && (
                          <p className="text-[10px] md:text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                            {card.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );

              return (
                <div
                  key={card.id}
                  className="carousel-item flex-shrink-0 w-[260px] h-[320px] md:w-[350px] md:h-[400px] relative [transform-style:preserve-3d] cursor-pointer"
                >
                  {card.href ? (
                    <Link href={card.href}>
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
export default ThreeDCardsCarousel;
