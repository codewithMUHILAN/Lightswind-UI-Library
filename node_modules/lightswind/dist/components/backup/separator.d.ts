import * as React from "react";
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The orientation of the separator */
    orientation?: "horizontal" | "vertical";
    /** Whether the separator is decorative or functional */
    decorative?: boolean;
    /** The thickness of the separator */
    thickness?: "thin" | "default" | "thick";
    /** The style of the separator */
    lineStyle?: "solid" | "dashed" | "dotted";
    /** The color variant of the separator */
    variant?: "default" | "muted" | "accent" | "primary";
}
declare const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<HTMLDivElement>>;
export { Separator };
