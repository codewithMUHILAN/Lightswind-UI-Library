"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface SparkleCursorProps {
  /** Distance in pixels between sparkles */
  distance?: number;
  /** Whether to show a glow behind the cursor */
  glow?: boolean;
}

export const SparkleCursor = ({ distance = 50, glow = true }: SparkleCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resize
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    // SVG Star
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="hsl(40 90% 80%)">
        <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />
      </svg>
    `;
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;

    let parts: any[] = [];
    let glows: any[] = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const g of glows) {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size * g.scale, 0, Math.PI * 2);
        ctx.fillStyle = "hsl(265 90% 80% / 0.2)";
        ctx.fill();
      }

      for (const part of parts) {
        ctx.save();
        ctx.globalAlpha = part.alpha;
        ctx.filter = `brightness(${part.sy < 0 ? part.b + 0.5 : part.b})`;

        // Scale coordinates for devicePixelRatio
        const x = part.x * window.devicePixelRatio;
        const y = part.y * window.devicePixelRatio;
        
        ctx.translate(x, y);
        ctx.rotate(part.r * (Math.PI / 180));
        ctx.scale(1, part.sy);

        const size = part.size * part.scale * window.devicePixelRatio;

        ctx.drawImage(img, size * -0.5, size * -0.5, size, size);
        ctx.restore();
      }
    };

    let distCounter = 0;
    let lastPoint: [number, number] | null = null;

    const paint = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastPoint) {
        const dist = Math.hypot(x - lastPoint[0], y - lastPoint[1]);
        if (!Number.isNaN(dist)) distCounter += dist;
      }
      lastPoint = [x, y];

      if (glow) {
        const g = {
          id: `glow--${Date.now()}-${Math.random()}`,
          size: 30,
          scale: 1,
          x: x * window.devicePixelRatio,
          y: y * window.devicePixelRatio,
        };
        gsap.to(g, {
          duration: 0.2,
          scale: 0,
          onComplete: () => {
            glows = glows.filter((glow) => glow.id !== g.id);
          },
        });
        glows.push(g);
      }

      if (distCounter >= distance) {
        distCounter = 0;

        const newPart = {
          id: Date.now() + Math.random(),
          x,
          y,
          sy: Math.random() > 0.5 ? 1 : -1,
          b: gsap.utils.random(0.5, 1.5),
          r: gsap.utils.random(0, 359, 1),
          hue: gsap.utils.random(0, 359, 1),
          size: gsap.utils.random(10, 40, 1),
          scale: 1,
          alpha: 1,
        };

        const spin = gsap.to(newPart, {
          sy: newPart.sy < 0 ? 1 : -1,
          duration: gsap.utils.random(0.1, 0.5),
          repeat: gsap.utils.random(0, 10, 1),
        });

        gsap.to(newPart, {
          duration: gsap.utils.random(0.5, 2.5),
          r: newPart.r + gsap.utils.random(-45, 45, 1),
          y: y + gsap.utils.random(50, 350, 1),
          alpha: 0,
          scale: 0,
          onComplete: () => {
            spin.kill();
            parts = parts.filter((p) => p.id !== newPart.id);
          },
        });
        
        parts.push(newPart);
      }
    };

    window.addEventListener("pointermove", paint);
    gsap.ticker.add(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", paint);
      gsap.ticker.remove(render);
    };
  }, [distance, glow]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999]"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default SparkleCursor;
