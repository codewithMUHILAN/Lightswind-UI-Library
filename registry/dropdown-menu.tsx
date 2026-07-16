import * as React from "react";
import ReactDOM from "react-dom";
import { cva } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hoverMode?: boolean;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined);

interface DropdownMenuProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hoverMode?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  hoverMode = false,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      } else if (onOpenChange) {
        const nextOpen = typeof value === "function" ? (value as (p: boolean) => boolean)(controlledOpen ?? false) : value;
        onOpenChange(nextOpen);
      }
    },
    [isControlled, onOpenChange, controlledOpen]
  );

  // Notify parent of uncontrolled state changes — outside state updaters to avoid Strict Mode issues
  React.useEffect(() => {
    if (!isControlled && onOpenChange) {
      onOpenChange(uncontrolledOpen);
    }
  }, [uncontrolledOpen, isControlled, onOpenChange]);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open: open || false, setOpen, hoverMode, triggerRef, timeoutRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, asChild, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");

  const { setOpen, hoverMode, triggerRef, timeoutRef } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (hoverMode) {
      // In hover mode, click should only open (not toggle), to avoid
      // fighting with the hover timers on first interaction
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setOpen(true);
    } else {
      setOpen((prev) => !prev);
    }
    if (props.onClick) props.onClick(e);
  };

  React.useImperativeHandle(ref, () => {
    if (!triggerRef.current) return document.createElement("button");
    return triggerRef.current as HTMLButtonElement;
  }, [triggerRef]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverMode) {
      // Always clear any pending timer (open or close)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Schedule open — setOpen(true) is idempotent if already open
      timeoutRef.current = setTimeout(() => setOpen(true), 150);
    }
    if (props.onMouseEnter) props.onMouseEnter(e as React.MouseEvent<HTMLButtonElement>);
  };

  const handleMouseLeaveTrigger = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverMode) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setOpen(false), 200);
    }
    if (props.onMouseLeave) props.onMouseLeave(e as React.MouseEvent<HTMLButtonElement>);
  };

  const { onClick, onMouseEnter, onMouseLeave, ...otherProps } = props;

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...child.props,
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node as HTMLButtonElement);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;

        // Handle child's original ref
        const childRef = (child as any).ref;
        if (childRef) {
          if (typeof childRef === "function") childRef(node);
          else if (childRef.hasOwnProperty("current")) childRef.current = node;
        }
      },
      onClick: (e: React.MouseEvent) => {
        handleClick(e as React.MouseEvent<HTMLButtonElement>);
        if (child.props.onClick) child.props.onClick(e);
      },
      onMouseEnter: (e: React.MouseEvent) => {
        handleMouseEnter(e as React.MouseEvent<HTMLElement>);
        if (child.props.onMouseEnter) child.props.onMouseEnter(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        // Start a close timer; the content's onMouseEnter will cancel it if
        // the cursor moves into the portal-rendered dropdown before the timer fires.
        handleMouseLeaveTrigger(e as React.MouseEvent<HTMLElement>);
        if (child.props.onMouseLeave) child.props.onMouseLeave(e);
      },
      ...otherProps,
    });
  }

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveTrigger}
      {...otherProps}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const dropdownMenuContentVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
  {
    variants: {
      variant: {
        default: "",
        contextMenu: "min-w-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface DropdownMenuContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> {
  align?: "start" | "center" | "end";
  alignOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  variant?: "default" | "contextMenu";
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, children, align = "center", alignOffset = 0, side = "bottom", sideOffset = 4, variant, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuContent must be used within a DropdownMenu");

    const { open, setOpen, hoverMode, triggerRef } = context;
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [mounted, setMounted] = React.useState(false);
    const [positioned, setPositioned] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Reset positioned to false ONLY when closed, avoids flickering when children change
    React.useEffect(() => {
      if (!open) {
        setPositioned(false);
      }
    }, [open]);

    // Body scroll lock removed
    // Previous logic was interfering with page navigation

    // Close on click outside
    React.useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, setOpen, triggerRef]);

    // Position updates
    React.useEffect(() => {
      if (!open || !triggerRef.current) return;

      const updatePosition = () => {
        if (!triggerRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        let menuRect = menuRef.current?.getBoundingClientRect();

        if (!menuRect) {
          // Temporary render to get size if not yet rendered
          // This part in a Portal scenario is tricky because ref might be null initially.
          // We'll rely on a second pass or basic estimation if ref is null, 
          // but Framer Motion should attach ref quickly.
          // For simplicity in this fix, if no menuRect, we assume a default width/height or wait for next tick.
          if (!menuRef.current) return;
          menuRect = menuRef.current.getBoundingClientRect();
        }

        let top = 0;
        let left = 0;

        // Basic positioning logic tailored for Portal (relative to viewport)
        if (side === "bottom") {
          top = triggerRect.bottom + sideOffset;
        } else if (side === "top") {
          top = triggerRect.top - (menuRect?.height || 0) - sideOffset;
        } else if (side === "left" || side === "right") {
          top = triggerRect.top + triggerRect.height / 2 - (menuRect?.height || 0) / 2;
        }

        if (side === "right") {
          left = triggerRect.right + sideOffset;
        } else if (side === "left") {
          left = triggerRect.left - (menuRect?.width || 0) - sideOffset;
        } else {
          if (align === "start") left = triggerRect.left + alignOffset;
          else if (align === "center") left = triggerRect.left + triggerRect.width / 2 - (menuRect?.width || 0) / 2 + alignOffset;
          else if (align === "end") left = triggerRect.right - (menuRect?.width || 0) - alignOffset;
        }

        // Viewport collision detection
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (left + (menuRect?.width || 0) > windowWidth) left = windowWidth - (menuRect?.width || 0) - 8;
        if (left < 8) left = 8;

        if (top + (menuRect?.height || 0) > windowHeight) {
          if (side === "bottom" && triggerRect.top > (menuRect?.height || 0) + sideOffset) {
            top = triggerRect.top - (menuRect?.height || 0) - sideOffset;
          } else {
            const maxHeight = windowHeight - top - 8;
            if (menuRef.current) menuRef.current.style.maxHeight = `${maxHeight}px`;
          }
        }

        setPosition({ top, left });
      };

      // Run update immediately and on scroll/resize
      // Use rAF to ensure the DOM has painted the portal content before measuring
      const raf = requestAnimationFrame(() => {
        updatePosition();
        setPositioned(true);
      });
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      // Also update after a short delay to ensure Framer Motion has rendered the initial frame
      const timeout = setTimeout(() => {
        updatePosition();
        setPositioned(true);
      }, 0);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
        cancelAnimationFrame(raf);
        clearTimeout(timeout);
      };
    }, [open, align, alignOffset, side, sideOffset, triggerRef, children, variant, className, mounted]);

    if (!mounted) return null;

    return ReactDOM.createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={(node) => {
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              menuRef.current = node;
            }}
            className={cn(dropdownMenuContentVariants({ variant }), "dropdown-scrollbar", className)}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 99999,
              maxHeight: "calc(90vh - 60px)",
              overflowY: "auto",
              transformOrigin: side === "bottom" ? "top center" : side === "top" ? "bottom center" : side === "left" ? "center right" : "center left",
            }}
            initial={{ opacity: 0, scale: 0.9, y: side === "bottom" ? -4 : side === "top" ? 4 : 0 }}
            animate={positioned ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const } : { opacity: 0, scale: 0.9, pointerEvents: "none" as const }}
            exit={{ opacity: 0, scale: 0.9, y: side === "bottom" ? -4 : side === "top" ? 4 : 0, transition: { duration: 0.15 }, pointerEvents: "none" as const }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
            onMouseEnter={(e) => {
              if (hoverMode && context.timeoutRef.current) {
                clearTimeout(context.timeoutRef.current);
              }
              if (props.onMouseEnter) props.onMouseEnter(e as any);
            }}
            onMouseLeave={(e) => {
              if (hoverMode) {
                context.timeoutRef.current = setTimeout(() => setOpen(false), 200);
              }
              if (props.onMouseLeave) props.onMouseLeave(e as any);
            }}
            data-lenis-prevent
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  disabled?: boolean;
  asChild?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, inset, asChild, disabled = false, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuItem must be used within a DropdownMenu");
    const { setOpen } = context;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      setOpen(false);
      if (props.onClick) props.onClick(e);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex gap-1 cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          inset && "pl-8",
          className
        )}
        onClick={handleClick}
        data-disabled={disabled ? "" : undefined}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
  )
);
DropdownMenuGroup.displayName = "DropdownMenuGroup";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
};
