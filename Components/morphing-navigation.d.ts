import React from "react";
export interface MorphingNavigationLink {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
}
export interface MorphingNavigationProps {
    links: MorphingNavigationLink[];
    scrollThreshold?: number;
    enablePageBlur?: boolean;
    theme?: "dark" | "light" | "glass" | "custom";
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    initialTop?: number;
    compactTop?: number;
    animationDuration?: number;
    className?: string;
    onLinkClick?: (link: MorphingNavigationLink) => void;
    onMenuToggle?: (isOpen: boolean) => void;
    enableSmoothTransitions?: boolean;
    customHamburgerIcon?: React.ReactNode;
    disableAutoMorph?: boolean;
}
export declare const MorphingNavigation: React.FC<MorphingNavigationProps>;
export default MorphingNavigation;
