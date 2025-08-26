import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion"; // Import motion and HTMLMotionProps
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    return (_jsx(motion.input, { type: type, className: cn(`flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-800 bg-background 
          px-3 py-2 text-base ring-offset-background/30 
          file:border-0 file:bg-transparent file:text-sm 
          file:font-medium file:text-foreground placeholder:text-muted-foreground 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
          md:text-sm`, className), ref: ref, onFocus: (e) => {
            setIsFocused(true);
            props.onFocus?.(e); // Call original onFocus if it exists
        }, onBlur: (e) => {
            setIsFocused(false);
            props.onBlur?.(e); // Call original onBlur if it exists
        }, 
        // Animate properties based on isFocused state
        animate: {
            scale: isFocused ? 1.005 : 1, // Slight scale up when focused
        }, transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
            duration: 0.1 // Keep duration very short
        }, ...props }));
});
Input.displayName = "Input";
export { Input };
