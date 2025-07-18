import * as React from "react";
import { cn } from "../lib/utils"; // Assuming 'cn' utility is correctly set up

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "size"
  > {
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  thumbColor?: string;
  trackColor?: string;
  animation?: "smooth" | "bounce" | "slide";
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      onCheckedChange,
      checked,
      defaultChecked,
      size = "md",
      thumbColor,
      trackColor,
      animation = "smooth",
      ...props
    },
    ref
  ) => {
    // Manages the internal checked state of the switch
    const [isChecked, setIsChecked] = React.useState(
      checked !== undefined ? checked : defaultChecked || false
    );

    // Synchronizes internal state with external 'checked' prop for controlled components
    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    // Defines Tailwind CSS classes for different switch sizes
    const sizeClasses = {
      sm: {
        track: "h-4 w-8",
        thumb: "h-3 w-3",
        translate: "translate-x-4", // Tailwind class for thumb movement
      },
      md: {
        track: "h-6 w-11",
        thumb: "h-5 w-5",
        translate: "translate-x-5", // Tailwind class for thumb movement
      },
      lg: {
        track: "h-8 w-14",
        thumb: "h-7 w-7",
        translate: "translate-x-6", // Tailwind class for thumb movement
      },
    };

    // Defines Tailwind CSS classes for different animation types
    const animationClasses = {
      smooth: { transition: "transition-transform duration-200 ease-in-out" },
      // Note: "ease-spring" is not a standard CSS easing function.
      // For a true spring animation, you'd typically need a CSS keyframe animation
      // or a JavaScript animation library. Using ease-in-out for demonstration.
      bounce: { transition: "transition-transform duration-300 ease-in-out" },
      slide: { transition: "transition-all duration-300 ease-out" },
    };

    // Handles changes from the hidden native checkbox input
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      // Only update internal state if the component is uncontrolled
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      // Call the external onCheckedChange handler
      onCheckedChange?.(newChecked);
    };

    // Handles clicks on the main div, simulating checkbox behavior
    const handleClick = () => {
      if (!props.disabled) {
        const newChecked = !isChecked;
        // Only update internal state if the component is uncontrolled
        if (checked === undefined) {
          setIsChecked(newChecked);
        }
        // Call the external onCheckedChange handler
        onCheckedChange?.(newChecked);
      }
    };

    // Apply custom track color dynamically based on isChecked state
    // The default Tailwind 'bg-primary' or 'bg-input' will be overridden if trackColor is provided.
    const customTrackStyle = trackColor
      ? { backgroundColor: isChecked ? trackColor : undefined } // Only applies custom color when checked
      : {};

    // Apply custom thumb color if provided
    const customThumbStyle = thumbColor ? { backgroundColor: thumbColor } : {};

    return (
      <div
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          // Default background colors for the track based on checked state
          isChecked ? "bg-primary" : "bg-input",
          // Apply size-specific track dimensions
          sizeClasses[size].track,
          className
        )}
        style={customTrackStyle} // Apply custom track background color
        onClick={handleClick} // Handle clicks on the track
        role="switch" // ARIA role for accessibility
        aria-checked={isChecked} // ARIA state for accessibility
      >
        {/* Hidden native checkbox to handle form submissions and accessibility */}
        <input
          type="checkbox"
          className="absolute h-0 w-0 opacity-0" // Visually hide the checkbox
          ref={ref} // Forward ref to the native input
          checked={isChecked} // Control the checked state of the native input
          onChange={handleChange} // Handle changes from the native input
          aria-hidden="true" // Hide from accessibility tree as visual role="switch" is used
          {...props} // Pass any other standard input props
        />
        {/* The thumb element that visually moves */}
        <span
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0",
            // Apply translation based on checked state using Tailwind classes
            isChecked ? sizeClasses[size].translate : "translate-x-0",
            // Apply size-specific thumb dimensions
            sizeClasses[size].thumb,
            // Apply animation class based on chosen animation type
            animationClasses[animation].transition
          )}
          style={customThumbStyle} // Apply custom thumb background color
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };