"use client";

import React from "react";
import { motion, type Variants } from "framer-motion"; // Import Variants type
import { cn } from "../lib/utils";

export interface ShinyTextProps {
  /** Text content to display */
  children: React.ReactNode;
  /** Disable the shiny animation */
  disabled?: boolean;
  /** Animation speed in seconds */
  speed?: number;
  /** Custom className */
  className?: string;
  /** Text size variant */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  /** Base text color */
  baseColor?: string;
  /** Shine effect color */
  shineColor?: string;
  /** Shine effect intensity (0-1) */
  intensity?: number;
  /** Animation direction */
  direction?: "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top";
  /** Shine effect width percentage */
  shineWidth?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Animation repeat behavior */
  repeat?: number | "infinite";
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Gradient type */
  gradientType?: "linear" | "radial";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const directionConfig = {
  "left-to-right": {
    backgroundPosition: ["100% 0%", "-100% 0%"],
    backgroundSize: "200% 100%",
  },
  "right-to-left": {
    backgroundPosition: ["-100% 0%", "100% 0%"],
    backgroundSize: "200% 100%",
  },
  "top-to-bottom": {
    backgroundPosition: ["0% 100%", "0% -100%"],
    backgroundSize: "100% 200%",
  },
  "bottom-to-top": {
    backgroundPosition: ["0% -100%", "0% 100%"],
    backgroundSize: "100% 200%",
  },
};

export function ShinyText({
  children,
  disabled = false,
  speed = 3,
  className,
  size = "base",
  weight = "medium",
  baseColor,
  shineColor,
  intensity = 1,
  direction = "left-to-right",
  shineWidth = 0,
  delay = 0,
  repeat = "infinite",
  pauseOnHover = false,
  gradientType = "linear",
}: ShinyTextProps) {
  const config = directionConfig[direction];

  const gradientDirection = direction === "left-to-right" || direction === "right-to-left"
    ? "90deg"
    : direction === "top-to-bottom"
    ? "180deg"
    : "0deg";

  // Default colors based on theme
  const defaultBaseColor = "hsl(var(--foreground)/20)";
  const defaultShineColor = "hsl(var(--primary)/20)";

  const finalBaseColor = baseColor || defaultBaseColor;
  const finalShineColor = shineColor || defaultShineColor;

  const createGradient = () => {
    const transparentStartPos = Math.max(0, (50 - shineWidth / 2));
    const transparentEndPos = Math.min(100, (50 + shineWidth / 2));

    const shineStart = `${finalShineColor} ${transparentStartPos}%`;
    const shineEnd = `${finalShineColor} ${transparentEndPos}%`;

    return gradientType === "linear"
      ? `linear-gradient(${gradientDirection}, ${finalBaseColor}, transparent ${transparentStartPos - 5}%, ${shineStart}, ${shineEnd}, transparent ${transparentEndPos + 5}%, ${finalBaseColor})`
      : `radial-gradient(ellipse at center, ${finalShineColor} ${intensity * 100}%, transparent)`;
  };

  // Define the animate state structure consistently
  const animationVariants: Variants = { // Explicitly type as Variants
    initial: {
      backgroundPosition: config.backgroundPosition[0],
    },
    animate: disabled
      ? {
          // When disabled, snap to initial position with no animation
          backgroundPosition: config.backgroundPosition[0],
          transition: {
            duration: 0,
            delay: 0,
            repeat: 0, // Explicitly define repeat and ease for consistent type
            ease: "linear", // Even if not used, keeps type consistent
          },
        }
      : {
          backgroundPosition: config.backgroundPosition[1],
          transition: {
            duration: speed,
            delay,
            repeat: typeof repeat === "number" ? repeat : Infinity,
            ease: "linear",
          },
        },
    hover: pauseOnHover ? {
      // Note: `animationPlayState` is a CSS property, Framer Motion variants
      // primarily animate numerical/string values. To truly pause a Framer Motion
      // animation, you'd typically use `useAnimationControls` and call `stop()`.
      // However, if this is a background CSS animation being controlled by Framer Motion's
      // `animate` prop, this might have an indirect effect or be ignored.
      // For a robust pause, consider a `useAnimationControls` hook.
      // Keeping it as is to preserve original logic for now, but be aware.
    } : {},
  };


  if (disabled) {
    return (
      <span
        className={cn(
          "inline-block",
          sizeClasses[size],
          weightClasses[weight],
          "text-foreground",
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent inline-block",
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
      style={{
        backgroundImage: createGradient(),
        backgroundSize: config.backgroundSize,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        opacity: intensity,
      }}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {children}
    </motion.span>
  );
}

export default ShinyText;