import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
function Skeleton({ className, variant = "default", width, height, animation = "pulse", shimmer = false, count = 1, ...props }) {
    // Variant classes
    const variantClasses = {
        default: "rounded-md",
        circle: "rounded-full",
        rounded: "rounded-xl",
        square: "rounded-none"
    };
    // Animation classes
    const animationClasses = {
        pulse: "animate-pulse",
        wave: "animate-shimmer",
        none: ""
    };
    // Style object for width and height
    const style = {
        width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
        ...props.style
    };
    // Render multiple skeleton items if count > 1
    if (count > 1) {
        return (_jsx("div", { className: cn("flex flex-col gap-2", className), ...props, children: Array.from({ length: count }).map((_, index) => (_jsx("div", { className: cn("bg-muted relative overflow-hidden", variantClasses[variant], animationClasses[animation], shimmer && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"), style: style }, index))) }));
    }
    return (_jsx("div", { className: cn("bg-primary/20 relative overflow-hidden", variantClasses[variant], animationClasses[animation], shimmer && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent", className), style: style, ...props }));
}
// Template Card Skeleton component for reuse
function TemplateCardSkeleton() {
    return (_jsx("div", { className: "rounded-lg border   bg-card overflow-hidden shadow-sm", children: _jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-48 w-full rounded-t-lg rounded-b-none", shimmer: true }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsx(Skeleton, { className: "h-6 w-3/4", shimmer: true }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full", shimmer: true }), _jsx(Skeleton, { className: "h-4 w-5/6", shimmer: true })] }), _jsxs("div", { className: "flex flex-wrap gap-2 pt-2", children: [_jsx(Skeleton, { className: "h-5 w-16 rounded-full", shimmer: true }), _jsx(Skeleton, { className: "h-5 w-20 rounded-full", shimmer: true }), _jsx(Skeleton, { className: "h-5 w-14 rounded-full", shimmer: true })] }), _jsxs("div", { className: "flex justify-between items-center pt-3", children: [_jsx(Skeleton, { className: "h-6 w-20", shimmer: true }), _jsx(Skeleton, { className: "h-9 w-28 rounded-md", shimmer: true })] })] })] }) }));
}
export { Skeleton, TemplateCardSkeleton };
