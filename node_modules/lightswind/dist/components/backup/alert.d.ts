import * as React from "react";
declare const alertVariants: {
    variant: {
        default: string;
        destructive: string;
        success: string;
        warning: string;
        info: string;
    };
    size: {
        default: string;
        sm: string;
        lg: string;
    };
};
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The style variant of the alert */
    variant?: keyof typeof alertVariants.variant;
    /** The size of the alert */
    size?: keyof typeof alertVariants.size;
    /** Whether the alert should be dismissible */
    dismissible?: boolean;
    /** Callback fired when dismissing the alert */
    onDismiss?: () => void;
    /** Whether to display an icon */
    withIcon?: boolean;
    /** Custom icon to display */
    icon?: React.ReactNode;
}
declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
declare const AlertTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & {
    /** Size of the title */
    size?: "sm" | "default" | "lg";
} & React.RefAttributes<HTMLParagraphElement>>;
declare const AlertDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & {
    /** Text color intensity */
    intensity?: "muted" | "default";
} & React.RefAttributes<HTMLParagraphElement>>;
export { Alert, AlertTitle, AlertDescription };
