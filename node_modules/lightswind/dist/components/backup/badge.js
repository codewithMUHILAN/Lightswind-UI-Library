import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground",
            secondary: "border-transparent bg-secondary text-secondary-foreground",
            destructive: "border-transparent bg-destructive text-destructive-foreground",
            outline: "text-foreground",
            success: "border-transparent bg-green-500 text-white",
            warning: "border-transparent bg-amber-500 text-white",
            info: "border-transparent bg-blue-500 text-white",
        },
        size: {
            default: "px-2.5 py-0.5 text-xs",
            sm: "px-2 py-0.5 text-xs",
            lg: "px-3 py-1 text-sm",
        },
        shape: {
            default: "rounded-full",
            square: "rounded-sm",
            rounded: "rounded-md",
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default",
        shape: "default",
    },
});
function Badge({ className, variant, size, shape, withDot, dotColor = "currentColor", interactive, highlighted, ...props }) {
    return (_jsxs("div", { className: cn(badgeVariants({ variant, size, shape }), interactive && "cursor-pointer hover:opacity-80", highlighted && "ring-2 ring-offset-2 ring-ring", className), ...props, children: [withDot && (_jsx("span", { className: "mr-1 h-1.5 w-1.5 rounded-full inline-block", style: { backgroundColor: dotColor } })), props.children] }));
}
export { Badge, badgeVariants };
