"use client";

import React, { useRef, useState, useEffect } from "react";

export interface FluidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "aurora" | "emerald" | "obsidian";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  magneticRange?: number; // Distance in px to trigger magnetic pull
  pullStrength?: number; // Multiplier (0.1 to 0.8)
  theme?: "light" | "dark" | "system";
}

export function FluidButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  magneticRange = 90,
  pullStrength = 0.45,
  theme = "system",
  ...props
}: FluidButtonProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [filterId, setFilterId] = useState("gooey-filter-id");

  // Create unique filter ID on mount to prevent SVG collisions
  useEffect(() => {
    setFilterId(`gooey-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

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

  // Magnetic tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < magneticRange) {
        setIsHovered(true);
        const factor = (magneticRange - distance) / magneticRange;
        const targetX = dx * pullStrength * factor;
        const targetY = dy * pullStrength * factor;
        
        setOffset({
          x: targetX,
          y: targetY,
        });
      } else {
        setIsHovered(false);
        setOffset({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsPressed(false);
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    triggerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      triggerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [magneticRange, pullStrength]);

  // Size configurations
  const sizeClasses = {
    sm: "text-xs px-5 py-2.5 rounded-lg",
    md: "text-sm px-7 py-3 rounded-xl",
    lg: "text-base px-9 py-4 rounded-2xl",
    xl: "text-lg px-11 py-5 rounded-[22px]",
  };

  const getColors = () => {
    if (isDarkMode) {
      switch (variant) {
        case "aurora":
          return {
            bg: "bg-purple-950/15 dark:bg-purple-950/20 backdrop-blur-md",
            border: "border-purple-500/40 hover:border-purple-400/80",
            textColor: "text-purple-200 hover:text-white",
            blobs: ["bg-indigo-600", "bg-purple-500", "bg-pink-500"],
            glow: "shadow-[0_0_25px_rgba(168,85,247,0.25)]",
          };
        case "emerald":
          return {
            bg: "bg-emerald-950/15 dark:bg-emerald-950/20 backdrop-blur-md",
            border: "border-emerald-500/40 hover:border-emerald-400/80",
            textColor: "text-emerald-200 hover:text-white",
            blobs: ["bg-emerald-500", "bg-teal-500", "bg-lime-500"],
            glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
          };
        case "obsidian":
          return {
            bg: "bg-zinc-900/30 dark:bg-zinc-900/35 backdrop-blur-md",
            border: "border-zinc-700/60 hover:border-zinc-500/90",
            textColor: "text-zinc-300 hover:text-white",
            blobs: ["bg-zinc-600", "bg-zinc-700", "bg-zinc-500"],
            glow: "shadow-[0_0_20px_rgba(255,255,255,0.06)]",
          };
        case "primary":
        default:
          return {
            bg: "bg-blue-950/15 dark:bg-blue-950/20 backdrop-blur-md",
            border: "border-blue-500/40 hover:border-blue-400/80",
            textColor: "text-blue-200 hover:text-white",
            blobs: ["bg-blue-600", "bg-cyan-500", "bg-indigo-500"],
            glow: "shadow-[0_0_25px_rgba(59,130,246,0.25)]",
          };
      }
    } else {
      // Light Theme Colors
      switch (variant) {
        case "aurora":
          return {
            bg: "bg-purple-50/40 backdrop-blur-md",
            border: "border-purple-200 hover:border-purple-400/80",
            textColor: "text-purple-700 hover:text-purple-950",
            blobs: ["bg-indigo-300/70", "bg-purple-300/70", "bg-pink-300/70"],
            glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
          };
        case "emerald":
          return {
            bg: "bg-emerald-50/40 backdrop-blur-md",
            border: "border-emerald-200 hover:border-emerald-400/80",
            textColor: "text-emerald-700 hover:text-emerald-950",
            blobs: ["bg-emerald-300/70", "bg-teal-300/70", "bg-lime-300/70"],
            glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
          };
        case "obsidian":
          return {
            bg: "bg-zinc-100/40 backdrop-blur-md",
            border: "border-zinc-300 hover:border-zinc-500",
            textColor: "text-zinc-800 hover:text-black",
            blobs: ["bg-zinc-300/70", "bg-zinc-400/70", "bg-zinc-200/70"],
            glow: "shadow-[0_0_15px_rgba(0,0,0,0.05)]",
          };
        case "primary":
        default:
          return {
            bg: "bg-blue-50/40 backdrop-blur-md",
            border: "border-blue-200 hover:border-blue-400/80",
            textColor: "text-blue-700 hover:text-blue-950",
            blobs: ["bg-blue-300/70", "bg-cyan-300/70", "bg-indigo-300/70"],
            glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
          };
      }
    }
  };

  const style = getColors();

  return (
    <>
      {/* Gooey SVG Filter */}
      <svg className="hidden w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Button styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes blob-float-1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -15px) scale(1.1); }
              66% { transform: translate(-15px, 20px) scale(0.9); }
            }
            @keyframes blob-float-2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-25px, 20px) scale(0.9); }
              66% { transform: translate(20px, -15px) scale(1.15); }
            }
            @keyframes blob-float-3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(15px, 25px) scale(1.1); }
              66% { transform: translate(-30px, -10px) scale(0.85); }
            }
            .blob-anim-1 { animation: blob-float-1 8s infinite ease-in-out; }
            .blob-anim-2 { animation: blob-float-2 7s infinite ease-in-out 1s; }
            .blob-anim-3 { animation: blob-float-3 9s infinite ease-in-out 2s; }
          `,
        }}
      />

      {/* Magnetic Area Trigger Wrapper */}
      <div
        ref={triggerRef}
        className="relative flex items-center justify-center p-3 cursor-pointer"
        style={{
          perspective: 1000,
        }}
      >
        <button
          ref={buttonRef}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          className={`
            relative overflow-hidden group select-none transition-all duration-300
            flex items-center justify-center font-bold tracking-wide
            border border-solid backdrop-blur-[4px] ${style.border} ${style.bg} ${style.textColor}
            ${sizeClasses[size]} ${isHovered ? style.glow : "shadow-sm"}
            ${className}
          `}
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0px) scale(${isPressed ? 0.94 : isHovered ? 1.03 : 1})`,
            transition: isPressed ? "transform 0.08s ease" : "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
          }}
          {...props}
        >
          {/* Gooey Liquid Blobs Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] transition-opacity duration-500"
            style={{
              filter: `url(#${filterId})`,
              opacity: isHovered ? 0.9 : 0.25,
            }}
          >
            {/* Blob 1 */}
            <div
              className={`absolute blob-anim-1 w-24 h-24 rounded-full blur-[2px] transition-all duration-500 ${style.blobs[0]}`}
              style={{
                top: "-10%",
                left: "15%",
                mixBlendMode: isDarkMode ? "screen" : "multiply",
                opacity: 1,
              }}
            />
            {/* Blob 2 */}
            <div
              className={`absolute blob-anim-2 w-28 h-28 rounded-full blur-[2px] transition-all duration-500 ${style.blobs[1]}`}
              style={{
                bottom: "-20%",
                right: "10%",
                mixBlendMode: isDarkMode ? "screen" : "multiply",
                opacity: 1,
              }}
            />
            {/* Blob 3 */}
            <div
              className={`absolute blob-anim-3 w-20 h-20 rounded-full blur-[2px] transition-all duration-500 ${style.blobs[2]}`}
              style={{
                top: "20%",
                right: "35%",
                mixBlendMode: isDarkMode ? "screen" : "multiply",
                opacity: 1,
              }}
            />
          </div>

          {/* Button Content */}
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        </button>
      </div>
    </>
  );
}

export default FluidButton;
