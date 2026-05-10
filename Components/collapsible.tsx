import * as React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils"; // Assuming you have a utility for combining class names

// --- Context ---
interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const CollapsibleContext = React.createContext<
  CollapsibleContextValue | undefined
>(undefined);

// --- Root Component ---
interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      children,
      open,
      defaultOpen = false,
      disabled = false,
      onOpenChange,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : isOpen;

    const handleOpenChange = React.useCallback(
      (value: boolean) => {
        if (disabled) return;
        if (!isControlled) {
          setIsOpen(value);
        }
        onOpenChange?.(value);
      },
      [disabled, isControlled, onOpenChange]
    );

    return (
      <CollapsibleContext.Provider
        value={{ open: currentOpen!, onOpenChange: handleOpenChange, disabled }}
      >
        <div
          ref={ref}
          className={cn("", className)}
          data-state={currentOpen ? "open" : "closed"}
          data-disabled={disabled ? "" : undefined}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = "Collapsible";

// --- Trigger Component ---
interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleTrigger must be used within a Collapsible");
  }

  const { open, onOpenChange, disabled } = context;

  const handleClick = () => {
    onOpenChange(!open);
  };

  if (asChild) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const element = child as React.ReactElement<any>;
            return React.cloneElement(element, {
              ...element.props,
              ref,
              onClick: (e: React.MouseEvent) => {
                handleClick();
                if (element.props.onClick) {
                  element.props.onClick(e);
                }
              },
              disabled: disabled || element.props.disabled,
              "data-state": open ? "open" : "closed",
              "data-disabled": disabled ? "" : undefined,
              "aria-expanded": open,
            });
          }
          return child;
        })}
      </>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      aria-expanded={open}
      className={cn("", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// --- Content Component ---
// Omit event handlers that conflict with Framer Motion's types
type OmittedHTMLAttributes = Omit<
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

interface CollapsibleContentProps extends OmittedHTMLAttributes {
  forceMount?: boolean;
}

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, children, forceMount, ...props }, ref) => {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleContent must be used within a Collapsible");
  }

  const { open } = context;
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => contentRef.current!);

  // Framer Motion variants for a professional, smooth animation
  const variants = {
    closed: {
      height: 0,
      opacity: 0,
      scale: 0.98,
      y: -10,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.15 },
        scale: { duration: 0.2 },
        y: { duration: 0.2 }
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        height: {
          type: "spring",
          damping: 25,
          stiffness: 300
        } as any,
        opacity: { duration: 0.2, delay: 0.05 },
        scale: {
          type: "spring",
          damping: 20,
          stiffness: 200
        } as any,
        y: {
          type: "spring",
          damping: 20,
          stiffness: 200
        } as any
      }
    },
  };

  return (
    <AnimatePresence initial={false}>
      {(open || forceMount) && (
        <motion.div
          key="collapsible-content"
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          style={{ overflow: "hidden" }} // Crucial for a smooth height animation
          className={cn(className)}
          data-state={open ? "open" : "closed"}
          {...(props as HTMLMotionProps<"div">)}
        >
          {/* This inner div is what we measure if we needed it, but height: auto handles it now */}
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
