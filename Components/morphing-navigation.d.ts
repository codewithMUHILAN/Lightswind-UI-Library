import React from 'react';
export interface MorphingNavigationLink {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
}
export interface MorphingNavigationProps {
    /** Navigation links */
    links: MorphingNavigationLink[];
    /** Scroll threshold to trigger morphing (default: 100) */
    scrollThreshold?: number;
    /** Enable blur effect on page when menu is open */
    enablePageBlur?: boolean;
    /** Navigation background color theme */
    theme?: 'dark' | 'light' | 'glass' | 'custom';
    /** Custom background color (for custom theme) */
    backgroundColor?: string;
    /** Custom text color (for custom theme) */
    textColor?: string;
    /** Custom border color (for custom theme) */
    borderColor?: string;
    /** Initial top position when expanded (default: 70px) */
    initialTop?: number;
    /** Compact top position when morphed (default: 20px) */
    compactTop?: number;
    /** Animation duration in seconds (default: 1) */
    animationDuration?: number;
    /** Custom CSS class for container */
    className?: string;
    /** Callback when a link is clicked */
    onLinkClick?: (link: MorphingNavigationLink) => void;
    /** Callback when menu is opened/closed */
    onMenuToggle?: (isOpen: boolean) => void;
    /** Enable smooth section transitions */
    enableSmoothTransitions?: boolean;
    /** Custom hamburger icon */
    customHamburgerIcon?: React.ReactNode;
    /** Disable auto-morphing on scroll */
    disableAutoMorph?: boolean;
}
export declare const MorphingNavigation: React.FC<MorphingNavigationProps>;
export default MorphingNavigation;
