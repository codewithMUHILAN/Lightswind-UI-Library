import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "../lib/utils";

// Helper function to format the number
const formatValue = (val: number, precision: number, sep: string): string => {
  return val
    .toFixed(precision)
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};

export interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  separator?: string;
  interactive?: boolean;
  triggerOnView?: boolean;
  className?: string;
  numberClassName?: string;
  animationStyle?: "default" | "bounce" | "spring" | "gentle" | "energetic";
  colorScheme?: "default" | "gradient" | "primary" | "secondary" | "custom";
  customColor?: string;
  onAnimationComplete?: () => void;
}

const easingFunctions = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

const animationStyles = {
  default: { type: "tween" },
  bounce: { type: "spring", bounce: 0.25 },
  spring: { type: "spring", stiffness: 100, damping: 10 },
  gentle: { type: "spring", stiffness: 60, damping: 15 },
  energetic: { type: "spring", stiffness: 300, damping: 20 },
};

const colorSchemes = {
  default: "text-foreground",
  gradient: "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600",
  primary: "text-primary",
  secondary: "text-secondary",
  custom: "", // use customColor
};

export function CountUp({
  value,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  easing = "easeOut",
  separator = ",",
  interactive = false,
  triggerOnView = true,
  className,
  numberClassName,
  animationStyle = "default",
  colorScheme = "default",
  customColor,
  onAnimationComplete,
}: CountUpProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, function (latest) {
    return formatValue(latest, decimals, separator);
  });

  const animationConfig = {
    ...(animationStyles[animationStyle] as any),
    ease: easingFunctions[easing],
    duration: animationStyle === "default" ? duration : undefined,
  };

  useEffect(() => {
    if (!triggerOnView) {
      animate(count.get(), value, {
        ...animationConfig,
        onUpdate: function (latest) {
          return count.set(latest);
        },
        onComplete: function () {
          setHasAnimated(true);
          if (onAnimationComplete) onAnimationComplete();
        },
      });
      return;
    }

    const observer = new IntersectionObserver(
      function ([entry]) {
        if (entry.isIntersecting && !hasAnimated) {
          animate(count.get(), value, {
            ...animationConfig,
            onUpdate: function (latest) {
              return count.set(latest);
            },
            onComplete: function () {
              setHasAnimated(true);
              if (onAnimationComplete) onAnimationComplete();
            },
          });
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return function () {
      return observer.disconnect();
    };
  }, [value, triggerOnView, hasAnimated]);

  useEffect(
    function () {
      if (hasAnimated || !triggerOnView) {
        animate(count.get(), value, {
          ...animationConfig,
          onUpdate: function (latest) {
            return count.set(latest);
          },
          onComplete: onAnimationComplete,
        });
      }
    },
    [value, animationConfig, hasAnimated, triggerOnView, onAnimationComplete]
  );

  const colorClass =
    colorScheme === "custom" && customColor ? "" : colorSchemes[colorScheme];

  const getHoverAnimation = function () {
    if (!interactive) return {};
    return {
      whileHover: {
        scale: 1.05,
        filter: "brightness(1.1)",
        transition: { duration: 0.2 },
      },
      whileTap: {
        scale: 0.95,
        filter: "brightness(0.95)",
        transition: { duration: 0.1 },
      },
    };
  };

  return (
    <div
      ref={containerRef}
      // Using cn directly with string literals for classes
      className={cn(
        "inline-flex items-center justify-center text-4xl font-bold text-black dark:textwhite",
        className
      )}
    >
      <motion.div
        {...getHoverAnimation()}
        className={cn("flex items-center transition-all", colorClass, numberClassName)}
        style={colorScheme === "custom" && customColor ? { color: customColor } : undefined}
      >
        {prefix && <span className="mr-1 text-foreground">{prefix}</span>}
        <motion.span className=" text-foreground">{rounded}</motion.span>
        {suffix && <span className="ml-1  text-foreground">{suffix}</span>}
      </motion.div>
    </div>
  );
}