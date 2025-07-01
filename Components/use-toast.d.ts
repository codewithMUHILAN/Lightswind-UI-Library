import * as React from "react";
export type ToastActionElement = React.ReactElement;
export type ToastType = "default" | "destructive" | "success" | "warning" | "info";
export interface ToastItem {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    type?: ToastType;
    duration?: number;
    variant?: "default" | "destructive" | "success" | "warning" | "info";
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
}
export type ToasterToast = ToastItem;
type ToastOptions = Omit<ToastItem, "id">;
declare function toast(props: ToastOptions): {
    id: string;
    dismiss: () => void;
    update: (props: ToastOptions) => string;
};
declare namespace toast {
    var _a: (props: Omit<ToastOptions, "type">) => {
        id: string;
        dismiss: () => void;
        update: (props: ToastOptions) => string;
    };
    export var destructive: (props: Omit<ToastOptions, "type">) => {
        id: string;
        dismiss: () => void;
        update: (props: ToastOptions) => string;
    };
    export var success: (props: Omit<ToastOptions, "type">) => {
        id: string;
        dismiss: () => void;
        update: (props: ToastOptions) => string;
    };
    export var warning: (props: Omit<ToastOptions, "type">) => {
        id: string;
        dismiss: () => void;
        update: (props: ToastOptions) => string;
    };
    export var info: (props: Omit<ToastOptions, "type">) => {
        id: string;
        dismiss: () => void;
        update: (props: ToastOptions) => string;
    };
    export { _a as default };
}
declare function useToast(): {
    toast: typeof toast;
    dismiss: (toastId?: string) => void;
    toasts: ToasterToast[];
};
export { useToast, toast };
