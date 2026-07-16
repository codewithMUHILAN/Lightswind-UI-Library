"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface ExpandableSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  isSearching?: boolean;
}

/**
 * ExpandableSearch
 * 
 * A sleek, minimal search component that rests purely as an icon 
 * and expands fluidly into an input field using Framer Motion when interacted with.
 */
export const ExpandableSearch: React.FC<ExpandableSearchProps> = ({
  className,
  placeholder = "Search documents...",
  onSearch,
  isSearching = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchValue.trim().length > 0 && onSearch) {
      onSearch(searchValue);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={false}
      animate={{
        width: isExpanded ? 300 : 48,
        backgroundColor: isExpanded ? "var(--bg-muted)" : "transparent",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={cn(
        "relative flex items-center overflow-hidden rounded-full border shadow-sm transition-colors",
        isExpanded ? "border-border/60 bg-muted/30" : "border-border/40 hover:border-border/80 hover:bg-muted/10",
        className
      )}
      style={{ height: 48 }}
    >
      {/* Icon Button directly toggles state when closed, acts as submit when open */}
      <button
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
          } else {
            handleSearch();
          }
        }}
        className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground z-10"
        aria-label="Search"
      >
        {isSearching ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full items-center pl-12 pr-12"
          >
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="h-full w-full bg-transparent text-sm text-foreground outline-none border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/60"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isExpanded && searchValue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={clearSearch}
            className="absolute right-2 top-0 bottom-0 my-auto flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-neutral-800/10 hover:text-foreground cursor-pointer"
            aria-label="Clear Search"
          >
            <X className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
