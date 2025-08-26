import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // Import HTMLMotionProps
const CollapsibleContext = React.createContext(undefined);
const Collapsible = React.forwardRef(({ children, open, defaultOpen = false, disabled = false, onOpenChange, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : isOpen;
    const handleOpenChange = React.useCallback((value) => {
        if (disabled)
            return;
        if (!isControlled) {
            setIsOpen(value);
        }
        onOpenChange?.(value);
    }, [disabled, isControlled, onOpenChange]);
    return (_jsx(CollapsibleContext.Provider, { value: { open: currentOpen, onOpenChange: handleOpenChange, disabled }, children: _jsx("div", { ref: ref, className: cn("", className), "data-state": currentOpen ? "open" : "closed", "data-disabled": disabled ? "" : undefined, ...props, children: children }) }));
});
Collapsible.displayName = "Collapsible";
const CollapsibleTrigger = React.forwardRef(({ className, children, asChild = false, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);
    if (!context) {
        throw new Error("CollapsibleTrigger must be used within a Collapsible");
    }
    const { open, onOpenChange, disabled } = context;
    const handleClick = () => {
        onOpenChange(!open);
    };
    if (asChild) {
        return (_jsx(_Fragment, { children: React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        ...child.props,
                        ref,
                        onClick: (e) => {
                            handleClick();
                            if (child.props.onClick) {
                                child.props.onClick(e);
                            }
                        },
                        disabled: disabled || child.props.disabled,
                        "data-state": open ? "open" : "closed",
                        "data-disabled": disabled ? "" : undefined,
                        "aria-expanded": open,
                    });
                }
                return child;
            }) }));
    }
    return (_jsx("button", { ref: ref, type: "button", disabled: disabled, "data-state": open ? "open" : "closed", "data-disabled": disabled ? "" : undefined, "aria-expanded": open, className: cn("", className), onClick: handleClick, ...props, children: children }));
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";
const CollapsibleContent = React.forwardRef(({ className, children, forceMount, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);
    if (!context) {
        throw new Error("CollapsibleContent must be used within a Collapsible");
    }
    const { open } = context;
    const contentRef = React.useRef(null); // Ref to measure content height
    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => contentRef.current);
    return (_jsxs(AnimatePresence, { initial: false, children: [" ", (open || forceMount) && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3, ease: "easeInOut" }, style: { overflow: 'hidden' }, 
                // The onAnimationStart and onAnimationComplete are not strictly necessary for basic height animation,
                // but can be useful for more complex scenarios or debugging.
                // onAnimationStart={() => { /* maybe add data-state="animating" */ }}
                // onAnimationComplete={() => { /* maybe remove data-state="animating" */ }}
                className: cn("overflow-hidden", // Keep overflow hidden for content clipping during animation
                className), "data-state": open ? "open" : "closed", ...props, children: _jsxs("div", { ref: contentRef, className: "pb-4", children: [" ", children] }) }, "collapsible-content" // Unique key for AnimatePresence to track
            ))] }));
});
CollapsibleContent.displayName = "CollapsibleContent";
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
