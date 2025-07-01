import React from 'react';
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    bio?: string;
}
export interface TeamCarouselProps {
    /** Array of team members */
    members: TeamMember[];
    /** Title displayed above the carousel */
    title?: string;
    /** Title font size */
    titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    /** Title color */
    titleColor?: string;
    /** Background color or gradient */
    background?: string;
    /** Card width in pixels */
    cardWidth?: number;
    /** Card height in pixels */
    cardHeight?: number;
    /** Card border radius */
    cardRadius?: number;
    /** Enable/disable navigation arrows */
    showArrows?: boolean;
    /** Enable/disable dots indicator */
    showDots?: boolean;
    /** Enable/disable keyboard navigation */
    keyboardNavigation?: boolean;
    /** Enable/disable touch/swipe navigation */
    touchNavigation?: boolean;
    /** Animation duration in milliseconds */
    animationDuration?: number;
    /** Auto-play interval in milliseconds (0 to disable) */
    autoPlay?: number;
    /** Pause auto-play on hover */
    pauseOnHover?: boolean;
    /** Number of visible cards on each side */
    visibleCards?: number;
    /** Scale factor for side cards */
    sideCardScale?: number;
    /** Opacity for side cards */
    sideCardOpacity?: number;
    /** Apply grayscale filter to side cards */
    grayscaleEffect?: boolean;
    /** Custom className for container */
    className?: string;
    /** Custom className for cards */
    cardClassName?: string;
    /** Custom className for title */
    titleClassName?: string;
    /** Member info position */
    infoPosition?: 'bottom' | 'overlay' | 'none';
    /** Info text color */
    infoTextColor?: string;
    /** Info background */
    infoBackground?: string;
    /** Callback when active member changes */
    onMemberChange?: (member: TeamMember, index: number) => void;
    /** Callback when card is clicked */
    onCardClick?: (member: TeamMember, index: number) => void;
    /** Initial active index */
    initialIndex?: number;
}
export declare const TeamCarousel: React.FC<TeamCarouselProps>;
export default TeamCarousel;
