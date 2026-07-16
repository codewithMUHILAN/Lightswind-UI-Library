
import * as React from "react";
import { cn } from "@/components/lib/utils";

// Define button style variants
const toggleVariants = {
  variant: {
    default: "bg-transparent",
    outline: "border   bg-transparent hover:bg-accent hover:text-accent-foreground",
  },
  size: {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5",
  },
};

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof toggleVariants.variant;
  size?: keyof typeof toggleVariants.size;
  pressed?: boolean;
  defaultPressed?: boolean; // Add defaultPressed prop
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    children, 
    pressed, 
    defaultPressed = false, // Add default value
    onPressedChange,
    ...props 
  }, ref) => {
    // Use internal state if uncontrolled
    const [isPressed, setIsPressed] = React.useState(defaultPressed);
    
    // Determine if we're in controlled or uncontrolled mode
    const isControlled = pressed !== undefined;
    const dataState = isControlled ? pressed : isPressed;
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Don't update internal state if controlled
      if (!isControlled) {
        setIsPressed(!isPressed);
      }
      
      // Call the change handler if provided
      onPressedChange?.(!dataState);
      
      // Call the original onClick handler if it exists
      props.onClick?.(event);
    };
    
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={dataState}
        data-state={dataState ? "on" : "off"}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
          "[.lw-3d_&]:border [.lw-3d_&]:border-black/10 [.dark.lw-3d_&]:border-white/10",
          "data-[state=off]:[.lw-3d_&]:bg-gradient-to-b data-[state=off]:[.lw-3d_&]:from-white data-[state=off]:[.lw-3d_&]:to-zinc-50/95 data-[state=off]:[.dark.lw-3d_&]:from-zinc-900 data-[state=off]:[.dark.lw-3d_&]:to-zinc-950",
          "data-[state=off]:[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.45),0_1.5px_2px_0_rgba(0,0,0,0.06),0_1px_1px_0_rgba(0,0,0,0.04)]",
          "data-[state=off]:[.dark.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15),0_1.5px_2px_0_rgba(0,0,0,0.3)]",
          "data-[state=on]:[.lw-3d_&]:bg-accent/80",
          "data-[state=on]:[.lw-3d_&]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]",
          "data-[state=on]:[.dark.lw-3d_&]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
          toggleVariants.variant[variant],
          toggleVariants.size[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
