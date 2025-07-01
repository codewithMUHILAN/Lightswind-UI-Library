import React from "react";
export interface GridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    gridSize?: number;
    gridColor?: string;
    darkGridColor?: string;
    showFade?: boolean;
    fadeIntensity?: number;
    children?: React.ReactNode;
}
export declare const GridBackground: ({ className, children, gridSize, gridColor, darkGridColor, showFade, fadeIntensity, ...props }: GridBackgroundProps) => import("react/jsx-runtime").JSX.Element;
export interface DotBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    dotSize?: number;
    dotColor?: string;
    darkDotColor?: string;
    spacing?: number;
    showFade?: boolean;
    fadeIntensity?: number;
    children?: React.ReactNode;
}
export declare const DotBackground: ({ className, children, dotSize, dotColor, darkDotColor, spacing, showFade, fadeIntensity, ...props }: DotBackgroundProps) => import("react/jsx-runtime").JSX.Element;
declare const _default: {
    GridBackground: ({ className, children, gridSize, gridColor, darkGridColor, showFade, fadeIntensity, ...props }: GridBackgroundProps) => import("react/jsx-runtime").JSX.Element;
    DotBackground: ({ className, children, dotSize, dotColor, darkDotColor, spacing, showFade, fadeIntensity, ...props }: DotBackgroundProps) => import("react/jsx-runtime").JSX.Element;
};
export default _default;
