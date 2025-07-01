import * as React from "react";
import { cn } from "../lib/utils";

interface SliderProps {
  defaultValue?: number[];
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  className?: string;
  showTooltip?: boolean;
  showLabels?: boolean;
  thumbClassName?: string;
  trackClassName?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof SliderProps>>(
  ({
    className,
    defaultValue = [0],
    value,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    disabled = false,
    showTooltip = false,
    showLabels = false,
    thumbClassName = "",
    trackClassName = "",
    ...props
  }, ref) => {
    const [values, setValues] = React.useState<number[]>(value !== undefined ? value : defaultValue);
    const [dragging, setDragging] = React.useState<number | null>(null);
    const [tooltipVisible, setTooltipVisible] = React.useState<boolean>(false);
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Update internal values when controlled value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setValues(value);
      }
    }, [value]);

    // Calculate the percentage position for a value
    const getValuePercent = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };

    // Calculate the value based on position percentage with smooth continuous values
    const getValueFromPosition = (position: number) => {
      const trackRect = trackRef.current?.getBoundingClientRect();
      if (!trackRect) return min;

      const percent = Math.max(0, Math.min(1, position / trackRect.width));
      const rawValue = min + percent * (max - min);

      // Apply stepping only if step is greater than 0
      const steppedValue = step > 0
        ? Math.round(rawValue / step) * step
        : rawValue;

      return Math.max(min, Math.min(max, steppedValue));
    };

    // Store a ref to the current values during dragging
    const currentValuesRef = React.useRef(values);
    React.useEffect(() => {
        currentValuesRef.current = values;
    }, [values]);

    // Store a ref to the current dragging index
    const currentDraggingRef = React.useRef(dragging);
    React.useEffect(() => {
        currentDraggingRef.current = dragging;
    }, [dragging]);


    // Handle mouse/touch events for dragging with smooth transitions
    const handlePointerDown = (e: React.PointerEvent, index: number) => {
      if (disabled) return;
      e.preventDefault();

      setDragging(index);
      setTooltipVisible(true);

      // Set pointer capture to handle events outside the element
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    };

    const handlePointerMove = React.useCallback((e: PointerEvent) => {
      const currentDragging = currentDraggingRef.current;
      const currentValues = currentValuesRef.current;

      if (currentDragging === null || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(trackRect.width, e.clientX - trackRect.left));
      const newValue = getValueFromPosition(position);

      // We should always update if dragging, to provide smooth feedback
      // even if the value falls within the same "step" visually.
      // The onValueChange will be debounced or optimized by the parent if needed.
      const newValues = [...currentValues];
      newValues[currentDragging] = newValue;

      // Update internal state immediately for visual feedback
      setValues(newValues);

      // Notify parent if needed
      // Consider debouncing onValueChange if performance is an issue for very frequent updates
      onValueChange?.(newValues);

    }, [onValueChange, min, max, step]); // Dependencies for useCallback are good

    const handlePointerUp = React.useCallback((e: PointerEvent) => {
      const currentDragging = currentDraggingRef.current;
      if (currentDragging !== null) {
        // Release pointer capture
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }

      setDragging(null);
      setTooltipVisible(false);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerMove]); // Only handlePointerMove is needed as a dependency for cleanup

    // Clean up event listeners on unmount
    React.useEffect(() => {
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }, [handlePointerMove, handlePointerUp]);


    // Handle track clicks for immediate value change
    const handleTrackClick = (e: React.MouseEvent) => {
      if (disabled || dragging !== null) return; // Prevent track click during active drag

      const trackRect = trackRef.current?.getBoundingClientRect();
      if (!trackRect) return;

      const position = e.clientX - trackRect.left;
      const newValue = getValueFromPosition(position);

      // Find the closest thumb to update
      const closestThumbIndex = values.reduce((closest, value, index) => {
        const closestDiff = Math.abs(values[closest] - newValue);
        const currentDiff = Math.abs(value - newValue);
        return currentDiff < closestDiff ? index : closest;
      }, 0);

      const newValues = [...values];
      newValues[closestThumbIndex] = newValue;

      // Update internal state
      setValues(newValues);

      // Notify parent if needed
      onValueChange?.(newValues);
    };

    // Handle keyboard controls for accessibility
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (disabled) return;

      let newValue = values[index];
      const smallStep = step || (max - min) / 100;
      const largeStep = ((max - min) / 10);

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          newValue = Math.min(max, newValue + smallStep);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          newValue = Math.max(min, newValue - smallStep);
          break;
        case "PageUp":
          newValue = Math.min(max, newValue + largeStep);
          break;
        case "PageDown":
          newValue = Math.max(min, newValue - largeStep);
          break;
        case "Home":
          newValue = min;
          break;
        case "End":
          newValue = max;
          break;
        default:
          return;
      }

      const newValues = [...values];
      newValues[index] = newValue;

      setValues(newValues);
      onValueChange?.(newValues);
      e.preventDefault();
    };

    // Handle mouse enter/leave for tooltips
    const handleThumbMouseEnter = () => {
      if (!disabled) {
        setTooltipVisible(true);
      }
    };

    const handleThumbMouseLeave = () => {
      if (dragging === null) {
        setTooltipVisible(false);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {showLabels && (
          <div className="absolute w-full flex justify-between text-xs text-muted-foreground -top-6">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        )}

        <div
          ref={trackRef}
          className={cn(
            "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",
            trackClassName
          )}
          onClick={handleTrackClick}
        >
          <div
            className={cn(
              "absolute h-full bg-primary transition-all",
              values.length > 1 ? "bg-transparent" : ""
            )}
            style={{
              left: 0,
              width: `${getValuePercent(Math.max(...values))}%`
            }}
          />
        </div>

        {values.map((value, index) => (
          <div
            key={index}
            className={cn(
              "absolute z-10 flex items-center justify-center",
              tooltipVisible && showTooltip ? "opacity-100" : "opacity-0",
              "transition-opacity duration-200",
              "pointer-events-none -top-8",
            )}
            style={{
              left: `calc(${getValuePercent(value)}% - 10px)`,
            }}
          >
            {showTooltip && (
              <div className="px-2 py-1 text-xs font-semibold text-white dark:text-black
               bg-primary rounded shadow-sm whitespace-nowrap">
                {Math.round(value * 100) / 100}
              </div>
            )}
          </div>
        ))}

        {values.map((value, index) => (
          <div
            key={index}
            className={cn(
              "absolute block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "hover:scale-110",
              dragging === index && "scale-110 cursor-grabbing",
              disabled ? "cursor-not-allowed" : "cursor-grab",
              thumbClassName
            )}
            style={{
              left: `calc(${getValuePercent(value)}% - 10px)`,
              top: "50%",
              transform: "translateY(-50%)",
              touchAction: "none"
            }}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onMouseEnter={handleThumbMouseEnter}
            onMouseLeave={handleThumbMouseLeave}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            tabIndex={disabled ? -1 : 0}
            data-disabled={disabled ? "" : undefined}
          />
        ))}
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };