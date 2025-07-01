export interface AuroraTextEffectProps {
    text: string;
    className?: string;
    textClassName?: string;
    fontSize?: string;
    colors?: {
        first?: string;
        second?: string;
        third?: string;
        fourth?: string;
    };
    blurAmount?: "blur-none" | "blur-sm" | "blur-md" | "blur-lg" | "blur-xl" | "blur-2xl" | "blur-3xl" | string;
    animationSpeed?: {
        border?: number;
        first?: number;
        second?: number;
        third?: number;
        fourth?: number;
    };
}
export declare function AuroraTextEffect({ text, className, textClassName, fontSize, colors, blurAmount, animationSpeed, }: AuroraTextEffectProps): import("react/jsx-runtime").JSX.Element;
