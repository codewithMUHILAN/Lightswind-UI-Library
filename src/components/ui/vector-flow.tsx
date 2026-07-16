"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export type InteractionMode = "attract" | "repel" | "vortex" | "none";

interface VectorFlowProps {
  colorParticles?: string[]; // Array of Hex colors to pick for particles
  particleCount?: number;
  particleSpeed?: number;
  particleSize?: number;
  interactionMode?: InteractionMode;
  interactive?: boolean;
  trailLength?: number; // trail opacity, e.g. 0.08
  blurAmount?: number; // Blur in pixels
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  speed: number;
  life: number;
  maxLife: number;
}

const defaultColors = ["#00f0ff", "#d946ef", "#3b82f6"]; // Cyan, Magenta, Blue

// Classic 2D Perlin Noise Permutation Table Setup
const perm = new Uint8Array(512);
const grad2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1]
];

const initNoise = () => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  // Linear congruential generator for deterministic shuffle
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x80000000;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
  }
};
initNoise();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);

const noise2D = (x: number, y: number) => {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[X] + Y];
  const ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X] + 1 + Y];
  const bb = perm[perm[X] + 1 + Y + 1];

  const g_aa = grad2[aa & 7];
  const g_ab = grad2[ab & 7];
  const g_ba = grad2[ba & 7];
  const g_bb = grad2[bb & 7];

  const n_aa = g_aa[0] * xf + g_aa[1] * yf;
  const n_ba = g_ba[0] * (xf - 1) + g_ba[1] * yf;
  const n_ab = g_ab[0] * xf + g_ab[1] * (yf - 1);
  const n_bb = g_bb[0] * (xf - 1) + g_bb[1] * (yf - 1);

  const x1 = lerp(u, n_aa, n_ba);
  const x2 = lerp(u, n_ab, n_bb);

  return lerp(v, x1, x2);
};

// Dynamic color contrast adjustment for Light Theme readability
const getThemeColor = (color: string, isDark: boolean): string => {
  if (isDark) return color;
  
  const lowColor = color.toLowerCase();
  if (lowColor === "#00f0ff" || lowColor === "#00ffff") return "#0284c7"; // Cyan -> Deep Sky Blue
  if (lowColor === "#d946ef") return "#b55fe6"; // Magenta -> Darker Magenta/Orchid
  if (lowColor === "#a855f7") return "#7c3aed"; // Purple -> Violet
  if (lowColor === "#f97316") return "#c2410c"; // Orange -> Rust Orange
  if (lowColor === "#f59e0b") return "#d97706"; // Yellow -> Darker Amber
  if (lowColor === "#ef4444") return "#dc2626"; // Red -> Crimson
  if (lowColor === "#14b8a6") return "#0d9488"; // Teal -> Deep Teal
  if (lowColor === "#3b82f6") return "#2563eb"; // Blue -> Medium Blue
  return color;
};

const VectorFlow: React.FC<VectorFlowProps> = ({
  colorParticles = defaultColors,
  particleCount = 1000,
  particleSpeed = 1.0,
  particleSize = 1.5,
  interactionMode = "vortex",
  interactive = true,
  trailLength = 0.08,
  blurAmount = 1.5,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isDarkModeRef = useRef(true);

  // Mouse coords, velocities, and active state refs
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    vx: 0, 
    vy: 0, 
    active: false, 
    radius: 160 
  });

  // Monitor theme mutations
  useEffect(() => {
    const checkTheme = () => {
      isDarkModeRef.current = document.documentElement.classList.contains("dark");
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const createParticle = (width: number, height: number): Particle => {
      const maxLife = 100 + Math.random() * 150;
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        lastX: x,
        lastY: y,
        vx: 0,
        vy: 0,
        color: colorParticles[Math.floor(Math.random() * colorParticles.length)],
        size: (0.4 + Math.random() * 1.0) * particleSize,
        speed: (0.6 + Math.random() * 1.0) * particleSpeed,
        life: 0,
        maxLife,
      };
    };

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;

        // Initialize particles
        particles = [];
        for (let i = 0; i < particleCount; i++) {
          particles.push(createParticle(width, height));
        }

        // Clean initial clear
        ctx.fillStyle = isDarkModeRef.current ? "#000000" : "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    };

    resizeCanvas();

    // Listeners for mouse interaction & velocity calculation
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      const mouse = mouseRef.current;
      if (mouse.active) {
        // Capture swipe speeds
        mouse.vx = (newX - mouse.x) * 0.4;
        mouse.vy = (newY - mouse.y) * 0.4;
      }
      mouse.x = newX;
      mouse.y = newY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      const mouse = mouseRef.current;
      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const newX = touch.clientX - rect.left;
      const newY = touch.clientY - rect.top;
      
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.vx = (newX - mouse.x) * 0.4;
        mouse.vy = (newY - mouse.y) * 0.4;
      }
      mouse.x = newX;
      mouse.y = newY;
      mouse.active = true;
    };

    const handleTouchEnd = () => {
      const mouse = mouseRef.current;
      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
      canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    let lastTime = performance.now();
    let time = 0;

    const render = () => {
      if (!isInView) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt * particleSpeed;

      const isDark = isDarkModeRef.current;

      // 1. Transparent trail fading using destination-out
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${trailLength})`;
      ctx.fillRect(0, 0, width, height);

      // 2. Set composite operation for particles drawing
      ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

      const mouse = mouseRef.current;
      // Damp mouse velocities
      mouse.vx *= 0.95;
      mouse.vy *= 0.95;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Advanced math: classic Perlin noise + octave synthesis + domain warping
        const qx = noise2D(p.x * 0.0025 + 1.2, p.y * 0.0025 + time * 0.04);
        const qy = noise2D(p.x * 0.0025 + 5.7, p.y * 0.0025 + time * 0.04);

        const baseAngle = noise2D(
          p.x * 0.0018 + qx * 0.35, 
          p.y * 0.0018 + qy * 0.35 + time * 0.05
        ) * Math.PI * 2.5;

        // Apply base velocity
        let fx = Math.cos(baseAngle) * p.speed;
        let fy = Math.sin(baseAngle) * p.speed;

        // Mouse interactive force fields
        if (interactive && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 1) {
            const normalizedDist = dist / mouse.radius;
            const force = Math.pow(1.0 - normalizedDist, 1.5); // smoother falloff

            // Velocity drag (mouse sweeps particles in its swipe direction)
            const speedSq = mouse.vx * mouse.vx + mouse.vy * mouse.vy;
            if (speedSq > 0.1) {
              fx += mouse.vx * force * 1.8;
              fy += mouse.vy * force * 1.8;
            }

            if (interactionMode === "attract") {
              fx += (dx / dist) * force * p.speed * 2.5;
              fy += (dy / dist) * force * p.speed * 2.5;
            } else if (interactionMode === "repel") {
              fx -= (dx / dist) * force * p.speed * 3.0;
              fy -= (dy / dist) * force * p.speed * 3.0;
            } else if (interactionMode === "vortex") {
              const vx = -dy / dist;
              const vy = dx / dist;
              fx += vx * force * p.speed * 3.5;
              fy += vy * force * p.speed * 3.5;
            }
          }
        }

        // Momentum damping accumulation
        p.vx += (fx - p.vx) * 0.08;
        p.vy += (fy - p.vy) * 0.08;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges protection
        let wrapped = false;
        if (p.x < 0) { p.x = width; wrapped = true; }
        else if (p.x > width) { p.x = 0; wrapped = true; }
        if (p.y < 0) { p.y = height; wrapped = true; }
        else if (p.y > height) { p.y = 0; wrapped = true; }

        if (Math.abs(p.x - p.lastX) > width * 0.3 || Math.abs(p.y - p.lastY) > height * 0.3) {
          wrapped = true;
        }

        p.life++;
        if (p.life >= p.maxLife) {
          particles[i] = createParticle(width, height);
          continue;
        }

        if (wrapped) {
          p.lastX = p.x;
          p.lastY = p.y;
          continue;
        }

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.85;
        const mappedColor = getThemeColor(p.color, isDark);

        // Three-pass rendering pipeline for realistic volumetric neon glow
        
        // 1. Soft Glow outer sheath
        ctx.beginPath();
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = mappedColor;
        ctx.lineWidth = p.size * 3.5;
        ctx.globalAlpha = alpha * 0.14;
        ctx.stroke();

        // 2. Vibrant core fiber
        ctx.beginPath();
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = mappedColor;
        ctx.lineWidth = p.size * 1.4;
        ctx.globalAlpha = alpha * 0.7;
        ctx.stroke();

        // 3. Hot laser center core
        ctx.beginPath();
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = p.size * 0.6;
        ctx.globalAlpha = alpha * 0.95;
        ctx.stroke();

        p.lastX = p.x;
        p.lastY = p.y;
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [colorParticles, particleCount, particleSpeed, particleSize, interactionMode, interactive, trailLength, isInView]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          display: "block",
          pointerEvents: "auto",
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
        }}
      />
    </div>
  );
};

export default VectorFlow;
