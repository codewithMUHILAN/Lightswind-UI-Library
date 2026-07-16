"use client";
import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface MagnifyingZoomProps {
  children: React.ReactNode;
  zoom?: number;
  size?: number;
  className?: string;
  classNameZoom?: string;
}

export const MagnifyingZoom = ({
  children,
  zoom = 2,
  size = 200,
  className,
  classNameZoom,
}: MagnifyingZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showZoom, setShowZoom] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const backgroundX = useTransform(smoothX, (v) => {
    if (!containerRef.current) return "0%";
    return `${(v / containerRef.current.offsetWidth) * 100}%`;
  });
  const backgroundY = useTransform(smoothY, (v) => {
    if (!containerRef.current) return "0%";
    return `${(v / containerRef.current.offsetHeight) * 100}%`;
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      className={cn("relative overflow-hidden cursor-crosshair", className)}
    >
      {children}
      
      {showZoom && (
        <motion.div
           style={{
             left: smoothX,
             top: smoothY,
             translateX: "-50%",
             translateY: "-50%",
             width: size,
             height: size,
             backgroundImage: `url('${(children as any)?.props?.src || (children as any)?.props?.children?.props?.src}')`,
             backgroundPositionX: backgroundX,
             backgroundPositionY: backgroundY,
             backgroundSize: `${zoom * 100}%`,
           }}
           className={cn(
             "absolute pointer-events-none rounded-full border-2 border-primary/50 shadow-2xl z-50 bg-no-repeat",
             classNameZoom
           )}
        />
      )}
    </div>
  );
};
