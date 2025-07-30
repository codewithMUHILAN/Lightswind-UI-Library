
import * as React from "react";
import { cn } from "../lib/utils";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";

const alertVariants = {
  variant: {
    default: "bg-white dark:bg-black text-foreground",
    destructive:
      " border-gray-400 dark:border-gray-700/50 text-red-500  [&>svg]:text-destructive",
    success:
      "border-green-500/50 text-green-700 dark:text-green-500 [&>svg]:text-green-500",
    warning:
      "border-yellow-500/50 text-yellow-700 dark:text-yellow-500 [&>svg]:text-yellow-500",
    info:
      "border-blue-500/50 text-blue-700 dark:text-blue-500 [&>svg]:text-blue-500",
  },
  size: {
    default: "p-4",
    sm: "p-3 text-sm",
    lg: "p-6 text-base"
  }
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The style variant of the alert */
  variant?: keyof typeof alertVariants.variant;
  /** The size of the alert */
  size?: keyof typeof alertVariants.size;
  /** Whether the alert should be dismissible */
  dismissible?: boolean;
  /** Callback fired when dismissing the alert */
  onDismiss?: () => void;
  /** Whether to display an icon */
  withIcon?: boolean;
  /** Custom icon to display */
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    dismissible = false,
    onDismiss,
    withIcon = false,
    icon,
    children,
    ...props 
  }, ref) => {
    // Icon mapping based on variant
    const variantIcons = {
      default: <Info className="h-4 w-4" />,
      destructive: <AlertCircle className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />
    };

    const handleDismiss = () => {
      if (onDismiss) {
        onDismiss();
      }
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border",
          withIcon && "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          withIcon && "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
          alertVariants.variant[variant],
          alertVariants.size[size],
          className
        )}
        {...props}
      >
        {withIcon && (icon || variantIcons[variant])}
        {children}
        {dismissible && (
          <button
            className="absolute top-4 right-4 rounded-full p-1 
            text-foreground/70 opacity-70 
            transition-opacity hover:opacity-100 
            focus:outline-none focus:ring-2 focus:ring-ring 
            focus:ring-offset-2"
            onClick={handleDismiss}
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    /** Size of the title */
    size?: "sm" | "default" | "lg";
  }
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg"
  };

  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", sizeClasses[size], className)}
      {...props}
    />
  );
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    /** Text color intensity */
    intensity?: "muted" | "default";
  }
>(({ className, intensity = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm [&_p]:leading-relaxed", 
      intensity === "muted" ? "text-muted-foreground" : "",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
