"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
/**
 * AnimatedBlobBackground component displays animated gradient blobs with
 * configurable shapes, colors, and animation properties.
 */
export const AnimatedBlobBackground = ({ className, style, blurAmount = "4vw", firstBlobColors = ["hotpink", "red", "orange", "yellow", "hotpink"], secondBlobColors = ["cyan", "blue", "green", "purple", "cyan"], blobPath = "polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)", firstBlobSpeed = 8000, secondBlobSpeed = 6000, firstBlobOpacity = 0.66, secondBlobOpacity = 0.5, firstBlobRotation = 0, secondBlobRotation = 180, isAnimating = true, interactive = false, zIndex = -1, blobCount = 2, children, interactiveIntensity = 5, }) => {
    // Create gradient string from blob colors
    const createGradient = (colors) => {
        return `linear-gradient(${colors.join(", ")})`;
    };
    // Calculate the max movement for interactive mode
    const maxMovement = interactiveIntensity * 10;
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    // Handle mouse movement for interactive mode
    React.useEffect(() => {
        if (!interactive)
            return;
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            // Calculate normalized position (-1 to 1)
            const normalizedX = (clientX / innerWidth) * 2 - 1;
            const normalizedY = (clientY / innerHeight) * 2 - 1;
            setMousePosition({ x: normalizedX, y: normalizedY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [interactive]);
    return (_jsxs("div", { className: cn("absolute inset-0 grid overflow-hidden", className), style: {
            filter: `blur(${blurAmount})`,
            zIndex,
            ...style,
        }, children: [_jsx(motion.div, { className: "shape absolute inset-0 mx-auto", style: {
                    clipPath: blobPath,
                    background: createGradient(firstBlobColors),
                    opacity: firstBlobOpacity,
                    transform: `rotate(${firstBlobRotation}deg)`,
                }, animate: isAnimating
                    ? { rotate: 360 + firstBlobRotation }
                    : { rotate: firstBlobRotation }, transition: {
                    duration: firstBlobSpeed / 1000,
                    ease: "linear",
                    repeat: Infinity,
                }, ...(interactive && {
                    animate: {
                        x: mousePosition.x * maxMovement,
                        y: mousePosition.y * maxMovement,
                        rotate: isAnimating ? 360 + firstBlobRotation : firstBlobRotation,
                    },
                    transition: {
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        rotate: {
                            duration: firstBlobSpeed / 1000,
                            ease: "linear",
                            repeat: Infinity,
                        },
                    }
                }) }), blobCount === 2 && (_jsx(motion.div, { className: "shape absolute inset-0 mx-auto", style: {
                    clipPath: blobPath,
                    background: createGradient(secondBlobColors),
                    opacity: secondBlobOpacity,
                    transform: `rotate(${secondBlobRotation}deg)`,
                }, animate: isAnimating
                    ? { rotate: 360 + secondBlobRotation }
                    : { rotate: secondBlobRotation }, transition: {
                    duration: secondBlobSpeed / 1000,
                    ease: "linear",
                    repeat: Infinity,
                }, ...(interactive && {
                    animate: {
                        x: -mousePosition.x * maxMovement * 0.7,
                        y: -mousePosition.y * maxMovement * 0.7,
                        rotate: isAnimating ? 360 + secondBlobRotation : secondBlobRotation,
                    },
                    transition: {
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        rotate: {
                            duration: secondBlobSpeed / 1000,
                            ease: "linear",
                            repeat: Infinity,
                        },
                    }
                }) })), children] }));
};
