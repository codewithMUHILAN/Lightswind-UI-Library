"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings2, 
  X, 
  Sun, 
  Moon, 
  Share2, 
  Link2, 
  Twitter, 
  Compass, 
  ArrowUp, 
  Check,
  ChevronRight,
  Monitor
} from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface FluidActionPanelProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
  onThemeToggle?: () => void;
  isDark?: boolean;
}

export const FluidActionPanel = ({
  position = "bottom-right",
  className,
  onThemeToggle,
  isDark = false
}: FluidActionPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  // SVG circular path metrics
  const radius = 26;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // Stagger configurations for child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("fixed z-[9999] font-sans select-none", positionClasses[position], className)}
    >
      <motion.div
        layout
        initial={{ borderRadius: 30 }}
        animate={{ 
          width: isOpen ? 320 : 56,
          height: isOpen ? 385 : 56,
          borderRadius: isOpen ? 24 : 28
        }}
        transition={{ 
          type: "spring", 
          stiffness: 350, 
          damping: 28,
          mass: 0.8
        }}
        className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-2xl shadow-zinc-500/10 dark:shadow-black/50 overflow-hidden flex flex-col justify-start"
      >
        {/* Toggle Button wrapper (Always rendered at the top-left coordinate space of the layout container) */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 flex items-center justify-center relative focus:outline-none z-25 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* SVG Progress Ring */}
            <svg className="w-14 h-14 absolute rotate-[-90deg] pointer-events-none">
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="28"
                cy="28"
                className="text-zinc-900 dark:text-zinc-50 transition-all duration-75"
              />
            </svg>

            {/* Morphing Icon */}
            <AnimatePresence mode="wait">
              {!isOpen ? (
                <motion.div
                  key="settings"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Settings2 className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                </motion.div>
              ) : (
                <motion.div
                  key="close"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Action Panel Content (Animate in only when open) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="px-5 pb-5 flex flex-col gap-4 text-left flex-1"
            >
              {/* Header Info */}
              <motion.div variants={itemVariants} className="flex flex-col gap-0.5 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
                <span className="text-[10px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  System Hub
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-zinc-800 dark:text-zinc-200" /> Page Navigator
                </span>
              </motion.div>

              {/* Progress Indicator Card */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 p-3 rounded-xl shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Progress</span>
                  <span className="text-base font-black tracking-tight text-zinc-800 dark:text-zinc-200">
                    {Math.round(scrollProgress)}% Scrolled
                  </span>
                </div>
                <button
                  onClick={handleScrollToTop}
                  className="p-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center border border-transparent dark:border-zinc-200/50"
                  title="Scroll to Top"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Toggle controls grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
                {/* Theme Controller */}
                <button
                  onClick={onThemeToggle}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 hover:-translate-y-0.5 active:translate-y-0 transition-all gap-2 text-center text-zinc-700 dark:text-zinc-300"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Dark Theme</span>
                    </>
                  )}
                </button>

                {/* Link Copy Widget */}
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 hover:-translate-y-0.5 active:translate-y-0 transition-all gap-2 text-center text-zinc-700 dark:text-zinc-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Copy Link</span>
                    </>
                  )}
                </button>
              </motion.div>

              {/* Share hub row */}
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Quick Share
                </span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 hover:-translate-y-0.5 transition-all text-[11px] font-bold text-zinc-700 dark:text-zinc-300"
                  >
                    <Twitter className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    Twitter
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: document.title,
                          url: window.location.href
                        });
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 hover:-translate-y-0.5 transition-all text-[11px] font-bold text-zinc-700 dark:text-zinc-300"
                  >
                    <Share2 className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    System
                  </button>
                </div>
              </motion.div>

              {/* Footer specs */}
              <motion.div variants={itemVariants} className="flex justify-between items-center text-[9px] text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-2 mt-auto">
                <span className="flex items-center gap-1 font-bold">
                  <Monitor className="w-2.5 h-2.5" /> Lightswind UI
                </span>
                <span className="font-semibold">v1.2.6</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
