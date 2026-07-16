"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export const TagInput = ({
  tags,
  setTags,
  placeholder = "Add tag...",
  className,
  maxTags = 10,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      setTags([...tags, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 p-2 rounded-xl border border-border bg-background transition-all duration-200",
        isFocused ? "ring-2 ring-primary/20 border-primary" : "hover:border-border/80 shadow-sm",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 pl-2">
        <TagIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <AnimatePresence initial={false}>
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:text-primary/70 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm p-1 placeholder:text-muted-foreground"
      />
      
      {inputValue && (
         <button 
           onClick={() => addTag(inputValue)}
           className="p-1 hover:bg-muted rounded-lg transition-colors mr-1"
         >
           <Plus className="h-4 w-4 text-muted-foreground" />
         </button>
      )}
    </div>
  );
};
