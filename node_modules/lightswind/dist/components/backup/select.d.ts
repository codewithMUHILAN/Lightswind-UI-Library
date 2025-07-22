import * as React from "react";
interface SelectProps {
    children: React.ReactNode;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    placeholder?: string;
}
declare const Select: React.FC<SelectProps>;
declare const SelectGroup: React.FC<React.HTMLAttributes<HTMLDivElement>>;
interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    placeholder?: string;
}
declare const SelectValue: React.ForwardRefExoticComponent<SelectValueProps & React.RefAttributes<HTMLSpanElement>>;
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
declare const SelectTrigger: React.ForwardRefExoticComponent<SelectTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React.FC<React.HTMLAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React.FC<React.HTMLAttributes<HTMLDivElement>>;
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
    position?: "popper" | "item-aligned";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}
declare const SelectContent: React.ForwardRefExoticComponent<SelectContentProps & React.RefAttributes<HTMLDivElement>>;
interface SelectLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
}
declare const SelectLabel: React.ForwardRefExoticComponent<SelectLabelProps & React.RefAttributes<HTMLSpanElement>>;
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
}
declare const SelectItem: React.ForwardRefExoticComponent<SelectItemProps & React.RefAttributes<HTMLDivElement>>;
interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const SelectSeparator: React.ForwardRefExoticComponent<SelectSeparatorProps & React.RefAttributes<HTMLDivElement>>;
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, };
