import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from "react";
import { cn } from "../lib/utils";
const ParticleOrbitEffect = ({ className, style, particleCount = 25, radius = 70, particleSpeed = 0.025, radiusScale = 1.5, intensity = 1, fadeOpacity = 0.05, colorRange = [0, 360], disabled = false, followMouse = true, autoColors = true, particleSize = 2 }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const particlesRef = useRef([]);
    const mouseRef = useRef({
        x: 0,
        y: 0,
        isDown: false,
        radiusScale: 1,
    });
    const colorTimerRef = useRef(0);
    // Helper to generate HSL color
    const generateColor = useCallback((hue) => {
        const h = hue ?? (colorRange[0] + Math.random() * (colorRange[1] - colorRange[0]));
        return `hsl(${h}, 70%, 60%)`;
    }, [colorRange]);
    // Create particles
    const createParticles = useCallback((initialX, initialY) => {
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const hue = colorRange[0] + Math.random() * (colorRange[1] - colorRange[0]);
            particles.push({
                size: particleSize,
                position: { x: initialX, y: initialY },
                offset: { x: 0, y: 0 },
                shift: { x: initialX, y: initialY },
                speed: particleSpeed + Math.random() * particleSpeed,
                targetSize: particleSize,
                fillColor: generateColor(hue),
                orbit: radius * 0.5 + radius * 0.5 * Math.random(),
                hue,
                trail: []
            });
        }
        return particles;
    }, [particleCount, particleSpeed, particleSize, radius, generateColor, colorRange]);
    // Update canvas dimensions
    const updateCanvasDimensions = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        // Initialize mouse position to center
        mouseRef.current.x = width / 2;
        mouseRef.current.y = height / 2;
        // Create initial particles
        particlesRef.current = createParticles(mouseRef.current.x, mouseRef.current.y);
    }, [createParticles]);
    useEffect(() => {
        if (disabled)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const context = canvas.getContext("2d");
        if (!context)
            return;
        // Event handlers
        const handleMouseMove = (event) => {
            if (!followMouse)
                return;
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };
        const handleMouseDown = () => {
            mouseRef.current.isDown = true;
        };
        const handleMouseUp = () => {
            mouseRef.current.isDown = false;
        };
        const handleTouchMove = (event) => {
            if (!followMouse || event.touches.length === 0)
                return;
            mouseRef.current.x = event.touches[0].clientX;
            mouseRef.current.y = event.touches[0].clientY;
        };
        const handleTouchStart = (event) => {
            if (event.touches.length === 0)
                return;
            mouseRef.current.isDown = true;
            if (followMouse) {
                mouseRef.current.x = event.touches[0].clientX;
                mouseRef.current.y = event.touches[0].clientY;
            }
        };
        const handleTouchEnd = () => {
            mouseRef.current.isDown = false;
        };
        // Animation loop
        const draw = () => {
            if (!context || !canvas)
                return;
            // Update color timer for auto colors
            if (autoColors) {
                colorTimerRef.current += 0.016; // ~60fps
                if (colorTimerRef.current >= 2) { // Change colors every 2 seconds
                    colorTimerRef.current = 0;
                    particlesRef.current.forEach(particle => {
                        particle.hue = colorRange[0] + Math.random() * (colorRange[1] - colorRange[0]);
                        particle.fillColor = generateColor(particle.hue);
                    });
                }
            }
            // Animate radius scale
            const targetScale = mouseRef.current.isDown ? radiusScale : 1;
            mouseRef.current.radiusScale += (targetScale - mouseRef.current.radiusScale) * 0.02;
            // Clear canvas completely for transparent background
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Update and draw particles
            for (let i = 0; i < particlesRef.current.length; i++) {
                const particle = particlesRef.current[i];
                // Update particle position
                particle.offset.x += particle.speed * intensity;
                particle.offset.y += particle.speed * intensity;
                particle.shift.x += (mouseRef.current.x - particle.shift.x) * particle.speed * intensity;
                particle.shift.y += (mouseRef.current.y - particle.shift.y) * particle.speed * intensity;
                const orbitRadius = particle.orbit * mouseRef.current.radiusScale * intensity;
                particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * orbitRadius;
                particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * orbitRadius;
                // Keep particles within canvas bounds
                particle.position.x = Math.max(0, Math.min(particle.position.x, canvas.width));
                particle.position.y = Math.max(0, Math.min(particle.position.y, canvas.height));
                // Update trail
                particle.trail.push({
                    x: particle.position.x,
                    y: particle.position.y,
                    alpha: 1
                });
                // Limit trail length and fade existing points
                const maxTrailLength = Math.max(5, Math.floor(40 * intensity));
                if (particle.trail.length > maxTrailLength) {
                    particle.trail.shift();
                }
                // Fade trail points
                particle.trail.forEach((point, index) => {
                    point.alpha = (index + 1) / particle.trail.length * fadeOpacity * 20;
                });
                // Draw trail
                if (particle.trail.length > 1) {
                    for (let j = 1; j < particle.trail.length; j++) {
                        const prev = particle.trail[j - 1];
                        const curr = particle.trail[j];
                        context.beginPath();
                        context.strokeStyle = particle.fillColor;
                        context.lineWidth = particle.size * 0.3 * curr.alpha;
                        context.globalAlpha = curr.alpha;
                        context.moveTo(prev.x, prev.y);
                        context.lineTo(curr.x, curr.y);
                        context.stroke();
                    }
                }
                // Animate particle size
                particle.size += (particle.targetSize - particle.size) * 0.05;
                if (Math.abs(particle.size - particle.targetSize) < 0.1) {
                    particle.targetSize = particleSize + Math.random() * particleSize * 2;
                }
                // Draw main particle
                context.beginPath();
                context.fillStyle = particle.fillColor;
                context.globalAlpha = 0.9;
                context.arc(particle.position.x, particle.position.y, particle.size * 0.5, 0, Math.PI * 2);
                context.fill();
            }
            context.globalAlpha = 1;
            animationRef.current = requestAnimationFrame(draw);
        };
        // Initialize
        updateCanvasDimensions();
        // Add event listeners
        window.addEventListener("resize", updateCanvasDimensions);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd);
        // Start animation
        animationRef.current = requestAnimationFrame(draw);
        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener("resize", updateCanvasDimensions);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [
        disabled,
        followMouse,
        particleCount,
        radius,
        particleSpeed,
        radiusScale,
        intensity,
        fadeOpacity,
        colorRange,
        autoColors,
        particleSize,
        updateCanvasDimensions,
        createParticles,
        generateColor
    ]);
    if (disabled) {
        return null;
    }
    return (_jsx("div", { className: cn("fixed top-0 left-0 z-50 pointer-events-none w-full h-full", className), children: _jsx("canvas", { ref: canvasRef, className: "w-screen h-screen block", style: style, "aria-hidden": "true" }) }));
};
export default ParticleOrbitEffect;
