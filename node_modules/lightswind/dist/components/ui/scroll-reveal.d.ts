import React from "react";
export interface ScrollRevealProps {
    children: React.ReactNode;
    /** Custom container className */
    containerClassName?: string;
    /** Custom text className */
    textClassName?: string;
    /** Enable blur animation effect */
    enableBlur?: boolean;
    /** Base opacity when text is out of view */
    baseOpacity?: number;
    /** Base rotation angle in degrees */
    baseRotation?: number;
    /** Blur strength in pixels */
    blurStrength?: number;
    /** Animation delay between words in seconds */
    staggerDelay?: number;
    /** Viewport threshold for triggering animation */
    threshold?: number;
    /** Animation duration in seconds */
    duration?: number;
    /** Spring animation configuration */
    springConfig?: {
        damping?: number;
        stiffness?: number;
        mass?: number;
    };
    /** Text size variant */
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    /** Text alignment */
    align?: "left" | "center" | "right";
    /** Color variant */
    variant?: "default" | "muted" | "accent" | "primary";
}
export declare function ScrollReveal({ children, containerClassName, textClassName, enableBlur, baseOpacity, baseRotation, blurStrength, staggerDelay, threshold, duration, springConfig, size, align, variant, }: ScrollRevealProps): import("react/jsx-runtime").JSX.Element;
export default ScrollReveal;
