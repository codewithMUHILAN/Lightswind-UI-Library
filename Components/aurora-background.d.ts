import React, { ReactNode } from "react";
interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}
export declare const AuroraBackground: ({ className, children, showRadialGradient, ...props }: AuroraBackgroundProps) => import("react/jsx-runtime").JSX.Element;
export {};
