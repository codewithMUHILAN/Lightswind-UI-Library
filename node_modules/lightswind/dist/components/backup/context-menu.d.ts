import * as React from "react";
interface ContextMenuProps {
    children: React.ReactNode;
}
declare const ContextMenu: ({ children }: ContextMenuProps) => import("react/jsx-runtime").JSX.Element;
interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const ContextMenuTrigger: React.ForwardRefExoticComponent<ContextMenuTriggerProps & React.RefAttributes<HTMLDivElement>>;
interface ContextMenuPortalProps {
    children: React.ReactNode;
}
declare const ContextMenuPortal: ({ children }: ContextMenuPortalProps) => import("react/jsx-runtime").JSX.Element;
interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const ContextMenuContent: React.ForwardRefExoticComponent<ContextMenuContentProps & React.RefAttributes<HTMLDivElement>>;
interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    inset?: boolean;
}
declare const ContextMenuItem: React.ForwardRefExoticComponent<ContextMenuItemProps & React.RefAttributes<HTMLButtonElement>>;
declare const ContextMenuCheckboxItem: ({ children, checked, className, ...props }: React.HTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
declare const ContextMenuRadioItem: ({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => import("react/jsx-runtime").JSX.Element;
declare const ContextMenuLabel: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
declare const ContextMenuSeparator: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const ContextMenuShortcut: ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => import("react/jsx-runtime").JSX.Element;
declare const ContextMenuGroup: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => import("react/jsx-runtime").JSX.Element;
declare const ContextMenuSub: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
declare const ContextMenuSubTrigger: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & {
    inset?: boolean;
} & React.RefAttributes<HTMLButtonElement>>;
declare const ContextMenuSubContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const ContextMenuRadioGroup: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => import("react/jsx-runtime").JSX.Element;
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup, };
