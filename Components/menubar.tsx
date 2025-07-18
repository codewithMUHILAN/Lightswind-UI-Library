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

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menubarElement = e.target as HTMLElement;
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

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu }}>
      <div
        className={cn(
          "flex h-10 items-center space-x-1 rounded-md border border-gray-200 dark:border-gray-800 bg-background p-1",
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
  // Always call useId unconditionally
  const generatedId = React.useId();
  // Then, use the provided value if it exists, otherwise use the generatedId
  const menuId = value ?? generatedId; // Use nullish coalescing operator for clarity

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
  }, []); // Empty dependency array means this runs once on mount

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
        "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
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

interface MenubarContentProps extends HTMLMotionProps<"div"> {
  // Add any specific props for MenubarContent here if needed, e.g., side, align
}

function MenubarContent({ className, children, ...props }: MenubarContentProps) {
  const { openMenu } = useMenubarContext();
  const menuContentRef = React.useRef<HTMLDivElement>(null);
  
  const [currentMenuId, setCurrentMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (menuContentRef.current) {
      const parentDataValue = menuContentRef.current.parentElement?.getAttribute("data-value");
      setCurrentMenuId(parentDataValue || null);
    }
  }, []);

  const shouldBeOpen = openMenu === currentMenuId;

  return (
    <AnimatePresence>
      {shouldBeOpen && (
        <motion.div
          ref={menuContentRef}
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            `absolute left-0 top-0 z-50 mt-10 min-w-[8rem] flex-col
             rounded-md border border-gray-200 dark:border-gray-800 bg-popover p-1
             text-popover-foreground shadow-md`,
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
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      role="menuitem"
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
};