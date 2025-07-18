import React from 'react';
export interface GlowingCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    hoverEffect?: boolean;
}
export interface GlowingCardsProps {
    children: React.ReactNode;
    className?: string;
    /** Enable the glowing overlay effect */
    enableGlow?: boolean;
    /** Size of the glow effect radius */
    glowRadius?: number;
    /** Opacity of the glow effect */
    glowOpacity?: number;
    /** Animation duration for glow transitions */
    animationDuration?: number;
    /** Enable hover effects on individual cards */
    enableHover?: boolean;
    /** Gap between cards */
    gap?: string;
    /** Maximum width of cards container */
    maxWidth?: string;
    /** Padding around the container */
    padding?: string;
    /** Background color for the container */
    backgroundColor?: string;
    /** Border radius for cards */
    borderRadius?: string;
    /** Enable responsive layout */
    responsive?: boolean;
    /** Custom CSS variables for theming */
    customTheme?: {
        cardBg?: string;
        cardBorder?: string;
        textColor?: string;
        hoverBg?: string;
    };
}
export declare const GlowingCard: React.FC<GlowingCardProps>;
export declare const GlowingCards: React.FC<GlowingCardsProps>;
export { GlowingCards as default };
