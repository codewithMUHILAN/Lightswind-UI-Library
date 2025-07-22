import * as React from "react";
interface SliderProps {
    defaultValue?: number[];
    value?: number[];
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number[]) => void;
    disabled?: boolean;
    className?: string;
    showTooltip?: boolean;
    showLabels?: boolean;
    thumbClassName?: string;
    trackClassName?: string;
}
declare const Slider: React.ForwardRefExoticComponent<SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof SliderProps> & React.RefAttributes<HTMLDivElement>>;
export { Slider };
