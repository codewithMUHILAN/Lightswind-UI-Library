import React from "react";
import { Easing } from "framer-motion";
interface LensProps {
    children: React.ReactNode;
    zoomFactor?: number;
    lensSize?: number;
    position?: {
        x: number;
        y: number;
    };
    isStatic?: boolean;
    isFocusing?: () => void;
    hovering?: boolean;
    setHovering?: (hovering: boolean) => void;
    className?: string;
    borderRadius?: string;
    borderWidth?: number;
    borderColor?: string;
    shadowIntensity?: 'none' | 'light' | 'medium' | 'heavy';
    animationDuration?: number;
    animationEasing?: Easing | Easing[];
    maskShape?: 'circle' | 'square';
    opacity?: number;
    blurEdge?: boolean;
    smoothFollow?: boolean;
    disabled?: boolean;
}
export declare const Lens: React.FC<LensProps>;
export {};
