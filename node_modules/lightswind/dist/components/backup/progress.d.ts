import * as React from "react";
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Current progress value */
    value?: number;
    /** Maximum progress value */
    max?: number;
    /** Optional class name for the indicator element */
    indicatorClassName?: string;
    /** Whether to show indeterminate loading animation */
    indeterminate?: boolean;
    /** Color variant for the progress bar */
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    /** Size variant of the progress bar */
    size?: "sm" | "md" | "lg";
    /** Whether to show the progress value as text */
    showValue?: boolean;
    /** Animation speed for the progress transitions */
    animationSpeed?: "slow" | "normal" | "fast";
}
declare const Progress: React.ForwardRefExoticComponent<ProgressProps & React.RefAttributes<HTMLDivElement>>;
export { Progress };
