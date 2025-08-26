"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
export const GridBackground = ({ className, children, gridSize = 20, gridColor = "#e4e4e7", darkGridColor = "#262626", showFade = true, fadeIntensity = 20, ...props }) => {
    const [currentGridColor, setCurrentGridColor] = useState(gridColor);
    useEffect(() => {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkModeActive = document.documentElement.classList.contains('dark') || prefersDarkMode;
        setCurrentGridColor(isDarkModeActive ? darkGridColor : gridColor);
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    const updatedIsDarkModeActive = document.documentElement.classList.contains('dark');
                    setCurrentGridColor(updatedIsDarkModeActive ? darkGridColor : gridColor);
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return function () {
            return observer.disconnect();
        };
    }, [gridColor, darkGridColor]);
    return (_jsxs("div", { className: cn("absolute flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black", className), ...props, children: [_jsx("div", { className: "absolute inset-0", style: {
                    backgroundSize: gridSize + "px " + gridSize + "px", // String concatenation
                    backgroundImage: "linear-gradient(to right, " + currentGridColor + " 1px, transparent 1px), " +
                        "linear-gradient(to bottom, " + currentGridColor + " 1px, transparent 1px)", // String concatenation
                } }), showFade && (_jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black", style: {
                    maskImage: "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)", // String concatenation
                    WebkitMaskImage: "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)", // String concatenation
                } })), _jsx("div", { className: "relative z-20", children: children })] }));
};
export const DotBackground = ({ className, children, dotSize = 1, dotColor = "#000", darkDotColor = "#fff", spacing = 20, showFade = true, fadeIntensity = 20, ...props }) => {
    const [currentDotColor, setCurrentDotColor] = useState(dotColor);
    useEffect(() => {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkModeActive = document.documentElement.classList.contains('dark') || prefersDarkMode;
        setCurrentDotColor(isDarkModeActive ? darkDotColor : dotColor);
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    const updatedIsDarkModeActive = document.documentElement.classList.contains('dark');
                    setCurrentDotColor(updatedIsDarkModeActive ? darkDotColor : dotColor);
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return function () {
            return observer.disconnect();
        };
    }, [dotColor, darkDotColor]);
    return (_jsxs("div", { className: cn("absolute flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black", className), ...props, children: [_jsx("div", { className: "absolute inset-0", style: {
                    backgroundSize: spacing + "px " + spacing + "px", // String concatenation
                    backgroundImage: "radial-gradient(" + currentDotColor + " " + dotSize + "px, transparent " + dotSize + "px)", // String concatenation
                } }), showFade && (_jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black", style: {
                    maskImage: "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)", // String concatenation
                    WebkitMaskImage: "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)", // String concatenation
                } })), _jsx("div", { className: "relative z-20", children: children })] }));
};
export default { GridBackground, DotBackground };
