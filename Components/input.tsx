import * as React from "react";
import { cn } from "../lib/utils";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { BorderBeam } from "./border-beam";

// Extend HTMLMotionProps instead of React.InputHTMLAttributes directly
// HTMLMotionProps already includes React.InputHTMLAttributes
export interface InputProps extends HTMLMotionProps<"input"> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="relative w-full group/input">
        <motion.input
          type={type}
          className={cn(
            `flex h-10 w-full rounded-md border border-muted-foreground/50 dark:border-muted-foreground/30 bg-background 
            px-3 py-2 text-base ring-offset-background/30 
            file:border-0 file:bg-transparent file:text-sm 
            file:font-medium file:text-foreground placeholder:text-muted-foreground 
            focus-visible:outline-none focus-visible:ring-0
            disabled:cursor-not-allowed disabled:opacity-70 
            md:text-sm transition-all duration-300`,
            isFocused ? "border-primary/50 dark:border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.05)]" : "",
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          {...props}
        />
        <AnimatePresence>
          {isFocused && (
            <BorderBeam
              size={120}
              duration={3}
              colorFrom="var(--primary, #3b82f6)"
              colorTo="#9c40ff"
              className="pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
