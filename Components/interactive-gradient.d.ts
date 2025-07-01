import React from "react";
export interface GradientCardProps {
    color: string;
    glowColor: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
    children?: React.ReactNode;
    followMouse?: boolean;
    hoverOnly?: boolean;
    intensity?: number;
    backgroundColor?: string;
}
export declare const InteractiveGradient: ({ color, glowColor, width, height, borderRadius, className, children, followMouse, hoverOnly, intensity, backgroundColor, }: GradientCardProps) => import("react/jsx-runtime").JSX.Element;
export default InteractiveGradient;
