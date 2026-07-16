"use client";
import React, { useRef } from "react";
import { useScroll, motion, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface StackingCardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

export const StackingCard = ({
  i,
  title,
  description,
  src,
  url,
  color,
  progress,
  range,
  targetScale,
}: StackingCardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative h-[500px] w-full max-w-4xl rounded-3xl p-10 transform-origin-top border border-border/20 shadow-2xl"
      >
        <h2 className="text-center m-0 text-3xl font-bold text-foreground">
          {title}
        </h2>
        <div className="flex h-full mt-10 gap-10">
          <div className="w-2/5 relative top-10">
            <p className="text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
            <span className="flex items-center gap-1 mt-4">
              <a
                href={url}
                target="_blank"
                className="text-sm underline cursor-pointer font-semibold"
              >
                See more
              </a>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L10 10M10 10H1L10 10V1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="relative w-3/5 h-full rounded-2xl overflow-hidden border border-border/10">
            <motion.div className="w-full h-full" style={{ scale: imageScale }}>
              <img
                src={src}
                alt="image"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const StackingCardsLayout = ({
  cards,
  containerRef,
}: {
  cards: any[];
  containerRef?: React.RefObject<any>;
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef || container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative mt-20">
      {cards.map((card, i) => {
        const targetScale = 1 - (cards.length - i) * 0.05;
        return (
          <StackingCard
            key={`p_${i}`}
            i={i}
            {...card}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
};
