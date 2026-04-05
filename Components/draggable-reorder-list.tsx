"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import { GripVertical, X, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export interface ReorderItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface DraggableReorderListProps {
  /** Initial items */
  items: ReorderItem[];
  /** Callback with new order when reordered */
  onReorder?: (items: ReorderItem[]) => void;
  /** Allow removing items */
  removable?: boolean;
  /** Additional classes */
  className?: string;
}

function Item({
  item,
  onRemove,
  removable,
}: {
  item: ReorderItem;
  onRemove: (id: string) => void;
  removable: boolean;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      className="relative"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        whileDrag={{
          scale: 1.03,
          boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
          zIndex: 50,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        onPointerDown={(e) => e.preventDefault()}
        className={cn(
          "flex items-center gap-3 rounded-xl border bg-background px-4 py-3",
          "shadow-sm hover:shadow-md transition-shadow cursor-default select-none"
        )}
      >
        {/* Drag Handle */}
        <motion.div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <GripVertical className="h-4 w-4" />
        </motion.div>

        {/* Icon */}
        {item.icon && (
          <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {item.icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pointer-events-none">
          <p className="text-sm font-medium truncate select-none">{item.label}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5 select-none">
              {item.description}
            </p>
          )}
        </div>

        {/* Remove Button */}
        {removable && (
          <motion.button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.label}`}
            className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors focus:outline-none"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </motion.div>
    </Reorder.Item>
  );
}

export function DraggableReorderList({
  items: initialItems,
  onReorder,
  removable = true,
  className,
}: DraggableReorderListProps) {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);

  const handleReorder = (newOrder: ReorderItem[]) => {
    setItems(newOrder);
    onReorder?.(newOrder);
  };

  const handleRemove = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    onReorder?.(next);
  };

  return (
    <div className={cn("w-full select-none", className)} style={{ userSelect: "none" }}>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="flex flex-col gap-2"
        as="div"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onRemove={handleRemove}
              removable={removable}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-muted-foreground gap-2"
        >
          <Plus className="h-5 w-5 opacity-40" />
          <p className="text-sm">All items removed</p>
        </motion.div>
      )}
    </div>
  );
}
