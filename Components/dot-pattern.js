import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { cn } from "../lib/utils";
export function DotPattern({ width = 16, height = 16, x = 0, y = 0, cx = 1, cy = 1, cr = 1, className, ...props }) {
    const id = useId();
    return (_jsxs("svg", { "aria-hidden": "true", className: cn("pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80 blur-[1px] animate-dotPatternMotion", className), ...props, children: [_jsx("defs", { children: _jsx("pattern", { id: id, width: width, height: height, patternUnits: "userSpaceOnUse", patternTransform: "translate(0,0)", children: _jsx("circle", { cx: cx, cy: cy, r: cr }) }) }), _jsx("rect", { width: "100%", height: "100%", strokeWidth: 0, fill: `url(#${id})` })] }));
}
export default DotPattern;
