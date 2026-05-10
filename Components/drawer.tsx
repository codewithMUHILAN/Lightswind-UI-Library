import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"; // Import HTMLMotionProps

interface DrawerContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  side: "top" | "bottom" | "left" | "right";
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(
  undefined
);

function useDrawerContext() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a Drawer");
  }
  return context;
}

interface DrawerProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
}

const Drawer = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  side = "bottom",
}: DrawerProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }

      if (onOpenChange) {
        const nextValue = typeof value === "function" ? value(open) : value;
        onOpenChange(nextValue);
      }
    },
    [isControlled, onOpenChange, open]
  );

  return (
    <DrawerContext.Provider value={{ open, setOpen, side }}>
      {children}
    </DrawerContext.Provider>
  );
};

interface DrawerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const { setOpen } = useDrawerContext();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ref,
        onClick: (e: React.MouseEvent<any>) => {
          (children as React.ReactElement<any>).props.onClick?.(e);
          props.onClick?.(e as any);
          setOpen(true);
        },
      });
    }

    return (
      <button ref={ref} type="button" onClick={() => setOpen(true)} {...props}>
        {children}
      </button>
    );
  }
);
DrawerTrigger.displayName = "DrawerTrigger";

// Define a type that omits conflicting HTML attributes for Framer Motion
type OmittedDrawerContentHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
  | "onMouseDown"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onMouseMove"
  | "onMouseOut"
  | "onMouseOver"
  | "onMouseUp"
  | "onTouchCancel"
  | "onTouchEnd"
  | "onTouchMove"
  | "onTouchStart"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerCancel"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onPointerOver"
  | "onPointerOut"
  | "onGotPointerCapture"
  | "onLostPointerCapture"
>;

interface DrawerContentProps extends OmittedDrawerContentHTMLAttributes {
  // Use the new type here
  className?: string;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open, setOpen, side } = useDrawerContext();

    const variants = {
      top: {
        initial: { y: "-100%", opacity: 0.5, scale: 0.9 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: "-100%", opacity: 0.5, scale: 0.9 }
      },
      bottom: {
        initial: { y: "100%", opacity: 0.5, scale: 0.9 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: "100%", opacity: 0.5, scale: 0.9 }
      },
      left: {
        initial: { x: "-100%", opacity: 0.5, scale: 0.9 },
        animate: { x: 0, opacity: 1, scale: 1 },
        exit: { x: "-100%", opacity: 0.5, scale: 0.9 }
      },
      right: {
        initial: { x: "100%", opacity: 0.5, scale: 0.9 },
        animate: { x: 0, opacity: 1, scale: 1 },
        exit: { x: "100%", opacity: 0.5, scale: 0.9 }
      },
    };

    const sideOrigins = {
      top: "top center",
      bottom: "bottom center",
      left: "center left",
      right: "center right",
    };

    return createPortal(
      <AnimatePresence>
        {open && (
          <div
            className={cn(
              "fixed inset-0 z-50 flex mx-auto",
              side === "top" && "flex-col items-center justify-start",
              side === "bottom" && "flex-col items-center justify-end",
              side === "left" && "flex-row items-start justify-start",
              side === "right" && "flex-row items-start justify-end"
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              ref={ref}
              initial={variants[side].initial}
              animate={variants[side].animate}
              exit={variants[side].exit}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                opacity: { duration: 0.2 }
              }}
              style={{ transformOrigin: sideOrigins[side] }}
              className={cn(
                "relative z-50 bg-background shadow-2xl outline-none border-border/50",
                (side === "top" || side === "bottom") && "w-full rounded-t-3xl border-t max-h-[90vh] overflow-y-auto",
                (side === "left") && "h-full w-3/4 max-w-sm border-r rounded-r-3xl overflow-y-auto",
                (side === "right") && "h-full w-3/4 max-w-sm border-l rounded-l-3xl overflow-y-auto",
                className
              )}
              role="dialog"
              aria-modal="true"
              {...Object.keys(props).reduce((acc: { [key: string]: any }, key) => {
                if (key === 'onDrag' || key === 'onAnimationStart' || key === 'onTransitionEnd') {
                  return acc;
                }
                acc[key] = (props as any)[key];
                return acc;
              }, {})}
            >
              {(side === "bottom" || side === "top") && (
                <div className="mx-auto my-2 h-1.5 w-16 rounded-full bg-muted" />
              )}
              {children}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-6 rounded-sm opacity-70 
                ring-offset-background transition-opacity hover:opacity-100 
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4 lg:h-8 lg:w-8 z-999" />
                <span className="sr-only">Close drawer</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
DrawerContent.displayName = "DrawerContent";

// Add the missing exports for the Drawer components
interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const { setOpen } = useDrawerContext();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ref,
        onClick: (e: React.MouseEvent<any>) => {
          (children as React.ReactElement<any>).props.onClick?.(e);
          props.onClick?.(e as any);
          setOpen(false);
        },
      });
    }

    return (
      <button ref={ref} type="button" onClick={() => setOpen(false)} {...props}>
        {children}
      </button>
    );
  }
);
DrawerClose.displayName = "DrawerClose";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left p-4",
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4",
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
