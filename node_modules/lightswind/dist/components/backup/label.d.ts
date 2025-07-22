import * as React from "react";
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor?: string;
}
declare const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLLabelElement>>;
export { Label };
