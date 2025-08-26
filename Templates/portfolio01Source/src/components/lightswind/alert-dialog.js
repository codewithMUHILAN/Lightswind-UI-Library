import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
const AlertDialogContext = React.createContext(undefined);
const AlertDialog = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange, }) => {
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
    return (_jsx(AlertDialogContext.Provider, { value: { open, setOpen }, children: children }));
};
const AlertDialogTrigger = React.forwardRef(({ children, asChild = false, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error("AlertDialogTrigger must be used within an AlertDialog");
    }
    const { setOpen } = context;
    const handleClick = (e) => {
        setOpen(true);
        // Call the original onClick if it exists
        if (props.onClick) {
            props.onClick(e);
        }
    };
    // Remove onClick from props to avoid duplicate handlers
    const { onClick, ...otherProps } = props;
    if (asChild) {
        return (_jsx(_Fragment, { children: React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        ...child.props,
                        ref,
                        onClick: handleClick
                    });
                }
                return child;
            }) }));
    }
    return (_jsx("button", { ref: ref, type: "button", onClick: handleClick, ...otherProps, children: children }));
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";
const AlertDialogPortal = ({ children }) => {
    return _jsx(_Fragment, { children: children });
};
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error("AlertDialogOverlay must be used within an AlertDialog");
    }
    const { open } = context;
    // It's less likely for AlertDialogOverlay to have conflicting props,
    // but if the error points here, apply the same filtering.
    // For now, we'll assume the primary issue is in AlertDialogContent.
    return (_jsx(AnimatePresence, { children: open && (_jsx("div", { ref: ref, className: cn("fixed inset-0 z-50 bg-black/80", className), ...props })) }));
});
AlertDialogOverlay.displayName = "AlertDialogOverlay";
const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error("AlertDialogContent must be used within an AlertDialog");
    }
    const { open, setOpen } = context;
    // Add click outside functionality
    const contentRef = React.useRef(null);
    React.useEffect(() => {
        if (!open)
            return;
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setOpen]);
    // Use AnimatePresence and motion.div for animation
    return (_jsx(AnimatePresence, { children: open && (_jsxs(AlertDialogPortal, { children: [_jsx(AlertDialogOverlay, {}), _jsx(motion.div, { ref: (node) => {
                        // Standard ref handling
                        if (typeof ref === "function") {
                            ref(node);
                        }
                        else if (ref) {
                            ref.current = node;
                        }
                        // Content ref for click outside
                        contentRef.current = node;
                    }, className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border   bg-background p-6 shadow-lg sm:rounded-lg", className), initial: { y: "-48%", x: "-50%", opacity: 0, scale: 0.95 }, animate: { y: "-50%", x: "-50%", opacity: 1, scale: 1 }, exit: { y: "-48%", x: "-50%", opacity: 0, scale: 0.95 }, transition: { duration: 0.2, ease: "easeInOut" }, ...Object.keys(props).reduce((acc, key) => {
                        // Add any other conflicting HTML attributes you might discover here.
                        // 'onDrag' is the most common one.
                        if (key === 'onDrag' || key === 'onAnimationStart' || key === 'onTransitionEnd') {
                            return acc; // Omit this property
                        }
                        acc[key] = props[key]; // Keep other properties
                        return acc;
                    }, {}), children: children })] })) }));
});
AlertDialogContent.displayName = "AlertDialogContent";
const AlertDialogHeader = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props }));
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props }));
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h2", { ref: ref, className: cn("text-lg font-semibold", className), ...props })));
AlertDialogTitle.displayName = "AlertDialogTitle";
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn("text-sm text-muted-foreground", className), ...props })));
AlertDialogDescription.displayName = "AlertDialogDescription";
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error("AlertDialogAction must be used within an AlertDialog");
    }
    const { setOpen } = context;
    const handleClick = (e) => {
        setOpen(false);
        // Call the original onClick if it exists
        if (props.onClick) {
            props.onClick(e);
        }
    };
    // Remove onClick from props to avoid duplicate handlers
    const { onClick, ...otherProps } = props;
    return (_jsx("button", { ref: ref, className: cn(buttonVariants(), className), onClick: handleClick, ...otherProps }));
});
AlertDialogAction.displayName = "AlertDialogAction";
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error("AlertDialogCancel must be used within an AlertDialog");
    }
    const { setOpen } = context;
    const handleClick = (e) => {
        setOpen(false);
        // Call the original onClick if it exists
        if (props.onClick) {
            props.onClick(e);
        }
    };
    // Remove onClick from props to avoid duplicate handlers
    const { onClick, ...otherProps } = props;
    return (_jsx("button", { ref: ref, className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className), onClick: handleClick, ...otherProps }));
});
AlertDialogCancel.displayName = "AlertDialogCancel";
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
