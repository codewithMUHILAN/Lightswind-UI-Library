import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import HTMLMotionProps
const DrawerContext = React.createContext(undefined);
function useDrawerContext() {
    const context = React.useContext(DrawerContext);
    if (!context) {
        throw new Error("useDrawerContext must be used within a Drawer");
    }
    return context;
}
const Drawer = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange, }) => {
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
    return (_jsx(DrawerContext.Provider, { value: { open, setOpen }, children: children }));
};
const DrawerTrigger = React.forwardRef(({ children, ...props }, ref) => {
    const { setOpen } = useDrawerContext();
    return (_jsx("button", { ref: ref, type: "button", onClick: () => setOpen(true), ...props, children: children }));
});
DrawerTrigger.displayName = "DrawerTrigger";
const DrawerContent = React.forwardRef(({ children, className, ...props }, ref) => {
    const { open, setOpen } = useDrawerContext();
    // Use AnimatePresence to handle mount/unmount animations
    return createPortal(_jsx(AnimatePresence, { children: open && ( // Conditionally render the motion components based on `open` state
        _jsxs("div", { className: "fixed inset-0 z-50 flex flex-col items-center justify-end mx-auto", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "absolute inset-0 bg-black/80 backdrop-blur-sm ", onClick: () => setOpen(false), "aria-hidden": "true" // Hide from screen readers as it's purely visual
                 }), _jsxs(motion.div, { ref: ref, initial: { y: "100%" }, animate: { y: "0%" }, exit: { y: "100%" }, transition: { type: "spring", stiffness: 300, damping: 30 }, className: cn("relative z-50 w-full mx-auto rounded-t-md bg-background shadow-lg", // Max-width added for better visual on larger screens
                    className), role: "dialog", "aria-modal": "true", ...props, children: [_jsx("div", { className: "mx-auto my-2 h-1.5 w-16 rounded-full bg-muted" }), children, _jsxs("button", { onClick: () => setOpen(false), className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", "aria-label": "Close drawer", children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Close drawer" })] })] })] })) }), document.body);
});
DrawerContent.displayName = "DrawerContent";
// Add the missing exports for the Drawer components
const DrawerClose = React.forwardRef(({ children, ...props }, ref) => {
    const { setOpen } = useDrawerContext();
    return (_jsx("button", { ref: ref, type: "button", onClick: () => setOpen(false), ...props, children: children }));
});
DrawerClose.displayName = "DrawerClose";
const DrawerHeader = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left p-4", className), ...props }));
DrawerHeader.displayName = "DrawerHeader";
const DrawerFooter = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4", className), ...props }));
DrawerFooter.displayName = "DrawerFooter";
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h3", { ref: ref, className: cn("text-lg font-semibold text-foreground", className), ...props })));
DrawerTitle.displayName = "DrawerTitle";
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn("text-sm text-muted-foreground", className), ...props })));
DrawerDescription.displayName = "DrawerDescription";
export { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, };
