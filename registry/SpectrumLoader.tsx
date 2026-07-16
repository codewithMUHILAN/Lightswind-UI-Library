"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpectrumLoaderProps {
  size?: number;
  strokeWidth?: number;
  duration?: number;
  colors?: string[];
  glow?: boolean;
  className?: string;
}

export const SpectrumLoader = ({
  size = 48,
  strokeWidth = 4,
  duration = 2,
  colors = ["#ff8000", "#00ff19", "#9900ff", "#ffff00", "#FF0000", "#00CCFF"],
  glow = true,
  className,
}: SpectrumLoaderProps) => {
  const id = useId().replace(/:/g, "");
  const maskId = `mask-${id}`;
  const filterId = `glow-${id}`;

  return (
    <div 
      className={cn("relative flex items-center justify-center overflow-visible", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {glow && (
            <filter id={filterId} y="-100%" x="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
              <feColorMatrix type="saturate" values="3" />
              <feComposite in="SourceGraphic" operator="over" />
            </filter>
          )}
          
          {/* Gradients */}
          <radialGradient id={`${id}-a`} cx="0" cy="24" r="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colors[0]} />
            <stop offset="1" stopColor={colors[0]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-b`} cx="24" cy="24" r="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colors[1]} />
            <stop offset="1" stopColor={colors[1]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-c`} cx="12" cy="0" r="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colors[2]} />
            <stop offset="1" stopColor={colors[2]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-d`} cx="12" cy="12" r="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colors[3]} />
            <stop offset="1" stopColor={colors[3]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-e`} cx="0" cy="0" r="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colors[4]} />
            <stop offset="1" stopColor={colors[4]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-f`} cx="24" cy="0" r="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={colors[5]} />
            <stop offset="1" stopColor={colors[5]} stopOpacity="0" />
          </radialGradient>

          <mask id={maskId}>
            <motion.circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="white"
              strokeWidth={strokeWidth}
              pathLength="1.025"
              animate={{ 
                strokeDashoffset: [1.05, 2.1, 3.15],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
              style={{ strokeDasharray: "1.05" }}
            />
          </mask>
        </defs>

        {/* Static Background Ring */}
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="opacity-[0.08]"
        />

        {/* Rotating Content Group */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: duration * 1.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
          filter={glow ? `url(#${filterId})` : undefined}
        >
          <g mask={`url(#${maskId})`}>
            <rect fill={`url(#${id}-a)`} width="24" height="24" />
            <rect fill={`url(#${id}-b)`} width="24" height="24" />
            <rect fill={`url(#${id}-c)`} width="24" height="24" />
            <rect fill={`url(#${id}-d)`} width="24" height="24" />
            <rect fill={`url(#${id}-e)`} width="24" height="24" />
            <rect fill={`url(#${id}-f)`} width="24" height="24" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};

export default SpectrumLoader;
