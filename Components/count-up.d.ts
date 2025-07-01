export interface CountUpProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
    separator?: string;
    interactive?: boolean;
    triggerOnView?: boolean;
    className?: string;
    numberClassName?: string;
    animationStyle?: "default" | "bounce" | "spring" | "gentle" | "energetic";
    colorScheme?: "default" | "gradient" | "primary" | "secondary" | "custom";
    customColor?: string;
    onAnimationComplete?: () => void;
}
export declare function CountUp({ value, duration, decimals, prefix, suffix, easing, separator, interactive, triggerOnView, className, numberClassName, animationStyle, colorScheme, customColor, onAnimationComplete, }: CountUpProps): import("react/jsx-runtime").JSX.Element;
