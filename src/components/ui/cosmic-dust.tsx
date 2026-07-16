"use client";

import React, { useEffect, useRef, useState } from "react";

interface CosmicDustProps {
  particleCount?: number;
  speedMultiplier?: number;
  particleSize?: number;
  theme?: "light" | "dark" | "system";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  history: { x: number; y: number }[];
}

export default function CosmicDust({
  particleCount = 120,
  speedMultiplier = 1.0,
  particleSize = 1.5,
  theme = "system",
}: CosmicDustProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, hasMoved: false });
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme detection mutation observer
  useEffect(() => {
    const checkTheme = () => {
      if (theme === "system") {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
      } else {
        setIsDarkMode(theme === "dark");
      }
    };

    checkTheme();

    if (theme === "system") {
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Initialize default mouse position to center
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    const colorsDark = [
      "rgba(34, 211, 238,", // cyan
      "rgba(168, 85, 247,", // purple
      "rgba(236, 72, 153,", // pink
      "rgba(234, 179, 8,",  // gold
    ];

    const colorsLight = [
      "rgba(99, 102, 241,", // indigo
      "rgba(139, 92, 246,", // violet
      "rgba(244, 63, 94,",  // rose
      "rgba(16, 185, 129,", // emerald
    ];

    // Helper to create a single particle
    const createParticle = (initRandom = false): Particle => {
      const pX = initRandom ? Math.random() * width : Math.random() * width;
      const pY = initRandom ? Math.random() * height : height + 10;
      
      const pColorSet = isDarkMode ? colorsDark : colorsLight;
      const baseColor = pColorSet[Math.floor(Math.random() * pColorSet.length)];

      return {
        x: pX,
        y: pY,
        vx: (Math.random() - 0.5) * 1.2 * speedMultiplier,
        vy: (-Math.random() - 0.2) * 1.5 * speedMultiplier,
        size: (Math.random() * 0.8 + 0.6) * particleSize,
        color: baseColor,
        opacity: Math.random() * 0.4 + 0.4,
        history: [],
      };
    };

    let particles: Particle[] = Array.from({ length: particleCount }, () => createParticle(true));

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.hasMoved = true;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Frame Loop
    const animate = (t: number) => {
      animationId = requestAnimationFrame(animate);

      // Clear canvas (fully transparent)
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates
      if (!mouseRef.current.hasMoved) {
        // Idle animation: soft circle orbit in the center
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.15;
        mouseRef.current.targetX = cx + Math.cos(t * 0.001) * radius;
        mouseRef.current.targetY = cy + Math.sin(t * 0.001) * radius;
      }

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      particles.forEach((p, index) => {
        // Natural drift
        p.vx += Math.sin(t * 0.002 + index) * 0.02 * speedMultiplier;

        // Interaction Vortex/Gravity Field
        const dx = mX - p.x;
        const dY = mY - p.y;
        const dist = Math.sqrt(dx * dx + dY * dY);
        const influenceRadius = 180;

        if (dist < influenceRadius) {
          const force = (1.0 - dist / influenceRadius) * 0.8 * speedMultiplier;
          
          // Pull force towards mouse
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dY / dist) * force * 0.04;

          // Tangential Vortex swirl force
          const swirlAngle = 0.5 * Math.PI; // Tangent direction
          const tx = -dY / dist;
          const ty = dx / dist;
          
          p.vx += tx * force * 0.18;
          p.vy += ty * force * 0.18;
        }

        // Apply friction/drag
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Store trail history
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 6) {
          p.history.shift();
        }

        // Check bounds (reset if offscreen)
        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[index] = createParticle(false);
          return;
        }

        // Draw particle trail
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let i = 1; i < p.history.length; i++) {
            ctx.lineTo(p.history[i].x, p.history[i].y);
          }
          
          ctx.strokeStyle = `${p.color}${p.opacity * 0.35})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (isDarkMode) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = `${p.color}0.8)`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for performance
      });
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [particleCount, speedMultiplier, particleSize, isDarkMode]);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 -z-10 pointer-events-none" />;
}
