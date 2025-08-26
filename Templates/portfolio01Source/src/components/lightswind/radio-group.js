import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const RadioGroupContext = React.createContext(undefined);
const RadioGroup = React.forwardRef(({ className, value, defaultValue, onValueChange, name, orientation = "vertical", ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");
    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);
    const handleValueChange = React.useCallback((newValue) => {
        if (value === undefined) {
            setSelectedValue(newValue);
        }
        onValueChange?.(newValue);
    }, [onValueChange, value]);
    return (_jsx(RadioGroupContext.Provider, { value: { value: selectedValue, onValueChange: handleValueChange, name, orientation }, children: _jsx("div", { ref: ref, className: cn(orientation === "horizontal" ? "flex items-center space-x-4" : "grid gap-2", className), role: "radiogroup", ...props }) }));
});
RadioGroup.displayName = "RadioGroup";
const RadioGroupItem = React.forwardRef(({ className, value, customSize = "md", ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) {
        throw new Error("RadioGroupItem must be used within a RadioGroup");
    }
    const { value: selectedValue, onValueChange, name } = context;
    const checked = selectedValue === value;
    const [focused, setFocused] = React.useState(false);
    const radioRef = React.useRef(null);
    // Size mappings for custom sizes
    const sizeMap = {
        sm: { outer: "h-3.5 w-3.5", inner: "h-1.5 w-1.5", icon: "h-2 w-2" },
        md: { outer: "h-4 w-4", inner: "h-2 w-2", icon: "h-2.5 w-2.5" },
        lg: { outer: "h-5 w-5", inner: "h-2.5 w-2.5", icon: "h-3 w-3" }
    };
    const itemSize = sizeMap[customSize];
    const handleChange = () => {
        onValueChange(value);
    };
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    return (_jsxs("div", { className: "relative flex items-center space-x-2", children: [_jsxs("div", { ref: ref, className: "relative flex items-center", children: [_jsx("input", { ref: radioRef, type: "radio", value: value, checked: checked, name: name, className: "absolute h-0 w-0 opacity-0", onChange: handleChange, onFocus: handleFocus, onBlur: handleBlur, ...props }), _jsx("div", { className: cn("relative flex items-center justify-center rounded-full border   ring-offset-background transition-all duration-200", checked && "border-primary", focused && "ring-2 ring-ring ring-offset-2", props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", itemSize.outer, className), onClick: () => radioRef.current?.click(), children: _jsx("div", { className: cn("absolute rounded-full bg-primary scale-0 transition-transform duration-200 ease-in-out", checked && "scale-100", itemSize.inner) }) })] }), props.children && (_jsx("label", { htmlFor: props.id, className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", props.disabled && "opacity-50 cursor-not-allowed"), onClick: () => !props.disabled && radioRef.current?.click(), children: props.children }))] }));
});
RadioGroupItem.displayName = "RadioGroupItem";
export { RadioGroup, RadioGroupItem };
