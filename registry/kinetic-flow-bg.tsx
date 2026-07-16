'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface KineticFlowBgProps {
  className?: string;
  /** Number of particles traversing the field */
  particleCount?: number;
  /** Controls the size of the swirling math features */
  complexity?: number;
  /** Particle movement speed multiplier */
  flowSpeed?: number;
  /** Opacity of the trails. Lower means longer tails. */
  trailOpacity?: number;
  /** Palette of colors assigned to the streams */
  particleColors?: string[];
  /** Whether the field reacts actively to cursor */
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  color: string;
}

/**
 * KineticFlowBg
 * 
 * An interactive, high-performance canvas background that renders thousands 
 * of particles following a mathematical flow field (Perlin-like noise).
 * Leaves beautiful, silky fading trails, mimicking fluid dynamics or wind currents.
 */
export default function KineticFlowBg({
  className = '',
  particleCount = 1200,
  complexity = 0.003,
  flowSpeed = 1.5,
  trailOpacity = 0.08,
  particleColors = ['#f87171', '#60a5fa', '#34d399', '#c084fc', '#facc15'],
  interactive = true,
}: KineticFlowBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const dimensions = useRef({ width: 0, height: 0 });
  const timeRef = useRef(0);

  const particles = useRef<Particle[]>([]);

  // Parse colors dynamically
  const parsedColors = useMemo(() => {
    return particleColors.map(color => color);
  }, [particleColors]);

  // Canvas Initialization & Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const initParticles = () => {
      particles.current = [];
      const { width, height } = dimensions.current;
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          speed: Math.random() * flowSpeed + 0.5,
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
      
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    const animate = () => {
      const { width, height } = dimensions.current;
      
      // Advance time for flowing animation
      timeRef.current += 0.002;
      const t = timeRef.current;

      // Draw faint background for tail effects
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, ${trailOpacity})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Process each particle
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        // Core Mathematical Flow Field Calculation (Simulation of noise)
        // This generates smooth undulating hills/valleys in 2D space
        const mathAngle = (Math.sin(p.x * complexity + t) + Math.cos(p.y * complexity + t)) * Math.PI * 2;
        
        let targetVx = Math.cos(mathAngle) * p.speed;
        let targetVy = Math.sin(mathAngle) * p.speed;

        // Interactive cursor disruption (adds a massive repelling force)
        if (mouseRef.current.active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          const interactRadius = 250;
          
          if (distSq < interactRadius * interactRadius) {
            const dist = Math.sqrt(distSq);
            // Repel strongly the closer they are
            const force = (1 - dist / interactRadius) * 4;
            targetVx += (dx / dist) * force;
            targetVy += (dy / dist) * force;
          }
        }

        // Steer towards target velocity for smooth curves
        p.vx += (targetVx - p.vx) * 0.1;
        p.vy += (targetVy - p.vy) * 0.1;

        p.x += p.vx;
        p.y += p.vy;

        // Edge wrapping
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw particle trail head
        ctx.beginPath();
        // Since velocity gives thickness, we use a simple arc
        // Instead of pure dots, we draw small lines in direction of travel for silk effect
        ctx.moveTo(p.x - p.vx, p.y - p.vy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        
        // Dynamic thickness mapping distance/speed to width intuitively
        const velocityTotal = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        ctx.lineWidth = Math.min(2.5, velocityTotal * 0.8 + 0.1);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount, complexity, flowSpeed, trailOpacity, parsedColors, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
