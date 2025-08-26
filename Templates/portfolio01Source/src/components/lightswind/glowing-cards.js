"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
export const GlowingCard = ({ children, className, glowColor = "#3b82f6", hoverEffect = true, ...props }) => {
    return (_jsx("div", { className: cn("relative flex-1 min-w-[14rem] p-6 rounded-2xl text-black dark:text-white", "bg-background border ", "transition-all duration-400 ease-out", className), style: {
            '--glow-color': glowColor, // CSS variable definition
        }, ...props, children: children }));
};
export const GlowingCards = ({ children, className, enableGlow = true, glowRadius = 25, glowOpacity = 1, animationDuration = 400, enableHover = true, gap = "2.5rem", maxWidth = "75rem", padding = "3rem 1.5rem", backgroundColor, borderRadius = "1rem", responsive = true, customTheme, }) => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showOverlay, setShowOverlay] = useState(false);
    useEffect(() => {
        const container = containerRef.current;
        const overlay = overlayRef.current;
        if (!container || !overlay || !enableGlow)
            return;
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePosition({ x, y });
            setShowOverlay(true);
            // Using string concatenation for style properties
            overlay.style.setProperty('--x', x + 'px');
            overlay.style.setProperty('--y', y + 'px');
            overlay.style.setProperty('--opacity', glowOpacity.toString());
        };
        const handleMouseLeave = () => {
            setShowOverlay(false);
            overlay.style.setProperty('--opacity', '0');
        };
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enableGlow, glowOpacity]);
    const containerStyle = {
        '--gap': gap,
        '--max-width': maxWidth,
        '--padding': padding,
        '--border-radius': borderRadius,
        '--animation-duration': animationDuration + 'ms', // Concatenation
        '--glow-radius': glowRadius + 'rem', // Concatenation
        '--glow-opacity': glowOpacity,
        backgroundColor: backgroundColor || undefined,
        ...customTheme,
    };
    return (_jsx("div", { className: cn("relative w-full", className), style: containerStyle, children: _jsxs("div", { ref: containerRef, className: cn("relative max-w-[var(--max-width)] mx-auto ", "px-6 py-2"), style: { padding: "var(--padding)" }, children: [_jsx("div", { className: cn("flex items-center justify-center flex-wrap gap-[var(--gap)]", responsive && "flex-col sm:flex-row "), children: children }), enableGlow && (_jsx("div", { ref: overlayRef, className: cn("absolute inset-0 pointer-events-none select-none", "opacity-0 transition-all duration-[var(--animation-duration)] ease-out"), style: {
                        // String concatenation for WebkitMask and mask
                        WebkitMask: "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
                        mask: "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
                        opacity: showOverlay ? 'var(--opacity)' : '0',
                    }, children: _jsx("div", { className: cn("flex items-center justify-center flex-wrap gap-[var(--gap)] max-w-[var(--max-width)] center mx-auto", responsive && "flex-col sm:flex-row"), style: { padding: "var(--padding)" }, children: React.Children.map(children, (child, index) => {
                            if (React.isValidElement(child) && child.type === GlowingCard) {
                                const cardGlowColor = child.props.glowColor || "#3b82f6";
                                return React.cloneElement(child, {
                                    className: cn(child.props.className, "bg-opacity-15 dark:bg-opacity-15", "border-opacity-100 dark:border-opacity-100"),
                                    style: {
                                        ...child.props.style,
                                        // String concatenation for background, border, and boxShadow
                                        backgroundColor: cardGlowColor + "15",
                                        borderColor: cardGlowColor,
                                        boxShadow: "0 0 0 1px inset " + cardGlowColor,
                                    },
                                });
                            }
                            return child;
                        }) }) }))] }) }));
};
export { GlowingCards as default };
