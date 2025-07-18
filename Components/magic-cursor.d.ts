import React from "react";
export interface MagicCursorConfig {
    colors?: number[];
    color?: number;
    coordScale?: number;
    noiseIntensity?: number;
    noiseTimeCoef?: number;
    pointSize?: number;
    pointDecay?: number;
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeCoefX?: number;
    sleepTimeCoefY?: number;
    gpgpuSize?: number;
}
export interface MagicCursorProps {
    target?: HTMLElement | string;
    config?: MagicCursorConfig;
    enabled?: boolean;
    className?: string;
    clickInteraction?: boolean;
    resetDuration?: number;
    showOnMobile?: boolean;
    interactionColors?: number[];
    children?: React.ReactNode;
}
declare const MagicCursor: React.FC<MagicCursorProps>;
export default MagicCursor;
