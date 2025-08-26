"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../lib/utils";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import HTMLMotionProps
export function VideoText({ src, children, className = "", autoPlay = true, muted = true, loop = true, preload = "auto", fontSize = 20, fontWeight = "bold", textAnchor = "middle", dominantBaseline = "middle", fontFamily = "sans-serif", as: Component = "div", ...motionProps // Collect all other props as motionProps
 }) {
    const [svgMask, setSvgMask] = useState("");
    const content = React.Children.toArray(children).join("");
    useEffect(() => {
        const responsiveFontSize = typeof fontSize === "number" ? `${fontSize}vw` : fontSize;
        const newSvgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
      <text x='50%' y='50%'
            font-size='${responsiveFontSize}'
            font-weight='${fontWeight}'
            text-anchor='${textAnchor}'
            dominant-baseline='${dominantBaseline}'
            font-family='${fontFamily}'
            fill='black'>${content}</text>
    </svg>`;
        setSvgMask(newSvgMask);
    }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily]);
    // Create a Motion component from the provided 'as' prop
    // If 'Component' is not a valid key of 'motion', it will default to 'motion.div'
    const MotionComponent = motion[Component] || motion.div;
    if (!svgMask) {
        return (_jsx(MotionComponent, { className: cn("relative size-full", className), ...motionProps, children: _jsx("span", { className: "sr-only", children: content }) }));
    }
    const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;
    return (_jsxs(MotionComponent, { className: cn("relative overflow-hidden", className), ...motionProps, children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center", style: {
                    maskImage: dataUrlMask,
                    WebkitMaskImage: dataUrlMask,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    opacity: 1,
                }, children: _jsxs("video", { className: "w-full h-full object-cover", autoPlay: autoPlay, muted: muted, loop: loop, preload: preload, playsInline: true, children: [_jsx("source", { src: src, type: "video/mp4" }), "Your browser does not support the video tag."] }) }), _jsx("span", { className: "sr-only", children: content })] }));
}
