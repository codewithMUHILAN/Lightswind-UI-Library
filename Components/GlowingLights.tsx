"use client";
import React from "react";

// Interface for GradientButtonProps (unchanged, for context)
export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  gradientColors?: string[];
  animationSpeed?: number;
  glowEffect?: boolean;
  glowSize?: number;
  variant?: "default" | "outline" | "ghost";
}

// GradientButton Component (unchanged, for context)
export function GradientButton({
  children,
  size = "md",
  className = "",
  gradientColors = [
    "#ff6d1b",
    "#ffee55",
    "#5bff89",
    "#4d8aff",
    "#6b5fff",
    "#ff64f9",
    "#ff6565",
  ],
  animationSpeed = 2,
  glowEffect = true,
  glowSize = 4,
  variant = "default",
  ...props
}: GradientButtonProps) {
  const gradientString = gradientColors.join(", ");

  const sizeClasses = {
    sm: "text-sm px-4 py-2 rounded-full",
    md: "text-base px-6 py-2 rounded-full",
    lg: "text-lg px-8 py-3 rounded-full",
    xl: "text-2xl px-10 py-4 rounded-full",
  };

  const borderStyles = {
    default: "border-transparent",
    outline: "border-current",
    ghost: "border-transparent bg-opacity-10",
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes gradient-animate {
              0% {
                background-position: 0;
              }
              100% {
                background-position: 200%;
              }
            }
          `,
        }}
      />

      <button
        className={`
          relative text-white dark:text-black
          flex items-center justify-center
          border-[0.15rem] z-20 ${borderStyles[variant]} ${sizeClasses[size]}
          ${className}
          ${variant === "default" ? "bg-black dark:bg-white" : ""}
          ${variant === "ghost" ? "overflow-hidden" : ""}
        `}
        style={{
          background:
            variant === "ghost"
              ? `linear-gradient(90deg, ${gradientString})`
              : undefined,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          backgroundSize: "200%",
          animation: variant === "ghost" ? `gradient-animate ${animationSpeed}s infinite linear` : undefined,
        }}
        {...props}
      >
        {glowEffect && (
          <div
            className="absolute bottom-[-20%] h-[50%] w-[60%] z-[-1] blur-3xl"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              background: `linear-gradient(90deg, ${gradientString})`,
              backgroundSize: "200%",
              animation: `gradient-animate ${animationSpeed}s infinite linear`,
            }}
          />
        )}
        {children}
      </button>
    </>
  );
}

// Interface for GlowingLightsProps
export interface GlowingLightsProps {
  // height?: string; // Removed as it will be handled by the glow itself or its positioning
  gradientColors?: string[];
  animationSpeed?: number;
  glowSize?: number;
  className?: string; // To allow external styling for positioning/size
}

// GlowingLights Component
export function GlowingLights({
  gradientColors = [
    "#ff6d1b",
    "#ffee55",
    "#5bff89",
    "#4d8aff",
    "#6b5fff",
    "#ff64f9",
    "#ff6565",
  ],
  animationSpeed = 5,
  glowSize = 40,
  className = "",
}: GlowingLightsProps) {
  const gradientString = gradientColors.join(", ");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fancy-gradient-animate {
              0% {
                background-position: 0% 0%;
              }
              50% {
                background-position: 100% 100%;
              }
              100% {
                background-position: 0% 0%;
              }
            }

            .glowing-lights-effect-only-glow { /* Renamed for clarity */
              background: linear-gradient(135deg, ${gradientString});
              background-size: 400% 400%;
              animation: fancy-gradient-animate ${animationSpeed}s infinite linear;
              filter: blur(calc(${glowSize} * 1rem));
            }
          `,
        }}
      />
      {/* The glowing effect div, now directly exposed and can be styled externally */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-[100%] z-50 h-[60%] rounded-full glowing-lights-effect-only-glow opacity-20 ${className}`}
        style={{
          top: "-30%", // Half of its height (60%) is hidden below
        }}
      ></div>
    </>
  );
}