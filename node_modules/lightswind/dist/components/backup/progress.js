import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const Progress = React.forwardRef(({ className, value = 0, max = 100, indicatorClassName, indeterminate = false, color = "default", size = "md", showValue = false, animationSpeed = "normal", ...props }, ref) => {
    const percentage = value ? (value / max) * 100 : 0;
    const [prevPercentage, setPrevPercentage] = React.useState(percentage);
    const [isAnimating, setIsAnimating] = React.useState(false);
    React.useEffect(() => {
        // Only animate when the value actually changes
        if (percentage !== prevPercentage) {
            setIsAnimating(true);
            setPrevPercentage(percentage);
            // Reset the animation state after the transition is complete
            const timeout = setTimeout(() => {
                setIsAnimating(false);
            }, 1000); // This should match the CSS transition duration
            return () => clearTimeout(timeout);
        }
    }, [percentage, prevPercentage]);
    // Color variants
    const colorVariants = {
        default: "bg-primary",
        primary: "bg-primary",
        secondary: "bg-secondary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        danger: "bg-red-500"
    };
    // Size variants
    const sizeVariants = {
        sm: "h-2",
        md: "h-4",
        lg: "h-6"
    };
    // Animation speed variants
    const animationVariants = {
        slow: "duration-1000",
        normal: "duration-700",
        fast: "duration-300"
    };
    return (_jsxs("div", { ref: ref, role: "progressbar", "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": indeterminate ? undefined : value, "aria-valuetext": indeterminate ? undefined : `${Math.round(percentage)}%`, className: cn("relative w-full overflow-hidden rounded-full bg-secondary", sizeVariants[size], className), ...props, children: [_jsx("div", { className: cn("h-full w-full flex-1", colorVariants[color], indeterminate ? "animate-progress-indeterminate origin-left" : "", isAnimating ? "transition-all ease-out" : "", animationVariants[animationSpeed], indicatorClassName), style: indeterminate ? {} : { transform: `translateX(-${100 - percentage}%)` } }), showValue && (_jsxs("div", { className: cn("absolute inset-0 flex items-center justify-center text-xs font-semibold", isAnimating ? "transition-opacity duration-300" : ""), children: [Math.round(percentage), "%"] }))] }));
});
Progress.displayName = "Progress";
export { Progress };
