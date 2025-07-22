import * as React from "react";
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Reference to the viewport element */
    viewportRef?: React.RefObject<HTMLDivElement>;
    /** Maximum height of the scroll area */
    maxHeight?: string | number;
    /** Whether to show scrollbars */
    showScrollbars?: boolean;
    /** Whether to allow scrolling */
    scrollable?: boolean;
    /** The orientation of the scroll area */
    orientation?: "vertical" | "horizontal" | "both";
    /** Whether to smooth scroll */
    smooth?: boolean;
    /** Theme for the scrollbar */
    theme?: "default" | "minimal" | "none";
}
declare const ScrollArea: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;
interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The orientation of the scrollbar */
    orientation?: "vertical" | "horizontal";
    /** Size of the scrollbar */
    size?: "thin" | "default" | "thick";
    /** Whether the scrollbar is visible */
    visible?: boolean;
}
declare const ScrollBar: React.ForwardRefExoticComponent<ScrollBarProps & React.RefAttributes<HTMLDivElement>>;
export { ScrollArea, ScrollBar };
