import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
// Define button style variants as a constant object (not exported)
const buttonStyles = {
    variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border   bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        github: "bg-white text-black hover:bg-gray-100 border   flex items-center gap-2 font-medium",
    },
    size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    }
};
// Define the buttonVariants function (exported)
export function buttonVariants(options = {}) {
    const { variant = "default", size = "default", className } = options;
    return cn(`inline-flex items-center justify-center gap-2 whitespace-nowrap 
    rounded-md text-sm font-medium ring-offset-background 
    transition-colors focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 
    disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
    [&_svg]:size-4 [&_svg]:shrink-0`, buttonStyles.variant[variant], buttonStyles.size[size], className);
}
const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    if (asChild) {
        return (_jsx(React.Fragment, { children: React.Children.map(props.children, child => {
                if (React.isValidElement(child)) {
                    // Instead of cloneElement with complex props, use a wrapper
                    return (_jsx("span", { className: buttonVariants({ variant, size, className }), children: child }));
                }
                return child;
            }) }));
    }
    return (_jsx("button", { className: buttonVariants({ variant, size, className }), ref: ref, ...props }));
});
Button.displayName = "Button";
export { Button };
