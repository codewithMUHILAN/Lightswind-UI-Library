import * as React from "react";
interface PopoverProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
declare const Popover: React.FC<PopoverProps>;
interface PopoverTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
}
declare const PopoverTrigger: React.FC<PopoverTriggerProps>;
interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "center" | "start" | "end";
    sideOffset?: number;
}
declare const PopoverContent: React.ForwardRefExoticComponent<PopoverContentProps & React.RefAttributes<HTMLDivElement>>;
export { Popover, PopoverTrigger, PopoverContent };
