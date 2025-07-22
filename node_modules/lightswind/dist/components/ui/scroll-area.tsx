
import * as React from "react";
import { cn } from "../lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Reference to the viewport element */
  viewportRef?: React.RefObject<HTMLDivElement>;
  /** Maximum height of the scroll area */
  maxHeight?: string | number;
  /** Whether to show scrollbars */
  showScrollbars?: boolean;
  /** Whether to allow scrolling */
  scrollable?: boolean;
  /** The orientation of the scroll area */
  orientation?: "vertical" | "horizontal" | "both";
  /** Whether to smooth scroll */
  smooth?: boolean;
  /** Theme for the scrollbar */
  theme?: "default" | "minimal" | "none";
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ 
    className, 
    children, 
    viewportRef, 
    maxHeight,
    showScrollbars = true,
    scrollable = true,
    orientation = "vertical",
    smooth = false,
    theme = "default",
    ...props 
  }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const resolvedRef = viewportRef || internalRef;

    const style: React.CSSProperties = {
      maxHeight: maxHeight !== undefined ? (typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight) : undefined,
      ...props.style
    };

    // Orientation scroll classes
    const orientationClasses = {
      vertical: "overflow-y-auto overflow-x-hidden",
      horizontal: "overflow-x-auto overflow-y-hidden",
      both: "overflow-auto"
    };

    // Theme classes
    const themeClasses = {
      default: "themed-scrollbar",
      minimal: "minimal-scrollbar",
      none: "scrollbar-none"
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        style={style}
        {...props}
      >
        <div
          ref={resolvedRef}
          className={cn(
            "h-full w-full rounded-[inherit]",
            scrollable ? orientationClasses[orientation] : "overflow-hidden",
            smooth && "scroll-smooth",
            showScrollbars ? themeClasses[theme] : "scrollbar-none"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The orientation of the scrollbar */
  orientation?: "vertical" | "horizontal";
  /** Size of the scrollbar */
  size?: "thin" | "default" | "thick";
  /** Whether the scrollbar is visible */
  visible?: boolean;
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ 
    className, 
    orientation = "vertical", 
    size = "default",
    visible = false,
    ...props 
  }, ref) => {
    // Size classes
    const sizeClasses = {
      thin: orientation === "vertical" ? "w-1" : "h-1",
      default: orientation === "vertical" ? "w-1.5" : "h-1.5",
      thick: orientation === "vertical" ? "w-2" : "h-2"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex touch-none select-none transition-all",
          orientation === "vertical"
            ? `h-full ${sizeClasses[size]} border-l border-l-transparent p-[1px]`
            : `${sizeClasses[size]} flex-col border-t border-t-transparent p-[1px]`,
          visible ? "opacity-100" : "opacity-0 hover:opacity-100",
          className
        )}
        {...props}
      >
        <div className="relative flex-1 rounded-full bg-primary/50 hover:bg-primary transition-all duration-150" />
      </div>
    );
  }
);
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
