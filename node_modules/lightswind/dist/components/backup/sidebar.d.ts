import * as React from "react";
interface SidebarContextType {
    expanded: boolean;
    onChange: (expanded: boolean) => void;
    activeMenuItem: string | null;
    setActiveMenuItem: (id: string | null) => void;
    menuItemPosition: React.MutableRefObject<{
        left: number;
        width: number;
        top: number;
        height: number;
    }>;
    menuItemRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
    menuRef: React.RefObject<HTMLDivElement>;
}
interface SidebarProviderProps {
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children: React.ReactNode;
}
export declare function SidebarProvider({ defaultExpanded, expanded: controlledExpanded, onExpandedChange, children, }: SidebarProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useSidebar(): SidebarContextType;
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function Sidebar({ className, children, ...props }: SidebarProps): import("react/jsx-runtime").JSX.Element;
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
export declare function SidebarTrigger({ className, ...props }: SidebarTriggerProps): import("react/jsx-runtime").JSX.Element;
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarHeader({ className, children, ...props }: SidebarHeaderProps): import("react/jsx-runtime").JSX.Element;
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarContent({ className, children, ...props }: SidebarContentProps): import("react/jsx-runtime").JSX.Element;
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarGroup({ className, children, ...props }: SidebarGroupProps): import("react/jsx-runtime").JSX.Element;
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarGroupLabel({ className, children, ...props }: SidebarGroupLabelProps): import("react/jsx-runtime").JSX.Element | null;
interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarGroupContent({ className, children, ...props }: SidebarGroupContentProps): import("react/jsx-runtime").JSX.Element;
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarFooter({ className, children, ...props }: SidebarFooterProps): import("react/jsx-runtime").JSX.Element;
interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare function SidebarMenu({ className, children, ...props }: SidebarMenuProps): import("react/jsx-runtime").JSX.Element;
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
}
export declare function SidebarMenuItem({ className, children, value, ...props }: SidebarMenuItemProps): import("react/jsx-runtime").JSX.Element;
interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    value?: string;
}
export declare function SidebarMenuButton({ className, children, asChild, value, ...props }: SidebarMenuButtonProps): import("react/jsx-runtime").JSX.Element;
export { Sidebar as SidebarRoot, };
