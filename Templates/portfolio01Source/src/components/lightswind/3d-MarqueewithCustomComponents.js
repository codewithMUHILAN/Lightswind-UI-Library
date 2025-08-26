"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from "framer-motion";
// Horizontal Grid Line component for visual effect
const HorizontalGridLine = ({ extraStyles = "", spacing = "20px", }) => {
    // Inline styles for the grid line appearance
    const lineStyles = {
        "--background": "#ffffff",
        "--color": "rgba(0, 0, 0, 0.2)",
        "--height": "1px",
        "--width": "5px",
        "--fade-stop": "90%",
        "--offset": spacing,
        "--color-dark": "rgba(255, 255, 255, 0.2)",
        maskComposite: "exclude",
    };
    // Tailwind CSS classes for positioning and appearance
    const baseClasses = [
        "absolute",
        "left-[calc(var(--offset)/-2)]",
        "h-[var(--height)]",
        "w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-black",
        extraStyles,
    ].join(" ");
    return _jsx("div", { style: lineStyles, className: baseClasses });
};
// Vertical Grid Line component for visual effect
const VerticalGridLine = ({ extraStyles = "", spacing = "150px", }) => {
    // Inline styles for the grid line appearance
    const lineStyles = {
        "--background": "#ffffff",
        "--color": "rgba(0, 0, 0, 0.2)",
        "--height": "5px",
        "--width": "1px",
        "--fade-stop": "90%",
        "--offset": spacing,
        "--color-dark": "rgba(0, 0, 0, 0.2)",
        maskComposite: "exclude",
    };
    // Tailwind CSS classes for positioning and appearance
    const baseClasses = [
        "absolute",
        "top-[calc(var(--offset)/-2)]",
        "h-[calc(100%+var(--offset))]",
        "w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-black",
        extraStyles,
    ].join(" ");
    return _jsx("div", { style: lineStyles, className: `${baseClasses} border border-dotted` });
};
// Main ThreeDCompMarquee component
export const ThreeDCompMarquee = ({ compItems, className = "", onCompItemClick, }) => {
    // Divide items into 4 groups for the columns
    const groupSize = Math.ceil(compItems.length / 4);
    const itemGroups = Array.from({ length: 4 }, (_, index) => compItems.slice(index * groupSize, (index + 1) * groupSize));
    // Handles click on an item, either via onCompItemClick prop or href
    const handleItemClick = (item, globalIndex) => {
        if (onCompItemClick) {
            onCompItemClick(item, globalIndex);
        }
        else if (item.href) {
            window.open(item.href, item.target || "_self");
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("section", { className: `mx-auto block h-[600px] overflow-hidden rounded-2xl 
        max-sm:h-[400px] 
 lg:hidden 
        bg-white dark:bg-black ${className}`, children: _jsx("div", { className: "flex w-full h-full items-center justify-center", children: _jsx("div", { className: "w-[1520px] shrink-0 scale-50 sm:scale-75 lg:scale-100", children: _jsx("div", { 
                            // Apply 3D rotation for the marquee effect
                            style: {
                                transform: "rotateX(55deg) rotateY(0deg) rotateZ(35deg)",
                                transformStyle: "preserve-3d", // Ensure child elements can have 3D transforms
                            }, className: "relative grid w-full h-full origin-center grid-cols-4 \r\n            gap-6 place-items-center", children: itemGroups.map((itemsInGroup, idx) => (_jsxs(motion.div, { 
                                // Animate columns vertically for continuous movement
                                animate: { y: idx % 2 === 0 ? 100 : -100 }, transition: {
                                    duration: idx % 2 === 0 ? 10 : 15,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }, className: "flex flex-col items-center gap-6", children: [_jsx(VerticalGridLine, { extraStyles: "-left-4", spacing: "80px" }), itemsInGroup.map((item, itemIdx) => {
                                        const globalIndex = idx * groupSize + itemIdx;
                                        const isClickable = item.href || onCompItemClick;
                                        return (_jsxs(motion.div, { 
                                            // Hover effect: slight lift and scale up
                                            whileHover: { y: -10, scale: 1.05 }, transition: { duration: 0.3, ease: "easeInOut" }, 
                                            // Styling for the individual component card
                                            className: `relative rounded-lg object-cover ring 
                        ring-gray-300/30 dark:ring-gray-800/50 shadow-xl 
                        dark:shadow-gray-900 hover:shadow-3xl 
                        dark:hover:shadow-gray-800 transition-shadow duration-300
                                  ${isClickable ? "cursor-pointer" : ""}
                                  min-w-[350px] max-w-[350px] h-[350px] sm:w-[970px] 
                                  sm:h-[350px] // Responsive fixed size for cards
                                  flex items-center justify-center overflow-hidden
                                  bg-white dark:bg-black // Background for the component card
                                  p-4 // Padding inside the card
                                  `, onClick: () => handleItemClick(item, globalIndex), style: { transformStyle: "preserve-3d" }, children: [_jsx(HorizontalGridLine, { extraStyles: "-top-4", spacing: "20px" }), _jsx("div", { className: "w-full h-full flex items-center \r\n                      justify-center", children: item.content })] }, item.id));
                                    })] }, `column-${idx}`))) }) }) }) }), _jsx("section", { className: `mx-auto block h-[600px] overflow-hidden rounded-2xl 
        max-sm:h-[400px] 
hidden lg:block border border-gray-200 dark:border-800
        bg-white dark:bg-black ${className}`, children: _jsx("div", { className: "flex w-full h-full items-center justify-center", children: _jsx("div", { className: "w-[1520px] shrink-0 scale-50 sm:scale-75 lg:scale-100", children: _jsx("div", { 
                            // Apply 3D rotation for the marquee effect
                            style: {
                                transform: "rotateX(55deg) rotateY(0deg) rotateZ(35deg)",
                                transformStyle: "preserve-3d", // Ensure child elements can have 3D transforms
                            }, className: "relative grid w-full h-full origin-center grid-cols-4 \r\n            gap-6 place-items-center", children: itemGroups.map((itemsInGroup, idx) => (_jsxs(motion.div, { 
                                // Animate columns vertically for continuous movement
                                animate: { y: idx % 2 === 0 ? 100 : -100 }, transition: {
                                    duration: idx % 2 === 0 ? 10 : 15,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }, className: "flex flex-col items-center gap-6", children: [_jsx(VerticalGridLine, { extraStyles: "-left-4", spacing: "80px" }), itemsInGroup.map((item, itemIdx) => {
                                        const globalIndex = idx * groupSize + itemIdx;
                                        const isClickable = item.href || onCompItemClick;
                                        return (_jsxs(motion.div, { 
                                            // Hover effect: slight lift and scale up
                                            whileHover: { y: -10, scale: 1.05 }, transition: { duration: 0.3, ease: "easeInOut" }, 
                                            // Styling for the individual component card
                                            className: `relative rounded-lg object-cover ring 
                        ring-gray-300/30 dark:ring-gray-800/50 shadow-xl 
                        dark:shadow-gray-900 hover:shadow-3xl 
                        dark:hover:shadow-gray-800 transition-shadow duration-300
                                  ${isClickable ? "cursor-pointer" : ""}
                                  min-w-[350px] max-w-[350px] h-[350px] sm:w-[970px] 
                                  sm:h-[350px] // Responsive fixed size for cards
                                  flex items-center justify-center overflow-hidden
                                  bg-white dark:bg-black // Background for the component card
                                  p-4 // Padding inside the card
                                  `, onClick: () => handleItemClick(item, globalIndex), style: { transformStyle: "preserve-3d" }, children: [_jsx(HorizontalGridLine, { extraStyles: "-top-4", spacing: "20px" }), _jsx("div", { className: "w-full h-full flex items-center \r\n                      justify-center", children: item.content })] }, item.id));
                                    })] }, `column-${idx}`))) }) }) }) })] }));
};
export default ThreeDCompMarquee;
