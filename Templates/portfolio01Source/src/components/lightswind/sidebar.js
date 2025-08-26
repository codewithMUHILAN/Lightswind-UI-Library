import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
// Re-implementing the 'cn' utility function directly for self-containment
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const SidebarContext = React.createContext(undefined);
export function SidebarProvider({ defaultExpanded = true, expanded: controlledExpanded, onExpandedChange, children, }) {
    const [expanded, setExpanded] = React.useState(defaultExpanded);
    const [activeMenuItem, setActiveMenuItem] = React.useState(null);
    const menuItemPosition = React.useRef({
        left: 0,
        width: 0,
        top: 0,
        height: 0,
    });
    const menuItemRefs = React.useRef(new Map());
    const menuRef = React.useRef(null);
    // NEW: State to force re-evaluation when menuItemRefs content might have changed
    const [menuRefsVersion, setMenuRefsVersion] = React.useState(0);
    const isControlled = controlledExpanded !== undefined;
    const actualExpanded = isControlled ? controlledExpanded : expanded;
    const onExpandedChangeRef = React.useRef(onExpandedChange);
    React.useEffect(() => {
        onExpandedChangeRef.current = onExpandedChange;
    }, [onExpandedChange]);
    const handleExpandedChange = React.useCallback((value) => {
        if (!isControlled) {
            setExpanded(value);
        }
        onExpandedChangeRef.current?.(value);
    }, [isControlled]);
    // NEW: Callback to increment the version when a menu item ref is added/removed
    const notifyMenuItemRefChange = React.useCallback(() => {
        setMenuRefsVersion((prev) => prev + 1);
    }, []);
    // Helper function to encapsulate indicator positioning logic
    const updateIndicatorPosition = React.useCallback((id) => {
        const indicator = menuRef.current?.querySelector(".sidebar-menu-indicator");
        if (id && menuRef.current) {
            const selectedItem = menuItemRefs.current.get(id);
            if (selectedItem) {
                const menuRect = menuRef.current.getBoundingClientRect();
                const rect = selectedItem.getBoundingClientRect();
                menuItemPosition.current = {
                    left: rect.left - menuRect.left,
                    width: rect.width,
                    top: rect.top - menuRect.top,
                    height: rect.height,
                };
                if (indicator) {
                    indicator.style.left = `${menuItemPosition.current.left}px`;
                    indicator.style.width = `${menuItemPosition.current.width}px`;
                    indicator.style.top = `${menuItemPosition.current.top}px`;
                    indicator.style.height = `${menuItemPosition.current.height}px`;
                    indicator.style.opacity = "1";
                }
            }
            else {
                // If selectedItem is not found (e.g., not yet mounted or invalid ID)
                // Ensure the indicator is hidden until the item is ready
                if (indicator) {
                    indicator.style.opacity = "0";
                }
            }
        }
        else {
            // If no active ID, hide the indicator
            if (indicator) {
                indicator.style.opacity = "0";
            }
        }
    }, [menuItemRefs, menuRef, menuItemPosition]);
    // Effect to set active menu item from URL
    React.useEffect(() => {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const path = url.pathname;
        let potentialMenuItemValue = null;
        if (searchParams.has("component")) {
            potentialMenuItemValue = searchParams.get("component");
        }
        else {
            const pathSegments = path.split("/").filter((segment) => segment);
            if (pathSegments.length > 0) {
                potentialMenuItemValue = pathSegments[pathSegments.length - 1];
            }
        }
        setActiveMenuItem(potentialMenuItemValue);
        // No need to call updateIndicatorPosition directly here.
        // The useLayoutEffect below, which depends on menuRefsVersion, will handle it.
    }, [window.location.pathname, window.location.search]);
    // Primary useLayoutEffect for synchronous indicator updates
    React.useLayoutEffect(() => {
        // This effect runs whenever activeMenuItem changes OR when menuRefsVersion increments.
        // By depending on menuRefsVersion, we ensure that if an item registers its ref
        // AFTER activeMenuItem is set (e.g., on initial load/navigation),
        // this effect will
        // re-run and find the newly available ref.
        updateIndicatorPosition(activeMenuItem);
    }, [activeMenuItem, menuRefsVersion, menuRef, updateIndicatorPosition]);
    // Effect to re-adjust on window resize/layout changes
    React.useEffect(() => {
        const handleResize = () => {
            if (activeMenuItem) {
                updateIndicatorPosition(activeMenuItem);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeMenuItem, updateIndicatorPosition]);
    return (_jsx(SidebarContext.Provider, { value: {
            expanded: actualExpanded,
            onChange: handleExpandedChange,
            activeMenuItem,
            setActiveMenuItem,
            menuItemPosition,
            menuItemRefs,
            menuRef,
            updateIndicatorPosition,
            notifyMenuItemRefChange, // Expose the new notification function
        }, children: children }));
}
export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
export function Sidebar({ className, children, ...props }) {
    const { expanded } = useSidebar();
    return (_jsx("div", { className: cn("h-full min-h-screen z-40 w-56 relative", 
        // expanded ? "" : "w-16",
        "bg-background border-r   shadow-sm", "fixed lg:sticky top-0 md:top-0", expanded ? "left-0" : "md:left-0 -left-full", className), role: "complementary", "data-collapsed": !expanded, ...props, children: children }));
}
export function SidebarTrigger({ className, ...props }) {
    const { expanded, onChange } = useSidebar();
    return (_jsxs("button", { type: "button", className: cn("inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "fixed md:static z-50 left-4 top-20", className), onClick: () => onChange(!expanded), "aria-label": expanded ? "Close sidebar" : "Open sidebar", ...props, children: [_jsx("span", { className: "sr-only", children: expanded ? "Close sidebar" : "Open sidebar" }), expanded ? (_jsx(ChevronLeft, { className: "h-4 w-4" })) : (_jsx(ChevronRight, { className: "h-4 w-4" }))] }));
}
export function SidebarHeader({ className, children, ...props }) {
    const { expanded } = useSidebar();
    return (_jsx("div", { className: cn("flex h-16 items-center border-b   px-4", expanded ? "justify-between" : "justify-center", className), ...props, children: children }));
}
export function SidebarContent({ className, children, ...props }) {
    const scrollRef = React.useRef(null);
    return (_jsx("div", { className: cn("flex-1 overflow-hidden h-[calc(100vh-4rem)] space-y-4 ", className), ...props, children: _jsx("div", { ref: scrollRef, className: "h-full pb-12 overflow-auto scrollbar-hide ", children: children }) }));
}
export function SidebarGroup({ className, children, ...props }) {
    return (_jsx("div", { className: cn("px-2 py-4", className), ...props, children: children }));
}
export function SidebarGroupLabel({ className, children, ...props }) {
    const { expanded } = useSidebar();
    if (!expanded) {
        return null;
    }
    return (_jsx("div", { className: cn("mb-2 px-2 text-md md:text-sm font-semibold md:font-bold tracking-tight", className), ...props, children: children }));
}
export function SidebarGroupContent({ className, children, ...props }) {
    return (_jsx("div", { className: cn("space-y-1", className), ...props, children: children }));
}
export function SidebarFooter({ className, children, ...props }) {
    const { expanded } = useSidebar();
    return (_jsx("div", { className: cn("flex border-t   p-4", expanded
            ? "flex-row items-center justify-between"
            : "flex-col justify-center", className), ...props, children: children }));
}
export function SidebarMenu({ className, children, ...props }) {
    const { menuRef } = useSidebar();
    return (
    // In your SidebarMenu component's div for the indicator:
    _jsxs("div", { ref: menuRef, className: cn("relative", className), ...props, children: [_jsx("div", { className: "sidebar-menu-indicator opacity-0 absolute ease-in-out \r\n      rounded-md bg-primarylw/10 dark:bg-greedy/10 border border-primarylw dark:border-greedy" }), _jsx("div", { className: "sidebar-menu-indicator/10 opacity-0 absolute \r\n        ease-in-out \r\n      rounded-md bg-primarylw/10 dark:bg-greedy/10" }), " ", children] }));
}
export function SidebarMenuItem({ className, children, value, ...props }) {
    const itemRef = React.useRef(null);
    // NEW: Get notifyMenuItemRefChange from context
    const { activeMenuItem, menuItemRefs, notifyMenuItemRefChange } = useSidebar();
    const menuItemId = value || React.useId();
    const isActive = activeMenuItem === menuItemId;
    const isInView = useInView(itemRef, { once: false, amount: 0.5 });
    // Register this menu item when it mounts
    // and NOTIFY the provider about the change
    React.useEffect(() => {
        if (itemRef.current) {
            menuItemRefs.current.set(menuItemId, itemRef.current);
            // Notify the provider that a ref has been added, potentially triggering
            // the useLayoutEffect if this item is the active one.
            notifyMenuItemRefChange();
        }
        return () => {
            menuItemRefs.current.delete(menuItemId);
            // Also notify when a ref is removed (component unmounts)
            notifyMenuItemRefChange();
        };
    }, [menuItemRefs, menuItemId, notifyMenuItemRefChange]); // Added notifyMenuItemRefChange to deps
    return (_jsx(motion.div, { ref: itemRef, className: cn("mb-1 scrollbar-hide", className), "data-value": menuItemId, "data-state": isActive ? "active" : "inactive", initial: { scale: 1, opacity: 0.5, x: -0 }, animate: {
            scale: isInView ? 1 : 0.6,
            opacity: isInView ? 1 : 0.5,
            x: isInView ? 0 : -60,
        }, transition: { duration: 0.4, ease: "easeOut" }, ...props, children: children }));
}
export function SidebarMenuButton({ className, children, asChild = false, value, ...props }) {
    const { expanded, activeMenuItem, setActiveMenuItem, updateIndicatorPosition, } = useSidebar();
    const menuItemId = value || React.useId();
    const isActive = activeMenuItem === menuItemId;
    const handleClick = React.useCallback(() => {
        setActiveMenuItem(menuItemId);
        // Explicitly call updateIndicatorPosition immediately on click.
        // This provides immediate visual feedback for direct clicks, overriding
        // any potential slight delay from the useLayoutEffect waiting for version update.
        updateIndicatorPosition(menuItemId);
        if (props.onClick && typeof props.onClick === "function") {
            const dummyEvent = {
                currentTarget: {},
                target: {},
                preventDefault: () => { },
                stopPropagation: () => { },
            };
            props.onClick(dummyEvent);
        }
    }, [menuItemId, setActiveMenuItem, updateIndicatorPosition, props.onClick]);
    const sharedClassName = "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ";
    if (!expanded) {
        if (asChild) {
            return (_jsx("div", { className: className, "data-active": isActive ? "true" : "false", onClick: handleClick, ...props, children: React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            ...child.props,
                            className: cn(sharedClassName, "justify-center p-2", "hover:bg-primary/10 hover:scale-110", isActive ? "text-primary font-medium" : "", child.props?.className),
                        });
                    }
                    return child;
                }) }));
        }
        return (_jsx("div", { className: cn(sharedClassName, "justify-center p-2", "hover:bg-primary/10 hover:scale-110", isActive ? "text-primary font-medium" : "", className), "data-active": isActive ? "true" : "false", onClick: handleClick, ...props, children: React.Children.toArray(children).filter((child) => React.isValidElement(child) && typeof child.type !== "string") }));
    }
    if (asChild) {
        return (_jsx("div", { className: className, "data-active": isActive ? "true" : "false", onClick: handleClick, ...props, children: React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        ...child.props,
                        className: cn(sharedClassName, "justify-start gap-2", "hover:bg-primary/10 hover:translate-x-1", isActive ? "text-primary font-medium" : "", child.props?.className),
                    });
                }
                return child;
            }) }));
    }
    return (_jsx("div", { className: cn(sharedClassName, "justify-start gap-2", "hover:bg-primary/10 hover:translate-x-1", isActive ? "text-primary font-medium" : "", className), "data-active": isActive ? "true" : "false", onClick: handleClick, ...props, children: children }));
}
export { Sidebar as SidebarRoot };
