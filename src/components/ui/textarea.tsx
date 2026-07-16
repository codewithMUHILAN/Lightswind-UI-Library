
import * as React from "react";
import { cn } from "@/components/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <textarea
        className={cn(
          `flex min-h-[80px] w-full rounded-md primarylw bg-background
           px-3 py-2 text-sm ring-offset-background border border-gray-300 dark:border-gray-800
           placeholder:text-muted-foreground focus-visible:outline-none 
           focus-visible:ring-2 focus-visible:ring-ring 
           focus-visible:ring-offset-2 disabled:cursor-not-allowed 
           disabled:opacity-50 transition-all duration-300`,
          "[.lw-3d_&]:border-black/10 dark:[.lw-3d_&]:border-white/10",
          "[.lw-3d_&]:focus-visible:ring-0 [.lw-3d_&]:focus-visible:ring-offset-0",
          isFocused 
            ? "border-primary/50 dark:border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.05)] [.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_0_0_2px_rgba(23,62,255,0.4)] dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),0_0_0_2px_rgba(23,62,255,0.4)]" 
            : "[.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(255,255,255,0.05)] dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]",
          className
        )}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        data-lenis-prevent
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
