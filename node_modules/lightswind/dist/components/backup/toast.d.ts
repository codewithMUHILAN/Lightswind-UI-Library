import * as React from "react";
declare const ToastProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
declare const ToastViewport: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive" | "success" | "warning" | "info";
    duration?: number;
    onClose?: () => void;
}
declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLDivElement>>;
declare const ToastClose: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
declare const ToastTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>;
declare const ToastDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, };
