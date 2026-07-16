"use client";

import * as React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// Re-implementing the 'cn' utility function directly for self-containment
function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// --- Context and Provider ---

interface SidebarContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  onChange: (expanded: boolean) => void;
  activeMenuItem: string | null;
  setActiveMenuItem: (id: string | null) => void;
  updateIndicatorPosition: (id: string | null) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

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
  const [expanded, setExpandedState] = React.useState(defaultExpanded);
  const [activeMenuItem, setActiveMenuItem] = React.useState<string | null>(null);

  const isControlled = controlledExpanded !== undefined;
  const actualExpanded = isControlled ? controlledExpanded : expanded;

  const setExpanded = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setExpandedState(value);
      }
      onExpandedChange?.(value);
    },
    [isControlled, onExpandedChange]
  );

  // Collapse by default on mobile viewports (< 1024px) after client-side mount
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setExpandedState(false);
    }
  }, []);

  // Sync active menu item from URL on mount
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const path = url.pathname;

    let potentialMenuItemValue: string | null = null;
    if (searchParams.has("component")) {
      potentialMenuItemValue = searchParams.get("component");
    } else {
      const pathSegments = path.split("/").filter((segment) => segment);
      if (pathSegments.length > 0) {
        potentialMenuItemValue = pathSegments[pathSegments.length - 1];
      }
    }
    setActiveMenuItem(potentialMenuItemValue);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        expanded: actualExpanded,
        setExpanded,
        onChange: setExpanded,
        activeMenuItem,
        setActiveMenuItem,
        updateIndicatorPosition: () => {},
      }}
    >
      <LayoutGroup id="sidebar-indicator">
        {children}
      </LayoutGroup>
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

// --- Main Sidebar Components ---

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { expanded } = useSidebar();

  return (
    <div
      className={cn(
        "h-full min-h-screen z-40 lg:z-10 w-72 shrink-0 relative",
        "bg-background border-r border-border/40 shadow-sm",
        "fixed lg:sticky top-0",
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

interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { expanded, setExpanded } = useSidebar();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "fixed md:static z-50 left-4 top-20 bg-background/80 backdrop-blur-sm border border-border shadow-sm",
        className
      )}
      onClick={() => setExpanded(!expanded)}
      aria-label={expanded ? "Close sidebar" : "Open sidebar"}
      {...props}
    >
      {expanded ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SidebarHeader({
  className,
  children,
  ...props
}: SidebarHeaderProps) {
  const { expanded } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-16 items-center border-b border-border/40 px-6",
        expanded ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const SCROLL_STORAGE_KEY = "sidebarScrollTop";

export function SidebarContent({
  className,
  children,
  ...props
}: SidebarContentProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Load/Save scroll position remains similar but cleaner
  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const savedScrollTop = localStorage.getItem(SCROLL_STORAGE_KEY);
      if (savedScrollTop) scrollElement.scrollTop = parseInt(savedScrollTop, 10);

      const handleScroll = () => {
        localStorage.setItem(SCROLL_STORAGE_KEY, scrollElement.scrollTop.toString());
      };

      scrollElement.addEventListener("scroll", handleScroll, { passive: true });
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex-1 overflow-hidden h-full flex flex-col",
        className
      )}
      {...props}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-4 px-3"
      >
        {children}
      </div>
    </div>
  );
}

// --- Grouping Components ---

export function SidebarGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-6 last:mb-0", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-0.5", className)} {...props}>
      {children}
    </div>
  );
}

// --- Menu Item Components (using LayoutID for Indicator) ---

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenuItem({
  className,
  children,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value?: string }) {
  return (
    <div
      className={cn("group relative w-full", className)}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  value?: string;
  isActive?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLDivElement, SidebarMenuButtonProps>(
  (
    {
      className,
      children,
      asChild = false,
      value,
      isActive: propIsActive,
      ...props
    },
    ref
  ) => {
    const { expanded, activeMenuItem, setActiveMenuItem } = useSidebar();
    const isActive = propIsActive ?? (activeMenuItem === value);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (value) setActiveMenuItem(value);
      if (props.onClick) props.onClick(e);
    };

    const content = (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none cursor-pointer",
          "hover:bg-secondary/50 active:scale-[0.98]",
          isActive
            ? "text-primarylw font-bold"
            : "text-muted-foreground hover:text-foreground",
          !expanded && "justify-center px-0 py-3",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Premium Sliding Indicator using Framer Motion */}
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute inset-0 rounded-lg bg-[color-mix(in_srgb,var(--primarylw)_8%,transparent)] dark:bg-[color-mix(in_srgb,var(--primarylw)_12%,transparent)] border border-[color-mix(in_srgb,var(--primarylw)_25%,transparent)] z-0"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35
            }}
          />
        )}

        <span className={cn("relative z-10 flex items-center", expanded ? "w-full gap-3" : "justify-center")}>
          {children}
        </span>
      </div>
    );

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement;
      const childProps = child.props as any;
      return React.cloneElement(child, {
        ref,
        ...props,
        className: cn(
          "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none group cursor-pointer",
          "hover:bg-secondary/50 active:scale-[0.98]",
          isActive
            ? "text-primarylw font-bold"
            : "text-muted-foreground hover:text-foreground",
          !expanded && "justify-center px-0 py-3",
          className,
          childProps.className
        ),
        onClick: (e: React.MouseEvent<any>) => {
          if (value) setActiveMenuItem(value);
          if (childProps.onClick) childProps.onClick(e);
          if (props.onClick) props.onClick(e);
        },
        children: (
          <>
            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 rounded-lg bg-[color-mix(in_srgb,var(--primarylw)_8%,transparent)] dark:bg-[color-mix(in_srgb,var(--primarylw)_12%,transparent)] border border-[color-mix(in_srgb,var(--primarylw)_25%,transparent)] z-0"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35
                }}
              />
            )}
            <span className={cn("relative z-10 flex items-center", expanded ? "w-full gap-3" : "justify-center")}>
              {childProps.children}
            </span>
          </>
        )
      } as any);
    }

    return content;
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar();

  return (
    <div
      className={cn(
        "mt-auto border-t border-border/40 p-4",
        expanded ? "flex-row items-center justify-between" : "flex-col justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Sidebar as SidebarRoot };