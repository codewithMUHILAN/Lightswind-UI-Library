import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
const AccordionContext = React.createContext(undefined);
const AccordionItemContext = React.createContext(undefined);
const Accordion = React.forwardRef(({ className, type = "multiple", value, defaultValue = [], onValueChange, children, ...props }, ref) => {
    // Always ensure values is an array, even if a single string is passed
    const [values, setValues] = React.useState(Array.isArray(value) ? value :
        value ? [value] :
            Array.isArray(defaultValue) ? defaultValue :
                defaultValue ? [defaultValue] : []);
    React.useEffect(() => {
        if (value !== undefined) {
            setValues(Array.isArray(value) ? value : value ? [value] : []);
        }
    }, [value]);
    const handleValueChange = React.useCallback((newValues) => {
        if (value === undefined) {
            setValues(newValues);
        }
        onValueChange?.(newValues);
    }, [onValueChange, value]);
    return (_jsx(AccordionContext.Provider, { value: { value: values, onValueChange: handleValueChange }, children: _jsx("div", { ref: ref, className: cn(className), ...props, children: children }) }));
});
Accordion.displayName = "Accordion";
const AccordionItem = React.forwardRef(({ className, value, disabled = false, children, ...props }, ref) => {
    return (_jsx(AccordionItemContext.Provider, { value: { value }, children: _jsx("div", { ref: ref, className: cn("border-b   text-black dark:text-white", className), "data-state": disabled ? "disabled" : undefined, "data-value": value, ...props, children: children }) }));
});
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context)
        throw new Error("AccordionTrigger must be used within an Accordion");
    const itemContext = React.useContext(AccordionItemContext);
    if (!itemContext)
        throw new Error("AccordionTrigger must be used within an AccordionItem");
    const { value: values, onValueChange } = context;
    const { value: itemValue } = itemContext;
    const isOpen = values.includes(itemValue);
    const handleToggle = () => {
        const newValues = isOpen
            ? values.filter(v => v !== itemValue)
            : [...values, itemValue];
        onValueChange(newValues);
    };
    return (_jsxs("button", { ref: ref, type: "button", className: cn(`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline 
          [&[data-state=open]>svg]:rotate-180`, className), onClick: handleToggle, "data-state": isOpen ? "open" : "closed", ...props, children: [children, _jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })] }));
});
AccordionTrigger.displayName = "AccordionTrigger";
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context)
        throw new Error("AccordionContent must be used within an Accordion");
    const itemContext = React.useContext(AccordionItemContext);
    if (!itemContext)
        throw new Error("AccordionContent must be used within an AccordionItem");
    const { value: values } = context;
    const { value: itemValue } = itemContext;
    const isOpen = values.includes(itemValue);
    return (_jsx("div", { ref: ref, className: cn("overflow-hidden text-sm transition-all", isOpen ? "animate-accordion-down" : "animate-accordion-up h-0", className), "data-state": isOpen ? "open" : "closed", ...props, children: _jsx("div", { className: cn("pb-4 pt-0"), children: children }) }));
});
AccordionContent.displayName = "AccordionContent";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
