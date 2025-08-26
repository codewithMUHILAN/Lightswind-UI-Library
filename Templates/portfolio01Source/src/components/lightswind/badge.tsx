import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-red-500 text-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-amber-500 text-white",
        info: "border-transparent bg-blue-500 text-white",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      shape: {
        default: "rounded-full",
        square: "rounded-sm",
        rounded: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
  dotColor?: string;
  interactive?: boolean;
  highlighted?: boolean;
}

function Badge({
  className,
  variant,
  size,
  shape,
  withDot,
  dotColor = "currentColor",
  interactive,
  highlighted,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, shape }),
        interactive && "cursor-pointer hover:opacity-80",
        highlighted && "ring-2 ring-offset-2 ring-ring",
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className="mr-1 h-1.5 w-1.5 rounded-full inline-block"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };
