"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/utils";

interface AnimatedNumberStepperProps {
  /** Initial value */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** onChange callback */
  onChange?: (value: number) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Label for accessibility */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export function AnimatedNumberStepper({
  defaultValue = 1,
  min = 0,
  max = 99,
  step = 1,
  onChange,
  size = "md",
  label = "Quantity",
  className,
}: AnimatedNumberStepperProps) {
  const [value, setValue] = useState(defaultValue);
  const [direction, setDirection] = useState<"up" | "down">("up");

  const sizes = {
    sm: {
      container: "h-9 gap-1",
      button: "h-9 w-9 text-sm",
      display: "w-12 h-9 text-sm",
    },
    md: {
      container: "h-11 gap-1.5",
      button: "h-11 w-11",
      display: "w-16 h-11 text-base",
    },
    lg: {
      container: "h-14 gap-2",
      button: "h-14 w-14 text-lg",
      display: "w-20 h-14 text-lg",
    },
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const s = sizes[size];

  const handleDecrement = () => {
    if (value - step < min) return;
    setDirection("down");
    const next = Math.max(min, value - step);
    setValue(next);
    onChange?.(next);
  };

  const handleIncrement = () => {
    if (value + step > max) return;
    setDirection("up");
    const next = Math.min(max, value + step);
    setValue(next);
    onChange?.(next);
  };

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  const variants = {
    enter: (dir: "up" | "down") => ({
      y: dir === "up" ? 16 : -16,
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (dir: "up" | "down") => ({
      y: dir === "up" ? -16 : 16,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn("inline-flex items-center", s.container, className)}
      aria-label={label}
    >
      {/* Decrement Button */}
      <motion.button
        type="button"
        onClick={handleDecrement}
        disabled={isAtMin}
        aria-label="Decrement"
        className={cn(
          "relative flex items-center justify-center rounded-xl border bg-background shadow-sm transition-colors",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          s.button
        )}
        whileTap={{ scale: isAtMin ? 1 : 0.88 }}
        whileHover={{ scale: isAtMin ? 1 : 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Minus className={iconSizes[size]} />
      </motion.button>

      {/* Number Display */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-xl border bg-muted/30 font-semibold tabular-nums select-none",
          s.display
        )}
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.span
            key={value}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 500, damping: 35 },
              opacity: { duration: 0.12 },
            }}
            className="absolute"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Increment Button */}
      <motion.button
        type="button"
        onClick={handleIncrement}
        disabled={isAtMax}
        aria-label="Increment"
        className={cn(
          "relative flex items-center justify-center rounded-xl border bg-background shadow-sm transition-colors",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          s.button
        )}
        whileTap={{ scale: isAtMax ? 1 : 0.88 }}
        whileHover={{ scale: isAtMax ? 1 : 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Plus className={iconSizes[size]} />
      </motion.button>
    </div>
  );
}
