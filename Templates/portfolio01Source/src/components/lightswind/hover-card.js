import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils"; // Ensure this utility is present or replace with className logic
import { motion, AnimatePresence } from "framer-motion"; // Import HTMLMotionProps
const HoverCardContext = React.createContext(undefined);
const HoverCard = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange, openDelay = 700, closeDelay = 300, }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = React.useCallback((value) => {
        if (!isControlled) {
            setUncontrolledOpen(value);
        }
        if (onOpenChange) {
            const newValue = typeof value === "function" ? value(open) : value;
            onOpenChange(newValue);
        }
    }, [isControlled, onOpenChange, open]);
    const openTimerRef = React.useRef(null);
    const closeTimerRef = React.useRef(null);
    const handleOpen = React.useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        if (!open) {
            openTimerRef.current = setTimeout(() => {
                setOpen(true);
            }, openDelay);
        }
    }, [open, openDelay, setOpen]);
    const handleClose = React.useCallback(() => {
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
        if (open) {
            closeTimerRef.current = setTimeout(() => {
                setOpen(false);
            }, closeDelay);
        }
    }, [open, closeDelay, setOpen]);
    // Clear timers on unmount
    React.useEffect(() => {
        return () => {
            if (openTimerRef.current)
                clearTimeout(openTimerRef.current);
            if (closeTimerRef.current)
                clearTimeout(closeTimerRef.current);
        };
    }, []);
    return (_jsx(HoverCardContext.Provider, { value: { open, setOpen }, children: _jsx("div", { className: "relative inline-block", onMouseEnter: handleOpen, onMouseLeave: handleClose, onFocusCapture: handleOpen, onBlurCapture: handleClose, children: children }) }));
};
const HoverCardTrigger = ({ children, asChild = false }) => {
    // If asChild is true, we just render the child directly.
    // The onMouseEnter/Leave/Focus/Blur listeners are on the parent HoverCard div.
    if (asChild) {
        return _jsx(_Fragment, { children: children });
    }
    // If not asChild, we wrap the children in a div to ensure the HoverCard has a DOM element to attach listeners to.
    // This div also needs to be part of the hover/focus interaction, so it's placed inside the HoverCard's event listeners.
    // The outer div in HoverCard handles the events, so this div simply renders the content.
    return _jsx("div", { tabIndex: 0, children: children }); // Add tabIndex for keyboard accessibility
};
const HoverCardContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    const context = React.useContext(HoverCardContext);
    if (!context) {
        throw new Error("HoverCardContent must be used within a HoverCard");
    }
    const { open } = context;
    return (_jsx(AnimatePresence, { children: open && ( // Conditionally render the motion.div based on `open` state
        _jsx(motion.div, { ref: ref, initial: { opacity: 0, scale: 0.95, y: -5 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -5 }, transition: { duration: 0.2, ease: "easeOut" }, className: cn(`absolute z-50 w-64 rounded-md border   bg-white
               p-4 text-black shadow-md`, className), style: {
                top: `calc(100% + ${sideOffset}px)`, // Position below the trigger
                left: align === "center" ? "50%" : align === "start" ? "0" : "auto",
                right: align === "end" ? "0" : "auto",
                transform: align === "center" ? "translateX(-50%)" : "none", // Center horizontally if align="center"
                // No need for transform here directly, framer-motion handles it
            }, ...props })) }));
});
HoverCardContent.displayName = "HoverCardContent";
// Exports
export { HoverCard, HoverCardTrigger, HoverCardContent };
