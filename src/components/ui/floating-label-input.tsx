"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils";

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, className, type, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const value = props.value as string;
    const isFloating = focused || (value && value.length > 0);

    return (
      <div className="relative w-full group">
        <input
          {...props}
          ref={ref}
          type={type}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "block w-full px-4 pt-6 pb-2 text-sm text-foreground bg-background rounded-2xl border border-border appearance-none focus:outline-none focus:ring-0 focus:border-primary transition-all duration-200 peer",
            className
          )}
          placeholder=" "
        />
        <label
          className={cn(
            "absolute text-sm text-muted-foreground duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none transition-all",
            isFloating ? "scale-75 -translate-y-3 text-primary" : ""
          )}
        >
          {label}
        </label>
        
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";
