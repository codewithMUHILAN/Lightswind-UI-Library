"use client";

import React, { useRef, useState, useEffect } from "react";

export interface HoloButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "cyber" | "rosegold" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glowSize?: number; // Radius in px
  theme?: "light" | "dark" | "system";
}

export function HoloButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  glowSize = 120,
  theme = "system",
  ...props
}: HoloButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  // Size configurations
  const sizeClasses = {
    sm: "text-xs px-4 py-2 rounded-lg",
    md: "text-sm px-6 py-3 rounded-xl",
    lg: "text-base px-8 py-4 rounded-2xl",
    xl: "text-lg px-10 py-5 rounded-[20px]",
  };

  // Color profiles based on variant & dark/light theme
  const getColors = () => {
    if (isDarkMode) {
      switch (variant) {
        case "cyber":
          return {
            bg: "bg-zinc-955/80",
            border: "border-cyan-500/20 hover:border-cyan-400/40",
            textColor: "text-cyan-400 hover:text-white",
            flare: "radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 100%)",
            beam: "linear-gradient(90deg, #22d3ee, #a855f7, #eab308)",
            glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]",
          };
        case "rosegold":
          return {
            bg: "bg-stone-955/85",
            border: "border-rose-400/20 hover:border-rose-300/40",
            textColor: "text-rose-200 hover:text-white",
            flare: "radial-gradient(circle, rgba(251, 113, 133, 0.2) 0%, rgba(253, 186, 116, 0.2) 60%, transparent 100%)",
            beam: "linear-gradient(90deg, #fb7185, #fdba74, #fb7185)",
            glow: "shadow-[0_0_20px_rgba(251,113,133,0.1)]",
          };
        case "glass":
          return {
            bg: "bg-white/5 backdrop-blur-md",
            border: "border-white/10 hover:border-white/20",
            textColor: "text-zinc-200 hover:text-white",
            flare: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)",
            beam: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(255,255,255,0.2))",
            glow: "shadow-none",
          };
        case "primary":
        default:
          return {
            bg: "bg-zinc-900/90",
            border: "border-indigo-500/20 hover:border-indigo-400/40",
            textColor: "text-indigo-200 hover:text-white",
            flare: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.25) 55%, transparent 100%)",
            beam: "linear-gradient(90deg, #6366f1, #ec4899, #a855f7)",
            glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
          };
      }
    } else {
      // Light Mode colors
      switch (variant) {
        case "cyber":
          return {
            bg: "bg-white/80",
            border: "border-cyan-500/10 hover:border-cyan-400/30",
            textColor: "text-cyan-600 hover:text-cyan-950",
            flare: "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 100%)",
            beam: "linear-gradient(90deg, #06b6d4, #c084fc, #eab308)",
            glow: "shadow-[0_0_15px_rgba(34,211,238,0.1)]",
          };
        case "rosegold":
          return {
            bg: "bg-rose-50/70",
            border: "border-rose-300/10 hover:border-rose-400/30",
            textColor: "text-rose-700 hover:text-rose-950",
            flare: "radial-gradient(circle, rgba(251, 113, 133, 0.15) 0%, rgba(253, 186, 116, 0.12) 60%, transparent 100%)",
            beam: "linear-gradient(90deg, #fda4af, #fde047, #fda4af)",
            glow: "shadow-[0_0_15px_rgba(251,113,133,0.08)]",
          };
        case "glass":
          return {
            bg: "bg-black/5 backdrop-blur-md",
            border: "border-black/5 hover:border-black/15",
            textColor: "text-zinc-800 hover:text-black",
            flare: "radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.02) 60%, transparent 100%)",
            beam: "linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.03), rgba(0,0,0,0.1))",
            glow: "shadow-none",
          };
        case "primary":
        default:
          return {
            bg: "bg-zinc-50/90",
            border: "border-indigo-200/40 hover:border-indigo-300/60",
            textColor: "text-indigo-700 hover:text-indigo-950",
            flare: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 55%, transparent 100%)",
            beam: "linear-gradient(90deg, #818cf8, #f472b6, #c084fc)",
            glow: "shadow-[0_0_15px_rgba(99,102,241,0.1)]",
          };
      }
    }
  };

  const style = getColors();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes holo-beam-rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .holo-beam-active {
              animation: holo-beam-rotate var(--beam-duration, 4s) infinite linear;
            }
          `,
        }}
      />

      <button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
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
        {/* Iridescent Mouse-Tracking Radial Glow Overlay */}
        <div
          className="absolute pointer-events-none transition-opacity duration-500 ease-out"
          style={{
            left: coords.x - glowSize / 2,
            top: coords.y - glowSize / 2,
            width: glowSize,
            height: glowSize,
            background: style.flare,
            opacity: isHovered ? 1 : 0,
            mixBlendMode: isDarkMode ? "screen" : "multiply",
          }}
        />

        {/* Dynamic Border Gradient Loop */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 overflow-hidden"
          style={{
            margin: "-1px",
            padding: "1.5px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            opacity: isHovered ? 1 : 0.25,
          }}
        >
          <div
            className="holo-beam-active absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
            style={{
              backgroundImage: style.beam,
              "--beam-duration": isHovered ? "2.5s" : "5.0s",
            } as React.CSSProperties}
          />
        </div>

        {/* Shimmer line effect on hover */}
        <div
          className="absolute inset-0 w-[30%] h-full pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] transition-all duration-1000 ease-in-out"
          style={{
            left: isHovered ? "120%" : "-40%",
            transitionProperty: "left",
          }}
        />

        {/* Button Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    </>
  );
}

export default HoloButton;
