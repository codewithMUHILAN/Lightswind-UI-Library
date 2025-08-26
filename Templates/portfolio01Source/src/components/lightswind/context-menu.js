import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
const ContextMenuContext = React.createContext(undefined);
function useContextMenu() {
    const context = React.useContext(ContextMenuContext);
    if (!context) {
        throw new Error("useContextMenu must be used within a ContextMenu");
    }
    return context;
}
const ContextMenu = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [subMenuOpen, setSubMenuOpen] = React.useState({});
    const [activeItem, setActiveItem] = React.useState(null);
    return (_jsx(ContextMenuContext.Provider, { value: {
            open,
            setOpen,
            position,
            setPosition,
            subMenuOpen,
            setSubMenuOpen,
            activeItem,
            setActiveItem,
        }, children: children }));
};
const ContextMenuTrigger = React.forwardRef(({ children, ...props }, ref) => {
    const { setOpen, setPosition } = useContextMenu();
    const handleContextMenu = (e) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setOpen(true);
    };
    return (_jsx("div", { ref: ref, onContextMenu: handleContextMenu, ...props, children: children }));
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";
const ContextMenuPortal = ({ children }) => {
    return _jsx(_Fragment, { children: children });
};
const ContextMenuContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const { open, position, setOpen } = useContextMenu();
    const contentRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const handleOutsideClick = (e) => {
                if (contentRef.current && !contentRef.current.contains(e.target)) {
                    setOpen(false);
                }
            };
            document.addEventListener("mousedown", handleOutsideClick);
            return () => {
                document.removeEventListener("mousedown", handleOutsideClick);
            };
        }
    }, [open, setOpen]);
    if (!open)
        return null;
    return (_jsx(ContextMenuPortal, { children: _jsx("div", { ref: ref, style: {
                position: "fixed",
                top: `${position.y}px`,
                left: `${position.x}px`,
                zIndex: 9999
            }, className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className), ...props, children: children }) }));
});
ContextMenuContent.displayName = "ContextMenuContent";
const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className), ...props }));
});
ContextMenuItem.displayName = "ContextMenuItem";
// Simplified implementation of other context menu components
const ContextMenuCheckboxItem = ({ children, checked, className, ...props }) => (_jsxs("button", { className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className), ...props, children: [_jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: checked && _jsx(Check, { className: "h-4 w-4" }) }), children] }));
const ContextMenuRadioItem = ({ children, className, ...props }) => (_jsxs("button", { className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className), ...props, children: [_jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(Circle, { className: "h-2 w-2 fill-current" }) }), children] }));
const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className), ...props })));
ContextMenuLabel.displayName = "ContextMenuLabel";
const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("-mx-1 my-1 h-px bg-background", className), ...props })));
ContextMenuSeparator.displayName = "ContextMenuSeparator";
const ContextMenuShortcut = ({ className, ...props }) => {
    return (_jsx("span", { className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className), ...props }));
};
// Simplified implementations for remaining context menu components
const ContextMenuGroup = ({ children, ...props }) => (_jsx("div", { ...props, children: children }));
const ContextMenuSub = ({ children }) => {
    return _jsx(_Fragment, { children: children });
};
const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (_jsxs("button", { ref: ref, className: cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", inset && "pl-8", className), ...props, children: [children, _jsx(ChevronRight, { className: "ml-auto h-4 w-4" })] })));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";
const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border   bg-popover p-1 text-popover-foreground shadow-md", className), ...props })));
ContextMenuSubContent.displayName = "ContextMenuSubContent";
const ContextMenuRadioGroup = ({ children, ...props }) => (_jsx("div", { ...props, children: children }));
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup, };
