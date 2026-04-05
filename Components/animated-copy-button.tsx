"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";

interface AnimatedCopyButtonProps {
  /** The text that will be copied to the clipboard */
  textToCopy: string;
  /** Optional classname for the button */
  className?: string;
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Optional callback fired when copied */
  onCopy?: () => void;
}

export function AnimatedCopyButton({
  textToCopy,
  className,
  size = "md",
  onCopy,
}: AnimatedCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      if (onCopy) onCopy();

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "relative flex items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sizes[size],
        className
      )}
      aria-label="Copy to clipboard"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute flex items-center justify-center text-green-500"
          >
            <Check className={iconSizes[size]} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute flex items-center justify-center text-foreground/70"
          >
            <Copy className={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Ripple Effect on Copy */}
      {isCopied && (
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-md bg-green-500/20"
        />
      )}
    </button>
  );
}
