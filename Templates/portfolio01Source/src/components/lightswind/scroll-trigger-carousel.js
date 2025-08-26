import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useTransform, useScroll } from "framer-motion";
import React, { useRef } from "react";
const HorizontalCarousel = ({ items, itemWidth = "90vw", itemHeight = "450px", gap = "1rem", scrollLength = "150vh", initialXOffset = "80%", // Start far off-screen
finalXOffset = "-95%", // End fully off-screen left
children, afterCarouselContent, }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });
    // Delay entrance even more (start at 20% scroll progress)
    const x = useTransform(scrollYProgress, [0.2, 1], [initialXOffset, finalXOffset]);
    return (_jsxs("section", { ref: targetRef, className: "relative bg-background", style: { height: scrollLength }, children: [children && (_jsx("div", { className: "flex h-48 items-center justify-center", children: children })), _jsx("div", { className: "sticky top-0 flex h-screen items-center overflow-hidden", children: _jsx(motion.div, { style: { x, gap }, className: "flex", children: items.map((item) => (_jsx(React.Fragment, { children: _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("div", { className: "group relative overflow-hidden bg-background \r\n        flex items-center justify-center", style: { width: itemWidth, height: itemHeight }, children: item.content }), _jsx("h2", { className: "my-4 text-3xl font-bold", children: String(item.contentid)
                                        .replace(/-/g, " ")
                                        .replace(/\b\w/g, (l) => l.toUpperCase()) })] }) }, item.id))) }) }), afterCarouselContent && (_jsx("div", { className: "flex h-48 items-center justify-center", children: afterCarouselContent }))] }));
};
export default HorizontalCarousel;
