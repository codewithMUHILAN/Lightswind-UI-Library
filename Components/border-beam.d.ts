import React from "react";
interface BorderBeamProps {
    /**
     * The size of the border beam.
     */
    size?: number;
    /**
     * The duration of the border beam.
     */
    duration?: number;
    /**
     * The delay of the border beam.
     */
    delay?: number;
    /**
     * The color of the border beam from.
     */
    colorFrom?: string;
    /**
     * The color of the border beam to.
     */
    colorTo?: string;
    /**
     * The motion transition of the border beam.
     */
    transition?: any;
    /**
     * The class name of the border beam.
     */
    className?: string;
    /**
     * The style of the border beam.
     */
    style?: React.CSSProperties;
    /**
     * Whether to reverse the animation direction.
     */
    reverse?: boolean;
    /**
     * The initial offset position (0-100).
     */
    initialOffset?: number;
    /**
     * The thickness of the border.
     */
    borderThickness?: number;
    /**
     * The opacity of the beam.
     */
    opacity?: number;
    /**
     * The intensity of the glow effect.
     */
    glowIntensity?: number;
    /**
     * Border radius of the beam in pixels.
     */
    beamBorderRadius?: number;
    /**
     * Whether to pause animation on hover.
     */
    pauseOnHover?: boolean;
    /**
     * Animation speed multiplier (higher is faster).
     */
    speedMultiplier?: number;
}
export declare const BorderBeam: ({ className, size, delay, duration, colorFrom, colorTo, transition, style, reverse, initialOffset, borderThickness, opacity, glowIntensity, beamBorderRadius, pauseOnHover, speedMultiplier, }: BorderBeamProps) => import("react/jsx-runtime").JSX.Element;
export {};
