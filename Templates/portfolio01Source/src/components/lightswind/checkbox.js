import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { Check } from "lucide-react";
const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    React.useEffect(() => {
        if (checked !== undefined) {
            setIsChecked(checked);
            setIsAnimating(true);
            // Reset animation state after transition completes
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [checked]);
    const handleChange = (event) => {
        const newChecked = event.target.checked;
        setIsChecked(newChecked);
        setIsAnimating(true);
        // Reset animation state after transition completes
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
        onCheckedChange?.(newChecked);
        props.onChange?.(event);
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("input", { type: "checkbox", className: "absolute h-4 w-4 opacity-0", ref: ref, checked: isChecked, onChange: handleChange, ...props }), _jsx("div", { className: cn("peer h-4 w-4 shrink-0 rounded-sm border   ring-offset-background", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", "disabled:cursor-not-allowed disabled:opacity-50", "transition-all duration-300 ease-in-out", isAnimating && "scale-110", isChecked ? "bg-primary" : "bg-transparent hover:bg-primary/10", className), children: isChecked && (_jsx("div", { className: cn("flex items-center justify-center text-current", "animate-in fade-in-0 zoom-in-0 duration-300"), children: _jsx(Check, { className: "h-4 w-4 text-white dark:text-black" }) })) })] }));
});
Checkbox.displayName = "Checkbox";
export { Checkbox };
