"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { cn } from "@/components/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  color: string;
  hue: number;
  phase: number;      // sin-wave phase for wobble
  wobble: number;     // horizontal oscillation amplitude
  depth: number;      // 0 (far) → 1 (close) — controls size & opacity
  glowIntensity: number;
  shimmerOffset: number;
  life: number;       // 0-1, decreases as bubble rises
  popped: boolean;
  popProgress: number;
}

export interface AnimatedBubbleParticlesProps {
  className?: string;
  /** Primary gradient color (hue start, 0-360) */
  colorHueStart?: number;
  /** Secondary gradient color (hue end, 0-360) */
  colorHueEnd?: number;
  /** Saturation of bubble colors (0-100) */
  saturation?: number;
  /** Lightness of bubble colors (0-100) */
  lightness?: number;
  /** Max number of simultaneous bubbles */
  maxBubbles?: number;
  /** Bubble spawn rate in ms */
  spawnInterval?: number;
  /** Min bubble radius in px */
  minRadius?: number;
  /** Max bubble radius in px */
  maxRadius?: number;
  /** Rise speed multiplier */
  speed?: number;
  /** Mouse push repulsion radius */
  mouseRepelRadius?: number;
  /** Enable mouse interaction */
  mouseInteraction?: boolean;
  /** Enable glow effect */
  enableGlow?: boolean;
  /** Enable pop animation on click */
  enablePop?: boolean;
  /** Background color (CSS value) */
  backgroundColor?: string;
  /** Z-index of the canvas layer */
  zIndex?: number;
  children?: React.ReactNode;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function createBubble(
  w: number,
  h: number,
  hueStart: number,
  hueEnd: number,
  sat: number,
  lit: number,
  minR: number,
  maxR: number
): Bubble {
  const depth = rand(0.15, 1);
  const baseRadius = lerp(minR, maxR, depth) * rand(0.7, 1.3);
  const hue = rand(hueStart, hueEnd);
  return {
    x: rand(baseRadius, w - baseRadius),
    y: h + baseRadius + rand(0, 80),
    vx: rand(-0.4, 0.4),
    vy: -rand(0.5, 1.8) * (0.4 + depth * 0.8),
    radius: baseRadius,
    baseRadius,
    opacity: rand(0.25, 0.7) * depth,
    color: `hsl(${hue}, ${sat}%, ${lit}%)`,
    hue,
    phase: rand(0, Math.PI * 2),
    wobble: rand(8, 40) * (1 - depth * 0.6),
    depth,
    glowIntensity: rand(6, 22) * depth,
    shimmerOffset: rand(0, Math.PI * 2),
    life: 1,
    popped: false,
    popProgress: 0,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const AnimatedBubbleParticles: React.FC<AnimatedBubbleParticlesProps> = ({
  className,
  colorHueStart = 200,
  colorHueEnd = 260,
  saturation = 80,
  lightness = 65,
  maxBubbles = 55,
  spawnInterval = 280,
  minRadius = 8,
  maxRadius = 55,
  speed = 1,
  mouseRepelRadius = 120,
  mouseInteraction = true,
  enableGlow = true,
  enablePop = true,
  backgroundColor = "transparent",
  zIndex = 0,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // ── Resize ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const w = container.clientWidth || container.offsetWidth || (typeof window !== "undefined" ? window.innerWidth : 0);
      const h = container.clientHeight || container.offsetHeight || (typeof window !== "undefined" ? window.innerHeight : 0);
      if (w > 0 && h > 0) {
        setDims({ w, h });
        if (canvasRef.current) {
          canvasRef.current.width = w;
          canvasRef.current.height = h;
        }
      }
    };

    // Initial check
    updateSize();

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        const w = Math.round(width) || container.clientWidth || container.offsetWidth;
        const h = Math.round(height) || container.clientHeight || container.offsetHeight;
        if (w > 0 && h > 0) {
          setDims({ w, h });
          if (canvasRef.current) {
            canvasRef.current.width = w;
            canvasRef.current.height = h;
          }
        }
      }
    });
    ro.observe(container);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateSize);
    }

    return () => {
      ro.disconnect();
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  // ── Mouse ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mouseInteraction) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    const onClick = (e: MouseEvent) => {
      if (!enablePop) return;
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      bubblesRef.current.forEach((b) => {
        const dx = b.x - cx;
        const dy = b.y - cy;
        if (Math.sqrt(dx * dx + dy * dy) < b.radius * 1.4 && !b.popped) {
          b.popped = true;
        }
      });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("click", onClick);
    };
  }, [mouseInteraction, enablePop]);

  // ── Draw bubble ─────────────────────────────────────────────────────────
  const drawBubble = useCallback(
    (ctx: CanvasRenderingContext2D, b: Bubble, t: number) => {
      if (b.popped) {
        // Pop burst — ring expanding
        const p = b.popProgress;
        const r = b.radius * (1 + p * 1.6);
        ctx.save();
        ctx.globalAlpha = (1 - p) * b.opacity * 1.2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = lerp(3, 0.5, p);
        ctx.stroke();
        // Spray dots
        for (let i = 0; i < 7; i++) {
          const angle = (i / 7) * Math.PI * 2 + p * 2;
          const dist = r * 0.9 * p;
          const sx = b.x + Math.cos(angle) * dist;
          const sy = b.y + Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.arc(sx, sy, lerp(3, 0.5, p), 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      const shimmer = Math.sin(t * 1.6 + b.shimmerOffset);
      const wobbleX = Math.sin(t * 0.9 + b.phase) * b.wobble * 0.1;

      // Glow
      if (enableGlow && b.glowIntensity > 0) {
        ctx.save();
        ctx.globalAlpha = b.opacity * 0.35;
        const glowGrad = ctx.createRadialGradient(
          b.x + wobbleX,
          b.y,
          b.radius * 0.1,
          b.x + wobbleX,
          b.y,
          b.radius + b.glowIntensity
        );
        glowGrad.addColorStop(0, b.color);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(
          b.x + wobbleX,
          b.y,
          b.radius + b.glowIntensity,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = clamp(b.opacity * (0.8 + shimmer * 0.2), 0, 1);

      // Main bubble body
      const bodyGrad = ctx.createRadialGradient(
        b.x + wobbleX - b.radius * 0.3,
        b.y - b.radius * 0.3,
        b.radius * 0.05,
        b.x + wobbleX,
        b.y,
        b.radius
      );
      bodyGrad.addColorStop(0, `hsla(${b.hue}, ${saturation}%, 95%, 0.9)`);
      bodyGrad.addColorStop(0.35, `${b.color}`);
      bodyGrad.addColorStop(0.75, `hsla(${b.hue + 20}, ${saturation}%, ${lightness - 15}%, 0.85)`);
      bodyGrad.addColorStop(1, `hsla(${b.hue + 40}, ${saturation}%, ${lightness - 25}%, 0.5)`);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(b.x + wobbleX, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Rim highlight
      ctx.strokeStyle = `hsla(${b.hue}, ${saturation}%, 95%, ${0.3 + shimmer * 0.15})`;
      ctx.lineWidth = clamp(b.radius * 0.07, 0.5, 2.5);
      ctx.stroke();

      // Inner specular highlight
      const specR = b.radius * 0.38;
      const specGrad = ctx.createRadialGradient(
        b.x + wobbleX - b.radius * 0.28,
        b.y - b.radius * 0.35,
        0,
        b.x + wobbleX - b.radius * 0.28,
        b.y - b.radius * 0.35,
        specR
      );
      specGrad.addColorStop(0, `rgba(255,255,255,${0.7 + shimmer * 0.15})`);
      specGrad.addColorStop(0.6, `rgba(255,255,255,0.12)`);
      specGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.arc(
        b.x + wobbleX - b.radius * 0.28,
        b.y - b.radius * 0.35,
        specR,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Bottom reflection
      const refGrad = ctx.createRadialGradient(
        b.x + wobbleX + b.radius * 0.2,
        b.y + b.radius * 0.5,
        0,
        b.x + wobbleX + b.radius * 0.2,
        b.y + b.radius * 0.5,
        b.radius * 0.25
      );
      refGrad.addColorStop(0, `rgba(255,255,255,0.18)`);
      refGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = refGrad;
      ctx.beginPath();
      ctx.arc(
        b.x + wobbleX + b.radius * 0.2,
        b.y + b.radius * 0.5,
        b.radius * 0.25,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    },
    [enableGlow, saturation, lightness]
  );

  // ── Main loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.w === 0 || dims.h === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    const { w, h } = dims;

    const tick = (ts: number) => {
      if (!running) return;
      const t = ts / 1000;

      // Spawn
      if (
        t - lastSpawnRef.current > spawnInterval / 1000 &&
        bubblesRef.current.length < maxBubbles
      ) {
        bubblesRef.current.push(
          createBubble(
            w,
            h,
            colorHueStart,
            colorHueEnd,
            saturation,
            lightness,
            minRadius,
            maxRadius
          )
        );
        lastSpawnRef.current = t;
      }

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active && mouseInteraction;

      // Update + draw (back-to-front by depth)
      bubblesRef.current.sort((a, b) => a.depth - b.depth);

      bubblesRef.current = bubblesRef.current.filter((b) => {
        if (b.popped) {
          b.popProgress += 0.055;
          drawBubble(ctx, b, t);
          return b.popProgress < 1;
        }

        // Physics
        const wobble = Math.sin(t * 0.9 + b.phase) * b.wobble * 0.012;
        b.x += b.vx + wobble;
        b.y += b.vy * speed;

        // Mouse repel
        if (mActive) {
          const dx = b.x - mx;
          const dy = b.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRepelRadius && dist > 0) {
            const force = ((mouseRepelRadius - dist) / mouseRepelRadius) * 1.8;
            b.vx += (dx / dist) * force * 0.06;
            b.vy += (dy / dist) * force * 0.04;
          }
        }

        // Velocity damping + drift correction
        b.vx *= 0.978;
        b.vy = lerp(b.vy, -rand(0.5, 1.8) * (0.4 + b.depth * 0.8) * speed, 0.015);

        // Boundary bounce
        const xOff = Math.sin(t * 0.9 + b.phase) * b.wobble * 0.1;
        if (b.x + xOff < b.radius || b.x + xOff > w - b.radius) {
          b.vx *= -0.5;
        }

        // Pulse radius
        b.radius = b.baseRadius * (1 + Math.sin(t * 1.1 + b.shimmerOffset) * 0.035);

        drawBubble(ctx, b, t);

        // Remove when fully off-screen top
        return b.y + b.radius > -80;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    dims,
    colorHueStart,
    colorHueEnd,
    saturation,
    lightness,
    maxBubbles,
    spawnInterval,
    minRadius,
    maxRadius,
    speed,
    mouseRepelRadius,
    mouseInteraction,
    enableGlow,
    drawBubble,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full min-w-[50vw] h-full", className)}
      style={{ backgroundColor, zIndex }}
    >
      <canvas
        ref={canvasRef}
        width={dims.w}
        height={dims.h}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {children && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export { AnimatedBubbleParticles };
export default AnimatedBubbleParticles;