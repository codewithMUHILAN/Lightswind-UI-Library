"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MeteorData {
  id: number;
  top: number;
  left: number; // percentage
  animationDelay: string;
  animationDuration: number; // seconds
}

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  angle: number;   // radians
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

interface SplashEvent {
  id: number;
  x: number;
  y: number;
  particles: SplashParticle[];
  createdAt: number;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

let _uid = 0;
const uid = () => ++_uid;

// Converts the CSS meteor trajectory into an {x, y} pixel endpoint
// relative to the container given the meteor's left % and container size.
function getMeteorImpactPoint(
  leftPct: number,
  containerWidth: number,
  containerHeight: number,
  travelPx = 500
): { x: number; y: number } {
  // Meteor travels at rotate(215deg) which is 215° CW from the right = 35° below-left
  const angleRad = (215 * Math.PI) / 180;
  const dx = Math.cos(angleRad) * travelPx;
  const dy = Math.sin(angleRad) * travelPx;

  const startX = (leftPct / 100) * containerWidth;
  const startY = 0;

  return { x: startX + dx, y: startY + dy };
}

// Build splash particles spreading outward from the impact axis
function buildSplashParticles(
  x: number,
  y: number,
  count: number,
  splashColors: string[]
): SplashParticle[] {
  const particles: SplashParticle[] = [];
  for (let i = 0; i < count; i++) {
    // Spread primarily upward (like water hitting a surface and diffracting up)
    // Angular range: mostly going upward and sideways
    const baseAngle = -Math.PI / 2; // straight up
    const spread = Math.PI * 1.1;   // 198° spread
    const angle = baseAngle + (Math.random() - 0.5) * spread;

    particles.push({
      id: uid(),
      x,
      y,
      angle,
      speed: 40 + Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      opacity: 0.7 + Math.random() * 0.3,
      color: splashColors[Math.floor(Math.random() * splashColors.length)],
    });
  }
  return particles;
}

// ─── Splash Rendering ────────────────────────────────────────────────────────

interface SplashEffectProps {
  splash: SplashEvent;
  splashComponent?: React.ComponentType<SplashParticleProps>;
  splashDuration: number;
}

interface SplashParticleProps {
  particle: SplashParticle;
  progress: number; // 0–1 lifetime progress
}

const DefaultSplashParticle: React.FC<SplashParticleProps> = ({ particle, progress }) => {
  const ease = 1 - Math.pow(progress, 2);
  const x = particle.x + Math.cos(particle.angle) * particle.speed * progress;
  const y = particle.y + Math.sin(particle.angle) * particle.speed * progress
    + 60 * progress * progress; // gravity droop

  const opacity = particle.opacity * (1 - progress);
  const blur = progress > 0.5 ? `blur(${(progress - 0.5) * 4}px)` : "none";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: particle.size,
        height: particle.size * (1 + ease * 2.5), // elongate when fast
        borderRadius: "50%",
        backgroundColor: particle.color,
        opacity,
        filter: blur,
        transform: `rotate(${particle.angle * (180 / Math.PI) + 90}deg)`,
        pointerEvents: "none",
        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
      }}
    />
  );
};

const SplashEffect: React.FC<SplashEffectProps> = ({
  splash,
  splashComponent: SplashComp,
  splashDuration,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const e = now - startRef.current;
      setElapsed(e);
      if (e < splashDuration) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [splashDuration]);

  const progress = Math.min(elapsed / splashDuration, 1);
  const Component = SplashComp ?? DefaultSplashParticle;

  return (
    <>
      {splash.particles.map((p) => (
        <Component key={p.id} particle={p} progress={progress} />
      ))}
    </>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export interface MeteorsProps {
  /** Number of meteors. @default 20 */
  number?: number;
  /** Extra className on each meteor span. */
  className?: string;
  /** Enable splash-on-border-collision effect. @default true */
  enableSplash?: boolean;
  /** Number of splash droplets per impact. @default 18 */
  splashCount?: number;
  /** How long each splash lives in ms. @default 700 */
  splashDuration?: number;
  /** Colors for splash droplets. */
  splashColors?: string[];
  /**
   * Custom React component rendered for each splash droplet.
   * Receives `particle` (static data) and `progress` (0→1 lifetime).
   */
  splashComponent?: React.ComponentType<SplashParticleProps>;
  /**
   * CSS selector or ref for the element whose border acts as the
   * collision surface. If omitted the parent element is used.
   */
  collisionTarget?: React.RefObject<HTMLElement | null>;
}

export type { SplashParticleProps };

export const Meteors: React.FC<MeteorsProps> = ({
  number = 20,
  className,
  enableSplash = true,
  splashCount = 18,
  splashDuration = 700,
  splashColors = [
    "#93c5fd", "#60a5fa", "#3b82f6",
    "#a5f3fc", "#67e8f9", "#ffffff",
    "#e2e8f0",
  ],
  splashComponent,
  collisionTarget,
}) => {
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const [splashes, setSplashes] = useState<SplashEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const meteorTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Build meteor list
  useEffect(() => {
    const count = number || 20;
    const generated: MeteorData[] = new Array(count).fill(null).map((_, i) => ({
      id: uid(),
      top: 0,
      left: Math.floor(Math.random() * 140 - 20),
      animationDelay: (Math.random() * 0.6 + 0.2).toFixed(2) + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2),
    }));
    setMeteors(generated);
    return () => {
      meteorTimersRef.current.forEach((t) => clearTimeout(t));
      meteorTimersRef.current.clear();
    };
  }, [number]);

  // Collision detection via timeout-based approach
  // We register a scheduled impact for each meteor based on its duration
  const scheduleImpact = useCallback(
    (meteor: MeteorData, containerEl: HTMLElement) => {
      const delay = parseFloat(meteor.animationDelay) * 1000;
      const duration = meteor.animationDuration * 1000;

      // Where in the container does this meteor reach the border?
      const rect = containerEl.getBoundingClientRect();
      const targetEl = collisionTarget?.current ?? containerEl;
      const targetRect = targetEl.getBoundingClientRect();

      // Approximate: meteor starts at top of container at `left%`
      // and travels 500px along 215° — find where it intersects the border
      const startX = (meteor.left / 100) * rect.width;

      // Travel per second
      const travelPx = 500;
      const angleRad = (215 * Math.PI) / 180;
      const dx = Math.cos(angleRad) * travelPx;
      const dy = Math.sin(angleRad) * travelPx;

      // Relative to container, target bounds
      const tLeft = targetRect.left - rect.left;
      const tTop = targetRect.top - rect.top;
      const tRight = tLeft + targetRect.width;
      const tBottom = tTop + targetRect.height;

      // Find t (0..1) where meteor hits any edge of the target
      // Ray: P = (startX, 0) + t * (dx, dy) for t in [0,1] → tPx in travel
      let impactT: number | null = null;
      let impactX = 0;
      let impactY = 0;

      // Check top edge: y = tTop → t = tTop / dy
      if (dy !== 0) {
        const t = tTop / dy;
        const x = startX + dx * t;
        if (t >= 0 && t <= 1 && x >= tLeft && x <= tRight) {
          if (impactT === null || t < impactT) { impactT = t; impactX = x; impactY = tTop; }
        }
      }
      // Check bottom edge: y = tBottom
      if (dy !== 0) {
        const t = tBottom / dy;
        const x = startX + dx * t;
        if (t >= 0 && t <= 1 && x >= tLeft && x <= tRight) {
          if (impactT === null || t < impactT) { impactT = t; impactX = x; impactY = tBottom; }
        }
      }
      // Check left edge: x = tLeft → t = (tLeft - startX) / dx
      if (dx !== 0) {
        const t = (tLeft - startX) / dx;
        const y = dy * t;
        if (t >= 0 && t <= 1 && y >= tTop && y <= tBottom) {
          if (impactT === null || t < impactT) { impactT = t; impactX = tLeft; impactY = y; }
        }
      }
      // Check right edge: x = tRight
      if (dx !== 0) {
        const t = (tRight - startX) / dx;
        const y = dy * t;
        if (t >= 0 && t <= 1 && y >= tTop && y <= tBottom) {
          if (impactT === null || t < impactT) { impactT = t; impactX = tRight; impactY = y; }
        }
      }

      if (impactT === null) return; // meteor doesn't hit this target

      // Time offset within the animation when impact happens
      const impactTimeInAnimation = duration * impactT;

      // Schedule splash, accounting for animation delay and looping
      const fireAt = delay + impactTimeInAnimation;

      const timer = setTimeout(() => {
        const particles = buildSplashParticles(impactX, impactY, splashCount, splashColors);
        const event: SplashEvent = { id: uid(), x: impactX, y: impactY, particles, createdAt: Date.now() };
        setSplashes((prev) => [...prev, event]);

        // Remove splash after it finishes
        setTimeout(() => {
          setSplashes((prev) => prev.filter((s) => s.id !== event.id));
        }, splashDuration + 100);

        // Reschedule for next loop
        const loopTimer = setInterval(() => {
          const newParticles = buildSplashParticles(impactX, impactY, splashCount, splashColors);
          const newEvent: SplashEvent = { id: uid(), x: impactX, y: impactY, particles: newParticles, createdAt: Date.now() };
          setSplashes((prev) => [...prev, newEvent]);
          setTimeout(() => {
            setSplashes((prev) => prev.filter((s) => s.id !== newEvent.id));
          }, splashDuration + 100);
        }, duration);

        // Clean up on unmount
        meteorTimersRef.current.set(meteor.id, loopTimer as any);
      }, fireAt);

      meteorTimersRef.current.set(meteor.id, timer);
    },
    [collisionTarget, splashColors, splashCount, splashDuration]
  );

  // Schedule impacts once meteors are generated
  useEffect(() => {
    if (!enableSplash || meteors.length === 0) return;

    const containerEl = containerRef.current;
    if (!containerEl) return;

    // Small delay to let the DOM settle and get accurate rects
    const setup = setTimeout(() => {
      meteors.forEach((m) => scheduleImpact(m, containerEl));
    }, 50);

    return () => {
      clearTimeout(setup);
      meteorTimersRef.current.forEach((t) => clearTimeout(t));
      meteorTimersRef.current.clear();
    };
  }, [meteors, enableSplash, scheduleImpact]);

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes meteor {
          0%   { transform: rotate(215deg) translateX(0); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
        }
        .animate-meteor-effect {
          animation-name: meteor;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Splash layer – rendered below meteors but above content */}
      {enableSplash && (
        <div
          ref={containerRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 5,
          }}
        >
          {splashes.map((splash) => (
            <SplashEffect
              key={splash.id}
              splash={splash}
              splashComponent={splashComponent}
              splashDuration={splashDuration}
            />
          ))}
        </div>
      )}

      {/* Meteors */}
      {meteors.map((el) => (
        <span
          key={"meteor" + el.id}
          style={{
            top: el.top,
            left: el.left + "%",
            animationDelay: el.animationDelay,
            animationDuration: el.animationDuration + "s",
          }}
          className={cn(
            "animate-meteor-effect absolute h-[0.1rem] w-[0.1rem] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
        />
      ))}
    </>
  );
};
