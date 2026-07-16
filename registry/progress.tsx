
import * as React from "react";
import { cn } from "@/components/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value */
  value?: number;
  /** Maximum progress value */
  max?: number;
  /** Optional class name for the indicator element */
  indicatorClassName?: string;
  /** Whether to show indeterminate loading animation */
  indeterminate?: boolean;
  /** Color variant for the progress bar */
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  /** Size variant of the progress bar */
  size?: "sm" | "md" | "lg";
  /** Whether to show the progress value as text */
  showValue?: boolean;
  /** Animation speed for the progress transitions */
  animationSpeed?: "slow" | "normal" | "fast";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    indicatorClassName,
    indeterminate = false,
    color = "default",
    size = "md",
    showValue = false,
    animationSpeed = "normal",
    ...props 
  }, ref) => {
    const percentage = value ? (value / max) * 100 : 0;
    const [prevPercentage, setPrevPercentage] = React.useState(percentage);
    const [isAnimating, setIsAnimating] = React.useState(false);
    
    React.useEffect(() => {
      // Only animate when the value actually changes
      if (percentage !== prevPercentage) {
        setIsAnimating(true);
        setPrevPercentage(percentage);
        
        // Reset the animation state after the transition is complete
        const timeout = setTimeout(() => {
          setIsAnimating(false);
        }, 1000); // This should match the CSS transition duration
        
        return () => clearTimeout(timeout);
      }
    }, [percentage, prevPercentage]);
    
    // Color variants
    const colorVariants = {
      default: "bg-primary",
      primary: "bg-primary",
      secondary: "bg-secondary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500"
    };
    
    // Size variants
    const sizeVariants = {
      sm: "h-2",
      md: "h-4",
      lg: "h-6"
    };
    
    // Animation speed variants in milliseconds
    const animationSpeedMs = {
      slow: 1000,
      normal: 700,
      fast: 300
    };
    
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuetext={indeterminate ? undefined : `${Math.round(percentage)}%`}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          "transition-colors", // Smooth colors/shadows transition for theme toggle
          // 3D track recessed styling
          "[.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(255,255,255,0.05)]",
          "dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]",
          "[.lw-3d_&]:border [.lw-3d_&]:border-black/5 dark:[.lw-3d_&]:border-white/5",
          sizeVariants[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1",
            colorVariants[color],
            // 3D indicator raised styling
            "[.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-white/20 [.lw-3d_&]:to-black/10",
            "[.lw-3d_&]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_-1px_0_0_rgba(0,0,0,0.15)]",
            "dark:[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.35),inset_0_-1.5px_0_0_rgba(0,0,0,0.3)]",
            indeterminate ? "animate-progress-indeterminate origin-left" : "",
            indicatorClassName
          )}
          style={{
            ...(indeterminate ? {} : { transform: `translateX(-${100 - percentage}%)` }),
            transition: indeterminate
              ? "background-color 200ms, border-color 200ms, box-shadow 200ms"
              : isAnimating
              ? `transform ${animationSpeedMs[animationSpeed]}ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms, border-color 200ms, box-shadow 200ms`
              : "background-color 200ms, border-color 200ms, box-shadow 200ms"
          }}
        />
        {showValue && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center text-xs font-semibold",
            isAnimating ? "transition-opacity duration-300" : ""
          )}>
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
