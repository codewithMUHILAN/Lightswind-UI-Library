import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
const alertVariants = {
    variant: {
        default: "bg-white dark:bg-black text-foreground",
        destructive: " border-gray-400 dark:border-gray-700/50 text-red-500  [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 dark:text-green-500 [&>svg]:text-green-500",
        warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-500 [&>svg]:text-yellow-500",
        info: "border-blue-500/50 text-blue-700 dark:text-blue-500 [&>svg]:text-blue-500",
    },
    size: {
        default: "p-4",
        sm: "p-3 text-sm",
        lg: "p-6 text-base"
    }
};
const Alert = React.forwardRef(({ className, variant = "default", size = "default", dismissible = false, onDismiss, withIcon = false, icon, children, ...props }, ref) => {
    // Icon mapping based on variant
    const variantIcons = {
        default: _jsx(Info, { className: "h-4 w-4" }),
        destructive: _jsx(AlertCircle, { className: "h-4 w-4" }),
        success: _jsx(CheckCircle, { className: "h-4 w-4" }),
        warning: _jsx(AlertTriangle, { className: "h-4 w-4" }),
        info: _jsx(Info, { className: "h-4 w-4" })
    };
    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
    };
    return (_jsxs("div", { ref: ref, role: "alert", className: cn("relative w-full rounded-lg border", withIcon && "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", withIcon && "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]", alertVariants.variant[variant], alertVariants.size[size], className), ...props, children: [withIcon && (icon || variantIcons[variant]), children, dismissible && (_jsx("button", { className: "absolute top-4 right-4 rounded-full p-1 \r\n            text-foreground/70 opacity-70 \r\n            transition-opacity hover:opacity-100 \r\n            focus:outline-none focus:ring-2 focus:ring-ring \r\n            focus:ring-offset-2", onClick: handleDismiss, "aria-label": "Dismiss alert", children: _jsx(X, { className: "h-4 w-4" }) }))] }));
});
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg"
    };
    return (_jsx("h5", { ref: ref, className: cn("mb-1 font-medium leading-none tracking-tight", sizeClasses[size], className), ...props }));
});
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, intensity = "default", ...props }, ref) => (_jsx("div", { ref: ref, className: cn("text-sm [&_p]:leading-relaxed", intensity === "muted" ? "text-muted-foreground" : "", className), ...props })));
AlertDescription.displayName = "AlertDescription";
export { Alert, AlertTitle, AlertDescription };
