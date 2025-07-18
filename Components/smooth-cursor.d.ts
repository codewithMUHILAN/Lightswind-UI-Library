import { JSX } from "react";
interface Position {
    x: number;
    y: number;
}
export interface SpringConfig {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
}
export interface SmoothCursorProps {
    cursor?: JSX.Element;
    springConfig?: SpringConfig;
    className?: string;
    size?: number;
    color?: string;
    hideOnLeave?: boolean;
    trailLength?: number;
    showTrail?: boolean;
    rotateOnMove?: boolean;
    scaleOnClick?: boolean;
    glowEffect?: boolean;
    magneticDistance?: number;
    magneticElements?: string;
    onCursorMove?: (position: Position) => void;
    onCursorEnter?: () => void;
    onCursorLeave?: () => void;
    disabled?: boolean;
}
export declare function SmoothCursor({ cursor, springConfig, className, size, color, hideOnLeave, trailLength, showTrail, rotateOnMove, scaleOnClick, glowEffect, magneticDistance, magneticElements, onCursorMove, onCursorEnter, onCursorLeave, disabled, }: SmoothCursorProps): import("react/jsx-runtime").JSX.Element | null;
export default SmoothCursor;
