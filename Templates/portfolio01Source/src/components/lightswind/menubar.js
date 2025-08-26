import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
const MenubarContext = React.createContext(undefined);
function useMenubarContext() {
    const context = React.useContext(MenubarContext);
    if (!context) {
        throw new Error("useMenubarContext must be used within a MenubarProvider");
    }
    return context;
}
function Menubar({ className, children, ...props }) {
    const [openMenu, setOpenMenu] = React.useState(null);
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            const menubarElement = e.target;
            const isClickInsideMenubarOrDropdown = menubarElement.closest('[role="menubar"]') || menubarElement.closest('[role="menu"]');
            if (openMenu && !isClickInsideMenubarOrDropdown) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenu]);
    return (_jsx(MenubarContext.Provider, { value: { openMenu, setOpenMenu }, children: _jsx("div", { className: cn("flex h-10 items-center space-x-1 rounded-md border   bg-background p-1", className), role: "menubar", ...props, children: children }) }));
}
function MenubarMenu({ value, children }) {
    // Always call useId unconditionally
    const generatedId = React.useId();
    // Then, use the provided value if it exists, otherwise use the generatedId
    const menuId = value ?? generatedId; // Use nullish coalescing operator for clarity
    return (_jsx("div", { className: "relative", "data-value": menuId, children: children }));
}
function MenubarTrigger({ className, children, ...props }) {
    const { openMenu, setOpenMenu } = useMenubarContext();
    const triggerRef = React.useRef(null);
    const [menuId, setMenuId] = React.useState("");
    React.useEffect(() => {
        if (triggerRef.current) {
            setMenuId(triggerRef.current.parentElement?.getAttribute("data-value") || "");
        }
    }, []); // Empty dependency array means this runs once on mount
    const isOpen = openMenu === menuId;
    const handleClick = (e) => {
        e.stopPropagation();
        setOpenMenu(isOpen ? null : menuId);
    };
    return (_jsx("button", { ref: triggerRef, type: "button", role: "menuitem", className: cn("flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", className), "aria-expanded": isOpen, "data-state": isOpen ? "open" : "closed", onClick: handleClick, ...props, children: children }));
}
function MenubarContent({ className, children, ...props }) {
    const { openMenu } = useMenubarContext();
    const menuContentRef = React.useRef(null);
    const [currentMenuId, setCurrentMenuId] = React.useState(null);
    React.useEffect(() => {
        if (menuContentRef.current) {
            const parentDataValue = menuContentRef.current.parentElement?.getAttribute("data-value");
            setCurrentMenuId(parentDataValue || null);
        }
    }, []);
    const shouldBeOpen = openMenu === currentMenuId;
    return (_jsx(AnimatePresence, { children: shouldBeOpen && (_jsx(motion.div, { ref: menuContentRef, initial: { opacity: 0, y: -5, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -5, scale: 0.95 }, transition: { duration: 0.15, ease: "easeOut" }, className: cn(`absolute left-0 top-0 z-50 mt-10 min-w-[8rem] flex-col
             rounded-md border   bg-popover p-1
             text-popover-foreground shadow-md`, className), role: "menu", ...props, children: children })) }));
}
function MenubarItem({ className, inset, children, ...props }) {
    const { setOpenMenu } = useMenubarContext();
    const handleClick = (e) => {
        e.stopPropagation();
        setOpenMenu(null);
        if (props.onClick) {
            props.onClick(e);
        }
    };
    return (_jsx("div", { className: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className), role: "menuitem", onClick: handleClick, ...props, children: children }));
}
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, };
