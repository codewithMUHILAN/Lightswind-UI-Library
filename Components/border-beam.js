"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
export const BorderBeam = ({ className, size = 50, delay = 0, duration = 6, colorFrom = "#7400ff", colorTo = "#9b41ff", transition, style, reverse = false, initialOffset = 0, borderThickness = 1, opacity = 1, glowIntensity = 0, beamBorderRadius, pauseOnHover = false, speedMultiplier = 1, }) => {
    // Calculate actual duration based on speed multiplier
    const actualDuration = speedMultiplier ? duration / speedMultiplier : duration;
    // Generate box shadow for glow effect
    const glowEffect = glowIntensity > 0
        ? `0 0 ${glowIntensity * 5}px ${glowIntensity * 2}px var(--color-from)`
        : undefined;
    return (_jsx("div", { className: cn("pointer-events-none absolute inset-0 rounded-[inherit]", "border border-transparent", "[mask-clip:padding-box,border-box]", "[mask-composite:intersect]", "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"), style: {
            borderWidth: `${borderThickness}px`,
        }, children: _jsx(motion.div, { className: cn("absolute aspect-square", "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent", pauseOnHover && "group-hover:animation-play-state-paused", className), style: {
                width: size,
                offsetPath: `rect(0 auto auto 0 round ${beamBorderRadius ?? size}px)`,
                "--color-from": colorFrom,
                "--color-to": colorTo,
                opacity: opacity,
                boxShadow: glowEffect,
                borderRadius: beamBorderRadius ? `${beamBorderRadius}px` : undefined,
                ...style,
            }, initial: { offsetDistance: `${initialOffset}%` }, animate: {
                offsetDistance: reverse
                    ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
                    : [`${initialOffset}%`, `${100 + initialOffset}%`],
            }, transition: {
                repeat: Infinity,
                ease: "linear",
                duration: actualDuration,
                delay: -delay,
                ...transition,
            } }) }));
};
