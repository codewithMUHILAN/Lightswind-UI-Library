"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "../lib/utils"; // Assuming cn utility is available for Tailwind classes
// Utility function to convert a hex color string to a normalized RGB array
// Handles #RGB and #RRGGBB formats.
const hexToRgbNormalized = (hex) => {
    let r = 0, g = 0, b = 0;
    // Remove the # if present
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
    if (cleanHex.length === 3) {
        // Handle shorthand hex codes (e.g., #00F -> #0000FF)
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
    }
    else if (cleanHex.length === 6) {
        // Handle full hex codes (e.g., #RRGGBB)
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
    }
    else {
        // Fallback for invalid hex (or if you want to throw an error)
        console.warn(`Invalid hex color: ${hex}. Falling back to black.`);
        return [0, 0, 0];
    }
    // Normalize to 0-1 range
    return [r / 255, g / 255, b / 255];
};
const Globe = ({ className, theta = 0.25, dark = 0, scale = 1.1, diffuse = 1.2, mapSamples = 60000, mapBrightness = 10, baseColor = "#ffffff", // Removed default here, handled in useEffect
markerColor = "#ffffff", // Removed default here
glowColor = "#ffffff", // Removed default here
 }) => {
    const canvasRef = useRef(null);
    const globeRef = useRef(null); // To store the cobe globe instance
    // Refs for interactive rotation and dragging state
    const phiRef = useRef(0);
    const thetaRef = useRef(theta); // Initialize thetaRef with prop theta
    const isDragging = useRef(false);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const autoRotateSpeed = 0.003; // Define auto-rotation speed
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        // Resolve color props to the [R, G, B] format required by cobe
        const resolvedBaseColor = typeof baseColor === "string"
            ? hexToRgbNormalized(baseColor)
            : baseColor || [0.4, 0.6509, 1]; // Default if not provided or invalid hex
        const resolvedMarkerColor = typeof markerColor === "string"
            ? hexToRgbNormalized(markerColor)
            : markerColor || [1, 0, 0]; // Default if not provided or invalid hex
        const resolvedGlowColor = typeof glowColor === "string"
            ? hexToRgbNormalized(glowColor)
            : glowColor || [0.2745, 0.5765, 0.898]; // Default if not provided or invalid hex
        const initGlobe = () => {
            // Destroy existing globe instance if it exists to prevent multiple instances
            if (globeRef.current) {
                globeRef.current.destroy();
                globeRef.current = null;
            }
            const rect = canvas.getBoundingClientRect();
            const size = Math.min(rect.width, rect.height);
            const devicePixelRatio = window.devicePixelRatio || 1;
            const internalWidth = size * devicePixelRatio;
            const internalHeight = size * devicePixelRatio;
            canvas.width = internalWidth;
            canvas.height = internalHeight;
            globeRef.current = createGlobe(canvas, {
                devicePixelRatio: devicePixelRatio,
                width: internalWidth,
                height: internalHeight,
                phi: phiRef.current,
                theta: thetaRef.current, // Use thetaRef for initial and interactive theta
                dark: dark,
                scale: scale,
                diffuse: diffuse,
                mapSamples: mapSamples,
                mapBrightness: mapBrightness,
                baseColor: resolvedBaseColor, // Use converted/resolved colors
                markerColor: resolvedMarkerColor, // Use converted/resolved colors
                glowColor: resolvedGlowColor, // Use converted/resolved colors
                opacity: 1,
                offset: [0, 0],
                markers: [],
                onRender: (state) => {
                    if (!isDragging.current) {
                        // Only auto-rotate if not currently dragging
                        phiRef.current += autoRotateSpeed;
                    }
                    state.phi = phiRef.current;
                    state.theta = thetaRef.current; // Ensure cobe uses the updated thetaRef
                },
            });
        };
        // --- Mouse Interaction Handlers ---
        const onMouseDown = (e) => {
            isDragging.current = true;
            lastMouseX.current = e.clientX;
            lastMouseY.current = e.clientY;
            canvas.style.cursor = "grabbing"; // Change cursor to indicate dragging
        };
        const onMouseMove = (e) => {
            if (isDragging.current) {
                const deltaX = e.clientX - lastMouseX.current;
                const deltaY = e.clientY - lastMouseY.current;
                // Adjust rotation sensitivity as needed
                const rotationSpeed = 0.005;
                // Update phi (horizontal rotation)
                phiRef.current += deltaX * rotationSpeed;
                // Update theta (vertical rotation), clamp to prevent flipping
                // Clamped between -PI/2 and PI/2 to prevent globe from going upside down
                thetaRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, thetaRef.current - deltaY * rotationSpeed));
                lastMouseX.current = e.clientX;
                lastMouseY.current = e.clientY;
            }
        };
        const onMouseUp = () => {
            isDragging.current = false;
            canvas.style.cursor = "grab"; // Change cursor back
        };
        const onMouseLeave = () => {
            // If mouse leaves canvas while dragging, stop dragging
            if (isDragging.current) {
                isDragging.current = false;
                canvas.style.cursor = "grab";
            }
        };
        // --- End Mouse Interaction Handlers ---
        initGlobe();
        // Attach event listeners for mouse interaction
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseleave", onMouseLeave); // Important for when mouse leaves canvas during a drag
        const handleResize = () => {
            initGlobe();
        };
        window.addEventListener("resize", handleResize);
        // Cleanup function: destroy the globe instance and remove event listeners when component unmounts
        return () => {
            window.removeEventListener("resize", handleResize);
            // Remove mouse event listeners on cleanup
            if (canvas) {
                canvas.removeEventListener("mousedown", onMouseDown);
                canvas.removeEventListener("mousemove", onMouseMove);
                canvas.removeEventListener("mouseup", onMouseUp);
                canvas.removeEventListener("mouseleave", onMouseLeave);
            }
            if (globeRef.current) {
                globeRef.current.destroy();
                globeRef.current = null;
            }
        };
    }, [
        theta,
        dark,
        scale,
        diffuse,
        mapSamples,
        mapBrightness,
        baseColor, // Include color props in dependency array so globe re-initializes if they change
        markerColor,
        glowColor,
    ]);
    return (_jsx("div", { className: cn("flex items-center justify-center z-[10] mx-auto", className), style: {
            width: "auto",
            height: "auto", // Container takes full viewport height
            display: "flex", // Ensure flexbox properties are active for centering
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden", // Prevent scrollbars if content overflows
        }, children: _jsx("canvas", { ref: canvasRef, style: {
                width: "20rem", // Canvas takes full width of its parent (which is constrained)
                height: "20rem", // Canvas takes full height of its parent (which is constrained)
                maxWidth: "auto", // Limit max width to viewport height to ensure square aspect in landscape
                maxHeight: "auto", // Limit max height to viewport width to ensure square aspect in portrait
                aspectRatio: "1", // Force a 1:1 aspect ratio for the canvas element
                display: "block", // Ensure canvas behaves as a block element
                cursor: "grab", // Default cursor
            } }) }));
};
export default Globe;
