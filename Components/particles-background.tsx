"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

export interface ParticlesBackgroundProps {
  /** Particle colors — picked randomly */
  colors?: string[];
  /** Base particle radius in px */
  size?: number;
  /** Number of particles on desktop (>1024px) */
  countDesktop?: number;
  /** Number of particles on tablet (768–1024px) */
  countTablet?: number;
  /** Number of particles on mobile (<768px) */
  countMobile?: number;
  /** z-index for the canvas layer */
  zIndex?: number;
  /** Additional className applied to the wrapper div */
  className?: string;
  /** Particle movement speed multiplier */
  speed?: number;
  /** Enable soft glow around each particle (GPU-accelerated sprite approach) */
  enableGlow?: boolean;
}

// ---------------------------------------------------------------------------
// Pre-bake one glow sprite per color into an OffscreenCanvas / HTMLCanvas.
// This runs ONCE per color. Every frame we just call drawImage() — a single
// GPU blit — instead of creating a RadialGradient or using shadowBlur.
// ---------------------------------------------------------------------------
function bakeSprite(color: string, spriteSize: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = spriteSize;
  c.height = spriteSize;
  const ctx = c.getContext("2d")!;
  const cx = spriteSize / 2;

  const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  grad.addColorStop(0.0, color);          // bright core
  grad.addColorStop(0.35, color + "aa");  // mid glow
  grad.addColorStop(0.7, color + "33");   // soft halo
  grad.addColorStop(1.0, color + "00");   // fully transparent edge

  ctx.beginPath();
  ctx.arc(cx, cx, cx, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  return c;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  colors = ["#ff223e", "#5d1eb2", "#ff7300"],
  size = 3,
  countDesktop = 60,
  countTablet = 50,
  countMobile = 40,
  zIndex = 0,
  className,
  speed = 1,
  enableGlow = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    // -----------------------------------------------------------------------
    // All mutable state lives outside React — zero re-renders during animation
    // -----------------------------------------------------------------------
    let w = 0, h = 0, dpr = 1;
    let count = 0;

    // Typed arrays — contiguous memory, cache-friendly, no GC pressure
    let px!: Float32Array;
    let py!: Float32Array;
    let pvx!: Float32Array;
    let pvy!: Float32Array;
    let pradius!: Float32Array;
    let palpha!: Float32Array;
    let pcolorIdx!: Uint8Array;

    // Pre-baked glow sprites (created once per unique color)
    let sprites: HTMLCanvasElement[] = [];

    let raf = 0;
    let running = true;

    // -----------------------------------------------------------------------
    // Build one sprite per color
    // -----------------------------------------------------------------------
    const buildSprites = () => {
      const spriteSize = Math.ceil(size * 3 * 8); // 8× radius for the glow halo
      sprites = colors.map((c) => bakeSprite(c, spriteSize));
    };

    // -----------------------------------------------------------------------
    // Initialise / re-initialise particle data
    // -----------------------------------------------------------------------
    const initParticles = () => {
      count = w > 1024 ? countDesktop : w > 768 ? countTablet : countMobile;
      px = new Float32Array(count);
      py = new Float32Array(count);
      pvx = new Float32Array(count);
      pvy = new Float32Array(count);
      pradius = new Float32Array(count);
      palpha = new Float32Array(count);
      pcolorIdx = new Uint8Array(count);

      for (let i = 0; i < count; i++) {
        px[i] = Math.random() * w;
        py[i] = Math.random() * h;
        pvx[i] = (Math.random() - 0.5) * 1.4 * speed;
        pvy[i] = (Math.random() - 0.5) * 1.4 * speed;
        pradius[i] = size * (0.6 + Math.random() * 0.8);
        palpha[i] = 0.55 + Math.random() * 0.45;
        pcolorIdx[i] = Math.floor(Math.random() * colors.length);
      }
    };

    // -----------------------------------------------------------------------
    // Resize: resets canvas pixel dimensions and re-spawns particles
    // -----------------------------------------------------------------------
    const resize = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;

      // Cap DPR at 2 — 3× rendering on hi-DPI screens kills perf for no gain
      dpr = Math.min(window.devicePixelRatio ?? 1, 2);

      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      // canvas.style already set to 100%/100% via CSS
      ctx.scale(dpr, dpr);

      w = cw;
      h = ch;
      initParticles();
    };

    // -----------------------------------------------------------------------
    // Main animation loop — tight, GC-free inner loop
    // -----------------------------------------------------------------------
    const tick = () => {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);

      if (enableGlow) {
        // --- Glow path: drawImage from pre-baked sprite (GPU blit) ----------
        for (let i = 0; i < count; i++) {
          px[i] += pvx[i];
          py[i] += pvy[i];

          const r = pradius[i];
          if (px[i] < r) { px[i] = r; pvx[i] = -pvx[i]; }
          else if (px[i] > w - r) { px[i] = w - r; pvx[i] = -pvx[i]; }
          if (py[i] < r) { py[i] = r; pvy[i] = -pvy[i]; }
          else if (py[i] > h - r) { py[i] = h - r; pvy[i] = -pvy[i]; }

          const sprite = sprites[pcolorIdx[i]];
          const drawSize = r * 8; // match sprite's 8× radius sizing
          const half = drawSize * 0.5;

          ctx.globalAlpha = palpha[i];
          ctx.drawImage(sprite, px[i] - half, py[i] - half, drawSize, drawSize);
        }
      } else {
        // --- Plain path: simple filled circles --------------------------------
        for (let i = 0; i < count; i++) {
          px[i] += pvx[i];
          py[i] += pvy[i];

          const r = pradius[i];
          if (px[i] < r) { px[i] = r; pvx[i] = -pvx[i]; }
          else if (px[i] > w - r) { px[i] = w - r; pvx[i] = -pvx[i]; }
          if (py[i] < r) { py[i] = r; pvy[i] = -pvy[i]; }
          else if (py[i] > h - r) { py[i] = h - r; pvy[i] = -pvy[i]; }

          ctx.globalAlpha = palpha[i];
          ctx.beginPath();
          ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
          ctx.fillStyle = colors[pcolorIdx[i]];
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    // -----------------------------------------------------------------------
    // Boot
    // -----------------------------------------------------------------------
    buildSprites();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [colors, size, countDesktop, countTablet, countMobile, speed, enableGlow]);

  return (
    <div
      ref={containerRef}
      className={cn(
        // Fills the parent completely — parent must have position:relative
        "absolute inset-0 w-full h-full overflow-hidden pointer-events-none",
        className
      )}
      style={{ zIndex, background: "transparent" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
          willChange: "transform", // promote to its own GPU compositing layer
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
