import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
export const InteractiveGradient = ({ color = "#1890ff", glowColor = "#107667ed", width = "", height = "", borderRadius = "1rem", className = "", children, followMouse = true, hoverOnly = false, intensity = 100, backgroundColor, }) => {
    const cardRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [resolvedBgColor, setResolvedBgColor] = useState("#ffffff");
    // Detect dark mode for fallback
    useEffect(() => {
        if (!backgroundColor) {
            const html = document.documentElement;
            const updateColor = () => {
                const isDark = html.classList.contains("dark");
                setResolvedBgColor(isDark ? "#fff" : "#ffffff");
            };
            updateColor(); // Initial
            const observer = new MutationObserver(updateColor);
            observer.observe(html, { attributes: true, attributeFilter: ["class"] });
            return () => observer.disconnect();
        }
        else {
            setResolvedBgColor(backgroundColor);
        }
    }, [backgroundColor]);
    const normalizedIntensity = Math.max(0, Math.min(100, intensity)) / 100;
    useEffect(() => {
        if (!followMouse)
            return;
        const handleMouseMove = (e) => {
            if (!cardRef.current || (hoverOnly && !isHovering))
                return;
            const rect = cardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPosition({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [followMouse, hoverOnly, isHovering]);
    const getBackgroundStyle = () => {
        if (!followMouse || (hoverOnly && !isHovering)) {
            return {
                background: `radial-gradient(circle at center, ${glowColor} 0%, ${resolvedBgColor} ${45 * normalizedIntensity}%, ${resolvedBgColor} 100%)`,
            };
        }
        return {
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${glowColor} 0%, ${resolvedBgColor} ${45 * normalizedIntensity}%, ${resolvedBgColor} 100%)`,
        };
    };
    const getBorderStyle = () => {
        return {
            "--gradient-border": `linear-gradient(45deg, ${resolvedBgColor}, ${resolvedBgColor}, ${color})`,
        };
    };
    return (_jsxs("div", { ref: cardRef, className: cn(`relative grid place-content-center place-items-center text-center 
        shadow-[1px_12px_25px_rgba(0,_0,_0,_0.78)] transition-all duration-300 
        interactive-gradient-card bg-white dark:bg-black`, className), style: {
            ...getBackgroundStyle(),
            ...getBorderStyle(),
            width,
            height,
            borderRadius,
        }, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), children: [_jsx("style", { children: `
          .interactive-gradient-card::before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: ${borderRadius};
            z-index: -1;
            border: 0.155rem solid transparent;
            background: var(--gradient-border) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
          }
        ` }), children] }));
};
export default InteractiveGradient;
