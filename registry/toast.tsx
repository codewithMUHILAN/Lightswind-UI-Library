
import * as React from "react";
import { cn } from "@/components/lib/utils";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
import { Progress } from "./progress";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";


/* Toast Components */
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="toast-provider">{children}</div>;
};

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

const toastViewportVariants = cva(
  "fixed z-[100] flex flex-col gap-2 p-4 w-full md:max-w-[420px] pointer-events-none",
  {
    variants: {
      position: {
        "top-right": "top-0 right-0 flex-col-reverse",
        "top-left": "top-0 left-0 flex-col-reverse",
        "bottom-right": "bottom-0 right-0 flex-col",
        "bottom-left": "bottom-0 left-0 flex-col",
        "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col items-center",
      },
    },
    defaultVariants: {
      position: "top-right",
    },
  }
);

export interface ToastViewportProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?: ToastPosition;
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, position = "top-right", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(toastViewportVariants({ position }), className)}
      {...props}
    />
  )
);
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  `group relative flex w-96 items-center justify-between overflow-hidden rounded-md border   p-4 pr-8 shadow-lg transition-all 
  bg-background text-foreground`,
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-red-500 bg-red-100 text-red-800",
        success: "border-green-500 bg-green-100 text-green-800",
        warning: "border-yellow-500 bg-yellow-100 text-yellow-800",
        info: "border-primarylw bg-[color-mix(in_srgb,var(--primarylw)_15%,white)] dark:bg-[color-mix(in_srgb,var(--primarylw)_15%,black)] text-primarylw",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps extends Omit<HTMLMotionProps<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", duration = 5000, open = true, onOpenChange, onClose, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: -20 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          mass: 1
        }}
        className={cn(
          toastVariants({ variant }),
          "relative z-50 mb-2 overflow-hidden",
          "transition-all duration-300",
          "[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.45),inset_0_-1px_0_0_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
          "dark:[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.3),0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]",
          "[.lw-3d_&]:border-black/10 dark:[.lw-3d_&]:border-white/10",
          className
        )}
        {...props}
      >
        <div className="w-full">
          {(children as React.ReactNode)}
          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={cn(
                "h-full",
                variant === "destructive" ? "bg-red-600" :
                  variant === "success" ? "bg-green-600" :
                    variant === "warning" ? "bg-yellow-600" :
                      variant === "info" ? "bg-primarylw" :
                        "bg-gray-600"
              )}
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            onOpenChange?.(false);
            onClose?.();
          }}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/70 opacity-70 transition-opacity hover:text-foreground hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }
);
Toast.displayName = "Toast";

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/70 opacity-70 transition-opacity hover:text-foreground hover:opacity-100",
      className
    )}
    aria-label="Close toast"
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
