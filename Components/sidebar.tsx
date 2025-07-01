import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ScrollArea } from "./scroll-area";

interface SidebarContextType {
  expanded: boolean;
  onChange: (expanded: boolean) => void;
  activeMenuItem: string | null;
  setActiveMenuItem: (id: string | null) => void;
  menuItemPosition: React.MutableRefObject<{left: number, width: number, top: number, height: number}>;
  menuItemRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: React.ReactNode;
}

export function SidebarProvider({
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  children,
}: SidebarProviderProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [activeMenuItem, setActiveMenuItem] = React.useState<string | null>(null);
  const menuItemPosition = React.useRef({ left: 0, width: 0, top: 0, height: 0 });
  const menuItemRefs = React.useRef<Map<string, HTMLDivElement | null>>(new Map());
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledExpanded !== undefined;
  const actualExpanded = isControlled ? controlledExpanded : expanded;

  const onExpandedChangeRef = React.useRef(onExpandedChange);

  React.useEffect(() => {
    onExpandedChangeRef.current = onExpandedChange;
  }, [onExpandedChange]);

  const handleExpandedChange = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setExpanded(value);
      }

      onExpandedChangeRef.current?.(value);
    },
    [isControlled]
  );

  // This effect runs when activeMenuItem changes to update the indicator position
  React.useEffect(() => {
    if (activeMenuItem && menuRef.current) {
      const selectedItem = menuItemRefs.current.get(activeMenuItem);
      if (selectedItem) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const rect = selectedItem.getBoundingClientRect();

        menuItemPosition.current = {
          left: rect.left - menuRect.left,
          width: rect.width,
          top: rect.top - menuRect.top,
          height: rect.height
        };

        // Find and update the indicator element
        const indicator = menuRef.current.querySelector('.sidebar-menu-indicator');
        if (indicator) {
          (indicator as HTMLElement).style.left = `${menuItemPosition.current.left}px`;
          (indicator as HTMLElement).style.width = `${menuItemPosition.current.width}px`;
          (indicator as HTMLElement).style.top = `${menuItemPosition.current.top}px`;
          (indicator as HTMLElement).style.height = `${menuItemPosition.current.height}px`;
          (indicator as HTMLElement).style.opacity = '1';
        }
      }
    }
  }, [activeMenuItem]);

  return (
    <SidebarContext.Provider value={{
      expanded: actualExpanded,
      onChange: handleExpandedChange,
      activeMenuItem,
      setActiveMenuItem,
      menuItemPosition,
      menuItemRefs,
      menuRef
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { expanded } = useSidebar();

  return (
    <div
      className={cn(
        "h-full min-h-screen transition-all duration-300 z-40",
        expanded ? "w-56" : "w-16",
        "bg-background border-r  border-gray-200 dark:border-gray-800 shadow-sm",
        "fixed md:sticky top-0 md:top-0",
        expanded ? "left-0" : "md:left-0 -left-full",
        className
      )}
      role="complementary"
      data-collapsed={!expanded}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { expanded, onChange } = useSidebar();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "fixed md:static z-50 left-4 top-20",
        "transition-all duration-300",
        className
      )}
      onClick={() => onChange(!expanded)}
      aria-label={expanded ? "Close sidebar" : "Open sidebar"}
      {...props}
    >
      <span className="sr-only">{expanded ? "Close sidebar" : "Open sidebar"}</span>
      {expanded ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, children, ...props }: SidebarHeaderProps) {
  const { expanded } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-16 items-center border-b  border-gray-200 dark:border-gray-800 px-4",
        expanded ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Removed SCROLL_KEY constant as it's no longer needed

  // Removed useEffect for saving scroll position (handleBeforeUnload)
  // Removed useEffect for restoring scroll position

  return (
    <div className={cn("flex-1 overflow-hidden h-[calc(100vh-4rem)]", className)} {...props}>
      <div ref={scrollRef} className="h-full pb-12 overflow-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, children, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("px-2 py-2", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({ className, children, ...props }: SidebarGroupLabelProps) {
  const { expanded } = useSidebar();

  if (!expanded) {
    return null;
  }

  return (
    <div
      className={cn("mb-2 px-2 text-xs font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, children, ...props }: SidebarGroupContentProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, children, ...props }: SidebarFooterProps) {
  const { expanded } = useSidebar();

  return (
    <div
      className={cn(
        "flex border-t  border-gray-200 dark:border-gray-800 p-4",
        expanded ? "flex-row items-center justify-between" : "flex-col justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, children, ...props }: SidebarMenuProps) {
  const { menuRef } = useSidebar();

  return (
    <div ref={menuRef} className={cn("relative", className)} {...props}>
      <div className="sidebar-menu-indicator opacity-0 absolute transition-all
      duration-300 ease-in-out rounded-md bg-primary/10 border border-gray-400
        dark:border-gray-600" />
      {children}
    </div>
  );
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

export function SidebarMenuItem({ className, children, value, ...props }: SidebarMenuItemProps) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const { activeMenuItem, setActiveMenuItem, menuItemRefs, menuItemPosition, menuRef } = useSidebar();
  const menuItemId = value || React.useId();
  const isActive = activeMenuItem === menuItemId;

  // Register this menu item when it mounts
  React.useEffect(() => {
    if (itemRef.current) {
      menuItemRefs.current.set(menuItemId, itemRef.current);

      // If this is the active menu item, update position
      if (isActive && menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const rect = itemRef.current.getBoundingClientRect();

        menuItemPosition.current = {
          left: rect.left - menuRect.left,
          width: rect.width,
          top: rect.top - menuRect.top,
          height: rect.height
        };

        // Find and update the indicator element
        const indicator = menuRef.current.querySelector('.sidebar-menu-indicator');
        if (indicator) {
          (indicator as HTMLElement).style.left = `${menuItemPosition.current.left}px`;
          (indicator as HTMLElement).style.width = `${menuItemPosition.current.width}px`;
          (indicator as HTMLElement).style.top = `${menuItemPosition.current.top}px`;
          (indicator as HTMLElement).style.height = `${menuItemPosition.current.height}px`;
          (indicator as HTMLElement).style.opacity = '1';
        }
      }
    }

    return () => {
      menuItemRefs.current.delete(menuItemId);
    };
  }, [isActive, menuItemRefs, menuItemId, menuRef]);

  return (
    <div
      ref={itemRef}
      className={cn("mb-1", className)}
      data-value={menuItemId}
      data-state={isActive ? "active" : "inactive"}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  value?: string;
}

export function SidebarMenuButton({
  className,
  children,
  asChild = false,
  value,
  ...props
}: SidebarMenuButtonProps) {
  const { expanded, activeMenuItem, setActiveMenuItem, menuItemRefs, menuRef } = useSidebar();
  const menuItemId = value || React.useId();
  const isActive = activeMenuItem === menuItemId;

  const handleClick = React.useCallback(() => {
    setActiveMenuItem(menuItemId);

    // Update position immediately on click
    const selectedItem = menuItemRefs.current.get(menuItemId);
    if (selectedItem && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const rect = selectedItem.getBoundingClientRect();

      // Find and update the indicator element
      const indicator = menuRef.current.querySelector('.sidebar-menu-indicator');
      if (indicator) {
        // First make it invisible
        (indicator as HTMLElement).style.opacity = '0';

        // Add a tiny delay before repositioning and showing
        setTimeout(() => {
          (indicator as HTMLElement).style.left = `${rect.left - menuRect.left}px`;
          (indicator as HTMLElement).style.width = `${rect.width}px`;
          (indicator as HTMLElement).style.top = `${rect.top - menuRect.top}px`;
          (indicator as HTMLElement).style.height = `${rect.height}px`;
          (indicator as HTMLElement).style.opacity = '1';
        }, 50);
      }
    }

    // Call original onClick if it exists
    if (props.onClick && typeof props.onClick === 'function') {
      props.onClick(new MouseEvent('click') as any);
    }
  }, [menuItemId, setActiveMenuItem, menuItemRefs, menuRef, props.onClick]);

  const sharedClassName = "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300";

  if (!expanded) {
    if (asChild) {
      return (
        <div
          className={className}
          data-active={isActive ? "true" : "false"}
          onClick={handleClick}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...child.props,
                className: cn(
                  sharedClassName,
                  "justify-center p-2",
                  "hover:bg-primary/10 hover:scale-110",
                  isActive ? "text-primary font-medium" : "",
                  child.props?.className
                ),
              });
            }
            return child;
          })}
        </div>
      );
    }

    return (
      <div
        className={cn(
          sharedClassName,
          "justify-center p-2",
          "hover:bg-primary/10 hover:scale-110",
          isActive ? "text-primary font-medium" : "",
          className
        )}
        data-active={isActive ? "true" : "false"}
        onClick={handleClick}
        {...props}
      >
        {React.Children.toArray(children).filter(
          (child) => React.isValidElement(child) && typeof child.type !== "string"
        )}
      </div>
    );
  }

  if (asChild) {
    return (
      <div
        className={className}
        data-active={isActive ? "true" : "false"}
        onClick={handleClick}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              className: cn(
                sharedClassName,
                "justify-start gap-2",
                "hover:bg-primary/10 hover:translate-x-1",
                isActive ? "text-primary font-medium" : "",
                child.props?.className
              ),
              ...props, // Ensure props are passed to the child if asChild is true
            });
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        sharedClassName,
        "justify-start gap-2",
        "hover:bg-primary/10 hover:translate-x-1",
        isActive ? "text-primary font-medium" : "",
        className
      )}
      data-active={isActive ? "true" : "false"}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Sidebar as SidebarRoot,
}