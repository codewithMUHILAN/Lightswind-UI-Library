import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

export interface GradientCardProps {
  color: string;
  glowColor: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  children?: React.ReactNode;
  followMouse?: boolean;
  hoverOnly?: boolean;
  intensity?: number;
  backgroundColor?: string; // Keep this prop for other potential uses or if you want to pass a raw CSS color string
}

export const InteractiveGradient = ({
  color ,
  glowColor = "#107667ed",
  width = "",
  height = "",
  borderRadius = "1rem",
  className = "",
  children,
  followMouse = true,
  hoverOnly = false,
  intensity = 100,
  backgroundColor, // You can still use this for other parts if needed
}: GradientCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [resolvedGlowFallbackColor, setResolvedGlowFallbackColor] = useState("#ffffff"); // Renamed for clarity

  // Detect dark mode for fallback (if backgroundColor prop isn't a direct CSS color)
  useEffect(() => {
    // This logic is primarily for the *glow fallback* when the background is handled by Tailwind
    // or when no direct backgroundColor is provided for the radial gradient's base.
    if (!backgroundColor || !backgroundColor.startsWith("#") && !backgroundColor.startsWith("rgb")) {
        const html = document.documentElement;
        const updateColor = () => {
          const isDark = html.classList.contains("dark");
          // This sets the color for the "base" of the radial gradient, which needs a CSS color.
          setResolvedGlowFallbackColor(isDark ? "#000" : "#ffffff"); // Black for dark, white for light as default
        };

        updateColor();

        const observer = new MutationObserver(updateColor);
        observer.observe(html, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    } else {
        // If backgroundColor is a direct CSS color, use it for the radial gradient's base.
        setResolvedGlowFallbackColor(backgroundColor);
    }
  }, [backgroundColor]);

  const normalizedIntensity = Math.max(0, Math.min(100, intensity)) / 100;

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || (hoverOnly && !isHovering)) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse, hoverOnly, isHovering]);

  const getBackgroundStyle = (): React.CSSProperties => {
    // Use resolvedGlowFallbackColor for the radial gradient's base,
    // which should always be a valid CSS color.
    if (!followMouse || (hoverOnly && !isHovering)) {
      return {
        background: `radial-gradient(circle at center, ${glowColor} 0%, ${resolvedGlowFallbackColor} ${45 * normalizedIntensity}%, ${resolvedGlowFallbackColor} 100%)`,
      };
    }

    return {
      background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${glowColor} 0%, ${resolvedGlowFallbackColor} ${45 * normalizedIntensity}%, ${resolvedGlowFallbackColor} 100%)`,
    };
  };

  const getBorderStyle = (): React.CSSProperties => {
    // resolvedGlowFallbackColor is also used here
    return {
      "--gradient-border": `linear-gradient(45deg, ${resolvedGlowFallbackColor}, ${resolvedGlowFallbackColor}, ${color})`,
    } as React.CSSProperties;
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        `relative grid place-content-center place-items-center text-center
        border transition-all duration-300
        interactive-gradient-card text-foreground`,
        backgroundColor || 'bg-white dark:bg-black',
        className
      )}
      style={{
        ...getBackgroundStyle(), // This handles the radial glow overlay
        ...getBorderStyle(),
        width,
        height,
        borderRadius,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Gradient border */}
      <style>
        {`
          .interactive-gradient-card::before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: ${borderRadius};
            z-index: -1;
            border: 0.155rem solid transparent;
            background: var(--gradient-border) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
          }
        `}
      </style>
      {children}
    </div>
  );
};

export default InteractiveGradient;
