import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
const SheetContext = React.createContext(undefined);
const Sheet = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = React.useCallback((value) => {
        if (!isControlled) {
            setUncontrolledOpen(value);
        }
        if (onOpenChange) {
            const nextValue = typeof value === "function" ? value(open) : value;
            onOpenChange(nextValue);
        }
    }, [isControlled, onOpenChange, open]);
    return (_jsx(SheetContext.Provider, { value: { open, setOpen }, children: children }));
};
const SheetTrigger = React.forwardRef(({ children, ...props }, forwardedRef) => {
    const { setOpen } = React.useContext(SheetContext) || { setOpen: () => { } };
    if (props.asChild) {
        // Ensure children is a single React element for asChild functionality
        const child = React.Children.only(children); // React.Children.only will throw if not single
        // Type check the child element to ensure it's valid for cloning
        if (!React.isValidElement(child)) {
            // Handle invalid child type, e.g., return null or throw an error
            console.error("SheetTrigger with `asChild` expects a single valid React element child.");
            return null; // Return null if the child is not a valid element
        }
        // Merge the forwarded ref with the child's existing ref
        const childRef = child.ref; // Get the ref directly from the child (can be function or object ref)
        const mergedRef = React.useCallback((node) => {
            // Call the forwarded ref
            if (typeof forwardedRef === 'function') {
                forwardedRef(node); // Ensure type consistency for HTMLButtonElement or null
            }
            else if (forwardedRef) {
                forwardedRef.current = node;
            }
            // Call the child's original ref
            if (typeof childRef === 'function') {
                childRef(node);
            }
            else if (childRef) {
                childRef.current = node;
            }
        }, [forwardedRef, childRef]);
        return React.cloneElement(child, {
            ...child.props,
            onClick: (e) => {
                setOpen(true);
                if (child.props.onClick)
                    child.props.onClick(e); // Call original onClick
            },
            ref: mergedRef, // Assign the merged ref
        });
    }
    return (_jsx("button", { ref: forwardedRef, type: "button", onClick: () => setOpen(true), ...props, children: children }));
});
SheetTrigger.displayName = "SheetTrigger";
const SheetClose = React.forwardRef(({ children, ...props }, ref) => {
    const { setOpen } = React.useContext(SheetContext) || { setOpen: () => { } };
    return (_jsx("button", { ref: ref, type: "button", onClick: () => setOpen(false), ...props, children: children }));
});
SheetClose.displayName = "SheetClose";
const SheetPortal = ({ children }) => {
    const { open } = React.useContext(SheetContext) || { open: false };
    return open ? _jsx(_Fragment, { children: children }) : null;
};
SheetPortal.displayName = "SheetPortal";
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => {
    const { setOpen } = React.useContext(SheetContext) || { setOpen: () => { } };
    // Destructure props to exclude common drag-related events and onAnimationStart
    const { onDrag: _, onDragEnd: __, onDragStart: ___, // Added onDragStart
    onDragExit: ____, // Added onDragExit (if it applies)
    onDragEnter: _____, // Added onDragEnter (if it applies)
    onDragLeave: ______, // Added onDragLeave (if it applies)
    onDragOver: _______, // Added onDragOver (if it applies)
    onDrop: ________, // Added onDrop (if it applies)
    onAnimationStart: _________, // Keep onAnimationStart
    ...restProps } = props;
    return (_jsx(motion.div, { ref: ref, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3, ease: "easeInOut" }, className: cn("fixed inset-0 z-50 bg-black/80", className), onClick: () => setOpen(false), ...restProps }));
});
SheetOverlay.displayName = "SheetOverlay";
// DEFINE sideVariants OUTSIDE of SheetContent
const sideVariants = {
    top: {
        initial: { y: "-100%" },
        animate: { y: "0%" },
        exit: { y: "-100%" },
    },
    bottom: {
        initial: { y: "100%" },
        animate: { y: "0%" },
        exit: { y: "100%" },
    },
    left: {
        initial: { x: "-100%" },
        animate: { x: "0%" },
        exit: { x: "-100%" },
    },
    right: {
        initial: { x: "100%" },
        animate: { x: "0%" },
        exit: { x: "100%" },
    },
};
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SheetContext) || { open: false, setOpen: () => { } };
    const contentLocalRef = React.useRef(null); // Initialize with null
    const combinedRef = React.useCallback((node) => {
        // Set the internal ref for click outside logic
        contentLocalRef.current = node;
        // Set the external ref passed to forwardRef
        if (typeof ref === 'function') {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
    }, [ref]);
    React.useEffect(() => {
        if (!open)
            return;
        const handleMouseDown = (event) => {
            if (contentLocalRef.current && !contentLocalRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, setOpen]);
    // Destructure props to exclude common drag-related events and onAnimationStart for Framer Motion compatibility
    const { onDrag: _, onDragEnd: __, onDragStart: ___, onDragExit: ____, onDragEnter: _____, onDragLeave: ______, onDragOver: _______, onDrop: ________, onAnimationStart: _________, ...restProps } = props;
    return createPortal(_jsx(AnimatePresence, { children: open && (_jsxs(SheetPortal, { children: [_jsx(SheetOverlay, {}), _jsxs(motion.div, { ref: combinedRef, initial: sideVariants[side].initial, animate: sideVariants[side].animate, exit: sideVariants[side].exit, transition: { duration: 0.3, ease: "easeInOut" }, className: cn("fixed z-50 gap-4 bg-background p-6 shadow-lg", side === "top" && "inset-x-0 top-0 border-b  ", side === "bottom" && "inset-x-0 bottom-0 border-t  ", side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r   sm:max-w-sm", side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l   sm:max-w-sm", className), ...restProps, children: [children, _jsxs(SheetClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Close" })] })] }, "sheet-content")] })) }), document.body);
});
SheetContent.displayName = "SheetContent";
const SheetHeader = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props }));
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props }));
SheetFooter.displayName = "SheetFooter";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h3", { ref: ref, className: cn("text-lg font-semibold text-foreground", className), ...props })));
SheetTitle.displayName = "SheetTitle";
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn("text-sm text-muted-foreground", className), ...props })));
SheetDescription.displayName = "SheetDescription";
export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, };
