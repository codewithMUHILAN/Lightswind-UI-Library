"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
export const AuroraBackground = ({ className, children, showRadialGradient = true, ...props }) => {
    return (_jsx("main", { children: _jsxs("div", { 
            // Using cn for concatenation of classes. The static part is a single string.
            className: cn("transition-bg relative flex mx-auto h-[100vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900", className), ...props, children: [_jsx("div", { className: "absolute inset-0 overflow-hidden", style: {
                        // String concatenation for CSS variable values
                        "--aurora": "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
                        "--dark-gradient": "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
                        "--white-gradient": "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
                        "--blue-300": "#7dd3fc", // Soft Sky Blue
                        "--blue-400": "#38bdf8", // Mild Blue
                        "--blue-500": "#0ea5e9", // Calm Professional Blue
                        "--indigo-300": "#c4b5fd", // Soft Lavender Indigo
                        "--violet-200": "#e9d5ff", // Gentle Violet
                        "--green-300": "#6ee7b7", // Soft Mint Green
                        "--pink-300": "#f9a8d4", // Mild Pink
                        "--gray-300": "#d1d5db", // Soft Gray for Text
                        "--black": "#000000", // Background
                        "--white": "#ffffff", // Text or Highlights
                        "--transparent": "transparent",
                    }, children: _jsx("div", { className: cn(
                        // The main complex string for className, now as a single literal
                        "after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[\"\"] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]", 
                        // Conditional class applied using ternary for string or empty string
                        showRadialGradient
                            ? "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]"
                            : "") }) }), children] }) }));
};
