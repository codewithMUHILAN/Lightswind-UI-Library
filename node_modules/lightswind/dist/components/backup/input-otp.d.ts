import * as React from "react";
declare const InputOTP: React.ForwardRefExoticComponent<(Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "textAlign" | "value" | "maxLength" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "containerClassName" | "noScriptCSSFallback"> & {
    value?: string;
    onChange?: (newValue: string) => unknown;
    maxLength: number;
    textAlign?: "left" | "center" | "right";
    onComplete?: (...args: any[]) => unknown;
    pushPasswordManagerStrategy?: "increase-width" | "none";
    pasteTransformer?: (pasted: string) => string;
    containerClassName?: string;
    noScriptCSSFallback?: string | null;
} & {
    render: (props: import("input-otp").RenderProps) => React.ReactNode;
    children?: never;
} & React.RefAttributes<HTMLInputElement>, "ref"> | Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "textAlign" | "value" | "maxLength" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "containerClassName" | "noScriptCSSFallback"> & {
    value?: string;
    onChange?: (newValue: string) => unknown;
    maxLength: number;
    textAlign?: "left" | "center" | "right";
    onComplete?: (...args: any[]) => unknown;
    pushPasswordManagerStrategy?: "increase-width" | "none";
    pasteTransformer?: (pasted: string) => string;
    containerClassName?: string;
    noScriptCSSFallback?: string | null;
} & {
    render?: never;
    children: React.ReactNode;
} & React.RefAttributes<HTMLInputElement>, "ref">) & React.RefAttributes<HTMLInputElement>>;
declare const InputOTPGroup: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const InputOTPSlot: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    index: number;
} & React.RefAttributes<HTMLDivElement>>;
declare const InputOTPSeparator: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
