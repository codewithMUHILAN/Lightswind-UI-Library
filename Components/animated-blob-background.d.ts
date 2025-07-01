import React from "react";
export interface AnimatedBlobBackgroundProps {
    /**
     * Additional class name for the background container
     */
    className?: string;
    /**
     * Custom styles for the background container
     */
    style?: React.CSSProperties;
    /**
     * The amount of blur applied to the blobs (in pixels or viewport units)
     */
    blurAmount?: string;
    /**
     * Array of colors for the first blob gradient
     */
    firstBlobColors?: string[];
    /**
     * Array of colors for the second blob gradient
     */
    secondBlobColors?: string[];
    /**
     * Custom SVG path for the blob shapes
     */
    blobPath?: string;
    /**
     * Speed of the first blob rotation animation in ms
     */
    firstBlobSpeed?: number;
    /**
     * Speed of the second blob rotation animation in ms
     */
    secondBlobSpeed?: number;
    /**
     * Opacity of the first blob (0-1)
     */
    firstBlobOpacity?: number;
    /**
     * Opacity of the second blob (0-1)
     */
    secondBlobOpacity?: number;
    /**
     * Initial rotation angle for the first blob in degrees
     */
    firstBlobRotation?: number;
    /**
     * Initial rotation angle for the second blob in degrees
     */
    secondBlobRotation?: number;
    /**
     * Should the animation run or be paused
     */
    isAnimating?: boolean;
    /**
     * Enable interactive hover effects that respond to mouse movement
     */
    interactive?: boolean;
    /**
     * Z-index for the background container
     */
    zIndex?: number;
    /**
     * Number of blobs to show (1 or 2)
     */
    blobCount?: 1 | 2;
    /**
     * Children elements to render on top of the background
     */
    children?: React.ReactNode;
    /**
     * Intensity of the interactive effect (1-10)
     */
    interactiveIntensity?: number;
}
/**
 * AnimatedBlobBackground component displays animated gradient blobs with
 * configurable shapes, colors, and animation properties.
 */
export declare const AnimatedBlobBackground: ({ className, style, blurAmount, firstBlobColors, secondBlobColors, blobPath, firstBlobSpeed, secondBlobSpeed, firstBlobOpacity, secondBlobOpacity, firstBlobRotation, secondBlobRotation, isAnimating, interactive, zIndex, blobCount, children, interactiveIntensity, }: AnimatedBlobBackgroundProps) => import("react/jsx-runtime").JSX.Element;
