"use client";

import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { IOptions, RecursivePartial, MoveDirection } from "@tsparticles/engine"; // Import MoveDirection

interface SparkleParticlesProps {
  className?: string;
  maxParticleSize?: number;
  minParticleSize?: number | null;
  baseDensity?: number;
  maxSpeed?: number;
  minMoveSpeed?: number | null;
  maxOpacity?: number;
  customDirection?: MoveDirection | "none" | "" | "bottom" | "bottomLeft" | "bottomRight" | "left" | "right" | "top" | "topLeft" | "topRight"; // Allow string literals for common directions
  opacityAnimationSpeed?: number;
  minParticleOpacity?: number | null;
  particleColor?: string;
  enableParallax?: boolean;
  enableHoverGrab?: boolean;
  backgroundColor?: string;
  userOptions?: Record<string, any>;
  zIndexLevel?: number;
  clickEffect?: boolean;
  hoverMode?: "grab" | "bubble" | "repulse";
  particleCount?: number;
  particleShape?: "circle" | "square" | "triangle" | "star" | "edge";
  enableCollisions?: boolean;
}

export function SparkleParticles({
  className,
  maxParticleSize = 1.2,
  minParticleSize = null,
  baseDensity = 800,
  maxSpeed = 1.5,
  minMoveSpeed = null,
  maxOpacity = 1,
  customDirection = "",
  opacityAnimationSpeed = 3,
  minParticleOpacity = null,
  particleColor,
  enableParallax = false,
  enableHoverGrab = false,
  backgroundColor = "transparent",
  userOptions = {},
  zIndexLevel = 1,
  clickEffect = true,
  hoverMode = "grab",
  particleCount = 4,
  particleShape = "circle",
  enableCollisions = false,
}: SparkleParticlesProps) {
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [activeColor, setActiveColor] = useState("#000000");
  const instanceId = useId();

  useEffect(() => {
    const resolveThemeColor = () => {
      if (particleColor) return particleColor;
      return document.documentElement.classList.contains("dark")
        ? "#ffffff"
        : "#000000";
    };

    setActiveColor(resolveThemeColor());

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsEngineReady(true);
    });

    const observer = new MutationObserver(() => {
      setActiveColor(resolveThemeColor());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [particleColor]);

  const mergedOptions: RecursivePartial<IOptions> = {
    background: {
      color: {
        value: backgroundColor,
      },
    },
    fullScreen: {
      enable: false,
      zIndex: zIndexLevel,
    },
    fpsLimit: 300,
    interactivity: {
      events: {
        onClick: {
          enable: clickEffect,
          mode: "push",
        },
        onHover: {
          enable: enableHoverGrab,
          mode: hoverMode,
          parallax: {
            enable: enableParallax,
            force: 60,
            smooth: 10,
          },
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        push: { quantity: particleCount },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: activeColor,
      },
      shape: {
        type: particleShape,
      },
      move: {
        enable: true,
        direction: customDirection === "" ? "none" : customDirection, // Type assertion for customDirection
        speed: {
          min: minMoveSpeed || maxSpeed / 130,
          max: maxSpeed,
        },
        straight: true,
      },
      collisions: {
        enable: enableCollisions,
        mode: "bounce" as const,
        bounce: {
          horizontal: { value: 1 },
          vertical: { value: 1 },
        },
      },
      number: {
        value: baseDensity,
      },
      opacity: {
        value: {
          min: minParticleOpacity || maxOpacity / 10,
          max: maxOpacity,
        },
        animation: {
          enable: true,
          sync: false,
          speed: opacityAnimationSpeed,
        },
      },
      size: {
        value: {
          min: minParticleSize || maxParticleSize / 1.5,
          max: maxParticleSize,
        },
      },
    },
    detectRetina: true,
    ...userOptions,
  };

  return (
    isEngineReady && (
      <Particles
        id={instanceId}
        options={mergedOptions}
        className={className}
      />
    )
  );
}