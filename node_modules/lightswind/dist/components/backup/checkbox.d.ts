import * as React from "react";
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export { Checkbox };
