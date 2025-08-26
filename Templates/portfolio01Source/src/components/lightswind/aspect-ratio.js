import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const AspectRatio = React.forwardRef(({ className, ratio: propRatio, preset, rounded = false, bordered = false, objectFit, style, ...props }, ref) => {
    // Predefined aspect ratios
    const presetRatios = {
        square: 1, // 1:1
        video: 16 / 9, // 16:9
        portrait: 3 / 4, // 3:4
        widescreen: 16 / 9, // 16:9
        ultrawide: 21 / 9, // 21:9
        golden: 1.618 // Golden ratio
    };
    // Determine the final ratio to use
    const ratio = propRatio || (preset ? presetRatios[preset] : 1);
    return (_jsx("div", { ref: ref, style: {
            position: "relative",
            width: "100%",
            paddingBottom: `${(1 / ratio) * 100}%`,
            ...style,
        }, className: cn("overflow-hidden", rounded && "rounded-md", bordered && "border  ", className), ...props, children: props.children && (_jsx("div", { className: cn("absolute inset-0 h-full w-full", objectFit && `[&>img]:object-${objectFit} [&>video]:object-${objectFit}`), children: props.children })) }));
});
AspectRatio.displayName = "AspectRatio";
export { AspectRatio };
