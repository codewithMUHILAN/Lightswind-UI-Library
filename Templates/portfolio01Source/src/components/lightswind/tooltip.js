import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils"; // Assuming utils.ts is in lib/
import { motion, AnimatePresence } from "framer-motion"; // Import Variants and Easing
const TooltipContext = React.createContext(undefined);
// --- Tooltip Component ---
const Tooltip = ({ children, content, defaultOpen = false, open: controlledOpen, onOpenChange, delayDuration = 300, hideDelay = 100, side = "top", align = "center", sideOffset = 8, variant = "default", hideArrow = false, maxWidth = "20rem", asChild = false, disabled = false, }) => {
    // Manage uncontrolled open state
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    // Determine if the component is controlled or uncontrolled
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    // Ref for the trigger element, passed via context to TooltipContentDisplay
    const triggerRef = React.useRef(null);
    // Function to update the open state, handling both controlled and uncontrolled modes
    const setOpen = React.useCallback((value) => {
        if (!isControlled) {
            setUncontrolledOpen(value);
        }
        if (onOpenChange) {
            // Calculate the new value if a function is passed
            const newValue = typeof value === "function" ? value(open) : value;
            onOpenChange(newValue);
        }
    }, [isControlled, onOpenChange, open]);
    // Refs for managing show/hide timeouts
    const showTimeoutRef = React.useRef(null);
    const hideTimeoutRef = React.useRef(null);
    // Memoize configuration object to prevent unnecessary re-renders
    const config = React.useMemo(() => ({
        side,
        align,
        sideOffset,
        variant,
        hideArrow,
        maxWidth,
    }), [side, align, sideOffset, variant, hideArrow, maxWidth]);
    // Clean up any pending timeouts on component unmount
    React.useEffect(() => {
        return () => {
            if (showTimeoutRef.current)
                clearTimeout(showTimeoutRef.current);
            if (hideTimeoutRef.current)
                clearTimeout(hideTimeoutRef.current);
        };
    }, []);
    // Memoize the context value to prevent unnecessary re-renders of consumers
    const contextValue = React.useMemo(() => ({
        open,
        setOpen,
        content,
        config,
        triggerRef, // Include triggerRef in context value
    }), [open, setOpen, content, config, triggerRef]);
    return (_jsx(TooltipContext.Provider, { value: contextValue, children: _jsxs("div", { className: "relative inline-block", children: [disabled ? children : (_jsx(TooltipTrigger, { delayDuration: delayDuration, hideDelay: hideDelay, asChild: asChild, triggerRef: triggerRef, children: children })), _jsx(TooltipContentDisplay, {})] }) }));
};
// --- TooltipTrigger Component ---
const TooltipTrigger = React.forwardRef(({ children, delayDuration, hideDelay, asChild = false, triggerRef }, ref) => {
    const context = React.useContext(TooltipContext);
    if (!context) {
        throw new Error("TooltipTrigger must be used within a Tooltip");
    }
    const { setOpen } = context;
    const showTimeoutRef = React.useRef(null);
    const hideTimeoutRef = React.useRef(null);
    // Handle mouse enter event
    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        showTimeoutRef.current = setTimeout(() => {
            setOpen(true);
        }, delayDuration);
    };
    // Handle mouse leave event
    const handleMouseLeave = () => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }
        hideTimeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, hideDelay);
    };
    // Combined ref to set both the forwarded ref and the internal triggerRef
    const combinedRef = React.useCallback((node) => {
        if (typeof ref === 'function') {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
        triggerRef.current = node; // Crucial: assign the actual DOM node to the context's triggerRef
    }, [ref, triggerRef]);
    // Props to be applied to the trigger element
    const triggerProps = {
        ref: combinedRef, // Use the combined ref
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave,
    };
    // If asChild is true, clone props onto the child element
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, triggerProps);
    }
    // Default rendering if asChild is false
    return (_jsx("div", { className: "inline-block relative" // Keeps the trigger as a block for correct positioning
        , ...triggerProps, children: children }));
});
TooltipTrigger.displayName = "TooltipTrigger";
// --- TooltipContentDisplay Component ---
// This component renders the actual tooltip content and handles its positioning.
const TooltipContentDisplay = () => {
    const context = React.useContext(TooltipContext);
    if (!context) {
        throw new Error("TooltipContentDisplay must be used within a Tooltip");
    }
    const { open, content, config, triggerRef } = context; // Get triggerRef from context
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const contentRef = React.useRef(null);
    // Define animation variants based on side
    const getAnimationVariants = React.useCallback(() => {
        const { side } = config;
        const distance = 5;
        return {
            hidden: {
                opacity: 0,
                x: side === 'left' ? distance : side === 'right' ? -distance : 0,
                y: side === 'top' ? distance : side === 'bottom' ? -distance : 0,
            },
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: { duration: 0.15, ease: "easeOut" } // Cast "easeOut" to Easing
            },
            exit: {
                opacity: 0,
                transition: { duration: 0.1, ease: "easeIn" } // Cast "easeIn" to Easing
            }
        };
    }, [config]);
    // Callback to update the tooltip's position
    const updatePosition = React.useCallback(() => {
        if (!contentRef.current || !triggerRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        // Get the rect of the closest relatively positioned parent (the outer Tooltip div)
        // We assume the parentElement of contentRef.current is the `relative inline-block` container.
        const parentRect = contentRef.current.parentElement.getBoundingClientRect();
        let x = 0;
        let y = 0;
        const { side, align, sideOffset } = config;
        // Calculate initial position based on side, relative to the trigger
        switch (side) {
            case "top":
                y = triggerRect.top - contentRect.height - sideOffset;
                break;
            case "bottom":
                y = triggerRect.bottom + sideOffset;
                break;
            case "left":
                x = triggerRect.left - contentRect.width - sideOffset;
                break;
            case "right":
                x = triggerRect.right + sideOffset;
                break;
        }
        // Adjust for alignment (horizontal for top/bottom, vertical for left/right)
        if (side === "top" || side === "bottom") {
            switch (align) {
                case "start":
                    x = triggerRect.left;
                    break;
                case "end":
                    x = triggerRect.right - contentRect.width;
                    break;
                default: // center
                    x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
                    break;
            }
        }
        else if (side === "left" || side === "right") {
            switch (align) {
                case "start":
                    y = triggerRect.top;
                    break;
                case "end":
                    y = triggerRect.bottom - contentRect.height;
                    break;
                default: // center
                    y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
                    break;
            }
        }
        // Convert viewport coordinates to coordinates relative to the parentRect
        // The tooltip will be absolutely positioned within the parent container
        setPosition({
            x: x - parentRect.left,
            y: y - parentRect.top,
        });
    }, [config, triggerRef]);
    // Effect to update position when tooltip becomes open or window resizes
    React.useEffect(() => {
        if (open) {
            // Use requestAnimationFrame or setTimeout for next tick to ensure contentRect is accurate
            // after AnimatePresence renders the div
            const id = requestAnimationFrame(updatePosition); // Better than setTimeout for layout
            // Re-calculate position on window resize to keep it attached
            window.addEventListener('resize', updatePosition);
            return () => {
                cancelAnimationFrame(id);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [open, updatePosition]);
    // Arrow positioning based on side and alignment
    const getArrowStyle = React.useCallback(() => {
        const { side, align } = config;
        const arrowSize = 8; // Size of the square div for the arrow
        let style = {
            position: 'absolute',
            width: arrowSize,
            height: arrowSize,
            transform: 'rotate(45deg)', // Rotate to form a diamond shape
            zIndex: -1, // Ensure arrow is behind the content
        };
        // Calculate position of the arrow relative to the tooltip content box
        switch (side) {
            case "top": // Arrow points down from the bottom of tooltip
                style.bottom = -arrowSize / 2;
                if (align === 'center')
                    style.left = '50%';
                else if (align === 'start')
                    style.left = '10%'; // 10% from start of tooltip content
                else
                    style.right = '10%'; // 10% from end of tooltip content (using right instead of left for end)
                break;
            case "bottom": // Arrow points up from the top of tooltip
                style.top = -arrowSize / 2;
                if (align === 'center')
                    style.left = '50%';
                else if (align === 'start')
                    style.left = '10%';
                else
                    style.right = '10%';
                break;
            case "left": // Arrow points right from the right of tooltip
                style.right = -arrowSize / 2;
                if (align === 'center')
                    style.top = '50%';
                else if (align === 'start')
                    style.top = '10%';
                else
                    style.bottom = '10%';
                break;
            case "right": // Arrow points left from the left of tooltip
                style.left = -arrowSize / 2;
                if (align === 'center')
                    style.top = '50%';
                else if (align === 'start')
                    style.top = '10%';
                else
                    style.bottom = '10%';
                break;
        }
        // For start/end alignment, ensure the transform origin is correct
        if (align !== 'center') {
            if (side === 'top' || side === 'bottom') {
                style.transformOrigin = (align === 'start' ? 'left center' : 'right center');
                if (align === 'start')
                    style.transform = 'translateX(50%) rotate(45deg)'; // Adjust to push arrow more towards edge
                else
                    style.transform = 'translateX(-50%) rotate(45deg)'; // Adjust to push arrow more towards edge
            }
            else { // left or right
                style.transformOrigin = (align === 'start' ? 'top center' : 'bottom center');
                if (align === 'start')
                    style.transform = 'translateY(50%) rotate(45deg)';
                else
                    style.transform = 'translateY(-50%) rotate(45deg)';
            }
        }
        return style;
    }, [config]);
    // Get variant-based background and text colors for tooltip body and arrow
    const getVariantClasses = React.useCallback(() => {
        const { variant } = config;
        switch (variant) {
            case 'info':
                return 'bg-blue-500 text-white';
            case 'success':
                return 'bg-green-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-black'; // Often warnings have black text
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-popover text-popover-foreground border border-gray-200 dark:border-gray-700'; // Default with border
        }
    }, [config]);
    // Don't render if not open
    if (!open)
        return null;
    return (_jsx(AnimatePresence, { children: _jsxs(motion.div, { ref: contentRef, style: {
                position: 'absolute', // Position absolute relative to the nearest positioned ancestor
                top: position.y,
                left: position.x,
                maxWidth: config.maxWidth,
            }, initial: "hidden", animate: "visible", exit: "exit", variants: getAnimationVariants(), className: cn("z-50 rounded px-3 py-1.5 text-xs shadow-md", getVariantClasses()), children: [!config.hideArrow && (_jsx("div", { className: cn("w-2 h-2 absolute", getVariantClasses(), // Apply variant classes for arrow background color
                    "before:content-[''] before:absolute before:inset-0 before:bg-inherit before:rounded-sm" // Pseudo-element for actual arrow body
                    ), style: getArrowStyle() })), content] }) }));
};
// Re-export as named export
export { Tooltip, TooltipTrigger };
// For legacy compatibility (if needed, otherwise remove)
export const Tooltips = Tooltip;
// Deprecated TooltipContent, kept for backward compatibility with a warning
export const TooltipContent = React.forwardRef((props, _ref) => {
    console.warn("TooltipContent is deprecated. Use the Tooltip component with content prop instead.");
    return _jsx("div", { ...props });
});
TooltipContent.displayName = "TooltipContent";
// Backward compatibility for TooltipProvider (if needed, otherwise remove)
export const TooltipProvider = ({ children }) => {
    return _jsx(_Fragment, { children: children });
};
