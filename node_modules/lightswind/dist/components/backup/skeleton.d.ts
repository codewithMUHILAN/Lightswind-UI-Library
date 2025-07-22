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
declare function Skeleton({ className, variant, width, height, animation, shimmer, count, ...props }: SkeletonProps): import("react/jsx-runtime").JSX.Element;
declare function TemplateCardSkeleton(): import("react/jsx-runtime").JSX.Element;
export { Skeleton, TemplateCardSkeleton };
