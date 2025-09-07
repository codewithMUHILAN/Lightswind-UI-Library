import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

// Context to manage the navigation menu state
interface NavigationMenuContextType {
  open: Record<string, boolean>;
  activeItem: string | null;
  toggleMenu: (id: string) => void;
  setActiveItem: (id: string | null) => void;
}

const NavigationMenuContext = React.createContext<
  NavigationMenuContextType | undefined
>(undefined);

// Root component
interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState<Record<string, boolean>>({});
    const [activeItem, setActiveItem] = React.useState<string | null>(null);

    const toggleMenu = React.useCallback((id: string) => {
      setOpen((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }, []);

    return (
      <NavigationMenuContext.Provider
        value={{ open, activeItem, toggleMenu, setActiveItem }}
      >
        <div
          ref={ref}
          className={cn(
            "relative z-10 flex max-w-max flex-1 items-center justify-center",
            className
          )}
          {...props}
        >
          {children}
          <NavigationMenuViewport />
        </div>
      </NavigationMenuContext.Provider>
    );
  }
);
NavigationMenu.displayName = "NavigationMenu";

// List component
interface NavigationMenuListProps
  extends React.HTMLAttributes<HTMLUListElement> {}

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

// MenuItem component
interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value?: string;
}

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(({ className, value, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("relative", className)}
      data-value={value}
      {...props}
    />
  );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

// Trigger style
const navigationMenuTriggerStyle = () => {
  return "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";
};

// Trigger component
interface NavigationMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
}

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(({ className, children, id, ...props }, ref) => {
  // --- FIX START ---
  // 1. Call useId unconditionally to get a fallback ID.
  const generatedId = React.useId();
  // 2. Use the provided id prop, or fall back to the generated one.
  const menuId = id || generatedId;
  // --- FIX END ---

  const ctx = React.useContext(NavigationMenuContext);

  if (!ctx) {
    throw new Error("NavigationMenuTrigger must be used within NavigationMenu");
  }

  const { open, toggleMenu } = ctx;
  const isOpen = open[menuId] || false;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      onClick={() => toggleMenu(menuId)}
      aria-expanded={isOpen}
      aria-controls={`nav-menu-${menuId}`}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}{" "}
      <ChevronDown
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-[200ms] group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </button>
  );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

// Content component
interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  forceMount?: boolean;
}

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(({ className, children, id, forceMount = false, ...props }, ref) => {
  // --- FIX START ---
  // 1. Call useId unconditionally to get a fallback ID.
  const generatedId = React.useId();
  // 2. Use the provided id prop, or fall back to the generated one.
  const menuId = id || generatedId;
  // --- FIX END ---

  const ctx = React.useContext(NavigationMenuContext);

  if (!ctx) {
    throw new Error("NavigationMenuContent must be used within NavigationMenu");
  }

  const { open } = ctx;
  const isOpen = open[menuId] || false;

  if (!isOpen && !forceMount) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
        className
      )}
      id={`nav-menu-${menuId}`}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
    </div>
  );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

// Link component
interface NavigationMenuLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

// Viewport component
interface NavigationMenuViewportProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const ctx = React.useContext(NavigationMenuContext);

  if (!ctx) {
    return null;
  }

  const hasOpenMenu = Object.values(ctx.open).some(Boolean);

  return (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
      <div
        ref={viewportRef}
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]",
          !hasOpenMenu && "hidden",
          className
        )}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = "NavigationMenuViewport";

// Indicator component
interface NavigationMenuIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(NavigationMenuContext);

  if (!ctx) {
    return null;
  }

  const hasActiveItem = !!ctx.activeItem;

  if (!hasActiveItem) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className
      )}
      data-state={hasActiveItem ? "visible" : "hidden"}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-background shadow-md" />
    </div>
  );
});
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};