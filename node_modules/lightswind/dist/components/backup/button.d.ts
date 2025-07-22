import * as React from "react";
declare const buttonStyles: {
    variant: {
        default: string;
        destructive: string;
        outline: string;
        secondary: string;
        ghost: string;
        link: string;
        github: string;
    };
    size: {
        default: string;
        sm: string;
        lg: string;
        icon: string;
    };
};
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonStyles.variant;
    size?: keyof typeof buttonStyles.size;
    asChild?: boolean;
}
export declare function buttonVariants(options?: {
    variant?: keyof typeof buttonStyles.variant;
    size?: keyof typeof buttonStyles.size;
    className?: string;
}): string;
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button };
