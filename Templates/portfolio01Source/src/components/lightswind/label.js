import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const Label = React.forwardRef(({ className, htmlFor, ...props }, ref) => {
    return (_jsx("label", { ref: ref, htmlFor: htmlFor, className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className), ...props }));
});
Label.displayName = "Label";
export { Label };
