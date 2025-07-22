import * as React from "react";
import { cn } from "../lib/utils"; // Assuming this is a utility like classnames

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
    // Internal state for the slider values
    const [values, setValues] = React.useState<number[]>(value !== undefined ? value : defaultValue);
    // Index of the thumb currently being dragged
    const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
    // State to control tooltip visibility on hover
    const [tooltipHoverVisible, setTooltipHoverVisible] = React.useState<boolean>(false);

    // Ref to the slider track element to measure its dimensions
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Effect to synchronize internal state with controlled 'value' prop
    React.useEffect(() => {
      if (value !== undefined) {
        setValues(value);
      }
    }, [value]);

    /**
     * Calculates the percentage position of a value on the track.
     * @param val The value to convert to a percentage.
     * @returns The percentage (0-100)
     */
    const getValuePercent = React.useCallback((val: number) => {
      return ((val - min) / (max - min)) * 100;
    }, [min, max]);

    /**
     * Calculates the slider value from a given horizontal position on the track.
     * Applies snapping to 'step' if defined.
     * @param clientX The clientX coordinate of the pointer event.
     * @returns The calculated slider value.
     */
    const getValueFromClientX = React.useCallback((clientX: number) => {
      const trackRect = trackRef.current?.getBoundingClientRect();
      if (!trackRect) return min;

      // Calculate the position relative to the track's left edge
      const position = clientX - trackRect.left;
      // Clamp the position within the track's width
      const clampedPosition = Math.max(0, Math.min(trackRect.width, position));

      // Calculate the percentage of the track filled
      const percent = clampedPosition / trackRect.width;
      // Convert percentage to raw value within min/max range
      let rawValue = min + percent * (max - min);

      // Apply stepping if step is greater than 0
      if (step > 0) {
        rawValue = Math.round(rawValue / step) * step;
      }

      // Ensure the value is within the min/max bounds
      return Math.max(min, Math.min(max, rawValue));
    }, [min, max, step]);


    /**
     * Handles the start of a drag operation (pointer down on a thumb).
     * @param e The pointer event.
     * @param index The index of the thumb being dragged.
     */
    const handlePointerDown = React.useCallback((e: React.PointerEvent, index: number) => {
      if (disabled) return;
      e.preventDefault(); // Prevent default browser actions (like text selection)

      setDraggingIndex(index);
      // Tooltip visibility for dragging is handled directly in JSX based on `draggingIndex`

      // Capture the pointer to ensure events are received even if the pointer moves off the thumb
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [disabled]);

    /**
     * Handles pointer movement during a drag operation.
     */
    const handlePointerMove = React.useCallback((e: PointerEvent) => {
      if (draggingIndex === null || !trackRef.current) return;

      const newValue = getValueFromClientX(e.clientX);

      setValues(prevValues => {
        const newValues = [...prevValues];
        newValues[draggingIndex] = newValue;
        // Keep values sorted if there are multiple thumbs to prevent overlaps
        // Sort only if necessary (e.g., if it's a range slider where order matters)
        if (newValues.length > 1) {
          newValues.sort((a, b) => a - b);
        }
        return newValues;
      });

      // Notify parent immediately for smooth feedback.
      // The parent can debounce this callback if needed for external side effects.
      // Pass the current *derived* new values for the callback.
      onValueChange?.([...values].map((val, idx) => idx === draggingIndex ? newValue : val).sort((a, b) => a - b));

    }, [draggingIndex, getValueFromClientX, onValueChange, values]);


    /**
     * Handles the end of a drag operation (pointer up).
     */
    const handlePointerUp = React.useCallback((e: PointerEvent) => {
      if (draggingIndex !== null) {
        // Release pointer capture
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }

      setDraggingIndex(null);
      // Ensure onValueChange is called with the final value after drag ends
      onValueChange?.(values);
    }, [draggingIndex, onValueChange, values]);


    // Attach and clean up global pointer event listeners
    React.useEffect(() => {
      if (draggingIndex !== null) {
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
      } else {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      }
      // Cleanup on unmount or when draggingIndex changes
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }, [draggingIndex, handlePointerMove, handlePointerUp]);


    /**
     * Handles clicks on the track to move the closest thumb.
     * @param e The mouse event.
     */
    const handleTrackClick = React.useCallback((e: React.MouseEvent) => {
      if (disabled || draggingIndex !== null) return; // Prevent track click during active drag

      const newValue = getValueFromClientX(e.clientX);

      // Find the closest thumb to update
      const closestThumbIndex = values.reduce((closestIdx, currentValue, idx) => {
        const closestDiff = Math.abs(values[closestIdx] - newValue);
        const currentDiff = Math.abs(currentValue - newValue);
        return currentDiff < closestDiff ? idx : closestIdx;
      }, 0); // Start with index 0 as the closest

      setValues(prevValues => {
        const newValues = [...prevValues];
        newValues[closestThumbIndex] = newValue;
        if (newValues.length > 1) {
          newValues.sort((a, b) => a - b); // Keep sorted for multi-thumb
        }
        return newValues;
      });

      onValueChange?.(values); // Use the updated 'values' state for the callback
    }, [disabled, draggingIndex, getValueFromClientX, onValueChange, values]);


    /**
     * Handles keyboard controls for accessibility.
     * @param e The keyboard event.
     * @param index The index of the thumb.
     */
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent, index: number) => {
      if (disabled) return;

      let newValue = values[index];
      const effectiveStep = step > 0 ? step : (max - min) / 100; // Default to 1% of range if step is 0 or not provided
      const largeStep = (max - min) / 10; // 10% of total range

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          newValue = Math.min(max, newValue + effectiveStep);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          newValue = Math.max(min, newValue - effectiveStep);
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
          return; // Do not prevent default for unhandled keys
      }

      setValues(prevValues => {
        const newValues = [...prevValues];
        newValues[index] = newValue;
        if (newValues.length > 1) {
          newValues.sort((a, b) => a - b); // Keep sorted for multi-thumb
        }
        return newValues;
      });

      onValueChange?.(values); // Use the updated 'values' state for the callback
      e.preventDefault(); // Prevent default scrolling behavior
    }, [disabled, values, min, max, step, onValueChange]);

    // Handle mouse enter/leave for tooltips
    const handleThumbMouseEnter = React.useCallback(() => {
      if (!disabled) {
        setTooltipHoverVisible(true);
      }
    }, [disabled]);

    const handleThumbMouseLeave = React.useCallback(() => {
      setTooltipHoverVisible(false);
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center h-8", // Added h-8 for better click area
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {showLabels && (
          <div className="absolute w-full flex justify-between text-xs text-muted-foreground -top-2"> {/* Adjusted top */}
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
          {/* Render the filled track for single-thumb sliders */}
          {values.length === 1 && (
            <div
              className="absolute h-full bg-primary rounded-full transition-all duration-100 ease-out"
              style={{
                left: 0,
                width: `${getValuePercent(values[0])}%`
              }}
            />
          )}

          {/* Render the range for multi-thumb sliders */}
          {values.length > 1 && (
            <div
              className="absolute h-full bg-primary rounded-full transition-all duration-100 ease-out"
              style={{
                left: `${getValuePercent(Math.min(...values))}%`,
                width: `${getValuePercent(Math.max(...values)) - getValuePercent(Math.min(...values))}%`
              }}
            />
          )}
        </div>

        {/* Tooltips for each thumb */}
        {showTooltip && values.map((value, index) => (
          <div
            key={`tooltip-${index}`}
            className={cn(
              "absolute z-10 flex items-center justify-center",
              // Show tooltip if hovering OR currently dragging this thumb
              (tooltipHoverVisible || draggingIndex === index) ? "opacity-100" : "opacity-0",
              "transition-opacity duration-200",
              "pointer-events-none -top-8"
            )}
            style={{
              left: `${getValuePercent(value)}%`,
              transform: "translateX(-50%)", // Center tooltip precisely
            }}
          >
            <div className="px-2 py-1 text-xs font-semibold text-white dark:text-black bg-primary rounded shadow-sm whitespace-nowrap">
              {Math.round(value * 100) / 100}
            </div>
          </div>
        ))}

        {/* Thumbs for each value */}
        {values.map((value, index) => (
          <div
            key={`thumb-${index}`}
            className={cn(
              "absolute block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm",
              // Key change: Optimized transition for immediate feedback
              "transition-all duration-[50ms] ease-out", // Very short transition for responsiveness
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "hover:scale-110",
              draggingIndex === index && "scale-110 cursor-grabbing", // Apply dragging style
              disabled ? "cursor-not-allowed" : "cursor-grab",
              thumbClassName
            )}
            style={{
              left: `${getValuePercent(value)}%`,
              top: "50%",
              transform: "translate(-50%, -50%)", // Center thumb precisely
              touchAction: "none" // Prevents browser gestures like scrolling
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