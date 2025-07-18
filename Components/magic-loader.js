import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';
const MagicLoader = ({ size = 200, particleCount = 1, speed = 1, hueRange = [0, 360], className }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const particlesRef = useRef([]);
    const tickRef = useRef(0);
    const globalAngleRef = useRef(0);
    const globalRotationRef = useRef(0);
    const createParticle = useCallback((centerX, centerY, tick, minSize) => {
        return {
            radius: 7,
            x: centerX + Math.cos(tick / 20) * minSize / 2,
            y: centerY + Math.sin(tick / 20) * minSize / 2,
            angle: globalRotationRef.current + globalAngleRef.current,
            speed: 0,
            accel: 0.01,
            decay: 0.01,
            life: 1
        };
    }, []);
    const stepParticle = useCallback((particle, index) => {
        particle.speed += particle.accel;
        particle.x += Math.cos(particle.angle) * particle.speed * speed;
        particle.y += Math.sin(particle.angle) * particle.speed * speed;
        particle.angle += Math.PI / 64;
        particle.accel *= 1.01;
        particle.life -= particle.decay;
        if (particle.life <= 0) {
            particlesRef.current.splice(index, 1);
        }
    }, [speed]);
    const drawParticle = useCallback((ctx, particle, index, tick) => {
        const hue = hueRange[0] + ((tick + (particle.life * 120)) % (hueRange[1] - hueRange[0]));
        ctx.fillStyle = ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${particle.life})`;
        // Draw line to previous particle
        ctx.beginPath();
        if (particlesRef.current[index - 1]) {
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particlesRef.current[index - 1].x, particlesRef.current[index - 1].y);
        }
        ctx.stroke();
        // Draw main particle circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.001, particle.life * particle.radius), 0, Math.PI * 2);
        ctx.fill();
        // Draw sparkle effects
        const sparkleSize = Math.random() * 1.25;
        const sparkleX = particle.x + ((Math.random() - 0.5) * 35) * particle.life;
        const sparkleY = particle.y + ((Math.random() - 0.5) * 35) * particle.life;
        ctx.fillRect(Math.floor(sparkleX), Math.floor(sparkleY), sparkleSize, sparkleSize);
    }, [hueRange]);
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const minSize = Math.min(rect.width, rect.height) * 0.5;
        // Add new particles
        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push(createParticle(centerX, centerY, tickRef.current, minSize));
        }
        // Update particles
        particlesRef.current.forEach((particle, index) => {
            stepParticle(particle, index);
        });
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw particles
        particlesRef.current.forEach((particle, index) => {
            drawParticle(ctx, particle, index, tickRef.current);
        });
        // Update global rotation
        globalRotationRef.current += Math.PI / 6 * speed;
        globalAngleRef.current += Math.PI / 6 * speed;
        tickRef.current++;
        animationRef.current = requestAnimationFrame(animate);
    }, [createParticle, stepParticle, drawParticle, particleCount, speed]);
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Set canvas size
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(dpr, dpr);
        ctx.globalCompositeOperation = 'lighter';
        // Reset animation state
        particlesRef.current = [];
        tickRef.current = 0;
        globalAngleRef.current = 0;
        globalRotationRef.current = 0;
    }, [size]);
    useEffect(() => {
        setupCanvas();
        animate();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [setupCanvas, animate]);
    return (_jsx("div", { className: cn("flex items-center justify-center", className), children: _jsx("canvas", { ref: canvasRef, className: "max-w-full max-h-full", style: {
                width: size,
                height: size
            } }) }));
};
export default MagicLoader;
