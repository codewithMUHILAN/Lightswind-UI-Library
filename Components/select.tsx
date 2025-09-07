import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/utils"; // Assuming you have this utility function

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
);

interface SelectProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  children,
  defaultValue = "",
  value,
  onValueChange,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = React.useState(
    value || defaultValue
  );
  const [isOpen, setIsOpen] = React.useState(open || defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setSelectedValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [onValueChange, value]
  );

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (disabled) return;

      if (open === undefined) {
        setIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [onOpenChange, open, disabled]
  );

  return (
    <SelectContext.Provider
      value={{
        value: selectedValue,
        onValueChange: handleValueChange,
        open: isOpen,
        setOpen: handleOpenChange,
        triggerRef,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

const SelectGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div className="px-1 py-1.5" {...props}>
      {children}
    </div>
  );
};
SelectGroup.displayName = "SelectGroup";

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectValue must be used within a Select");
    }
    // This is a bit of a hack to get the children from the parent Select component.
    // A better implementation would involve passing a map of values to display labels via context.
    // For simplicity, we are assuming children are passed directly or can be inferred.
    const parentChildren =
      (context as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        ?.children || children;

    let displayValue: React.ReactNode = null;

    const findDisplayValue = (nodes: React.ReactNode) => {
      React.Children.forEach(nodes, (node) => {
        if (!React.isValidElement(node)) return;
        if (displayValue) return;

        // Check if it's a SelectItem
        if (
          (node.type as any).displayName === "SelectItem" &&
          node.props.value === context.value
        ) {
          displayValue = node.props.children;
        }
        // Check if it's a SelectGroup and recurse
        else if ((node.type as any).displayName === "SelectGroup") {
          findDisplayValue(node.props.children);
        }
      });
    };

    findDisplayValue(parentChildren);

    const content = displayValue || context.value || placeholder;

    return (
      <span ref={ref} className={cn("text-sm", className)} {...props}>
        {content || (
          <span className="text-muted-foreground">Select an option</span>
        )}
      </span>
    );
  }
);
SelectValue.displayName = "SelectValue";

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectTrigger must be used within a Select");
    }

    const { open, setOpen, triggerRef, searchQuery, setSearchQuery } = context;
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (open && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [open]);

    React.useImperativeHandle(ref, () => triggerRef.current!, [triggerRef]);

    return (
      <button
        ref={triggerRef}
        type="button"
        data-state={open ? "open" : "closed"}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        {...props}
      >
        {open ? (
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search..."
            className="w-full bg-transparent p-0 text-sm 
    border-none outline-none ring-0 focus:outline-none focus:ring-0 
    active:outline-none active:ring-0"
            style={{ boxShadow: "none" }} // ensure Chrome removes highlight
          />
        ) : (
          children
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => <div {...props} />;
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => <div {...props} />;
SelectScrollDownButton.displayName = "SelectScrollDownButton";

// *** FIX APPLIED HERE: Replaced React.HTMLAttributes with HTMLMotionProps ***
interface SelectContentProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode; // Explicitly define children as standard ReactNode
  position?: "popper" | "item-aligned";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      className,
      children,
      position = "popper",
      align = "start",
      sideOffset = 4,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectContent must be used within a Select");
    }

    const { open, setOpen, triggerRef, searchQuery } = context;
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [calculatedStyle, setCalculatedStyle] =
      React.useState<React.CSSProperties>({});
    const [currentSide, setCurrentSide] = React.useState<"top" | "bottom">(
      "bottom"
    );

    React.useEffect(() => {
      if (!open || !triggerRef.current) return;

      const updatePosition = () => {
        if (!triggerRef.current) return; // Guard against null ref

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        const preferredMaxHeight = 224; // A common max-height for dropdowns (e.g., tailwind's h-56)

        // Decide whether to show the dropdown below or above the trigger
        const showBelow =
          spaceBelow >= preferredMaxHeight || spaceBelow > spaceAbove;
        
        const newSide = showBelow ? "bottom" : "top";
        setCurrentSide(newSide);
        
        // Define the styles that will be applied
        const newStyles: React.CSSProperties = {
            position: "absolute",
            width: `${triggerRect.width}px`,
        };

        // --- START OF FIX ---
        // This is the key change. We now calculate position differently
        // for 'top' and 'bottom' to ensure it's always attached correctly.

        if (newSide === "bottom") {
            const availableHeight = spaceBelow - sideOffset - 8; // 8px for margin
            newStyles.maxHeight = `${Math.min(preferredMaxHeight, Math.max(0, availableHeight))}px`;
            newStyles.top = `${triggerRect.bottom + window.scrollY + sideOffset}px`;
        } else { // Position above the trigger
            const availableHeight = spaceAbove - sideOffset - 8; // 8px for margin
            newStyles.maxHeight = `${Math.min(preferredMaxHeight, Math.max(0, availableHeight))}px`;
            // By setting `bottom`, we anchor the dropdown's bottom edge to the trigger's top edge.
            // This solves the gap issue completely.
            newStyles.bottom = `${viewportHeight - triggerRect.top - window.scrollY + sideOffset}px`;
        }
        
        // --- END OF FIX ---

        // Handle horizontal alignment
        let left = triggerRect.left;
        if (align === "center") {
            // This calculation was slightly off, corrected to center based on content width if known,
            // but for a select, centering on trigger is usually sufficient.
            left = triggerRect.left + (triggerRect.width / 2) - (triggerRect.width / 2); // Assumes content width = trigger width
        } else if (align === "end") {
            left = triggerRect.right - triggerRect.width;
        }

        // Prevent overflow from the right edge of the viewport
        if (left + triggerRect.width > viewportWidth) {
            left = viewportWidth - triggerRect.width - 8; // 8px margin
        }
        // Prevent overflow from the left edge of the viewport
        if (left < 0) {
            left = 8; // 8px margin
        }

        newStyles.left = `${left + window.scrollX}px`;

        setCalculatedStyle(newStyles);
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, align, sideOffset, triggerRef]);

    React.useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, setOpen, triggerRef]);

    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const filteredChildren = React.useMemo(() => {
        if (!searchQuery) {
            return children;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();

        const getChildText = (child: React.ReactNode): string => {
            if (typeof child === "string" || typeof child === "number") {
                return child.toString();
            }
            if (React.isValidElement(child) && child.props.children) {
                return React.Children.map(child.props.children, getChildText).join(
                    ""
                );
            }
            return "";
        };

        return React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
                return child;
            }

            if ((child.type as any).displayName === "SelectGroup") {
                const matchedItems = React.Children.toArray(
                    child.props.children
                ).filter((groupChild) => {
                    if (
                        React.isValidElement(groupChild) &&
                        (groupChild.type as any).displayName === "SelectItem"
                    ) {
                        const text = getChildText(groupChild.props.children);
                        return text.toLowerCase().includes(lowerCaseQuery);
                    }
                    return false;
                });

                if (matchedItems.length > 0) {
                    return React.cloneElement(child, {
                        ...child.props,
                        children: matchedItems,
                    });
                }
                return null;
            }

            if ((child.type as any).displayName === "SelectItem") {
                const text = getChildText(child.props.children);
                return text.toLowerCase().includes(lowerCaseQuery) ? child : null;
            }

            return child;
        });
    }, [children, searchQuery]);
    
    // Check if there are any children to render after filtering
    const hasVisibleChildren = React.Children.count(filteredChildren) > 0;

    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={combinedRef}
            style={calculatedStyle}
            className={cn(
              "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
              className
            )}
            initial={{ opacity: 0, y: currentSide === "bottom" ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: currentSide === "bottom" ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            {...props}
          >
            <SelectScrollUpButton />
            <div
              className="p-1"
              style={{
                maxHeight: calculatedStyle.maxHeight,
                overflowY: "auto",
              }}
            >
              {hasVisibleChildren ? (
                filteredChildren
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No results found.
                </div>
              )}
            </div>
            <SelectScrollDownButton />
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectItem must be used within a Select");
    }

    const { value: selectedValue, onValueChange, setOpen } = context;
    const isSelected = selectedValue === value;

    const handleSelect = (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      onValueChange(value);
      setTimeout(() => setOpen(false), 50); // Small delay to show selection
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
          isSelected
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleSelect(e as any);
          }
        }}
        aria-selected={isSelected}
        data-disabled={disabled}
        role="option"
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        <span className="text-sm">{children}</span>
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
