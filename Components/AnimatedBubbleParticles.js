"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";
const AnimatedBubbleParticles = ({ className, backgroundColor = "#edf3f8", particleColor = "#3e82f7", particleSize = 30, spawnInterval = 180, 
// Changed default width to '100vw' for full viewport width
// height and width props will override these defaults if provided
height, // Removed default here to apply min-h-screen conditionally
width, // Removed default here to apply min-w-screen conditionally
enableGooEffect = true, blurStrength = 12, pauseOnBlur = true, zIndex = 1, friction = { min: 1, max: 2 }, scaleRange = { min: 0.4, max: 2.4 }, children, }) => {
    const containerRef = useRef(null);
    const particlesRef = useRef(null);
    const animationRef = useRef();
    const intervalRef = useRef();
    const particlesArrayRef = useRef([]);
    const isPausedRef = useRef(false);
    const gooIdRef = useRef(`goo-${Math.random().toString(36).substr(2, 9)}`);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // Memoize createParticleElement using useCallback to capture particleColor
    const createParticleElement = useCallback(() => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 67.4 67.4");
        svg.style.cssText = `
      display: block;
      width: ${particleSize}px;
      height: ${particleSize}px;
      position: absolute;
      transform: translateZ(0px);
    `;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "33.7");
        circle.setAttribute("cy", "33.7");
        circle.setAttribute("r", "33.7");
        // Set fill here, it will capture the current particleColor value
        circle.setAttribute("fill", particleColor);
        svg.appendChild(circle);
        return svg;
    }, [particleSize, particleColor]);
    // Create new particle - this now uses the memoized createParticleElement
    const createParticle = useCallback(() => {
        const element = createParticleElement();
        if (particlesRef.current) {
            particlesRef.current.appendChild(element);
        }
        const x = Math.random() * dimensions.width;
        const y = dimensions.height + 100;
        const steps = dimensions.height / 2;
        const frictionValue = friction.min + Math.random() * (friction.max - friction.min);
        const scale = scaleRange.min + Math.random() * (scaleRange.max - scaleRange.min);
        const siner = (dimensions.width / 2.5) * Math.random();
        const rotationDirection = Math.random() > 0.5 ? "+" : "-";
        // Set initial position
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
        return {
            x,
            y,
            vx: 0,
            vy: 0,
            scale,
            rotation: 0,
            rotationDirection,
            siner,
            steps,
            friction: frictionValue,
            element,
        };
    }, [createParticleElement, dimensions, friction, scaleRange]);
    // Update particle position (no changes needed here as it operates on existing elements)
    const updateParticle = (particle) => {
        particle.y -= particle.friction;
        const left = particle.x +
            Math.sin((particle.y * Math.PI) / particle.steps) * particle.siner;
        const top = particle.y;
        const rotation = particle.rotationDirection + (particle.y + particleSize);
        if (particle.element) {
            // Type assertion to SVGElement because you are creating SVG elements
            const element = particle.element;
            element.style.transform = `translateX(${left}px) translateY(${top}px) scale(${particle.scale}) rotate(${rotation}deg)`;
        } // Remove particle if it's off screen
        if (particle.y < -particleSize) {
            if (particle.element && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
            return false;
        }
        return true;
    };
    // Animation loop
    const animate = useCallback(() => {
        if (isPausedRef.current) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }
        // Update all particles
        particlesArrayRef.current =
            particlesArrayRef.current.filter(updateParticle);
        animationRef.current = requestAnimationFrame(animate);
    }, []);
    // Spawn particles
    const spawnParticle = useCallback(() => {
        if (!isPausedRef.current && dimensions.width > 0 && dimensions.height > 0) {
            const particle = createParticle();
            particlesArrayRef.current.push(particle);
        }
    }, [dimensions, createParticle]);
    // Handle window resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);
    // Handle focus/blur
    useEffect(() => {
        if (!pauseOnBlur)
            return;
        const handleBlur = () => {
            isPausedRef.current = true;
        };
        const handleFocus = () => {
            isPausedRef.current = false;
        };
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, [pauseOnBlur]);
    // Start animation and particle spawning
    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0) {
            // Clear any previous animation frames and intervals before starting new ones
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Start animation loop
            animationRef.current = requestAnimationFrame(animate);
            // Start particle spawning
            intervalRef.current = window.setInterval(spawnParticle, spawnInterval);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Clean up particles
            particlesArrayRef.current.forEach((particle) => {
                if (particle.element && particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
            });
            particlesArrayRef.current = [];
        };
    }, [dimensions, spawnInterval, animate, spawnParticle]);
    return (_jsxs("div", { ref: containerRef, className: cn("relative overflow-hidden", 
        // Apply min-h-screen and min-w-screen by default,
        // unless height or width props are explicitly provided
        {
            "min-h-screen": !height,
            "min-w-screen": !width,
        }, className), style: {
            // Apply user-defined height/width if provided, otherwise let Tailwind classes handle it
            height: height || "auto", // Use 'auto' if no height is set, allowing min-h-screen to apply
            width: width || "auto", // Use 'auto' if no width is set, allowing min-w-screen to apply
            background: backgroundColor,
            zIndex,
        }, children: [_jsx("div", { ref: particlesRef, className: "absolute inset-0 w-full h-full pointer-events-none z-0", style: {
                    filter: enableGooEffect ? `url(#${gooIdRef.current})` : undefined,
                } }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center z-10 w-full h-full", children: children }), enableGooEffect && (_jsx("svg", { className: "absolute w-0 h-0 z-0", children: _jsx("defs", { children: _jsxs("filter", { id: gooIdRef.current, children: [_jsx("feGaussianBlur", { in: "SourceGraphic", result: "blur", stdDeviation: blurStrength }), _jsx("feColorMatrix", { in: "blur", result: "colormatrix", type: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9" }), _jsx("feBlend", { in: "SourceGraphic", in2: "colormatrix" })] }) }) }))] }));
};
export { AnimatedBubbleParticles };
export default AnimatedBubbleParticles;
