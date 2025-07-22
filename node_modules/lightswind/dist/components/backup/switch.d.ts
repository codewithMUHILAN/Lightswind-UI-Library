import * as React from "react";
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
    onCheckedChange?: (checked: boolean) => void;
    size?: "sm" | "md" | "lg";
    thumbColor?: string;
    trackColor?: string;
    animation?: "smooth" | "bounce" | "slide";
}
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
export { Switch };
