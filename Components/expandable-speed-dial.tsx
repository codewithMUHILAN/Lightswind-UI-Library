"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "../lib/utils";

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ExpandableSpeedDialProps {
  /** The actions to display when expanded */
  actions: SpeedDialAction[];
  /** The direction to expand the speed dial */
  direction?: "up" | "down" | "left" | "right";
  /** Optional classname for the container */
  className?: string;
  /** Size of the main button */
  size?: "sm" | "md" | "lg";
}

export function ExpandableSpeedDial({
  actions,
  direction = "up",
  className,
  size = "md",
}: ExpandableSpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const sizes = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  const actionSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getDirectionClasses = () => {
    switch (direction) {
      case "up":
        return "bottom-full mb-3 flex-col-reverse left-1/2 -translate-x-1/2";
      case "down":
        return "top-full mt-3 flex-col left-1/2 -translate-x-1/2";
      case "left":
        return "right-full mr-3 flex-row-reverse top-1/2 -translate-y-1/2";
      case "right":
        return "left-full ml-3 flex-row top-1/2 -translate-y-1/2";
      default:
        return "bottom-full mb-3 flex-col-reverse left-1/2 -translate-x-1/2";
    }
  };

  const getMotionVariants = (index: number) => {
    const delay = index * 0.05;
    const distance = 15;
    
    let x = 0;
    let y = 0;
    
    switch (direction) {
      case "up": y = distance; break;
      case "down": y = -distance; break;
      case "left": x = distance; break;
      case "right": x = -distance; break;
    }

    return {
      hidden: { opacity: 0, scale: 0.5, x, y },
      visible: { 
        opacity: 1, 
        scale: 1, 
        x: 0, 
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 20,
          delay
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.5, 
        x, 
        y,
        transition: {
          duration: 0.2,
          delay: (actions.length - 1 - index) * 0.05
        }
      }
    };
  };

  return (
    <div className={cn("relative z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <div className={cn("absolute flex gap-3", getDirectionClasses())}>
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                variants={getMotionVariants(index)}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "relative flex items-center justify-center rounded-full bg-background shadow-md border hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  actionSizes[size]
                )}
                title={action.label}
                aria-label={action.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {action.icon}
                
                {/* Tooltip for horizontal/vertical depending on direction */}
                {(direction === "up" || direction === "down") && (
                  <span className="absolute right-full mr-3 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block">
                    {action.label}
                  </span>
                )}
                {(direction === "left" || direction === "right") && (
                  <span className="absolute bottom-full mb-3 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block">
                    {action.label}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        className={cn(
          "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          sizes[size]
        )}
        aria-label="Toggle Speed Dial"
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center"
        >
          <Plus className={size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6"} />
        </motion.div>
      </motion.button>
    </div>
  );
}
