import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
const NavigationMenuContext = React.createContext(undefined);
const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState({});
    const [activeItem, setActiveItem] = React.useState(null);
    const toggleMenu = React.useCallback((id) => {
        setOpen((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);
    return (_jsx(NavigationMenuContext.Provider, { value: { open, activeItem, toggleMenu, setActiveItem }, children: _jsxs("div", { ref: ref, className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className), ...props, children: [children, _jsx(NavigationMenuViewport, {})] }) }));
});
NavigationMenu.displayName = "NavigationMenu";
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (_jsx("ul", { ref: ref, className: cn("group flex flex-1 list-none items-center justify-center space-x-1", className), ...props })));
NavigationMenuList.displayName = "NavigationMenuList";
const NavigationMenuItem = React.forwardRef(({ className, value, ...props }, ref) => {
    return (_jsx("li", { ref: ref, className: cn("relative", className), "data-value": value, ...props }));
});
NavigationMenuItem.displayName = "NavigationMenuItem";
// Trigger style - now returns a string instead of using String constructor
const navigationMenuTriggerStyle = () => {
    return "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";
};
const NavigationMenuTrigger = React.forwardRef(({ className, children, id, ...props }, ref) => {
    const menuId = id || React.useId();
    const ctx = React.useContext(NavigationMenuContext);
    if (!ctx) {
        throw new Error("NavigationMenuTrigger must be used within NavigationMenu");
    }
    const { open, toggleMenu } = ctx;
    const isOpen = open[menuId] || false;
    return (_jsxs("button", { ref: ref, type: "button", className: cn(navigationMenuTriggerStyle(), "group", className), onClick: () => toggleMenu(menuId), "aria-expanded": isOpen, "aria-controls": `nav-menu-${menuId}`, "data-state": isOpen ? "open" : "closed", ...props, children: [children, " ", _jsx(ChevronDown, { className: "relative top-[1px] ml-1 h-3 w-3 transition duration-[200ms] group-data-[state=open]:rotate-180", "aria-hidden": "true" })] }));
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";
const NavigationMenuContent = React.forwardRef(({ className, children, id, forceMount = false, ...props }, ref) => {
    const menuId = id || React.useId();
    const ctx = React.useContext(NavigationMenuContext);
    if (!ctx) {
        throw new Error("NavigationMenuContent must be used within NavigationMenu");
    }
    const { open } = ctx;
    const isOpen = open[menuId] || false;
    if (!isOpen && !forceMount)
        return null;
    return (_jsx("div", { ref: ref, className: cn("absolute left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto", className), id: `nav-menu-${menuId}`, "data-state": isOpen ? "open" : "closed", ...props, children: children }));
});
NavigationMenuContent.displayName = "NavigationMenuContent";
const NavigationMenuLink = React.forwardRef(({ className, children, ...props }, ref) => {
    return (_jsx("a", { ref: ref, className: cn(navigationMenuTriggerStyle(), className), ...props, children: children }));
});
NavigationMenuLink.displayName = "NavigationMenuLink";
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => {
    const viewportRef = React.useRef(null);
    const ctx = React.useContext(NavigationMenuContext);
    if (!ctx) {
        return null;
    }
    const hasOpenMenu = Object.values(ctx.open).some(Boolean);
    return (_jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: _jsx("div", { ref: viewportRef, className: cn("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]", !hasOpenMenu && "hidden", className), ...props }) }));
});
NavigationMenuViewport.displayName = "NavigationMenuViewport";
const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => {
    const ctx = React.useContext(NavigationMenuContext);
    if (!ctx) {
        return null;
    }
    const hasActiveItem = !!ctx.activeItem;
    if (!hasActiveItem)
        return null;
    return (_jsx("div", { ref: ref, className: cn("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in", className), "data-state": hasActiveItem ? "visible" : "hidden", ...props, children: _jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-background shadow-md" }) }));
});
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";
export { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, };
