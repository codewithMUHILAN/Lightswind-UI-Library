import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Simple utility to conditionally join class names (similar to 'clsx' or 'classnames')
// This replaces the external import from "../lib/utils"
function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}
export const GridBackground = ({ className, children, gridSize = 20, gridColor = "#e4e4e7", darkGridColor = "#262626", showFade = true, fadeIntensity = 20, ...props }) => {
    return (_jsxs("div", { className: cn(`relative flex h-[50rem] w-full items-center justify-center 
        bg-white dark:bg-black`, className), ...props, children: [_jsx("div", { className: "absolute inset-0", style: {
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                    backgroundImage: `linear-gradient(to right, ${gridColor} 
          1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 
          1px, transparent 1px)`,
                } }), _jsx("style", { children: `
        .dark div[style*="background-image"] {
          background-image: linear-gradient(to right, ${darkGridColor} 1px, transparent 1px), linear-gradient(to bottom, ${darkGridColor} 1px, transparent 1px) !important;
        }
      ` }), showFade && (_jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black", style: {
                    maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
                    WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
                } })), _jsx("div", { className: "relative z-20", children: children })] }));
};
export const DotBackground = ({ className, children, dotSize = 1, dotColor = "#d4d4d4", darkDotColor = "#404040", spacing = 20, showFade = true, fadeIntensity = 20, ...props }) => {
    return (_jsxs("div", { className: cn("relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black", className), ...props, children: [_jsx("div", { className: "absolute inset-0", style: {
                    backgroundSize: `${spacing}px ${spacing}px`,
                    backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
                } }), _jsx("style", { children: `
        .dark div[style*="background-image"] {
          background-image: radial-gradient(${darkDotColor} ${dotSize}px, transparent ${dotSize}px) !important;
        }
      ` }), showFade && (_jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black", style: {
                    maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
                    WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
                } })), _jsx("div", { className: "relative z-20", children: children })] }));
};
export default { GridBackground, DotBackground };
