import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
export function AuroraTextEffect({ text, className, textClassName, fontSize = "clamp(3rem, 8vw, 7rem)", colors = {
    first: "bg-cyan-400",
    second: "bg-yellow-400",
    third: "bg-green-400",
    fourth: "bg-purple-500",
}, blurAmount = "blur-lg", animationSpeed = {
    border: 6,
    first: 5,
    second: 5,
    third: 3,
    fourth: 13,
}, }) {
    return (_jsx("div", { className: cn("bg-black flex items-center justify-center overflow-hidden text-white", className), children: _jsx("div", { className: "text-center", children: _jsxs("h1", { className: cn("font-extrabold tracking-tight relative overflow-hidden", textClassName), style: { fontSize }, children: [text, _jsxs("div", { className: "absolute inset-0 z-10 mix-blend-darken pointer-events-none", children: [_jsx("div", { className: cn("absolute w-[60vw] h-[60vw] rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter mix-blend-overlay", colors.first || "bg-cyan-400", blurAmount), style: {
                                    animationName: "aurora-border, aurora-1",
                                    animationDuration: `${animationSpeed.border}s, ${animationSpeed.first}s`,
                                    animationTimingFunction: "ease-in-out, ease-in-out",
                                    animationIterationCount: "infinite, infinite",
                                    animationDirection: "normal, alternate",
                                } }), _jsx("div", { className: cn("absolute w-[60vw] h-[60vw] rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter mix-blend-overlay", colors.second, blurAmount), style: {
                                    animationName: "aurora-border, aurora-2",
                                    animationDuration: `${animationSpeed.border}s, ${animationSpeed.second}s`,
                                    animationTimingFunction: "ease-in-out, ease-in-out",
                                    animationIterationCount: "infinite, infinite",
                                    animationDirection: "normal, alternate",
                                } }), _jsx("div", { className: cn("absolute w-[60vw] h-[60vw] rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter mix-blend-overlay", colors.third, blurAmount), style: {
                                    animationName: "aurora-border, aurora-3",
                                    animationDuration: `${animationSpeed.border}s, ${animationSpeed.third}s`,
                                    animationTimingFunction: "ease-in-out, ease-in-out",
                                    animationIterationCount: "infinite, infinite",
                                    animationDirection: "normal, alternate",
                                } }), _jsx("div", { className: cn("absolute w-[60vw] h-[60vw] rounded-[37%_29%_27%_27%/28%_25%_41%_37%] filter mix-blend-overlay", colors.fourth, blurAmount), style: {
                                    animationName: "aurora-border, aurora-4",
                                    animationDuration: `${animationSpeed.border}s, ${animationSpeed.fourth}s`,
                                    animationTimingFunction: "ease-in-out, ease-in-out",
                                    animationIterationCount: "infinite, infinite",
                                    animationDirection: "normal, alternate",
                                } })] })] }) }) }));
}
