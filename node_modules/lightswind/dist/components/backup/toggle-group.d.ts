import * as React from "react";
interface ToggleGroupProps {
    type: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    disabled?: boolean;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    className?: string;
    children?: React.ReactNode;
}
declare const ToggleGroup: React.ForwardRefExoticComponent<ToggleGroupProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof ToggleGroupProps> & React.RefAttributes<HTMLDivElement>>;
interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    disabled?: boolean;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    defaultPressed?: boolean;
}
declare const ToggleGroupItem: React.ForwardRefExoticComponent<ToggleGroupItemProps & React.RefAttributes<HTMLButtonElement>>;
export { ToggleGroup, ToggleGroupItem };
