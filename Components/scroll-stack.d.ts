import React from "react";
export interface ScrollStackCard {
    title: string;
    subtitle?: string;
    badge?: string;
    backgroundImage?: string;
    content?: React.ReactNode;
}
interface ScrollStackProps {
    cards: ScrollStackCard[];
    backgroundColor?: string;
    cardHeight?: string;
    animationDuration?: string;
    sectionHeightMultiplier?: number;
    intersectionThreshold?: number;
    className?: string;
}
declare const ScrollStack: React.FC<ScrollStackProps>;
export default ScrollStack;
