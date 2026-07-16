"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface RadioOption {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SmartRadioGroupProps {
  options: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SmartRadioGroup = ({
  options,
  defaultValue,
  onChange,
  className,
}: SmartRadioGroupProps) => {
  const [selected, setSelected] = useState(defaultValue || options[0]?.id);

  const handleSelect = (option: RadioOption) => {
    setSelected(option.id);
    if (onChange) onChange(option.value);
  };

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {options.map((option) => (
        <label
          key={option.id}
          onClick={() => handleSelect(option)}
          className={cn(
            "relative flex flex-col p-4 cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden",
            selected === option.id 
              ? "border-primary bg-primary/5 shadow-md" 
              : "border-border bg-background hover:border-border/80"
          )}
        >
          {selected === option.id && (
            <motion.div
              layoutId="radio-active-bg"
              className="absolute inset-0 bg-primary/5 z-0"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          <div className="relative z-10 flex items-center justify-between mb-2">
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              selected === option.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              {option.icon}
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              selected === option.id ? "border-primary" : "border-border"
            )}>
              {selected === option.id && (
                <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="w-2.5 h-2.5 rounded-full bg-primary" 
                />
              )}
            </div>
          </div>

          <div className="relative z-10 mt-2">
            <span className={cn(
               "font-bold text-sm block transition-colors",
               selected === option.id ? "text-primary" : "text-foreground"
            )}>
              {option.label}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};
