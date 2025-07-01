import React from "react";
export interface MenuItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
}
export interface HamburgerMenuOverlayProps {
    /** Array of menu items */
    items: MenuItem[];
    /** Button position from top */
    buttonTop?: string;
    /** Button position from left */
    buttonLeft?: string;
    /** Button size */
    buttonSize?: "sm" | "md" | "lg";
    /** Button background color */
    buttonColor?: string;
    /** Overlay background color/gradient */
    overlayBackground?: string;
    /** Menu text color */
    textColor?: string;
    /** Menu font size */
    fontSize?: "sm" | "md" | "lg" | "xl" | "2xl";
    /** Font family */
    fontFamily?: string;
    /** Font weight */
    fontWeight?: "normal" | "medium" | "semibold" | "bold";
    /** Animation duration in seconds */
    animationDuration?: number;
    /** Stagger delay between menu items */
    staggerDelay?: number;
    /** Menu items alignment */
    menuAlignment?: "left" | "center" | "right";
    /** Custom class for container */
    className?: string;
    /** Custom class for button */
    buttonClassName?: string;
    /** Custom class for menu items */
    menuItemClassName?: string;
    /** Disable overlay close on item click */
    keepOpenOnItemClick?: boolean;
    /** Custom button content */
    customButton?: React.ReactNode;
    /** ARIA label for accessibility */
    ariaLabel?: string;
    /** Callback when menu opens */
    onOpen?: () => void;
    /** Callback when menu closes */
    onClose?: () => void;
    /** Menu items layout direction */
    menuDirection?: "vertical" | "horizontal";
    /** Enable blur backdrop */
    enableBlur?: boolean;
    /** Z-index for overlay */
    zIndex?: number;
}
export declare const HamburgerMenuOverlay: React.FC<HamburgerMenuOverlayProps>;
export default HamburgerMenuOverlay;
