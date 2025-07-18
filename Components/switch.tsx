import * as React from "react";
import { cn } from "../lib/utils";

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
    const [isChecked, setIsChecked] = React.useState(
      checked !== undefined ? checked : defaultChecked || false
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const sizeClasses = {
      sm: {
        track: "h-4 w-8",
        thumb: "h-3 w-3",
        translate: "translate-x-4",
      },
      md: {
        track: "h-6 w-11",
        thumb: "h-5 w-5",
        translate: "translate-x-5",
      },
      lg: {
        track: "h-8 w-14",
        thumb: "h-7 w-7",
        translate: "translate-x-6",
      },
    };

    const animationClasses = {
      smooth: { transition: "transition-transform duration-200 ease-in-out" },
      bounce: { transition: "transition-transform duration-300 ease-spring" },
      slide: { transition: "transition-all duration-300 ease-out" },
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    const handleClick = () => {
      if (!props.disabled) {
        const newChecked = !isChecked;
        if (checked === undefined) {
          setIsChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
      }
    };

    const customTrackStyle = trackColor
      ? { backgroundColor: isChecked ? trackColor : undefined }
      : {};
    const customThumbStyle = thumbColor ? { backgroundColor: thumbColor } : {};

    return (
      <div
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-primary" : "bg-input",
          sizeClasses[size].track,
          className
        )}
        style={customTrackStyle}
        onClick={handleClick}
        role="switch"
        aria-checked={isChecked}
      >
        <input
          type="checkbox"
          className="absolute h-0 w-0 opacity-0"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          aria-hidden="true"
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0",
            isChecked ? sizeClasses[size].translate : "translate-x-0",
            sizeClasses[size].thumb,
            animationClasses[animation].transition
          )}
          style={{
            ...customThumbStyle,
            transform: isChecked
              ? `translateX(${sizeClasses[size].translate.split("-")[1]})`
              : "translateX(0)",
          }}
        />
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
