import * as React from "react";
import { cn } from "../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Makes the card have a hover effect */
  hoverable?: boolean;
  /** Makes the card have a bordered appearance */
  bordered?: boolean;
  /** Renders the card with compact padding */
  compact?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hoverable = false,
      bordered = false,
      compact = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-background/70 text-card-foreground shadow-sm",
        bordered ? "border" : "border  ",
        hoverable ? "transition-shadow duration-200 hover:shadow-md" : "",
        compact ? "p-3" : "p-0",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adjusts the spacing in the header */
  spacing?: "default" | "compact" | "relaxed";
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing = "default", ...props }, ref) => {
    const spacingClasses = {
      compact: "flex flex-col space-y-1 p-4",
      default: "flex flex-col space-y-1.5 p-6",
      relaxed: "flex flex-col space-y-2 p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML heading level to use */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Adjusts the text size */
  size?: "sm" | "default" | "lg";
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, as = "h3", size = "default", ...props }, ref) => {
    const Component = as;
    const sizeClasses = {
      sm: "text-lg",
      default: "text-2xl",
      lg: "text-3xl",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "font-semibold leading-none tracking-tight",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Makes text smaller or larger */
  size?: "xs" | "sm" | "default";
}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    default: "text-sm",
  };

  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground", sizeClasses[size], className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Removes the top padding when used after CardHeader */
  removeTopPadding?: boolean;
  /** Adjusts content padding */
  padding?: "none" | "sm" | "default" | "lg";
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (
    { className, removeTopPadding = true, padding = "default", ...props },
    ref
  ) => {
    const paddingClasses = {
      none: "p-0",
      sm: "px-4 py-3",
      default: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          paddingClasses[padding],
          removeTopPadding && padding !== "none" ? "pt-0" : "",
          className
        )}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Changes the alignment of footer items */
  align?: "start" | "center" | "end" | "between" | "around";
  /** Changes the direction of footer items */
  direction?: "row" | "column";
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = "center", direction = "row", ...props }, ref) => {
    const alignClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    const directionClasses = {
      row: "flex-row",
      column: "flex-col",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center p-6 pt-0",
          alignClasses[align],
          directionClasses[direction],
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
