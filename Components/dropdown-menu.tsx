import * as React from "react";
import { cn } from "../lib/utils";
import { cva } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hoverMode?: boolean;
  triggerRef: React.MutableRefObject<HTMLElement | null>; // Change to MutableRefObject
}

const DropdownMenuContext = React.createContext<
  DropdownMenuContextType | undefined
>(undefined);

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
      }
      if (onOpenChange) {
        const newValue = typeof value === "function" ? value(open) : value;
        onOpenChange(newValue);
      }
    },
    [isControlled, onOpenChange, open]
  );

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, hoverMode, triggerRef }}
    >
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
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");
  }

  const { setOpen, hoverMode, triggerRef } = context;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen((prev) => !prev);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  // New ref for managing hover timeout specifically within the trigger
  const triggerHoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useImperativeHandle(ref, () => {
    // Ensure triggerRef.current is not null before returning
    // This should now correctly refer to the DOM element after the ref callback runs
    if (!triggerRef.current) {
      // Fallback or throw an error if triggerRef.current is not set
      console.warn(
        "DropdownMenuTrigger ref is null. Ensure children forward their ref when asChild is true."
      );
      return document.createElement("button"); // Return a dummy element to satisfy the type
    }
    return triggerRef.current as HTMLButtonElement;
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverMode) {
      if (triggerHoverTimeoutRef.current) {
        clearTimeout(triggerHoverTimeoutRef.current);
      }
      triggerHoverTimeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, 100);
      if (triggerRef.current) {
        (triggerRef.current as any)._hoverTimeoutRef =
          triggerHoverTimeoutRef.current;
      }
    }

    if (props.onMouseEnter) {
      props.onMouseEnter(e as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const handleMouseLeaveTrigger = (e: React.MouseEvent<HTMLElement>) => {
    if (hoverMode) {
      if (triggerHoverTimeoutRef.current) {
        clearTimeout(triggerHoverTimeoutRef.current);
      }
    }
    if (props.onMouseLeave) {
      props.onMouseLeave(e as React.MouseEvent<HTMLButtonElement>);
    }
  };

  const { onClick, onMouseEnter, onMouseLeave, ...otherProps } = props;

  if (asChild) {
    const child = React.Children.only(children);

    if (!React.isValidElement(child)) {
      throw new Error(
        "DropdownMenuTrigger when asChild is true must have a single valid React element child."
      );
    }

    return React.cloneElement(child, {
      ...child.props,
      ref: (node: HTMLElement | null) => {
        // Update the internal triggerRef
        triggerRef.current = node;

        // Handle the forwarded ref from forwardRef
        if (typeof ref === "function") {
          ref(node as HTMLButtonElement);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node as HTMLButtonElement;
        }

        // Handle the original ref of the child element
        const childRef = (child as any).ref;
        if (childRef) {
          if (typeof childRef === "function") {
            childRef(node);
          } else if (childRef.hasOwnProperty("current")) {
            (childRef as React.MutableRefObject<HTMLElement | null>).current =
              node;
          }
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
        handleMouseLeaveTrigger(e as React.MouseEvent<HTMLElement>);
        if (child.props.onMouseLeave) child.props.onMouseLeave(e);
      },
    });
  }

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
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
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-popover p-1 text-popover-foreground shadow-md",
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

interface DropdownMenuContentProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | "onAnimationStart" // Omit this
    | "onAnimationEnd" // Omit this
    | "onTransitionEnd" // Omit this
    | "onTransitionCancel" // Omit this
    | "onDrag"
    | "onDragEnd"
    | "onDragEnter"
    | "onDragExit"
    | "onDragLeave"
    | "onDragOver"
    | "onDragStart"
    | "onDrop"
  > {
  align?: "start" | "center" | "end";
  alignOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  variant?: "default" | "contextMenu";
}
const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      className,
      children,
      align = "center",
      alignOffset = 0,
      side = "bottom",
      sideOffset = 4,
      variant,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
      throw new Error("DropdownMenuContent must be used within a DropdownMenu");
    }

    const { open, setOpen, hoverMode, triggerRef } = context;
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });

    const contentMouseLeaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(
      null
    );

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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open, setOpen, triggerRef]);

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverMode) {
        if (contentMouseLeaveTimeoutRef.current) {
          clearTimeout(contentMouseLeaveTimeoutRef.current);
        }
        contentMouseLeaveTimeoutRef.current = setTimeout(() => {
          setOpen(false);
        }, 150);
      }

      if (props.onMouseLeave) {
        props.onMouseLeave(e);
      }
    };

    const handleMouseEnterContent = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverMode) {
        if (contentMouseLeaveTimeoutRef.current) {
          clearTimeout(contentMouseLeaveTimeoutRef.current);
        }
        if (triggerRef.current) {
          const triggerAny = triggerRef.current as any;
          if (triggerAny._hoverTimeoutRef) {
            clearTimeout(triggerAny._hoverTimeoutRef);
            triggerAny._hoverTimeoutRef = null;
          }
        }
      }
      if (props.onMouseEnter) {
        props.onMouseEnter(e);
      }
    };

    React.useEffect(() => {
      if (!open || !triggerRef.current) return;

      const updatePosition = () => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        let menuRect = menuRef.current?.getBoundingClientRect();

        if (!menuRect) {
          const dummyDiv = document.createElement("div");
          dummyDiv.style.visibility = "hidden";
          dummyDiv.style.position = "absolute";
          dummyDiv.style.minWidth = "8rem";
          dummyDiv.style.padding = "1px";
          dummyDiv.style.border = "1px solid";
          dummyDiv.className = cn(
            dropdownMenuContentVariants({ variant }),
            className
          );
          document.body.appendChild(dummyDiv);
          menuRect = dummyDiv.getBoundingClientRect();
          document.body.removeChild(dummyDiv);
        }

        let top = 0;
        let left = 0;

        if (side === "bottom") {
          top = triggerRect.bottom + sideOffset;
        } else if (side === "top") {
          top = triggerRect.top - (menuRect?.height || 0) - sideOffset;
        } else if (side === "left" || side === "right") {
          top =
            triggerRect.top +
            triggerRect.height / 2 -
            (menuRect?.height || 0) / 2;
        }

        if (side === "right") {
          left = triggerRect.right + sideOffset;
        } else if (side === "left") {
          left = triggerRect.left - (menuRect?.width || 0) - sideOffset;
        } else {
          if (align === "start") {
            left = triggerRect.left + alignOffset;
          } else if (align === "center") {
            left =
              triggerRect.left +
              triggerRect.width / 2 -
              (menuRect?.width || 0) / 2 +
              alignOffset;
          } else if (align === "end") {
            left = triggerRect.right - (menuRect?.width || 0) - alignOffset;
          }
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (left + (menuRect?.width || 0) > windowWidth) {
          left = windowWidth - (menuRect?.width || 0) - 8;
        }

        if (left < 8) {
          left = 8;
        }

        if (top + (menuRect?.height || 0) > windowHeight) {
          if (
            side === "bottom" &&
            triggerRect.top > (menuRect?.height || 0) + sideOffset
          ) {
            top = triggerRect.top - (menuRect?.height || 0) - sideOffset;
          } else {
            const maxHeight = windowHeight - top - 8;
            if (menuRef.current) {
              menuRef.current.style.maxHeight = `${maxHeight}px`;
            }
          }
        }

        setPosition({ top, left });
      };

      updatePosition();

      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }, [
      open,
      align,
      alignOffset,
      side,
      sideOffset,
      triggerRef,
      children,
      variant,
      className,
    ]);

    const { onMouseLeave, onMouseEnter, ...otherProps } = props;

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
              }
              menuRef.current = node;
            }}
            className={cn(
              dropdownMenuContentVariants({ variant }),
              "dropdown-scrollbar",
              className
            )}
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 50,
              maxHeight: "calc(90vh - 60px)",
              overflowY: "auto",
            }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnterContent}
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            {...otherProps}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  disabled?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ className, inset, disabled = false, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuItem must be used within a DropdownMenu");
  }

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    setOpen(false);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const { onClick, ...otherProps } = props;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      data-disabled={disabled ? "" : undefined}
      {...otherProps}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

interface DropdownMenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

interface DropdownMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuGroupProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
));
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
