import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useToast } from "../hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, } from "./toast";
import { X } from "lucide-react";
export function Toaster() {
    const { toasts } = useToast();
    return (_jsxs(ToastProvider, { children: [_jsx("div", { className: "fixed md:top-4 right-0 md:right-4 z-[100] flex flex-col gap-2 w-auto max-w-sm", children: toasts.map(({ id, title, description, action, type, variant, duration, ...props }) => {
                    // Map toast type to variant if variant is not provided
                    const toastVariant = variant || (type === "success" ? "success" :
                        type === "warning" ? "warning" :
                            type === "info" ? "info" :
                                type === "destructive" ? "destructive" :
                                    "default");
                    return (_jsxs(Toast, { ...props, variant: toastVariant, duration: duration, children: [_jsxs("div", { className: "grid gap-1", children: [title && _jsx(ToastTitle, { children: title }), description && _jsx(ToastDescription, { children: description })] }), action, _jsx(ToastClose, { children: _jsx(X, { className: "h-4 w-4" }) })] }, id));
                }) }), _jsx(ToastViewport, {})] }));
}
