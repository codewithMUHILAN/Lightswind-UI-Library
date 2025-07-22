import React from 'react';
export interface TypewriterInputProps {
    /** The value of the input */
    value?: string;
    /** Callback when value changes */
    onChange?: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Input name attribute */
    name?: string;
    /** Input id attribute */
    id?: string;
    /** Enable typewriter animation */
    enableAnimation?: boolean;
    /** Animation duration in milliseconds */
    animationDuration?: number;
    /** Scale factor for character animation */
    scaleFactor?: number;
    /** Animation delay between characters */
    animationDelay?: number;
    /** Input background color */
    inputBackground?: string;
    /** Text color */
    textColor?: string;
    /** Caret color */
    caretColor?: string;
    /** Font weight */
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
    /** Font size */
    fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    /** Border radius */
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Shadow intensity */
    shadowIntensity?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    /** Disable input */
    disabled?: boolean;
    /** Make input readonly */
    readOnly?: boolean;
    /** Input width */
    width?: string;
    /** Custom className for container */
    className?: string;
    /** Custom className for input */
    inputClassName?: string;
    /** Custom className for animated text */
    textClassName?: string;
    /** Enable shake animation on focus */
    enableShakeAnimation?: boolean;
    /** Custom styles */
    style?: React.CSSProperties;
    /** ARIA label for accessibility */
    ariaLabel?: string;
    /** Callback when input is focused */
    onFocus?: () => void;
    /** Callback when input loses focus */
    onBlur?: () => void;
    /** Callback when Enter key is pressed */
    onEnter?: () => void;
}
export declare const TypewriterInput: React.FC<TypewriterInputProps>;
export default TypewriterInput;
