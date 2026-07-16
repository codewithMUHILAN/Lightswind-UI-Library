"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface InViewStaggerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  staggerChildren?: number;
}

export const InViewStagger = ({ 
  children, 
  delay = 0,
  staggerChildren = 0.1,
  className 
}: InViewStaggerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
};

export const InViewItem = ({ 
  children, 
  variant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  },
  className 
}: { children: React.ReactNode; variant?: any; className?: string }) => {
  return (
    <motion.div variants={variant} className={className}>
      {children}
    </motion.div>
  );
};
