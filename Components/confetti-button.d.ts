import React from "react";
import { type VariantProps } from "class-variance-authority";
type ConfettiOptions = {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
        x?: number;
        y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
};
declare global {
    interface Window {
        confetti?: (options?: ConfettiOptions) => void;
    }
}
declare const confettiButtonVariants: (props?: ({
    variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "gradient" | null | undefined;
    size?: "default" | "icon" | "sm" | "lg" | "xl" | "pill" | null | undefined;
    animation?: "none" | "expand" | "scale" | "pulse" | "bounce" | "shake" | "glow" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof confettiButtonVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    loading?: boolean;
    confettiOptions?: ConfettiOptions;
    autoConfetti?: boolean;
    triggerOnHover?: boolean;
}
declare const ConfettiButton: React.ForwardRefExoticComponent<ConfettiButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { ConfettiButton, confettiButtonVariants };
