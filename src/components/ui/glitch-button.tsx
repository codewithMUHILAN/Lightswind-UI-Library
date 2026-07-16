"use client";

import React, { useState, useEffect } from "react";

export interface GlitchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: "cyber" | "neon" | "stealth" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glitchInterval?: number; // In ms
  theme?: "light" | "dark" | "system";
}

export function GlitchButton({
  children,
  variant = "cyber",
  size = "md",
  className = "",
  glitchInterval = 3000,
  theme = "system",
  ...props
}: GlitchButtonProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [activeGlitch, setActiveGlitch] = useState(false);

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

  // Periodic subtle glitch effect when idle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGlitch(true);
      setTimeout(() => setActiveGlitch(false), 400);
    }, glitchInterval);

    return () => clearInterval(interval);
  }, [glitchInterval]);

  const sizeClasses = {
    sm: "text-xs px-4 py-2.5",
    md: "text-sm px-6 py-3.5",
    lg: "text-base px-8 py-4.5",
    xl: "text-lg px-10 py-5.5",
  };

  const getColors = () => {
    if (isDarkMode) {
      switch (variant) {
        case "neon":
          return {
            bg: "bg-zinc-950",
            border: "border-lime-500/35 hover:border-lime-400/90",
            textColor: "text-lime-400 hover:text-white",
            shadow: "shadow-[0_0_15px_rgba(132,204,22,0.15)]",
            glitchColors: ["#84cc16", "#eab308"], // Lime, Yellow
            scannerBg: "bg-lime-500/15",
          };
        case "stealth":
          return {
            bg: "bg-zinc-900",
            border: "border-zinc-700/50 hover:border-zinc-400/80",
            textColor: "text-zinc-200 hover:text-white",
            shadow: "shadow-[0_0_10px_rgba(255,255,255,0.05)]",
            glitchColors: ["#ffffff", "#52525b"], // White, Zinc
            scannerBg: "bg-white/10",
          };
        case "glass":
          return {
            bg: "bg-white/5 backdrop-blur-md",
            border: "border-white/10 hover:border-white/30",
            textColor: "text-zinc-100 hover:text-white",
            shadow: "shadow-none",
            glitchColors: ["#22d3ee", "#ec4899"], // Cyan, Fuchsia
            scannerBg: "bg-white/20",
          };
        case "cyber":
        default:
          return {
            bg: "bg-zinc-950",
            border: "border-cyan-500/35 hover:border-cyan-400/90",
            textColor: "text-cyan-400 hover:text-white",
            shadow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
            glitchColors: ["#06b6d4", "#d946ef"], // Cyan, Fuchsia
            scannerBg: "bg-cyan-500/15",
          };
      }
    } else {
      // Light Mode colors
      switch (variant) {
        case "neon":
          return {
            bg: "bg-white",
            border: "border-lime-300 hover:border-lime-500",
            textColor: "text-lime-700 hover:text-lime-950",
            shadow: "shadow-[0_0_12px_rgba(132,204,22,0.08)]",
            glitchColors: ["#65a30d", "#ca8a04"], // Lime, Yellow
            scannerBg: "bg-lime-500/10",
          };
        case "stealth":
          return {
            bg: "bg-zinc-50",
            border: "border-zinc-300 hover:border-zinc-500",
            textColor: "text-zinc-800 hover:text-black",
            shadow: "shadow-[0_0_8px_rgba(0,0,0,0.04)]",
            glitchColors: ["#18181b", "#71717a"], // Zinc darks
            scannerBg: "bg-black/10",
          };
        case "glass":
          return {
            bg: "bg-black/5 backdrop-blur-md",
            border: "border-black/5 hover:border-black/20",
            textColor: "text-zinc-800 hover:text-black",
            shadow: "shadow-none",
            glitchColors: ["#0891b2", "#c084fc"], // Cyan, Purple
            scannerBg: "bg-black/15",
          };
        case "cyber":
        default:
          return {
            bg: "bg-white",
            border: "border-cyan-300 hover:border-cyan-500",
            textColor: "text-cyan-700 hover:text-cyan-950",
            shadow: "shadow-[0_0_12px_rgba(6,182,212,0.08)]",
            glitchColors: ["#0891b2", "#c026d3"], // Cyan, Fuchsia
            scannerBg: "bg-cyan-500/10",
          };
      }
    }
  };

  const style = getColors();

  return (
    <>
      {/* Premium Cyber Glitch CSS Keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes glitch-anim-1 {
              0% { clip-path: inset(20% 0 50% 0); transform: translate(-4px, -2px) skew(2deg); }
              20% { clip-path: inset(60% 0 10% 0); transform: translate(3px, 1px) skew(-3deg); }
              40% { clip-path: inset(5% 0 75% 0); transform: translate(-2px, 3px) skew(1deg); }
              60% { clip-path: inset(80% 0 5% 0); transform: translate(4px, -1px) skew(-2deg); }
              80% { clip-path: inset(30% 0 45% 0); transform: translate(-3px, 2px) skew(3deg); }
              100% { clip-path: inset(20% 0 50% 0); transform: translate(0); }
            }
            @keyframes glitch-anim-2 {
              0% { clip-path: inset(50% 0 20% 0); transform: translate(4px, 2px) skew(-2deg); }
              20% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, -1px) skew(3deg); }
              40% { clip-path: inset(75% 0 5% 0); transform: translate(2px, -3px) skew(-1deg); }
              60% { clip-path: inset(5% 0 80% 0); transform: translate(-4px, 1px) skew(2deg); }
              80% { clip-path: inset(45% 0 30% 0); transform: translate(3px, -2px) skew(-3deg); }
              100% { clip-path: inset(50% 0 20% 0); transform: translate(0); }
            }
            @keyframes scan-sweep {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            .cyber-glitch-active-1 {
              animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
            }
            .cyber-glitch-active-2 {
              animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
            }
            .cyber-scanner-sweep {
              animation: scan-sweep 2s infinite linear;
            }
          `,
        }}
      />

      <button
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`
          relative overflow-hidden group select-none transition-all duration-200
          flex items-center justify-center font-bold tracking-widest uppercase
          border border-solid ${style.border} ${style.bg} ${style.textColor}
          ${sizeClasses[size]} ${style.shadow}
          ${className}
        `}
        style={{
          clipPath: "polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)",
          transform: isPressed ? "scale(0.97)" : "scale(1)",
        }}
        {...props}
      >
        {/* Dynamic Scan Line sweep overlay */}
        <div
          className={`absolute inset-x-0 h-[2px] pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity duration-300 cyber-scanner-sweep ${style.scannerBg}`}
          style={{
            boxShadow: `0 0 10px ${style.glitchColors[0]}`,
          }}
        />

        {/* Diagonal Corner Cut Accents */}
        <div
          className="absolute top-0 left-0 w-3 h-[1px] transition-transform duration-300"
          style={{
            backgroundColor: style.glitchColors[0],
            transform: "rotate(-45deg) translate(-2px, 3px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-3 h-[1px] transition-transform duration-300"
          style={{
            backgroundColor: style.glitchColors[1],
            transform: "rotate(-45deg) translate(2px, -3px)",
          }}
        />

        {/* Glitch Overlay Layer 1 */}
        <span
          className={`
            absolute inset-0 flex items-center justify-center pointer-events-none opacity-0
            ${(activeGlitch || isPressed) ? "opacity-90 cyber-glitch-active-1" : "group-hover:opacity-90 group-hover:cyber-glitch-active-1"}
            ${style.bg}
          `}
          style={{
            textShadow: `-2px 0 ${style.glitchColors[0]}`,
            color: isDarkMode ? "#fff" : "#000",
            left: "-2px",
          }}
        >
          {children}
        </span>

        {/* Glitch Overlay Layer 2 */}
        <span
          className={`
            absolute inset-0 flex items-center justify-center pointer-events-none opacity-0
            ${(activeGlitch || isPressed) ? "opacity-90 cyber-glitch-active-2" : "group-hover:opacity-90 group-hover:cyber-glitch-active-2"}
            ${style.bg}
          `}
          style={{
            textShadow: `2px 0 ${style.glitchColors[1]}`,
            color: isDarkMode ? "#fff" : "#000",
            left: "2px",
          }}
        >
          {children}
        </span>

        {/* Core button text */}
        <span className="relative z-10 flex items-center gap-2 group-hover:scale-[1.03] transition-transform duration-300">
          {children}
        </span>
      </button>
    </>
  );
}

export default GlitchButton;
