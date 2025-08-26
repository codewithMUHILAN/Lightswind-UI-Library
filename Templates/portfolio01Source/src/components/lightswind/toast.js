import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
import { Progress } from "./progress";
/* Toast Components */
const ToastProvider = ({ children }) => {
    return _jsx("div", { className: "toast-provider", children: children });
};
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn(`fixed z-[40] flex flex-col-reverse gap-2 right-4 
      top-4 w-auto max-w-sm `, className), ...props })));
ToastViewport.displayName = "ToastViewport";
const toastVariants = cva(`group relative flex w-96 items-center justify-between overflow-hidden rounded-md border   p-4 pr-8 shadow-lg transition-all 
  bg-background text-foreground`, {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "border-red-500 bg-red-100 text-red-800",
            success: "border-green-500 bg-green-100 text-green-800",
            warning: "border-yellow-500 bg-yellow-100 text-yellow-800",
            info: "border-blue-500 bg-blue-100 text-blue-800",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const Toast = React.forwardRef(({ className, variant = "default", duration = 5000, onClose, ...props }, ref) => {
    const [progress, setProgress] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(true);
    const intervalRef = React.useRef(null);
    React.useEffect(() => {
        if (!isOpen)
            return;
        const startTime = Date.now();
        const endTime = startTime + duration;
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        setProgress(0);
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const timeLeft = Math.max(0, endTime - now);
            const newProgress = 100 - (timeLeft / duration) * 100;
            setProgress(newProgress);
            if (newProgress >= 100) {
                clearInterval(intervalRef.current);
                setTimeout(() => {
                    setIsOpen(false);
                    onClose?.();
                }, 100);
            }
        }, 10);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [isOpen, duration, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { ref: ref, className: cn(toastVariants({ variant }), "relative z-50 pb-2", // Removed fixed positioning for better stacking
        className), style: {
            marginBottom: '8px', // Add spacing between toasts
            zIndex: 51 // Ensure proper stacking
        }, ...props, children: [_jsxs("div", { className: "w-full min-h-8", children: [props.children, _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1", children: _jsx(Progress, { value: progress, className: "h-1 rounded-none", indicatorClassName: cn(variant === "destructive" ? "bg-red-600" :
                                variant === "success" ? "bg-green-600" :
                                    variant === "warning" ? "bg-yellow-600" :
                                        variant === "info" ? "bg-blue-600" :
                                            "bg-gray-600") }) })] }), _jsx(ToastClose, { onClick: () => {
                    setIsOpen(false);
                    onClose?.();
                } })] }));
});
Toast.displayName = "Toast";
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (_jsx("button", { ref: ref, className: cn("absolute right-2 top-2 rounded-md p-1 text-foreground/70 opacity-70 transition-opacity hover:text-foreground hover:opacity-100", className), "aria-label": "Close toast", ...props, children: _jsx(X, { className: "h-4 w-4" }) })));
ToastClose.displayName = "ToastClose";
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h2", { ref: ref, className: cn("text-sm font-semibold", className), ...props })));
ToastTitle.displayName = "ToastTitle";
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn("text-sm opacity-90", className), ...props })));
ToastDescription.displayName = "ToastDescription";
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, };
