"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

interface MenubarContextValue {
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

const MenubarContext = React.createContext<MenubarContextValue | undefined>(undefined);

function useMenubarContext() {
  const context = React.useContext(MenubarContext);
  if (!context) {
    throw new Error("useMenubarContext must be used within a MenubarProvider");
  }
  return context;
}

interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {}

function Menubar({ className, children, ...props }: MenubarProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  // close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const insideMenubar = target.closest('[role="menubar"], [role="menu"]');
      if (openMenu && !insideMenubar) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu }}>
      <div
        className={cn(
          "flex h-12 items-center space-x-1 rounded-md border bg-background px-2 md:px-4 shadow-sm",
          className
        )}
        role="menubar"
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

interface MenubarMenuProps {
  value?: string;
  children: React.ReactNode;
}

function MenubarMenu({ value, children }: MenubarMenuProps) {
  const generatedId = React.useId();
  const menuId = value ?? generatedId;

  return (
    <div className="relative" data-value={menuId}>
      {children}
    </div>
  );
}

interface MenubarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function MenubarTrigger({ className, children, ...props }: MenubarTriggerProps) {
  const { openMenu, setOpenMenu } = useMenubarContext();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [menuId, setMenuId] = React.useState<string>("");

  React.useEffect(() => {
    if (triggerRef.current) {
      setMenuId(triggerRef.current.parentElement?.getAttribute("data-value") || "");
    }
  }, []);

  const isOpen = openMenu === menuId;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenMenu(isOpen ? null : menuId);
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      role="menuitem"
      className={cn(
        "flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        isOpen && "bg-accent text-accent-foreground",
        className
      )}
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

interface MenubarContentProps extends HTMLMotionProps<"div"> {}

function MenubarContent({ className, children, ...props }: MenubarContentProps) {
  const { openMenu } = useMenubarContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [menuId, setMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      const parentDataValue = contentRef.current.parentElement?.getAttribute("data-value");
      setMenuId(parentDataValue || null);
    }
  }, []);

  const isOpen = openMenu === menuId;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute left-0 top-full z-50 mt-2 min-w-[10rem] flex flex-col rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
            "md:min-w-[12rem]", // larger menus on bigger screens
            className
          )}
          role="menu"
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MenubarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

function MenubarItem({ className, inset, children, ...props }: MenubarItemProps) {
  const { setOpenMenu } = useMenubarContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpenMenu(null);
    props.onClick?.(e);
  };

  return (
    <div
      role="menuitem"
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem };
