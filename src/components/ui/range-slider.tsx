import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  onChange,
  className,
}: RangeSliderProps) => {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className={cn("relative w-full h-10 flex items-center group", className)}>
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className="absolute w-full h-full opacity-0 cursor-pointer z-30"
      />
      
      <motion.div
        className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg z-20 pointer-events-none"
        style={{ left: `calc(${percentage}% - 12px)` }}
        animate={{ scale: isDragging ? 1.2 : 1 }}
      >
        <AnimatePresence>
          {(isDragging || true) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.5 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg"
            >
              {value}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
