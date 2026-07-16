import * as React from "react";
import { cn } from "@/components/lib/utils";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { BorderBeam } from "./border-beam";

// Extend HTMLMotionProps instead of React.InputHTMLAttributes directly
// HTMLMotionProps already includes React.InputHTMLAttributes
export interface InputProps extends HTMLMotionProps<"input"> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
     const [isFocused, setIsFocused] = React.useState(false);

    const classList = className ? className.split(/\s+/) : [];
    const layoutClasses = classList.filter((c) =>
      /^(col-span-|col-start-|col-end-|row-span-|row-start-|row-end-|flex-|shrink-|grow-|self-|order-|justify-self-|align-self-|w-|max-w-)/.test(c)
    );
    const otherClasses = classList.filter((c) =>
      !/^(col-span-|col-start-|col-end-|row-span-|row-start-|row-end-|flex-|shrink-|grow-|self-|order-|justify-self-|align-self-|w-|max-w-)/.test(c)
    );

    return (
      <div className={cn("relative w-full group/input", layoutClasses.join(" "))}>
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
            "[.lw-3d_&]:border-black/10 dark:[.lw-3d_&]:border-white/10",
            isFocused 
              ? "border-primary/50 dark:border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.05)] [.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_0_0_2px_rgba(23,62,255,0.4)] dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),0_0_0_2px_rgba(23,62,255,0.4)]" 
              : "[.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(255,255,255,0.05)] dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]",
            otherClasses.join(" ")
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