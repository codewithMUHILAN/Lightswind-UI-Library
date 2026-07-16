import * as React from "react";
import { cn } from "@/components/lib/utils"; // Assuming utils.ts is in lib/
import { motion, AnimatePresence, Variants } from "framer-motion";
import ReactDOM from "react-dom";

// --- Context Types ---
interface TooltipContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: React.ReactNode;
  config: TooltipConfig;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  showTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  hideTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

interface TooltipConfig {
  side: "top" | "right" | "bottom" | "left";
  align: "center" | "start" | "end";
  sideOffset: number;
  variant: "default" | "info" | "success" | "warning" | "error";
  hideArrow: boolean;
  maxWidth: string | number;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

// --- Tooltip Props ---
interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean; // Controlled open state
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number; // Delay before showing tooltip
  hideDelay?: number; // Delay before hiding tooltip
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
  sideOffset?: number; // Distance from trigger
  variant?: "default" | "info" | "success" | "warning" | "error";
  hideArrow?: boolean;
  maxWidth?: string | number;
  asChild?: boolean; // If true, children is rendered directly without a wrapper div
  disabled?: boolean; // If true, tooltip interactions are disabled
}

// --- Tooltip Component ---
const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  delayDuration = 300,
  hideDelay = 100,
  side = "top",
  align = "center",
  sideOffset = 8,
  variant = "default",
  hideArrow = false,
  maxWidth = "20rem",
  asChild = false,
  disabled = false,
}) => {
  // Manage uncontrolled open state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  // Determine if the component is controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // Ref for the trigger element, passed via context to TooltipContentDisplay
  const triggerRef = React.useRef<HTMLElement | null>(null);

  // Function to update the open state, handling both controlled and uncontrolled modes
  const setOpen = React.useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (!isControlled) {
      setUncontrolledOpen(value);
    }
    if (onOpenChange) {
      // Calculate the new value if a function is passed
      const newValue = typeof value === "function" ? value(open) : value;
      onOpenChange(newValue);
    }
  }, [isControlled, onOpenChange, open]);

  // Refs for managing show/hide timeouts
  const showTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize configuration object to prevent unnecessary re-renders
  const config = React.useMemo(() => ({
    side,
    align,
    sideOffset,
    variant,
    hideArrow,
    maxWidth,
  }), [side, align, sideOffset, variant, hideArrow, maxWidth]);

  // Clean up any pending timeouts on component unmount
  React.useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (disabled) return;
    // Always clear both timers to prevent race conditions
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    showTimeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
  }, [disabled, setOpen, delayDuration]);

  const handleMouseLeave = React.useCallback(() => {
    if (disabled) return;
    // Always clear both timers to prevent race conditions
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    hideTimeoutRef.current = setTimeout(() => setOpen(false), hideDelay);
  }, [disabled, setOpen, hideDelay]);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    content,
    config,
    triggerRef,
    showTimeoutRef,
    hideTimeoutRef,
    handleMouseEnter,
    handleMouseLeave,
  }), [open, setOpen, content, config, triggerRef, handleMouseEnter, handleMouseLeave]);

  return (
    <TooltipContext.Provider value={contextValue}>
      {disabled ? children : (
        <TooltipTrigger
          asChild={asChild}
          triggerRef={triggerRef}
        >
          {children}
        </TooltipTrigger>
      )}
      <TooltipContentDisplay />
    </TooltipContext.Provider>
  );
};

// --- TooltipTrigger Props ---
interface TooltipTriggerProps {
  children: React.ReactNode;
  delayDuration?: number;
  hideDelay?: number;
  asChild?: boolean;
  triggerRef?: React.MutableRefObject<HTMLElement | null>;
}

// --- TooltipTrigger Component ---
const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild = false, triggerRef }, ref) => {
    const context = React.useContext(TooltipContext);
    if (!context) {
      throw new Error("TooltipTrigger must be used within a Tooltip");
    }

    // Combined ref to set both the forwarded ref and the internal triggerRef
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
      if (triggerRef) {
        triggerRef.current = node;
      }
    }, [ref, triggerRef]);

    // Props to be applied to the trigger element
    const triggerProps = {
      ref: combinedRef, // Use the combined ref
      onMouseEnter: context.handleMouseEnter,
      onMouseLeave: context.handleMouseLeave,
      onFocus: () => context.setOpen(true),
      onBlur: () => context.setOpen(false),
    };

    // If asChild is true, clone props onto the child element
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, triggerProps);
    }

    // Default rendering if asChild is false
    return (
      <div
        className="inline-block relative" // Keeps the trigger as a block for correct positioning
        {...triggerProps}
      >
        {children}
      </div>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

// --- TooltipContentDisplay Component ---
// This component renders the actual tooltip content and handles its positioning.
const TooltipContentDisplay = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipContentDisplay must be used within a Tooltip");
  }

  const { open, content, config, triggerRef } = context;
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getAnimationVariants = React.useCallback((): Variants => {
    const { side } = config;
    const distance = 8;

    return {
      hidden: {
        opacity: 0,
        scale: 0.8,
        x: side === "left" ? distance : side === "right" ? -distance : 0,
        y: side === "top" ? distance : side === "bottom" ? -distance : 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 400,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.15, ease: "easeIn" },
        pointerEvents: "none",
      },
    };
  }, [config]);

  const updatePosition = React.useCallback(() => {
    if (!contentRef.current || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;
    const { side, align, sideOffset } = config;

    switch (side) {
      case "top":
        y = triggerRect.top - contentRect.height - sideOffset;
        break;
      case "bottom":
        y = triggerRect.bottom + sideOffset;
        break;
      case "left":
        x = triggerRect.left - contentRect.width - sideOffset;
        break;
      case "right":
        x = triggerRect.right + sideOffset;
        break;
    }

    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          x = triggerRect.left;
          break;
        case "end":
          x = triggerRect.right - contentRect.width;
          break;
        default:
          x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
          break;
      }
    } else {
      switch (align) {
        case "start":
          y = triggerRect.top;
          break;
        case "end":
          y = triggerRect.bottom - contentRect.height;
          break;
        default:
          y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
          break;
      }
    }

    const padding = 8;
    if (x < padding) x = padding;
    if (x + contentRect.width > window.innerWidth - padding)
      x = window.innerWidth - contentRect.width - padding;
    if (y < padding) y = padding;
    if (y + contentRect.height > window.innerHeight - padding)
      y = window.innerHeight - contentRect.height - padding;

    setPosition({ x, y });
  }, [config, triggerRef]);

  React.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(updatePosition);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        cancelAnimationFrame(id);
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [open, updatePosition]);

  const getArrowStyle = React.useCallback(() => {
    const { side, align } = config;
    const arrowSize = 8;
    let style: React.CSSProperties = {
      position: "absolute",
      width: arrowSize,
      height: arrowSize,
      transform: "rotate(45deg)",
      zIndex: -1,
    };

    switch (side) {
      case "top":
        style.bottom = -arrowSize / 2;
        style.left = align === "center" ? "50%" : align === "start" ? "15%" : undefined;
        if (align === "end") style.right = "15%";
        if (align === "center") style.transform = "translateX(-50%) rotate(45deg)";
        break;
      case "bottom":
        style.top = -arrowSize / 2;
        style.left = align === "center" ? "50%" : align === "start" ? "15%" : undefined;
        if (align === "end") style.right = "15%";
        if (align === "center") style.transform = "translateX(-50%) rotate(45deg)";
        break;
      case "left":
        style.right = -arrowSize / 2;
        style.top = align === "center" ? "50%" : align === "start" ? "15%" : undefined;
        if (align === "end") style.bottom = "15%";
        if (align === "center") style.transform = "translateY(-50%) rotate(45deg)";
        break;
      case "right":
        style.left = -arrowSize / 2;
        style.top = align === "center" ? "50%" : align === "start" ? "15%" : undefined;
        if (align === "end") style.bottom = "15%";
        if (align === "center") style.transform = "translateY(-50%) rotate(45deg)";
        break;
    }

    return style;
  }, [config]);

  const getVariantClasses = React.useCallback(() => {
    const { variant } = config;
    switch (variant) {
      case "info":
        return cn(
          "bg-primarylw text-white border-[color-mix(in_srgb,var(--primarylw)_20%,transparent)]",
          "[.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-blue-500 [.lw-3d_&]:to-blue-600",
          "[.lw-3d_&]:border-blue-600/30 [.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.25)]"
        );
      case "success":
        return cn(
          "bg-emerald-600 text-white border-emerald-400/20",
          "[.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-emerald-500 [.lw-3d_&]:to-emerald-600",
          "[.lw-3d_&]:border-emerald-600/30 [.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.25)]"
        );
      case "warning":
        return cn(
          "bg-amber-500 text-black border-amber-400/20",
          "[.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-amber-400 [.lw-3d_&]:to-amber-500",
          "[.lw-3d_&]:border-amber-500/30 [.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.4)]"
        );
      case "error":
        return cn(
          "bg-rose-600 text-white border-rose-400/20",
          "[.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-rose-500 [.lw-3d_&]:to-rose-600",
          "[.lw-3d_&]:border-rose-600/30 [.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.25)]"
        );
      default:
        return cn(
          "bg-popover/90 text-popover-foreground border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-xl",
          "[.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-white [.lw-3d_&]:to-zinc-50/90",
          "dark:[.lw-3d_&]:from-zinc-800 dark:[.lw-3d_&]:to-zinc-900",
          "[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.6)]",
          "dark:[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15)]"
        );
    }
  }, [config]);

  if (!open || !mounted) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={contentRef}
        onMouseEnter={context.handleMouseEnter}
        onMouseLeave={context.handleMouseLeave}
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          maxWidth: config.maxWidth,
          zIndex: 9999,
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={getAnimationVariants()}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-medium border border-transparent",
          "transition-all duration-300",
          "[.lw-3d_&]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_2px_4px_0_rgba(0,0,0,0.06),0_4px_12px_0_rgba(0,0,0,0.08)]",
          "dark:[.lw-3d_&]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_4px_0_rgba(0,0,0,0.2),0_4px_12px_0_rgba(0,0,0,0.3)]",
          "[.lw-3d_&]:border-black/10 dark:[.lw-3d_&]:border-white/10",
          getVariantClasses()
        )}
      >
        {!config.hideArrow && (
          <div
            className={cn("absolute w-2 h-2", getVariantClasses(), "border-0")}
            style={getArrowStyle()}
          />
        )}
        {content}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// Re-export as named export
export { Tooltip, TooltipTrigger };

// For legacy compatibility (if needed, otherwise remove)
export const Tooltips = Tooltip;

// Deprecated TooltipContent, kept for backward compatibility with a warning
export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, _ref) => {
    console.warn("TooltipContent is deprecated. Use the Tooltip component with content prop instead.");
    return <div {...props} />;
  }
);
TooltipContent.displayName = "TooltipContent";

// Backward compatibility for TooltipProvider (if needed, otherwise remove)
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};