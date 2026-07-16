
import { cn } from "@/components/lib/utils";
import * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape of the skeleton */
  variant?: "default" | "circle" | "rounded" | "square";
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Animation type for the skeleton */
  animation?: "pulse" | "wave" | "none";
  /** Whether to show a shimmer effect */
  shimmer?: boolean;
  /** Number of skeleton items to display */
  count?: number;
}

function Skeleton({
  className,
  variant = "default",
  width,
  height,
  animation = "wave",
  shimmer = false,
  count = 1,
  ...props
}: SkeletonProps) {
  // Variant classes
  const variantClasses = {
    default: "rounded-md",
    circle: "rounded-full",
    rounded: "rounded-xl",
    square: "rounded-none"
  };

  // Animation classes
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "",
    none: ""
  };

  // Style object for width and height
  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
    ...props.style
  };

  const hasShimmer = shimmer || animation === "wave";

  // Render multiple skeleton items if count > 1
  if (count > 1) {
    return (
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-muted relative overflow-hidden",
              "transition-all duration-300",
              "[.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(255,255,255,0.05)]",
              "dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]",
              "[.lw-3d_&]:border [.lw-3d_&]:border-black/5 dark:[.lw-3d_&]:border-white/5",
              variantClasses[variant],
              animationClasses[animation],
              hasShimmer && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/10 before:to-transparent"
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-primary/20 relative overflow-hidden",
        "transition-all duration-300",
        "[.lw-3d_&]:shadow-[inset_0_1.5px_3px_0_rgba(0,0,0,0.15),0_1px_1px_0_rgba(255,255,255,0.05)]",
        "dark:[.lw-3d_&]:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)]",
        "[.lw-3d_&]:border [.lw-3d_&]:border-black/5 dark:[.lw-3d_&]:border-white/5",
        variantClasses[variant],
        animationClasses[animation],
        hasShimmer && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/10 before:to-transparent",
        className
      )}
      style={style}
      {...props}
    />
  );
}

// Template Card Skeleton component for reuse
function TemplateCardSkeleton() {
  return (
    <div className="rounded-lg border   bg-card overflow-hidden shadow-sm">
      <div className="space-y-3">
        {/* Image placeholder */}
        <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" shimmer />

        {/* Content area */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" shimmer />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" shimmer />
            <Skeleton className="h-4 w-5/6" shimmer />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-5 w-16 rounded-full" shimmer />
            <Skeleton className="h-5 w-20 rounded-full" shimmer />
            <Skeleton className="h-5 w-14 rounded-full" shimmer />
          </div>

          {/* Price and button */}
          <div className="flex justify-between items-center pt-3">
            <Skeleton className="h-6 w-20" shimmer />
            <Skeleton className="h-9 w-28 rounded-md" shimmer />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Skeleton, TemplateCardSkeleton };
