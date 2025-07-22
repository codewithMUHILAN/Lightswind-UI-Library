import * as React from "react";
interface CommandItem {
    id: string;
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
    onSelect?: () => void;
}
interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
    isLoading?: boolean;
    emptyMessage?: string;
}
declare const Command: React.ForwardRefExoticComponent<CommandProps & React.RefAttributes<HTMLDivElement>>;
interface CommandDialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}
declare const CommandDialog: React.FC<CommandDialogProps>;
interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onValueChange?: (value: string) => void;
    isLoading?: boolean;
}
declare const CommandInput: React.ForwardRefExoticComponent<CommandInputProps & React.RefAttributes<HTMLInputElement>>;
interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
    isLoading?: boolean;
}
declare const CommandList: React.ForwardRefExoticComponent<CommandListProps & React.RefAttributes<HTMLDivElement>>;
interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const CommandEmpty: React.ForwardRefExoticComponent<CommandEmptyProps & React.RefAttributes<HTMLDivElement>>;
interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    heading?: string;
}
declare const CommandGroup: React.ForwardRefExoticComponent<CommandGroupProps & React.RefAttributes<HTMLDivElement>>;
interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const CommandSeparator: React.ForwardRefExoticComponent<CommandSeparatorProps & React.RefAttributes<HTMLDivElement>>;
interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    onSelect?: () => void;
    value?: string;
}
declare const CommandItem: React.ForwardRefExoticComponent<CommandItemProps & React.RefAttributes<HTMLDivElement>>;
interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
}
declare const CommandShortcut: {
    ({ className, ...props }: CommandShortcutProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
