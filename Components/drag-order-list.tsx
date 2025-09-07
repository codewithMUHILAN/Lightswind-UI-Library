"use client";

import React, { useEffect } from "react";
import {
  useMotionValue,
  Reorder,
  useDragControls,
  motion,
  animate,
  DragControls,
} from "framer-motion";
import { GripVertical } from "lucide-react";

export interface DragItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  link?: string;
}

interface DragOrderListProps {
  items: DragItem[];
  onReorder?: (items: DragItem[]) => void;
}

export function DragOrderList({ items, onReorder }: DragOrderListProps) {
  const [list, setList] = React.useState(items);

  useEffect(() => {
    if (onReorder) onReorder(list);
  }, [list]);

  return (
    <Reorder.Group
      axis="y"
      values={list}
      onReorder={setList}
      className="space-y-4 w-full max-w-2xl mx-auto"
    >
      {list.map((item) => (
        <DragOrderItem key={item.id} item={item} />
      ))}
    </Reorder.Group>
  );
}

function DragOrderItem({ item }: { item: DragItem }) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      className="flex justify-between items-start p-4 bg-background 
     text-foreground rounded-xl border border-border shadow-sm"
    >
      <div className="flex flex-col space-y-1 flex-1">
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
        <span className="text-xs text-muted-foreground">{item.date}</span>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-blue-500 hover:underline"
          >
            More Info
          </a>
        )}
      </div>
      <ReorderHandle dragControls={dragControls} />
    </Reorder.Item>
  );
}

function ReorderHandle({ dragControls }: { dragControls: DragControls }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onPointerDown={(e) => {
        e.preventDefault();
        dragControls.start(e);
      }}
      className="cursor-grab active:cursor-grabbing p-2 text-muted-foreground"
    >
      <GripVertical />
    </motion.div>
  );
}

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

function useRaisedShadow(value: ReturnType<typeof useMotionValue>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "5px 5px 15px rgba(0,0,0,0.15)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value]);

  return boxShadow;
}
