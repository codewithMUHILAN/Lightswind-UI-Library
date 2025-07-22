import React from "react";
export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    gradientColors?: string[];
    animationSpeed?: number;
    glowEffect?: boolean;
    glowSize?: number;
    variant?: "default" | "outline" | "ghost";
}
export declare function GradientButton({ children, size, className, gradientColors, animationSpeed, glowEffect, glowSize, variant, ...props }: GradientButtonProps): import("react/jsx-runtime").JSX.Element;
export interface GlowingLightsProps {
    gradientColors?: string[];
    animationSpeed?: number;
    glowSize?: number;
    className?: string;
}
export declare function GlowingLights({ gradientColors, animationSpeed, glowSize, className, }: GlowingLightsProps): import("react/jsx-runtime").JSX.Element;
