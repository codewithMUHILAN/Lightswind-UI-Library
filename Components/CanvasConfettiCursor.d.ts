import React from "react";
export interface CanvasConfettiCursorProps {
    /**
     * Array of confetti colors to use.
     */
    colors?: string[];
    /**
     * Minimum confetti particle radius.
     */
    minSize?: number;
    /**
     * Maximum confetti particle radius.
     */
    maxSize?: number;
    /**
     * Number of particles to emit per burst.
     */
    particleCount?: number;
    /**
     * How frequently to spawn bursts (ms).
     */
    frequency?: number;
    /**
     * If true, fills parent (else covers screen).
     */
    fillParent?: boolean;
    /**
     * Opacity of the canvas overlay.
     */
    overlayOpacity?: number;
    /**
     * Confetti particle shrink speed (higher = faster shrink).
     */
    decay?: number;
    /**
     * Optional: callback on each explosion.
     */
    onExplosion?: (x: number, y: number) => void;
    /**
     * Enable/disable confetti effect.
     */
    enabled?: boolean;
    /**
     * Optional: custom styles for canvas
     */
    style?: React.CSSProperties;
    /**
     * Optional: extra className for canvas
     */
    className?: string;
}
export declare const CanvasConfettiCursor: React.FC<CanvasConfettiCursorProps>;
