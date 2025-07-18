import React from "react";
export interface TimelineEvent {
    id?: string;
    year: string;
    title: string;
    subtitle?: string;
    description: string;
    icon?: React.ReactNode;
    color?: string;
}
export interface ScrollTimelineProps {
    events: TimelineEvent[];
    title?: string;
    subtitle?: string;
    animationOrder?: "sequential" | "staggered" | "simultaneous";
    cardAlignment?: "alternating" | "left" | "right";
    lineColor?: string;
    activeColor?: string;
    progressIndicator?: boolean;
    cardVariant?: "default" | "elevated" | "outlined" | "filled";
    cardEffect?: "none" | "glow" | "shadow" | "bounce";
    parallaxIntensity?: number;
    progressLineWidth?: number;
    progressLineCap?: "round" | "square";
    dateFormat?: "text" | "badge";
    className?: string;
    revealAnimation?: "fade" | "slide" | "scale" | "flip" | "none";
    connectorStyle?: "dots" | "line" | "dashed";
    perspective?: boolean;
    darkMode?: boolean;
    smoothScroll?: boolean;
}
export declare const ScrollTimeline: ({ events, title, subtitle, animationOrder, cardAlignment, lineColor, activeColor, progressIndicator, cardVariant, cardEffect, parallaxIntensity, progressLineWidth, progressLineCap, dateFormat, revealAnimation, className, connectorStyle, perspective, darkMode, smoothScroll, }: ScrollTimelineProps) => import("react/jsx-runtime").JSX.Element;
