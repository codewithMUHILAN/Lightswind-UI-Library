
import * as React from "react";
import { cn } from "@/components/lib/utils";

// Define button style variants as a constant object (not exported)
const buttonStyles = {
  variant: {
    default: "btn-3d-default",
    destructive: "btn-3d-destructive",
    outline: "btn-3d-outline",
    secondary: "btn-3d-secondary",
    ghost: "btn-3d-ghost",
    link: "btn-3d-link",
    github: "btn-3d-github",
    custom: "btn-3d-custom",
    unstyled: "",
  },
  size: {
    default: "h-10 px-4 py-2 rounded-lg",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-xl",
    icon: "h-10 w-10 rounded-lg",
    unstyled: "",
  }
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonStyles.variant;
  size?: keyof typeof buttonStyles.size;
  asChild?: boolean;
}

// Define the buttonVariants function (exported)
export function buttonVariants(options: {
  variant?: keyof typeof buttonStyles.variant;
  size?: keyof typeof buttonStyles.size;
  className?: string;
} = {}): string {
  const { variant = "default", size = "default", className } = options;

  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    buttonStyles.variant[variant],
    buttonStyles.size[size],
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <React.Fragment>
          {React.Children.map(props.children, child => {
            if (React.isValidElement(child)) {
              // Instead of cloneElement with complex props, use a wrapper
              return (
                <span className={buttonVariants({ variant, size, className })}>
                  {child}
                </span>
              );
            }
            return child;
          })}
        </React.Fragment>
      );
    }

    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
