import * as React from "react";
declare const toggleVariants: {
    variant: {
        default: string;
        outline: string;
    };
    size: {
        default: string;
        sm: string;
        lg: string;
    };
};
export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof toggleVariants.variant;
    size?: keyof typeof toggleVariants.size;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
}
declare const Toggle: React.ForwardRefExoticComponent<ToggleProps & React.RefAttributes<HTMLButtonElement>>;
export { Toggle, toggleVariants };
