import React from "react";
export interface ShinyTextProps {
    /** Text content to display */
    children: React.ReactNode;
    /** Disable the shiny animation */
    disabled?: boolean;
    /** Animation speed in seconds */
    speed?: number;
    /** Custom className */
    className?: string;
    /** Text size variant */
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    /** Font weight */
    weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
    /** Base text color */
    baseColor?: string;
    /** Shine effect color */
    shineColor?: string;
    /** Shine effect intensity (0-1) */
    intensity?: number;
    /** Animation direction */
    direction?: "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top";
    /** Shine effect width percentage */
    shineWidth?: number;
    /** Delay before animation starts in seconds */
    delay?: number;
    /** Animation repeat behavior */
    repeat?: number | "infinite";
    /** Pause animation on hover */
    pauseOnHover?: boolean;
    /** Gradient type */
    gradientType?: "linear" | "radial";
}
export declare function ShinyText({ children, disabled, speed, className, size, weight, baseColor, shineColor, intensity, direction, shineWidth, delay, repeat, pauseOnHover, gradientType, }: ShinyTextProps): import("react/jsx-runtime").JSX.Element;
export default ShinyText;
