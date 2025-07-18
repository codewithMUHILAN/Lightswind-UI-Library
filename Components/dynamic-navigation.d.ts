import React from "react";
export interface DynamicNavigationProps {
    /** Navigation links */
    links: {
        id: string;
        label: string;
        href: string;
        icon?: React.ReactNode;
    }[];
    /** Background color */
    backgroundColor?: string;
    /** Text color */
    textColor?: string;
    /** Highlight color */
    highlightColor?: string;
    /** Glow effect intensity (0-10) */
    glowIntensity?: number;
    /** CSS class name */
    className?: string;
    /** Whether to show labels on mobile */
    showLabelsOnMobile?: boolean;
    /** Callback when a link is clicked */
    onLinkClick?: (id: string) => void;
    /** Initially active link ID */
    activeLink?: string;
    /** Enable ripple effect on click */
    enableRipple?: boolean;
}
export declare const DynamicNavigation: ({ links, backgroundColor, textColor, highlightColor, glowIntensity, className, showLabelsOnMobile, onLinkClick, activeLink, enableRipple, }: DynamicNavigationProps) => import("react/jsx-runtime").JSX.Element;
export default DynamicNavigation;
