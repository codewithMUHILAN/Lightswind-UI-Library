import * as React from "react";
import { cn } from "../lib/utils";
import { CircleXIcon } from "lucide-react";

// --- Context and Props (with the new prop added) ---

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

  // Hide/show body scrollbar based on popover open state
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
    <PopoverContext.Provider value={{ open, setOpen }}>
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
            const childProps = {
              ...child.props,
              onClick: (e: React.MouseEvent) => {
                handleClick(e as React.MouseEvent<HTMLElement>);
                if (child.props.onClick) child.props.onClick(e);
              },
            };
            return React.cloneElement(child, childProps);
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

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "center" | "start" | "end";
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    if (!context) {
      throw new Error("PopoverContent must be used within a Popover");
    }

    const { open, setOpen } = context;

    if (!open) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          style={{ opacity: open ? 1 : 0 }}
        />
        <div
          ref={ref}
          data-popover-content
          className={cn(
            "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto max-w-[90vw] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "max-h-[calc(100vh-2rem)] overflow-y-auto",
            className
          )}
          {...props}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 z-10 p-1 bg-gray-200/20 backdrop-blur-sm rounded-full shadow-md hover:bg-background hover:scale-110 transition-all duration-200"
          >
            <CircleXIcon className="w-6 h-6" />
          </button>
          {props.children}
        </div>
      </>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };