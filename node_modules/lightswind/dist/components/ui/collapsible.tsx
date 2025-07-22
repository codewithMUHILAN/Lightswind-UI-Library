import * as React from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"; // Import HTMLMotionProps

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined);

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, open, defaultOpen = false, disabled = false, onOpenChange, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : isOpen;

    const handleOpenChange = React.useCallback((value: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setIsOpen(value);
      }
      onOpenChange?.(value);
    }, [disabled, isControlled, onOpenChange]);

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

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
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
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...child.props,
                ref,
                onClick: (e: React.MouseEvent) => {
                  handleClick();
                  if (child.props.onClick) {
                    child.props.onClick(e);
                  }
                },
                disabled: disabled || child.props.disabled,
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
  }
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// Omit event handlers that conflict with Framer Motion's types
type OmittedHTMLAttributes = Omit<React.HTMLAttributes<HTMLDivElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 
  'onTransitionEnd' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 
  'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 
  'onDrop' | 'onMouseDown' | 'onMouseEnter' | 'onMouseLeave' | 
  'onMouseMove' | 'onMouseOut' | 'onMouseOver' | 'onMouseUp' |
  'onTouchCancel' | 'onTouchEnd' | 'onTouchMove' | 'onTouchStart' |
  'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel' |
  'onPointerEnter' | 'onPointerLeave' | 'onPointerOver' | 'onPointerOut' |
  'onGotPointerCapture' | 'onLostPointerCapture'
>;


interface CollapsibleContentProps extends OmittedHTMLAttributes { // Use the new type here
  forceMount?: boolean;
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, forceMount, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);
    if (!context) {
      throw new Error("CollapsibleContent must be used within a Collapsible");
    }

    const { open } = context;
    const contentRef = React.useRef<HTMLDivElement>(null); // Ref to measure content height

    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => contentRef.current!);

    return (
      <AnimatePresence initial={false}> {/* initial={false} prevents initial animation on mount */}
        {(open || forceMount) && (
          <motion.div
            key="collapsible-content" // Unique key for AnimatePresence to track
            initial={{ height: 0, opacity: 0 }} // Start collapsed and invisible
            animate={{ height: "auto", opacity: 1 }} // Animate to auto height and full opacity
            exit={{ height: 0, opacity: 0 }} // Animate back to 0 height and invisible on exit
            transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
            style={{ overflow: 'hidden' }} // Ensure content is clipped during animation
            // The onAnimationStart and onAnimationComplete are not strictly necessary for basic height animation,
            // but can be useful for more complex scenarios or debugging.
            // onAnimationStart={() => { /* maybe add data-state="animating" */ }}
            // onAnimationComplete={() => { /* maybe remove data-state="animating" */ }}
            className={cn(
              "overflow-hidden", // Keep overflow hidden for content clipping during animation
              className
            )}
            data-state={open ? "open" : "closed"} // Keep data-state for CSS overrides if needed
            // Cast props to HTMLMotionProps<'div'> to satisfy TypeScript
            {...props as HTMLMotionProps<'div'>}
          >
            <div ref={contentRef} className="pb-4"> {/* Add padding bottom to internal div to compensate for overflow hidden */}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };