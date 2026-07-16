"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface RaysBackgroundProps {
  theme?: "light" | "dark";
  animated?: boolean;
  animationSpeed?: number;
  opacity?: number;
  colors?: {
    purple?: string;
    yellow?: string;
    pink?: string;
    teal?: string;
    blue?: string;
  };
  blurAmount?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Performance notes:
 * - Framer Motion uses the Web Animations API (WAAPI) for `rotate`, running on
 *   the compositor thread with zero JS per frame.
 * - `filter: blur()` is only on a static non-animated outer div, so the GPU
 *   composites it once — never re-blurs a moving element.
 * - `useReducedMotion` respects system accessibility settings.
 * - `will-change: transform` on rotating divs promotes them to their own layer.
 * - `contain: layout style` isolates repaints without blocking compositing.
 * - blend modes (color-dodge, hard-light) are kept but on GPU-promoted layers
 *   so the browser can accelerate them via hardware blending on most GPUs.
 */
const RaysBackground: React.FC<RaysBackgroundProps> = ({
  theme = "dark",
  animated = true,
  animationSpeed = 1,
  opacity = 0.7,
  colors = {
    purple: "rgba(169, 73, 207, 1)",
    yellow: "rgba(238, 248, 86, 1)",
    pink: "rgba(248, 72, 202, 1)",
    teal: "rgba(119, 235, 195, 1)",
    blue: "rgba(77, 71, 214, 1)",
  },
  blurAmount = 6,
  children,
  className = "",
}) => {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animated && !prefersReduced;
  const isLightTheme = theme === "light";

  // Durations in seconds
  const cwDur = 10 / animationSpeed;
  const ccwDur = 8 / animationSpeed;
  const slowDur = 80 / animationSpeed;

  const radialMask =
    "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 1%, rgba(0,0,0,.7) 5%, rgba(0,0,0,.5) 10%, rgba(0,0,0,.3) 22%, rgba(0,0,0,.15) 35%, transparent 50%)";

  const colorMask =
    "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 6%, rgba(0,0,0,.7) 11%, rgba(0,0,0,.5) 18%, rgba(0,0,0,.3) 26%, rgba(0,0,0,.15) 35%, transparent 70%)";

  const innerColorMask =
    "radial-gradient(circle at 50% 50%, rgba(0,0,0,.9) 5%, rgba(0,0,0,.7) 13%, rgba(0,0,0,.5) 22%, rgba(0,0,0,.3) 29%, rgba(0,0,0,.15) 37%, transparent 46%)";

  const outerAccentMask =
    "radial-gradient(circle at 50% 50%, rgba(0,0,0,.9) 9%, rgba(0,0,0,.7) 17%, rgba(0,0,0,.5) 25%, rgba(0,0,0,.3) 33%, rgba(0,0,0,.15) 41%, transparent 50%)";

  // Per-direction typed animation configs
  const spinAnimate = (dir: 1 | -1) =>
    shouldAnimate ? { rotate: 360 * dir } : ({} as Record<string, never>);

  const spinTransition = (dur: number): Transition => shouldAnimate
    ? { repeat: Infinity, ease: "linear" as const, duration: dur }
    : {};

  const animatedStyle: React.CSSProperties = {
    willChange: shouldAnimate ? "transform" : "auto",
  };

  // Shared container style for the scaled ray group
  const rayGroupStyle = (blur?: number): React.CSSProperties => ({
    position: "absolute",
    width: "45%",
    height: "100%",
    top: "-50%",
    left: "50%",
    // Scale + center: this never changes so no repaint from transform
    transform: "translateX(-50%) scaleX(3.5) scaleY(3)",
    overflow: "hidden",
    pointerEvents: "none",
    // Blur on the STATIC wrapper — GPU composites this once
    ...(blur ? { filter: `blur(${blur}px)` } : {}),
    // Isolate this subtree's repaints
    contain: "layout style",
  });

  return (
    <div
      className={cn(
        "absolute left-0 top-0 w-full min-h-screen max-h-screen overflow-hidden bg-background",
        className
      )}
    >
      {/* ── Group 1: Light / Monochrome Rays ────────────────────────────── */}
      <div
        style={{
          ...rayGroupStyle(),
          mixBlendMode: isLightTheme ? "darken" : "normal",
        }}
      >
        {/* Static radial bg + masked container — no blur here */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(rgba(255,255,255,.6), rgba(0,0,0,.7))",
            overflow: "hidden",
            WebkitMaskImage: radialMask,
            maskImage: radialMask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            mixBlendMode: "color-burn",
            opacity: 0.6,
          }}
        >
          {/* CW spinning ray disc */}
          <motion.div
            animate={spinAnimate(1)}
            transition={spinTransition(cwDur)}
            style={{
              ...animatedStyle,
              position: "absolute",
              top: "50%",
              left: "50%",
              margin: "-100vmax",
              width: "200vmax",
              height: "200vmax",
              opacity: 0.45,
              background: `conic-gradient(
                from 20deg at 50% 50%,
                rgba(3,10,0,0.1), transparent,
                rgba(3,10,0,1), transparent,
                rgba(3,10,0,0.5), transparent,
                rgba(3,10,0,0.68), transparent,
                rgba(3,10,0,0.1), transparent,
                rgba(3,10,0,0.68), transparent,
                rgba(3,10,0,0.1)
              )`,
              mixBlendMode: "hard-light",
              WebkitMaskImage: radialMask,
              maskImage: radialMask,
            }}
          />

          {/* CCW spinning ray disc */}
          <motion.div
            animate={spinAnimate(-1)}
            transition={spinTransition(ccwDur)}
            style={{
              ...animatedStyle,
              position: "absolute",
              top: "50%",
              left: "50%",
              margin: "-100vmax",
              width: "200vmax",
              height: "200vmax",
              opacity: 0.45,
              background: `conic-gradient(
                from 0deg at 50% 50%,
                rgba(3,10,0,0.5), transparent,
                rgba(3,10,0,1), transparent,
                rgba(3,10,0,0.5), transparent,
                rgba(3,10,0,0.1), transparent,
                rgba(3,10,0,0.5)
              )`,
              mixBlendMode: "color-burn",
              WebkitMaskImage: radialMask,
              maskImage: radialMask,
            }}
          />
        </div>
      </div>

      {/* ── Group 2: Color Rays ──────────────────────────────────────────── */}
      {/* blur lives on THIS static wrapper — never re-blurs a moving element */}
      <div
        style={{
          ...rayGroupStyle(blurAmount),
          opacity: opacity,
          WebkitMaskImage: colorMask,
          maskImage: colorMask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          mixBlendMode: "hard-light",
        }}
      >
        {/* Primary color wheel — CCW */}
        <motion.div
          animate={spinAnimate(-1)}
          transition={spinTransition(ccwDur)}
          style={{
            ...animatedStyle,
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: `conic-gradient(
              from 90deg at 50% 50%,
              ${colors.purple},
              ${colors.yellow},
              ${colors.pink},
              ${colors.teal},
              ${colors.blue},
              ${colors.purple}
            )`,
            WebkitMaskImage: innerColorMask,
            maskImage: innerColorMask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            mixBlendMode: isLightTheme ? "overlay" : "color-dodge",
          }}
        />

        {/* Slow accent overlay — CCW */}
        <motion.div
          animate={spinAnimate(-1)}
          transition={spinTransition(slowDur)}
          style={{
            ...animatedStyle,
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "-1.5%",
            left: 0,
            background: `conic-gradient(
              from 45deg at 50% 50%,
              ${colors.blue},
              ${colors.purple},
              ${colors.teal},
              ${colors.pink},
              ${colors.yellow},
              ${colors.blue}
            )`,
            WebkitMaskImage: outerAccentMask,
            maskImage: outerAccentMask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            mixBlendMode: isLightTheme ? "hard-light" : "multiply",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default RaysBackground;