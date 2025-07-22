import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from "react";
const QUANTITY = 25;
const RADIUS = 70;
const RADIUS_SCALE_MIN = 1;
const RADIUS_SCALE_MAX = 1.5;
const ParticleOrbitEffect = ({ className = "", style = {}, fullScreen = false, // Default to false for container-bound behavior
 }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    // Explicitly define the type of particlesRef.current as an array of Particle
    const particlesRef = useRef([]);
    const mouseRef = useRef({
        x: 0, // Initialize to 0, will be updated by handler or initial positioning
        y: 0,
        isDown: false,
        radiusScale: 1,
        // screenWidth and screenHeight will now refer to canvas width/height
        width: 0,
        height: 0,
    });
    // State to track canvas dimensions if not full screen
    const [canvasDimensions, setCanvasDimensions] = useState({
        width: 0,
        height: 0,
    });
    // Helper: create all particles - now accepts initial x,y
    const createParticles = useCallback((initialX, initialY) => {
        // Explicitly define the type of the particles array
        const particles = [];
        for (let i = 0; i < QUANTITY; i++) {
            particles.push({
                size: 1,
                position: { x: initialX, y: initialY },
                offset: { x: 0, y: 0 },
                shift: { x: initialX, y: initialY },
                speed: 0.01 + Math.random() * 0.04,
                targetSize: 1,
                fillColor: "#" +
                    ((Math.random() * 0x404040 + 0xaaaaaa) | 0)
                        .toString(16)
                        .padStart(6, "0"),
                orbit: RADIUS * 0.5 + RADIUS * 0.5 * Math.random(),
            });
        }
        return particles;
    }, []); // No dependencies for createParticles itself, as it uses constants
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const context = canvas.getContext("2d");
        if (!context)
            return;
        let parentContainer = null;
        let canvasRect; // To store the canvas's position and dimensions
        // Function to update canvas dimensions and mouse origin
        const updateCanvasDimensions = () => {
            if (fullScreen) {
                mouseRef.current.width = window.innerWidth;
                mouseRef.current.height = window.innerHeight;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // For full screen, initial mouse position can be center of viewport
                mouseRef.current.x = window.innerWidth / 2;
                mouseRef.current.y = window.innerHeight / 2;
            }
            else {
                parentContainer = canvas.parentElement;
                if (parentContainer) {
                    canvasRect = parentContainer.getBoundingClientRect();
                    mouseRef.current.width = canvasRect.width;
                    mouseRef.current.height = canvasRect.height;
                    canvas.width = canvasRect.width;
                    canvas.height = canvasRect.height;
                    // For container-bound, initial mouse position can be center of container
                    mouseRef.current.x = canvasRect.width / 2;
                    mouseRef.current.y = canvasRect.height / 2;
                }
            }
            setCanvasDimensions({ width: canvas.width, height: canvas.height }); // Update state for initial render
            // Re-create particles if dimensions change significantly, or just update their initial shift
            particlesRef.current = createParticles(mouseRef.current.x, mouseRef.current.y);
        };
        // Event handlers for mouse/touch
        const handleEvent = (event) => {
            let clientX;
            let clientY;
            if ("touches" in event) {
                // Touch event
                if (event.touches.length === 0)
                    return; // No touch points
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            }
            else {
                // Mouse event
                clientX = event.clientX;
                clientY = event.clientY;
            }
            // Calculate relative position ONLY if not full screen
            if (!fullScreen && parentContainer) {
                canvasRect = parentContainer.getBoundingClientRect(); // Get latest rect
                mouseRef.current.x = clientX - canvasRect.left;
                mouseRef.current.y = clientY - canvasRect.top;
            }
            else {
                // For full screen, direct clientX/Y is fine
                mouseRef.current.x = clientX;
                mouseRef.current.y = clientY;
            }
            // Handle mouse/touch down/up states
            if (event.type === "mousedown" || event.type === "touchstart") {
                mouseRef.current.isDown = true;
            }
            else if (event.type === "mouseup" || event.type === "touchend") {
                mouseRef.current.isDown = false;
            }
        };
        // Animation loop
        const draw = () => {
            // Animate RADIUS SCALE
            if (mouseRef.current.isDown) {
                mouseRef.current.radiusScale +=
                    (RADIUS_SCALE_MAX - mouseRef.current.radiusScale) * 0.02;
            }
            else {
                mouseRef.current.radiusScale -=
                    (mouseRef.current.radiusScale - RADIUS_SCALE_MIN) * 0.02;
            }
            mouseRef.current.radiusScale = Math.min(mouseRef.current.radiusScale, RADIUS_SCALE_MAX);
            // Background fade for trailing
            context.fillStyle = "rgba(0,0,0,0.05)";
            context.fillRect(0, 0, mouseRef.current.width, // Use canvas's current width
            mouseRef.current.height // Use canvas's current height
            );
            // Particles update/draw
            for (let i = 0, len = particlesRef.current.length; i < len; i++) {
                const particle = particlesRef.current[i];
                const lp = { x: particle.position.x, y: particle.position.y };
                particle.offset.x += particle.speed;
                particle.offset.y += particle.speed;
                particle.shift.x +=
                    (mouseRef.current.x - particle.shift.x) * particle.speed;
                particle.shift.y +=
                    (mouseRef.current.y - particle.shift.y) * particle.speed;
                particle.position.x =
                    particle.shift.x +
                        Math.cos(i + particle.offset.x) *
                            (particle.orbit * mouseRef.current.radiusScale);
                particle.position.y =
                    particle.shift.y +
                        Math.sin(i + particle.offset.y) *
                            (particle.orbit * mouseRef.current.radiusScale);
                // Keep inside canvas bounds
                particle.position.x = Math.max(Math.min(particle.position.x, mouseRef.current.width), 0);
                particle.position.y = Math.max(Math.min(particle.position.y, mouseRef.current.height), 0);
                // Particle size animation
                particle.size += (particle.targetSize - particle.size) * 0.05;
                if (Math.round(particle.size) === Math.round(particle.targetSize)) {
                    particle.targetSize = 1 + Math.random() * 7;
                }
                context.beginPath();
                context.fillStyle = particle.fillColor;
                context.strokeStyle = particle.fillColor;
                context.lineWidth = particle.size;
                context.moveTo(lp.x, lp.y);
                context.lineTo(particle.position.x, particle.position.y);
                context.stroke();
                context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
                context.fill();
            }
            animationRef.current = requestAnimationFrame(draw);
        };
        // Initial setup
        updateCanvasDimensions(); // Call once on mount
        // Event listeners
        window.addEventListener("resize", updateCanvasDimensions);
        canvas.addEventListener("mousemove", handleEvent); // Listen on canvas directly
        canvas.addEventListener("mousedown", handleEvent);
        canvas.addEventListener("mouseup", handleEvent);
        canvas.addEventListener("touchstart", handleEvent, { passive: false });
        canvas.addEventListener("touchmove", handleEvent, { passive: false });
        canvas.addEventListener("touchend", handleEvent);
        // Start animation
        animationRef.current = requestAnimationFrame(draw);
        // Cleanup function
        return () => {
            if (animationRef.current)
                cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", updateCanvasDimensions);
            if (canvas) {
                // Check if canvas still exists for cleanup
                canvas.removeEventListener("mousemove", handleEvent);
                canvas.removeEventListener("mousedown", handleEvent);
                canvas.removeEventListener("mouseup", handleEvent);
                canvas.removeEventListener("touchstart", handleEvent);
                canvas.removeEventListener("touchmove", handleEvent);
                canvas.removeEventListener("touchend", handleEvent);
            }
        };
    }, [fullScreen, createParticles]); // Re-run effect if fullScreen prop changes
    // Dynamic style based on fullScreen prop
    const canvasStyle = fullScreen
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -1,
            display: "block",
            ...style,
        }
        : {
            position: "absolute", // Use absolute to position within relative parent
            top: 0,
            left: 0,
            width: "100%", // Take full width of parent
            height: "100%", // Take full height of parent
            display: "block",
            ...style,
        };
    return (_jsx("canvas", { ref: canvasRef, className: className, style: canvasStyle, width: canvasDimensions.width, height: canvasDimensions.height, "aria-hidden": "true", tabIndex: -1 }));
};
export default ParticleOrbitEffect;
