"use client";

import React, { useRef, useState, useEffect } from "react";

export interface StardustButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "cosmic" | "aurora" | "nebula" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  particleCount?: number;
  particleSpeed?: number;
  theme?: "light" | "dark" | "system";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  angle?: number;
  speed?: number;
  orbitRadius?: number;
}

export function StardustButton({
  children,
  variant = "cosmic",
  size = "md",
  className = "",
  particleCount = 45,
  particleSpeed = 1.0,
  theme = "system",
  ...props
}: StardustButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Theme tracking
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

  // Canvas particle logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    if (buttonRef.current) {
      resizeObserver.observe(buttonRef.current);
    }

    const particleColors = {
      cosmic: isDarkMode
        ? ["#6366f1", "#a855f7", "#ec4899", "#fbbf24"]
        : ["#4f46e5", "#7c3aed", "#db2777", "#d97706"],
      aurora: isDarkMode
        ? ["#10b981", "#06b6d4", "#6366f1", "#a855f7"]
        : ["#059669", "#0891b2", "#2563eb", "#7c3aed"],
      nebula: isDarkMode
        ? ["#ec4899", "#f43f5e", "#d946ef", "#8b5cf6"]
        : ["#db2777", "#e11d48", "#c084fc", "#6d28d9"],
      glass: isDarkMode
        ? ["#ffffff", "#e4e4e7", "#a1a1aa", "#d4d4d8"]
        : ["#09090b", "#27272a", "#52525b", "#71717a"],
    };

    const colors = particleColors[variant] || particleColors.cosmic;

    const createParticle = (x: number, y: number, isBurst = false): Particle => {
      const sizeVal = Math.random() * 1.5 + 0.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst
        ? Math.random() * 3 + 1
        : Math.random() * 0.6 + 0.2;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed * particleSpeed,
        vy: Math.sin(angle) * speed * particleSpeed,
        size: sizeVal,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: isBurst ? 1.0 : Math.random() * 0.6 + 0.4,
        decay: isBurst ? Math.random() * 0.03 + 0.02 : Math.random() * 0.008 + 0.005,
        angle: angle,
        orbitRadius: Math.random() * 40 + 10,
        speed: speed,
      };
    };

    // Initialize ambient particles
    for (let i = 0; i < (isHovered ? particleCount : particleCount / 3); i++) {
      particles.push(
        createParticle(Math.random() * width, Math.random() * height)
      );
    }

    const handleBurst = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail;
      for (let i = 0; i < 20; i++) {
        particles.push(createParticle(x, y, true));
      }
    };

    canvas.addEventListener("particle-burst", handleBurst);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Add ambient particles if count is below threshold
      const targetCount = isHovered ? particleCount : particleCount / 3;
      if (particles.length < targetCount && Math.random() < 0.3) {
        particles.push(
          createParticle(
            isHovered ? mousePos.x + (Math.random() * 20 - 10) : Math.random() * width,
            isHovered ? mousePos.y + (Math.random() * 20 - 10) : Math.random() * height
          )
        );
      }

      particles.forEach((p, idx) => {
        // Apply physics
        if (isHovered) {
          // Attract towards cursor
          const dx = mousePos.x - p.x;
          const dy = mousePos.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            // Apply slight orbit/swirl motion around cursor
            const force = (80 - dist) / 80;
            p.vx += (dx / dist) * force * 0.08;
            p.vy += (dy / dist) * force * 0.08;

            // Swirl component
            p.vx += -(dy / dist) * force * 0.15;
            p.vy += (dx / dist) * force * 0.15;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Bounce/Wrap borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        // Soft glow for sparkling effect
        if (p.size > 1.2) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
        }

        ctx.fill();
        ctx.restore();

        // Filter out dead particles
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("particle-burst", handleBurst);
    };
  }, [isHovered, mousePos, variant, particleCount, particleSpeed, isDarkMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    // Trigger burst on click
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const customEvent = new CustomEvent("particle-burst", {
      detail: { x: clickX, y: clickY },
    });
    canvas.dispatchEvent(customEvent);
  };

  // Size configurations
  const sizeClasses = {
    sm: "text-xs px-4 py-2 rounded-lg",
    md: "text-sm px-6 py-3 rounded-xl",
    lg: "text-base px-8 py-4 rounded-2xl",
    xl: "text-lg px-10 py-5 rounded-[20px]",
  };

  const getStyles = () => {
    if (isDarkMode) {
      switch (variant) {
        case "aurora":
          return {
            bg: "bg-emerald-950/20 backdrop-blur-md",
            border: "border-emerald-500/20 hover:border-emerald-400/40",
            textColor: "text-emerald-300 hover:text-white",
            glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          };
        case "nebula":
          return {
            bg: "bg-pink-955/15 backdrop-blur-md",
            border: "border-pink-500/20 hover:border-pink-400/40",
            textColor: "text-pink-300 hover:text-white",
            glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]",
          };
        case "glass":
          return {
            bg: "bg-white/5 backdrop-blur-md",
            border: "border-white/10 hover:border-white/20",
            textColor: "text-zinc-200 hover:text-white",
            glow: "shadow-none",
          };
        case "cosmic":
        default:
          return {
            bg: "bg-indigo-950/25 backdrop-blur-md",
            border: "border-indigo-500/25 hover:border-indigo-400/45",
            textColor: "text-indigo-300 hover:text-white",
            glow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
          };
      }
    } else {
      // Light Mode styles
      switch (variant) {
        case "aurora":
          return {
            bg: "bg-emerald-50/70 backdrop-blur-md",
            border: "border-emerald-200 hover:border-emerald-300/60",
            textColor: "text-emerald-700 hover:text-emerald-950",
            glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
          };
        case "nebula":
          return {
            bg: "bg-pink-50/70 backdrop-blur-md",
            border: "border-pink-200 hover:border-pink-300/60",
            textColor: "text-pink-700 hover:text-pink-950",
            glow: "shadow-[0_0_15px_rgba(236,72,153,0.1)]",
          };
        case "glass":
          return {
            bg: "bg-black/5 backdrop-blur-md",
            border: "border-black/5 hover:border-black/15",
            textColor: "text-zinc-800 hover:text-black",
            glow: "shadow-none",
          };
        case "cosmic":
        default:
          return {
            bg: "bg-indigo-50/70 backdrop-blur-md",
            border: "border-indigo-200/50 hover:border-indigo-300/80",
            textColor: "text-indigo-700 hover:text-indigo-950",
            glow: "shadow-[0_0_15px_rgba(99,102,241,0.1)]",
          };
      }
    }
  };

  const style = getStyles();

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative overflow-hidden group select-none transition-all duration-300
        flex items-center justify-center font-semibold tracking-wide
        border border-solid ${style.border} ${style.bg} ${style.textColor}
        ${sizeClasses[size]} ${isHovered ? style.glow : "shadow-sm"}
        ${className}
      `}
      style={{
        transform: isPressed ? "scale(0.96)" : isHovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      {...props}
    >
      {/* Interactive Stardust Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{
          mixBlendMode: isDarkMode ? "screen" : "multiply",
          opacity: isHovered ? 0.9 : 0.45,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

export default StardustButton;
