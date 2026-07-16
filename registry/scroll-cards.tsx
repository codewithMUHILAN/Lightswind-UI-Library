"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "@/components/lib/utils";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
}

export interface ScrollCardsProps {
  cards: CardData[];
  /**
   * Defines the direction from which the next card enters.
   * @default "bottom"
   */
  direction?: "bottom" | "top" | "left" | "right";
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
  /**
   * The scale the current card scales down to.
   * @default 0.7
   */
  cardScale?: number;
  /**
   * The rotation the current card rotates to.
   * @default 5
   */
  cardRotation?: number;
}

export function ScrollCards({
  cards,
  direction = "bottom",
  className,
  containerClassName,
  imageClassName,
  cardScale = 0.7,
  cardRotation = 5,
}: ScrollCardsProps) {
  const container = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current.filter(Boolean);
      const totalCards = imageElements.length;

      if (!imageElements[0]) return;

      gsap.set(imageElements[0], { x: "0%", y: "0%", scale: 1, rotation: 0 });

      // Determine initial offset based on direction
      const getInitialOffset = () => {
        switch (direction) {
          case "top":
            return { y: "-100%", x: "0%" };
          case "left":
            return { x: "-100%", y: "0%" };
          case "right":
            return { x: "100%", y: "0%" };
          case "bottom":
          default:
            return { y: "100%", x: "0%" };
        }
      };

      for (let i = 1; i < totalCards; i++) {
        gsap.set(imageElements[i], { ...getInitialOffset(), scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${window.innerHeight * totalCards}`,
          pin: true,
          scrub: 1,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;

        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: cardScale,
            rotation: cardRotation,
            duration: 1,
            ease: "power2.inOut",
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            x: "0%",
            y: "0%",
            duration: 1,
            ease: "power2.inOut",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
      };
    },
    { scope: container, dependencies: [direction, cards.length, cardScale, cardRotation] }
  );

  return (
    <div className={cn("relative w-full h-[70vh]", className)} ref={container}>
      <div className="lightswind-scroll-cards-trigger relative flex h-[70vh] w-full items-center justify-center overflow-hidden p-4 lg:p-8">
        <div
          className={cn(
            "relative w-[95%] sm:w-[90%] lg:w-[85%] max-w-[1400px] aspect-[4/3] md:aspect-video overflow-hidden rounded-3xl shadow-xl",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || `Scroll card gallery image ${i}`}
              className={cn(
                "absolute top-0 left-0 h-full w-full object-cover rounded-3xl will-change-transform shadow-2xl",
                imageClassName
              )}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
