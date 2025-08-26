import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
// Define button style variants
const toggleVariants = {
    variant: {
        default: "bg-transparent",
        outline: "border   bg-transparent hover:bg-accent hover:text-accent-foreground",
    },
    size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
    },
};
const Toggle = React.forwardRef(({ className, variant = "default", size = "default", children, pressed, defaultPressed = false, // Add default value
onPressedChange, ...props }, ref) => {
    // Use internal state if uncontrolled
    const [isPressed, setIsPressed] = React.useState(defaultPressed);
    // Determine if we're in controlled or uncontrolled mode
    const isControlled = pressed !== undefined;
    const dataState = isControlled ? pressed : isPressed;
    const handleClick = (event) => {
        // Don't update internal state if controlled
        if (!isControlled) {
            setIsPressed(!isPressed);
        }
        // Call the change handler if provided
        onPressedChange?.(!dataState);
        // Call the original onClick handler if it exists
        props.onClick?.(event);
    };
    return (_jsx("button", { ref: ref, type: "button", "aria-pressed": dataState, "data-state": dataState ? "on" : "off", className: cn("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground", toggleVariants.variant[variant], toggleVariants.size[size], className), onClick: handleClick, ...props, children: children }));
});
Toggle.displayName = "Toggle";
export { Toggle, toggleVariants };
