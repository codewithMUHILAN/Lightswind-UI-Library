import * as React from "react";
import { cn } from "@/components/lib/utils";
import { CircleXIcon } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

// --- Context and Props (with the new prop added) ---

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeOnOutsideClick?: boolean;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(
  undefined
);

interface PopoverProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsideClick?: boolean; // New prop for controlling outside click behavior
}

// --- The Updated Popover Component ---

const Popover: React.FC<PopoverProps> = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  closeOnOutsideClick = true, // <-- CHANGE #1: Destructure the prop with a default value of 'true'
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
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

  // Close popover when clicking outside (now conditional)
  React.useEffect(() => {
    // <-- CHANGE #2: The entire effect is now conditional
    // If the prop is false, we don't add the event listener at all.
    if (!open || !closeOnOutsideClick) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const popoverContents = document.querySelectorAll(
        "[data-popover-content]"
      );
      let isClickInside = false;

      popoverContents.forEach((content) => {
        if (content.contains(event.target as Node)) {
          isClickInside = true;
        }
      });

      if (!isClickInside) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // <-- CHANGE #3: Add the new prop to the dependency array
  }, [open, setOpen, closeOnOutsideClick]);

  // Body scroll lock to prevent background scrolling when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, closeOnOutsideClick }}>
      {children}
    </PopoverContext.Provider>
  );
};

// --- PopoverTrigger and PopoverContent remain the same ---
// (No changes needed for the other components)

interface PopoverTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  onClick,
  asChild,
  children,
}) => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("PopoverTrigger must be used within a Popover");
  }

  const { open, setOpen } = context;

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    setOpen(!open);
    onClick?.(e);
  };

  if (asChild) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const element = child as React.ReactElement<any>;
            const childProps = {
              ...element.props,
              onClick: (e: React.MouseEvent) => {
                handleClick(e as React.MouseEvent<HTMLElement>);
                if (element.props.onClick) element.props.onClick(e);
              },
            };
            return React.cloneElement(element, childProps);
          }
          return child;
        })}
      </>
    );
  }

  return (
    <button type="button" onClick={handleClick} aria-expanded={open}>
      {children}
    </button>
  );
};

interface PopoverContentProps extends Omit<HTMLMotionProps<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> {
  align?: "center" | "start" | "end";
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    if (!context) {
      throw new Error("PopoverContent must be used within a Popover");
    }

    const { open, setOpen } = context;

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (context.closeOnOutsideClick) {
                  setOpen(false);
                }
              }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
            />
            <motion.div
              ref={ref}
              data-popover-content
              initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={cn(
                "fixed z-50 left-1/2 top-1/2 w-[95vw] sm:w-auto max-w-[95vw] sm:max-w-[90vw] rounded-2xl border bg-popover text-popover-foreground shadow-2xl outline-none",
                "max-h-[95vh] sm:max-h-[calc(100vh-4rem)] overflow-y-auto",
                className
              )}
              data-lenis-prevent
              {...props}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-50 p-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                <CircleXIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
              {(children as React.ReactNode)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };