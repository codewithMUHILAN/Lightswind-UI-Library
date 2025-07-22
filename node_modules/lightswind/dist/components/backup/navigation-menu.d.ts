import * as React from "react";
interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const NavigationMenu: React.ForwardRefExoticComponent<NavigationMenuProps & React.RefAttributes<HTMLDivElement>>;
interface NavigationMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
}
declare const NavigationMenuList: React.ForwardRefExoticComponent<NavigationMenuListProps & React.RefAttributes<HTMLUListElement>>;
interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
    value?: string;
}
declare const NavigationMenuItem: React.ForwardRefExoticComponent<NavigationMenuItemProps & React.RefAttributes<HTMLLIElement>>;
declare const navigationMenuTriggerStyle: () => string;
interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    id?: string;
}
declare const NavigationMenuTrigger: React.ForwardRefExoticComponent<NavigationMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    id?: string;
    forceMount?: boolean;
}
declare const NavigationMenuContent: React.ForwardRefExoticComponent<NavigationMenuContentProps & React.RefAttributes<HTMLDivElement>>;
interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
}
declare const NavigationMenuLink: React.ForwardRefExoticComponent<NavigationMenuLinkProps & React.RefAttributes<HTMLAnchorElement>>;
interface NavigationMenuViewportProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const NavigationMenuViewport: React.ForwardRefExoticComponent<NavigationMenuViewportProps & React.RefAttributes<HTMLDivElement>>;
interface NavigationMenuIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const NavigationMenuIndicator: React.ForwardRefExoticComponent<NavigationMenuIndicatorProps & React.RefAttributes<HTMLDivElement>>;
export { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, };
