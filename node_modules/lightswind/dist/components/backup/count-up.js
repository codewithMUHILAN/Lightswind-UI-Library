import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "../lib/utils";
// Helper function to format the number
const formatValue = (val, precision, sep) => {
    return val
        .toFixed(precision)
        .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};
const easingFunctions = {
    linear: [0, 0, 1, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
};
const animationStyles = {
    default: { type: "tween" },
    bounce: { type: "spring", bounce: 0.25 },
    spring: { type: "spring", stiffness: 100, damping: 10 },
    gentle: { type: "spring", stiffness: 60, damping: 15 },
    energetic: { type: "spring", stiffness: 300, damping: 20 },
};
const colorSchemes = {
    default: "text-foreground",
    gradient: "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600",
    primary: "text-primary",
    secondary: "text-secondary",
    custom: "", // use customColor
};
export function CountUp({ value, duration = 2, decimals = 0, prefix = "", suffix = "", easing = "easeOut", separator = ",", interactive = false, triggerOnView = true, className, numberClassName, animationStyle = "default", colorScheme = "default", customColor, onAnimationComplete, }) {
    const [hasAnimated, setHasAnimated] = useState(false); // Keep for initial view trigger if needed
    const containerRef = useRef(null);
    const count = useMotionValue(0); // This will hold the animated number
    const rounded = useTransform(count, (latest) => formatValue(latest, decimals, separator));
    const animationConfig = {
        ...animationStyles[animationStyle],
        ease: easingFunctions[easing],
        duration: animationStyle === "default" ? duration : undefined,
    };
    // This effect will run whenever `value` changes
    useEffect(() => {
        // If not triggering on view, just animate immediately
        if (!triggerOnView) {
            // Animate from the current `count.get()` value to the new `value`
            animate(count.get(), value, {
                ...animationConfig,
                onUpdate: (latest) => count.set(latest),
                onComplete: () => {
                    setHasAnimated(true); // Mark as animated after completion (useful for initial load)
                    if (onAnimationComplete)
                        onAnimationComplete();
                },
            });
            return;
        }
        // If triggering on view, use IntersectionObserver
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated) { // Only animate once when it enters view
                animate(count.get(), value, {
                    ...animationConfig,
                    onUpdate: (latest) => count.set(latest),
                    onComplete: () => {
                        setHasAnimated(true);
                        if (onAnimationComplete)
                            onAnimationComplete();
                    },
                });
            }
            else if (!entry.isIntersecting && hasAnimated) {
                // Optional: Reset hasAnimated if it goes out of view and you want it to re-animate on re-entry
                // setHasAnimated(false);
                // Optional: Animate back to 0 or initial state when out of view
                // animate(count.get(), 0, { ...animationConfig, onUpdate: (latest) => count.set(latest) });
            }
        }, { threshold: 0.1 });
        if (containerRef.current)
            observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [value, triggerOnView, hasAnimated]); // Add `value` to dependencies so it re-runs when `value` changes
    // Additionally, to ensure animation on prop change *after* initial view,
    // we can have a separate effect for value changes when `triggerOnView` is false
    // OR when `triggerOnView` is true but `hasAnimated` is already true (meaning it's a subsequent update)
    useEffect(() => {
        if (hasAnimated || !triggerOnView) { // If already animated (and subsequent value change) OR not triggering on view
            animate(count.get(), value, {
                ...animationConfig,
                onUpdate: (latest) => count.set(latest),
                onComplete: onAnimationComplete,
            });
        }
    }, [value, animationConfig, hasAnimated, triggerOnView, onAnimationComplete]);
    const colorClass = colorScheme === "custom" && customColor
        ? ""
        : colorSchemes[colorScheme];
    const getHoverAnimation = () => {
        if (!interactive)
            return {};
        return {
            whileHover: {
                scale: 1.05,
                filter: "brightness(1.1)",
                transition: { duration: 0.2 },
            },
            whileTap: {
                scale: 0.95,
                filter: "brightness(0.95)",
                transition: { duration: 0.1 },
            },
        };
    };
    return (_jsx("div", { ref: containerRef, className: cn("inline-flex items-center justify-center text-4xl font-bold text-black dark:textwhite", className), children: _jsxs(motion.div, { ...getHoverAnimation(), className: cn("flex items-center transition-all", colorClass, numberClassName), style: colorScheme === "custom" && customColor ? { color: customColor } : undefined, children: [prefix && _jsx("span", { className: "mr-1 text-foreground", children: prefix }), _jsx(motion.span, { className: " text-foreground", children: rounded }), suffix && _jsx("span", { className: "ml-1  text-foreground", children: suffix })] }) }));
}
