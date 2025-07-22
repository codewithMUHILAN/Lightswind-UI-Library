import * as React from "react";
interface TopLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Whether the loader is currently active */
    isLoading?: boolean;
    /** The color of the loader bar */
    color?: string;
    /** The height of the loader bar in pixels */
    height?: number;
    /** The speed of the loader animation in milliseconds */
    speed?: number;
    /** Whether to show the spinner */
    showSpinner?: boolean;
    /** The easing function for the animation */
    easing?: string;
    /** The minimum percentage to start at */
    minimum?: number;
    /** The parent element to render the loader in */
    parent?: string;
    /** Whether to automatically increment the loader */
    trickle?: boolean;
    /** How much to increase during trickle */
    trickleRate?: number;
    /** How often to trickle in milliseconds */
    trickleSpeed?: number;
    /** Custom template for the loader */
    template?: string;
    /** Z-index for the loader elements */
    zIndex?: number;
    /** Current progress value (0-1) */
    progress?: number;
}
declare const TopLoader: React.ForwardRefExoticComponent<TopLoaderProps & React.RefAttributes<HTMLDivElement>>;
export { TopLoader };
