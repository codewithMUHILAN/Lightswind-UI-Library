'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';

interface AntigravityBgProps {
  className?: string;
  /** Inner radius of the first ring */
  innerRadius?: number;
  /** Number of concentric rings */
  ringCount?: number;
  /** Distance between consecutive rings */
  ringSpacing?: number;
  /** Size of each dot */
  particleSize?: number;
  /** Color of the dots */
  particleColor?: string;
  /** Speed of the wave movement */
  animationSpeed?: number;
  /** How much the wave affects the radius */
  waveAmplitude?: number;
  /** Frequency of the wave (how many ripples) */
  waveFrequency?: number;
  /** Whether to follow the mouse center */
  followMouse?: boolean;
}

/**
 * AntigravityBg
 * 
 * A high-fidelity replication of the Google Antigravity background effect.
 * Uses a radial grid of thousands of small dots arranged in concentric rings.
 * A wave function propagates radially from the center (or mouse), shifting dot 
 * positions and opacities to create the signature "dot wave" texture.
 */
export default function AntigravityBg({
  className = '',
  innerRadius = 80,
  ringCount = 35,
  ringSpacing = 15,
  particleSize = 1.4,
  particleColor = '#3186FF',
  animationSpeed = 1.5,
  waveAmplitude = 25,
  waveFrequency = 0.015,
  followMouse = true,
}: AntigravityBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });

  // Pre-calculate the radial grid points to save per-frame calculations
  const points = useMemo(() => {
    const pts: Array<{ angle: number; baseRadius: number }> = [];
    
    // Density target: about 1 dot per 12 pixels along the circumference
    const dotDensity = 12;

    for (let r = 0; r < ringCount; r++) {
      const radius = innerRadius + r * ringSpacing;
      // Calculate how many dots fit in this ring based on circumference
      const circumference = 2 * Math.PI * radius;
      const count = Math.max(12, Math.floor(circumference / dotDensity));
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        pts.push({ angle, baseRadius: radius });
      }
    }
    return pts;
  }, [innerRadius, ringCount, ringSpacing]);

  // Parse color only when it changes
  const rgb = useMemo(() => {
    if (/^#([0-9a-f]{6})$/i.test(particleColor)) {
      const r = parseInt(particleColor.slice(1, 3), 16);
      const g = parseInt(particleColor.slice(3, 5), 16);
      const b = parseInt(particleColor.slice(5, 7), 16);
      return `${r},${g},${b}`;
    }
    return '49,134,255';
  }, [particleColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      // Use devicePixelRatio for sharp dots
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      if (!followMouse) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const animate = (time: number) => {
      const t = time * 0.001 * animationSpeed;
      
      // Smooth center transition
      const lerp = 0.05;
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * lerp;

      const W = canvas.width / (window.devicePixelRatio || 1);
      const H = canvas.height / (window.devicePixelRatio || 1);
      const cx = currentRef.current.x * W;
      const cy = currentRef.current.y * H;

      ctx.clearRect(0, 0, W, H);

      // Draw points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // The wave function
        // Offset is based on distance from the ring start + time
        // We use the baseRadius as a proxy for distance in the radial pattern
        const wave = Math.sin(p.baseRadius * waveFrequency - t);
        
        // Displacement: push radius outwards/inwards
        // The amplitude decays slightly for further points to keep center active
        const displacement = wave * waveAmplitude;
        const currentRadius = p.baseRadius + displacement;
        
        const px = cx + Math.cos(p.angle) * currentRadius;
        const py = cy + Math.sin(p.angle) * currentRadius;

        // Opacity mapping: higher displacement = more visible
        // Adds that "sparkle/interference" look
        const alpha = Math.max(0.05, 0.1 + (wave * 0.5 + 0.5) * 0.6);

        // Optimization: only draw if within canvas bounds
        if (px > -10 && px < W + 10 && py > -10 && py < H + 10) {
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const canvasElem = canvas;
    canvasElem.addEventListener('pointermove', onPointerMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvasElem.removeEventListener('pointermove', onPointerMove);
    };
  }, [points, rgb, animationSpeed, waveAmplitude, waveFrequency, followMouse, particleSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
