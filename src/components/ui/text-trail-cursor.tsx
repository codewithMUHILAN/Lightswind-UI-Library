"use client";
import React, { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface TextTrailCursorProps {
  text?: string;
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const TextTrailCursor = ({
  text = "FOLLOW ME",
  className,
  containerRef,
}: TextTrailCursorProps) => {
  const characters = text.split("");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {characters.map((char, index) => (
        <CharacterTrail
          key={index}
          char={char}
          index={index}
          mouseX={mouseX}
          mouseY={mouseY}
          className={className}
        />
      ))}
    </div>
  );
};

const CharacterTrail = ({
  char,
  index,
  mouseX,
  mouseY,
  className,
}: {
  char: string;
  index: number;
  mouseX: any;
  mouseY: any;
  className?: string;
}) => {
  const springConfig = { damping: 20 + index * 2, stiffness: 200 - index * 10 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  return (
    <motion.span
      style={{ x, y, translateX: 15 + index * 12, translateY: 15 }}
      className={cn(
        "absolute text-xs font-black uppercase tracking-tight text-primary mix-blend-difference",
        className
      )}
    >
      {char}
    </motion.span>
  );
};
