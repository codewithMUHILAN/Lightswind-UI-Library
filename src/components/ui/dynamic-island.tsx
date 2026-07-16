"use client";
import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils";

export type IslandState = "idle" | "compact" | "expanded" | "long";

interface DynamicIslandProps {
  state: IslandState;
  children?: ReactNode;
  className?: string;
}

const sizeMapping = {
  idle: { width: 120, height: 35, borderRadius: 20 },
  compact: { width: 250, height: 50, borderRadius: 25 },
  long: { width: 350, height: 50, borderRadius: 25 },
  expanded: { width: 350, height: 200, borderRadius: 32 },
};

export const DynamicIsland = ({
  state = "idle",
  children,
  className,
}: DynamicIslandProps) => {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width: sizeMapping[state].width,
        height: sizeMapping[state].height,
        borderRadius: sizeMapping[state].borderRadius,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
      className={cn(
        "bg-black dark:bg-black overflow-hidden flex items-center justify-center relative shadow-2xl border border-zinc-900",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="w-full h-full absolute inset-0 text-white"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
