"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command } from "lucide-react";
import { cn } from "../lib/utils";

interface ExpandableSearchBarProps {
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional onChange handler */
  onChange?: (value: string) => void;
  /** Optional onSubmit handler */
  onSubmit?: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** The maximum expanded width (Tailwind class or absolute value like "300px") */
  expandedWidth?: string | number;
}

export function ExpandableSearchBar({
  placeholder = "Search...",
  onChange,
  onSubmit,
  className,
  expandedWidth = "18rem", // 288px (w-72)
}: ExpandableSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle outside click to collapse if empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        value === ""
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  const handleClear = () => {
    setValue("");
    if (onChange) onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-end", className)}
      // Ensures the container takes up the max space when expanded to prevent layout shifts if needed
      style={{ width: isExpanded ? expandedWidth : "2.5rem" }}
    >
      <motion.form
        initial={false}
        animate={{
          width: isExpanded ? expandedWidth : "2.5rem",
          backgroundColor: isExpanded ? "var(--background)" : "var(--muted)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        onSubmit={handleSubmit}
        className={cn(
          "relative flex h-10 items-center overflow-hidden rounded-full border shadow-sm transition-colors focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0",
          isExpanded ? "border-border/50 bg-background" : "border-transparent bg-muted hover:bg-muted/80 cursor-pointer"
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <button
          type="button"
          className="absolute left-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground z-10 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
          onClick={() => {
            if (isExpanded && value === "") {
              setIsExpanded(false);
            } else if (!isExpanded) {
              setIsExpanded(true);
            }
          }}
          aria-label="Search"
          disabled={isExpanded && value !== ""}
        >
          <Search className="h-4 w-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="h-full w-full border-none bg-transparent pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-offset-0 focus-visible:ring-offset-0"
          style={{
            pointerEvents: isExpanded ? "auto" : "none",
            opacity: isExpanded ? 1 : 0,
            boxShadow: "none",
          }}
          tabIndex={isExpanded ? 0 : -1}
        />

        <AnimatePresence>
          {isExpanded && value === "" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-3 flex items-center justify-center pointer-events-none"
            >
              <div className="flex h-5 items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </motion.div>
          )}

          {isExpanded && value !== "" && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className="absolute right-0 flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
