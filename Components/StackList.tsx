"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type StackListItem = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  date: string;
};

type StackListProps = {
  items: StackListItem[];
  initialVisible?: number;
  className?: string; // allows custom responsive width/styling
};

export default function StackList({
  items,
  initialVisible = 1,
  className = "",
}: StackListProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, initialVisible);

  return (
    <div
      className={`bg-transparent text-foreground mx-auto  
         overflow-hidden ${className}`}
    >
      <div className="flex flex-col gap-4 relative">
        <AnimatePresence initial={false}>
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.title + index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-sm"
            >
              <div className="w-12 h-12 bg-background rounded-xl 
              flex items-center justify-center text-foreground">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </div>
                <div className="text-xs xl:text-sm text-gray-500 dark:text-gray-400">
                  {item.subtitle}
                </div>
              </div>
              <div className="text-xs xl:text-sm text-gray-400">{item.date}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length > initialVisible && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 mx-auto flex items-center justify-center gap-2 px-4 py-2
           border border-gray-300 dark:border-gray-700 rounded-full 
           text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-300 transition 
           hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <span>{expanded ? "Hide" : "Show All"}</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      )}
    </div>
  );
}
