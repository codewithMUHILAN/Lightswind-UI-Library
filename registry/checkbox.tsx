
import * as React from "react";
import { cn } from "@/components/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(
      checked !== undefined ? checked : (defaultChecked || false)
    );
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
        setIsAnimating(true);
        
        // Reset animation state after transition completes
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }, [checked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      setIsChecked(newChecked);
      setIsAnimating(true);
      
      // Reset animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      onCheckedChange?.(newChecked);
      props.onChange?.(event);
    };

    return (
      <div className="relative">
        <input
          type="checkbox"
          className="absolute h-4 w-4 opacity-0"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300 ease-in-out",
            isAnimating && "scale-110",
            "[.lw-3d_&]:border-black/10 dark:[.lw-3d_&]:border-white/10",
            isChecked 
              ? "bg-primary [.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-white/15 [.lw-3d_&]:to-black/15 [.lw-3d_&]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_-1px_0_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(0,0,0,0.05)]" 
              : "bg-transparent hover:bg-primary/10 [.lw-3d_&]:shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.15)]",
            className
          )}
        >
          {isChecked && (
            <div className={cn(
              "flex items-center justify-center text-current",
              "animate-in fade-in-0 zoom-in-0 duration-300"
            )}>
              <Check className="h-4 w-4 text-white dark:text-black" />
            </div>
          )}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
