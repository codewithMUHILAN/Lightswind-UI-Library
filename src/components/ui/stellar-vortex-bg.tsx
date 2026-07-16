'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface StellarVortexBgProps {
  className?: string;
  /** Number of particles in the vortex */
  particleCount?: number;
  /** Opacity of the fade tail (lower = longer tails) */
  trailOpacity?: number;
  /** Speed multiplier for the swirling effect */
  swirlSpeed?: number;
  /** Base roaming speed for particles */
  baseSpeed?: number;
  /** Colors to randomly assign to particles */
  particleColors?: string[];
  /** Radius of the mouse interaction zone */
  interactionRadius?: number;
  /** Whether the vortex reacts to the mouse */
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseVx: number;
  baseVy: number;
}

/**
 * StellarVortexBg
 * 
 * A high-performance interactive particle system that creates a mesmerizing
 * swirling nebula effect around the user's cursor.
 */
export default function StellarVortexBg({
  className = '',
  particleCount = 800,
  trailOpacity = 0.15,
  swirlSpeed = 0.05,
  baseSpeed = 0.5,
  particleColors = ['#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#facc15'],
  interactionRadius = 300,
  interactive = true,
}: StellarVortexBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });
  const dimensions = useRef({ width: 0, height: 0 });

  const particles = useRef<Particle[]>([]);

  // Parse colors to RGB format to allow custom alpha handling if needed
  const parsedColors = useMemo(() => {
    return particleColors.map(color => {
      // Very basic hex to rgb normalization just in case
      if (color.startsWith('#') && color.length === 7) {
        return color;
      }
      return color;
    });
  }, [particleColors]);

  // Initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const initParticles = () => {
      particles.current = [];
      const { width, height } = dimensions.current;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const angle = Math.random() * Math.PI * 2;
        const speed = baseSpeed * (0.5 + Math.random());
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          size: Math.random() * 1.5 + 0.5,
          color: parsedColors[Math.floor(Math.random() * parsedColors.length)],
        });
      }
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      dimensions.current = { width: rect.width, height: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Re-initialize particles to spread them across the new bounds
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    const animate = () => {
      const { width, height } = dimensions.current;
      
      // Draw fade background for trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, ${trailOpacity})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // Smooth mouse interpolation (easing)
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      } else {
        // Slowly drift away if not active
        mouseRef.current.x += (width / 2 - mouseRef.current.x) * 0.01;
        mouseRef.current.y += (height / 2 - mouseRef.current.y) * 0.01;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update and draw particles
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        let forceX = 0;
        let forceY = 0;
        
        const dx = mx - p.x;
        const dy = my - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // If within interaction radius, apply vortex forces
        if (dist < interactionRadius && mouseRef.current.active) {
          // Tangential force (creates the swirl/vortex)
          const tangentX = -dy / dist;
          const tangentY = dx / dist;

          // Attraction force (pulls slightly towards center)
          const attrCoef = 0.01;
          const attractionX = (dx / dist) * attrCoef;
          const attractionY = (dy / dist) * attrCoef;

          // Strength decays with distance squared
          const strength = 1 - (dist / interactionRadius);
          
          forceX = (tangentX * swirlSpeed + attractionX) * strength * 100;
          forceY = (tangentY * swirlSpeed + attractionY) * strength * 100;
        }

        // Add forces to velocity
        p.vx += forceX;
        p.vy += forceY;

        // Add a bit of friction to return to base velocity
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        // Apply velocity limits
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxCurrentSpeed = baseSpeed + (mouseRef.current.active && dist < interactionRadius ? 4 : 0);
        if (speed > maxCurrentSpeed) {
          p.vx = (p.vx / speed) * maxCurrentSpeed;
          p.vy = (p.vy / speed) * maxCurrentSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Speed-based opacity for glowing effect
        const speedRatio = Math.min(1, speed / 3);
        ctx.fillStyle = p.color;
        
        // Glow effect
        ctx.shadowBlur = speedRatio * 15;
        ctx.shadowColor = p.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset for performance
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    
    // Start animation
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount, trailOpacity, swirlSpeed, baseSpeed, parsedColors, interactionRadius, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
