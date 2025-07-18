import React from "react";
export interface SlidingLogoMarqueeItem {
    id: string;
    content: React.ReactNode;
    href?: string;
}
export interface SlidingLogoMarqueeProps {
    /** Array of logo/content items to display */
    items: SlidingLogoMarqueeItem[];
    /** Animation speed (lower = faster) */
    speed?: number;
    /** Whether to pause animation on hover */
    pauseOnHover?: boolean;
    /** Enable blur effects on edges */
    enableBlur?: boolean;
    /** Blur intensity (0-10) */
    blurIntensity?: number;
    /** Container height */
    height?: string;
    /** Container width */
    width?: string;
    /** Gap between items */
    gap?: string;
    /** Scale factor for the entire component */
    scale?: number;
    /** Direction of animation */
    direction?: "horizontal" | "vertical";
    /** Whether animation is initially playing */
    autoPlay?: boolean;
    /** Background color */
    backgroundColor?: string;
    /** Enable grid background pattern */
    showGridBackground?: boolean;
    /** Custom CSS class */
    className?: string;
    /** Callback when item is clicked */
    onItemClick?: (item: SlidingLogoMarqueeItem) => void;
    /** Whether to show spill effect outside container */
    enableSpillEffect?: boolean;
    /** Number of animation steps for smooth transition */
    animationSteps?: number;
    /** Whether to show play/pause controls */
    showControls?: boolean;
}
export declare function SlidingLogoMarquee({ items, speed, pauseOnHover, enableBlur, blurIntensity, height, width, gap, scale, direction, autoPlay, backgroundColor, showGridBackground, className, onItemClick, enableSpillEffect, animationSteps, showControls, }: SlidingLogoMarqueeProps): import("react/jsx-runtime").JSX.Element;
export default SlidingLogoMarquee;
