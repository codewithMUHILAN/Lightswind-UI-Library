import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "./dialog";
import { Search, Loader2, } from "lucide-react";
const CommandContext = React.createContext(undefined);
function useCommand() {
    const context = React.useContext(CommandContext);
    if (!context) {
        throw new Error("useCommand must be used within a Command component");
    }
    return context;
}
const Command = React.forwardRef(({ className, isLoading: controlledLoading, emptyMessage = "No results found.", ...props }, ref) => {
    const [value, setValue] = React.useState("");
    const [internalLoading, setInternalLoading] = React.useState(false);
    const isLoading = controlledLoading !== undefined ? controlledLoading : internalLoading;
    const filter = React.useCallback((items) => {
        if (!value)
            return items;
        return items.filter((item) => typeof item.label === "string"
            ? item.label.toLowerCase().includes(value.toLowerCase())
            : item.value.toLowerCase().includes(value.toLowerCase()));
    }, [value]);
    return (_jsx(CommandContext.Provider, { value: {
            value,
            onValueChange: setValue,
            filter,
            isLoading,
            setIsLoading: setInternalLoading,
            emptyMessage,
        }, children: _jsx("div", { ref: ref, className: cn(`flex h-full w-full flex-col overflow-hidden rounded-md
             bg-popover text-popover-foreground`, className), ...props, "cmdk-root": "" }) }));
});
Command.displayName = "Command";
const CommandDialog = ({ children, open, onOpenChange, className, }) => {
    // Prevent form submission causing page refresh
    const handleDialogClick = (e) => {
        // Prevent any click events from bubbling up to a form
        e.stopPropagation();
    };
    // Handle ESC key to close dialog
    React.useEffect(() => {
        if (!open)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (onOpenChange) {
                    onOpenChange(false);
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onOpenChange]);
    // Add body class to enable blur effect on the entire page
    React.useEffect(() => {
        if (open) {
            document.body.classList.add("command-dialog-open");
        }
        else {
            document.body.classList.remove("command-dialog-open");
        }
        return () => {
            document.body.classList.remove("command-dialog-open");
        };
    }, [open]);
    return (_jsxs(_Fragment, { children: [open && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm", "aria-hidden": "true" })), _jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsx(DialogContent, { className: cn(`fixed overflow-hidden p-0 shadow-xl border-muted/50 bg-background/90
             backdrop-blur-lg max-w-3xl z-50`, "top-[10vh] max-h-[80vh]", // Position from top with max height
                    className), onClick: handleDialogClick, children: _jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children: children }) }) })] }));
};
const CommandInput = React.forwardRef(({ className, onValueChange, isLoading: controlledLoading, ...props }, ref) => {
    const { value, onValueChange: contextOnValueChange, isLoading: contextLoading, } = useCommand();
    const isLoading = controlledLoading !== undefined ? controlledLoading : contextLoading;
    const handleChange = React.useCallback((e) => {
        e.preventDefault(); // Prevent form submission
        const newValue = e.target.value;
        if (onValueChange) {
            onValueChange(newValue);
        }
        else {
            contextOnValueChange(newValue);
        }
    }, [onValueChange, contextOnValueChange]);
    // Prevent form submission on key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };
    return (_jsxs("div", { className: "flex items-center border-b   px-3", "cmdk-input-wrapper": "", children: [isLoading ? (_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin opacity-70" })) : (_jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" })), _jsx("input", { ref: ref, value: props.value !== undefined ? props.value : value, onChange: handleChange, onKeyDown: handleKeyDown, className: cn(`flex h-11 w-full rounded-md bg-transparent py-3 text-sm border-none focus:border-none focus:ring-0 focus:outline-none 
   active:border-none active:ring-0 active:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50`, className), placeholder: props.placeholder || "Type to search...", "cmdk-input": "", autoComplete: "off", autoCorrect: "off", spellCheck: "false", "aria-autocomplete": "list", ...props })] }));
});
CommandInput.displayName = "CommandInput";
const CommandList = React.forwardRef(({ className, isLoading: controlledLoading, ...props }, ref) => {
    const { isLoading: contextLoading } = useCommand();
    const isLoading = controlledLoading !== undefined ? controlledLoading : contextLoading;
    return (_jsxs("div", { ref: ref, className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className), ...props, children: [isLoading && props.children && (_jsx("div", { className: "flex items-center justify-center py-6", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })), !isLoading && props.children] }));
});
CommandList.displayName = "CommandList";
const CommandEmpty = React.forwardRef((props, ref) => {
    const { emptyMessage } = useCommand();
    return (_jsx("div", { ref: ref, className: "py-6 text-center text-sm text-muted-foreground", ...props, children: props.children || emptyMessage || "No results found." }));
});
CommandEmpty.displayName = "CommandEmpty";
const CommandGroup = React.forwardRef(({ className, heading, ...props }, ref) => (_jsxs("div", { ref: ref, className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className), ...props, children: [heading && _jsx("div", { "cmdk-group-heading": "", children: heading }), props.children] })));
CommandGroup.displayName = "CommandGroup";
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("-mx-1 h-px bg-background", className), ...props })));
CommandSeparator.displayName = "CommandSeparator";
const CommandItem = React.forwardRef(({ className, disabled, onSelect, value, ...props }, ref) => {
    const [isSelected, setIsSelected] = React.useState(false);
    return (_jsx("div", { ref: ref, className: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50", isSelected && "bg-accent text-accent-foreground", className), "data-disabled": disabled ? "true" : undefined, "data-selected": isSelected ? "true" : undefined, "data-value": value, onMouseEnter: () => setIsSelected(true), onMouseLeave: () => setIsSelected(false), onClick: () => {
            if (!disabled && onSelect) {
                onSelect();
            }
        }, ...props }));
});
CommandItem.displayName = "CommandItem";
const CommandShortcut = ({ className, ...props }) => {
    return (_jsx("span", { className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className), ...props }));
};
CommandShortcut.displayName = "CommandShortcut";
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
