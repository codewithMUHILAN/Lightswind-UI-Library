import { InputProps } from "../ui/input";
export type StrengthLevel = "empty" | "weak" | "medium" | "strong" | "very-strong";
export interface PasswordStrengthIndicatorProps {
    /**
     * The value of the password input
     */
    value: string;
    /**
     * Class name for the container
     */
    className?: string;
    /**
     * Label text for the password field
     */
    label?: string;
    /**
     * Show strength score as text
     */
    showScore?: boolean;
    /**
     * Show strength score as number
     */
    showScoreNumber?: boolean;
    /**
     * Function called when password changes
     */
    onChange?: (value: string) => void;
    /**
     * Function called when strength level changes
     */
    onStrengthChange?: (strength: StrengthLevel) => void;
    /**
     * Placeholder text for input
     */
    placeholder?: string;
    /**
     * Show toggle for password visibility
     */
    showVisibilityToggle?: boolean;
    /**
     * Additional props for the input element
     */
    inputProps?: InputProps;
}
export declare function PasswordStrengthIndicator({ value, className, label, showScore, showScoreNumber, onChange, onStrengthChange, placeholder, showVisibilityToggle, inputProps, }: PasswordStrengthIndicatorProps): import("react/jsx-runtime").JSX.Element;
