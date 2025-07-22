import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const ScrollArea = React.forwardRef(({ className, children, viewportRef, maxHeight, showScrollbars = true, scrollable = true, orientation = "vertical", smooth = false, theme = "default", ...props }, ref) => {
    const internalRef = React.useRef(null);
    const resolvedRef = viewportRef || internalRef;
    const style = {
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
    return (_jsx("div", { ref: ref, className: cn("relative overflow-hidden", className), style: style, ...props, children: _jsx("div", { ref: resolvedRef, className: cn("h-full w-full rounded-[inherit]", scrollable ? orientationClasses[orientation] : "overflow-hidden", smooth && "scroll-smooth", showScrollbars ? themeClasses[theme] : "scrollbar-none"), children: children }) }));
});
ScrollArea.displayName = "ScrollArea";
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", size = "default", visible = false, ...props }, ref) => {
    // Size classes
    const sizeClasses = {
        thin: orientation === "vertical" ? "w-1" : "h-1",
        default: orientation === "vertical" ? "w-1.5" : "h-1.5",
        thick: orientation === "vertical" ? "w-2" : "h-2"
    };
    return (_jsx("div", { ref: ref, className: cn("flex touch-none select-none transition-all", orientation === "vertical"
            ? `h-full ${sizeClasses[size]} border-l border-l-transparent p-[1px]`
            : `${sizeClasses[size]} flex-col border-t border-t-transparent p-[1px]`, visible ? "opacity-100" : "opacity-0 hover:opacity-100", className), ...props, children: _jsx("div", { className: "relative flex-1 rounded-full bg-primary/50 hover:bg-primary transition-all duration-150" }) }));
});
ScrollBar.displayName = "ScrollBar";
export { ScrollArea, ScrollBar };
