"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export type CursorPole = "north" | "south" | "none";

interface MagneticFieldProps {
  gridScale?: number;         // Cell spacing in pixels (e.g. 25)
  needleLength?: number;      // Length of compass needles in pixels (e.g. 12)
  particleCount?: number;     // Number of flowing tracer particles
  particleSpeed?: number;     // Speed of tracers
  cursorMode?: CursorPole;    // Cursor pole type: North (Attractor) or South (Repeller)
  interactive?: boolean;
  baseColor?: string;         // Default needle color
  accentColor?: string;       // Active pole region needle color
  className?: string;
  isInView?: boolean;
}

interface Pole {
  x: number;
  y: number;
  vx: number;
  vy: number;
  strength: number; // positive = North (Attractor/Source), negative = South (Sink/Repeller)
}

interface Tracer {
  x: number;
  y: number;
  history: { x: number; y: number }[]; // Trail path coordinates
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FluxRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

// Classic 2D Perlin Noise Permutation Table Setup
const perm = new Uint8Array(512);
const grad2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1]
];

const initNoise = () => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let seed = 99;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x80000000;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
  }
};
initNoise();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);

const noise2D = (x: number, y: number) => {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[X] + Y];
  const ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X] + 1 + Y];
  const bb = perm[perm[X] + 1 + Y + 1];

  const g_aa = grad2[aa & 7];
  const g_ab = grad2[ab & 7];
  const g_ba = grad2[ba & 7];
  const g_bb = grad2[bb & 7];

  const n_aa = g_aa[0] * xf + g_aa[1] * yf;
  const n_ba = g_ba[0] * (xf - 1) + g_ba[1] * yf;
  const n_ab = g_ab[0] * xf + g_ab[1] * (yf - 1);
  const n_bb = g_bb[0] * (xf - 1) + g_bb[1] * (yf - 1);

  const x1 = lerp(u, n_aa, n_ba);
  const x2 = lerp(u, n_ab, n_bb);

  return lerp(v, x1, x2);
};

const MagneticFieldBackground: React.FC<MagneticFieldProps> = ({
  gridScale = 26,
  needleLength = 13,
  particleCount = 100,      // More particles for richer animation
  particleSpeed = 1.7,
  cursorMode = "south",
  interactive = true,
  baseColor = "#64748b",   // slate-500
  accentColor = "#00f0ff", // cyan
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isDarkModeRef = useRef(true);

  // Mouse coordinate refs
  const mouseRef = useRef({
    x: 0,
    y: 0,
    active: false,
    radius: 200,
  });

  // Monitor theme alterations
  useEffect(() => {
    const checkTheme = () => {
      isDarkModeRef.current = document.documentElement.classList.contains("dark");
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let poles: Pole[] = [];
    let tracers: Tracer[] = [];
    let rings: FluxRing[] = [];
    let ringTimer = 0;
    let lastTime = performance.now();
    let time = 0;
    let poleFactor = 1.0;
    let isMouseMoving = false;
    let mouseMoveTimeout: ReturnType<typeof setTimeout> | undefined;

    // Helper: Calculate magnetic field vector B = (Bx, By) at coordinate (x, y)
    const getFieldAt = (x: number, y: number, mouseActive: boolean, mouseX: number, mouseY: number) => {
      let Bx = 0;
      let By = 0;

      // Add contributions from drifting poles
      for (let i = 0; i < poles.length; i++) {
        const p = poles[i];
        const dx = x - p.x;
        const dy = y - p.y;
        const distSq = dx * dx + dy * dy + 1500; // soften center
        const dist = Math.sqrt(distSq);

        const force = (p.strength * poleFactor) / distSq;
        Bx += (dx / dist) * force;
        By += (dy / dist) * force;
      }

      // Add contribution from active cursor pole
      if (interactive && mouseActive && cursorMode !== "none") {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distSq = dx * dx + dy * dy + 2000;
        const dist = Math.sqrt(distSq);

        const strength = cursorMode === "north" ? 28000 : -28000;
        const force = strength / distSq;
        Bx += (dx / dist) * force;
        By += (dy / dist) * force;
      }

      const strength = Math.sqrt(Bx * Bx + By * By);
      const angle = Math.atan2(By, Bx);

      return { Bx, By, angle, strength };
    };

    const initializeEntities = (width: number, height: number) => {
      // Create drifting poles (1 North, 1 South, 1 Weak North)
      poles = [
        { x: width * 0.25, y: height * 0.35, vx: 0.35, vy: -0.22, strength: 16000 },  // N (Source)
        { x: width * 0.75, y: height * 0.65, vx: -0.28, vy: 0.38, strength: -16000 }, // S (Sink)
        { x: width * 0.5, y: height * 0.5, vx: 0.18, vy: -0.18, strength: 8000 },    // Weak N
      ];

      // Initialize flow tracers
      tracers = [];
      for (let i = 0; i < particleCount; i++) {
        tracers.push(resetTracer(width, height));
      }
      rings = [];
    };

    const resetTracer = (width: number, height: number): Tracer => {
      let spawnX = Math.random() * width;
      let spawnY = Math.random() * height;

      const mouse = mouseRef.current;
      const spawnAtMouse = interactive && mouse.active && cursorMode === "north" && (Math.random() < 0.6 || poleFactor < 0.3);

      if (spawnAtMouse) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 5 + Math.random() * 45;
        spawnX = mouse.x + Math.cos(angle) * dist;
        spawnY = mouse.y + Math.sin(angle) * dist;
      } else {
        const northPoles = poles.filter(p => p.strength > 0);
        if (northPoles.length > 0 && poleFactor > 0.15) {
          const source = northPoles[Math.floor(Math.random() * northPoles.length)];
          const angle = Math.random() * Math.PI * 2;
          const dist = 5 + Math.random() * 55;
          spawnX = source.x + Math.cos(angle) * dist;
          spawnY = source.y + Math.sin(angle) * dist;
        }
      }

      return {
        x: spawnX,
        y: spawnY,
        history: [{ x: spawnX, y: spawnY }],
        life: 0,
        maxLife: 100 + Math.floor(Math.random() * 120),
        color: Math.random() > 0.5 ? accentColor : "#a855f7",
        size: 0.8 + Math.random() * 0.8,
      };
    };

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        initializeEntities(width, height);
      }
    };

    resizeCanvas();

    // Mouse Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;

      isMouseMoving = true;
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
      mouseMoveTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 1500);
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      isMouseMoving = false;
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    const render = () => {
      if (!isInView) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const isDark = isDarkModeRef.current;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt;

      // Clean background
      ctx.clearRect(0, 0, width, height);

      // Move poles inside screen bounds
      for (let i = 0; i < poles.length; i++) {
        const p = poles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < width * 0.1 || p.x > width * 0.9) p.vx *= -1;
        if (p.y < height * 0.1 || p.y > height * 0.9) p.vy *= -1;
      }

      const mouse = mouseRef.current;

      // Interpolate poleFactor: 0 if mouse is active and moving, 1 otherwise
      const targetFactor = (mouse.active && isMouseMoving) ? 0.0 : 1.0;
      poleFactor += (targetFactor - poleFactor) * 0.08;

      // Theme-adaptive colors
      const finalBaseColor = isDark ? baseColor : "#94a3b8"; // slate-400
      const finalAccentColor = isDark ? accentColor : "#0284c7"; // deep sky blue
      const secondaryColor = isDark ? "#d946ef" : "#7c3aed"; // magenta-pink remapping

      // 1. Spawning concentric expanding Flux Rings
      ringTimer += dt;
      if (ringTimer > 1.3) {
        ringTimer = 0;
        if (poleFactor > 0.5) {
          poles.forEach(p => {
            rings.push({
              x: p.x,
              y: p.y,
              radius: 10,
              maxRadius: 160 + Math.random() * 80,
              opacity: 1.0,
              color: p.strength > 0 ? finalAccentColor : secondaryColor,
            });
          });
        }
      }

      // Draw Flux Rings
      ctx.lineWidth = 0.6;
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.radius += 1.3;
        r.opacity = (1.0 - r.radius / r.maxRadius) * poleFactor;

        if (r.opacity <= 0) {
          rings.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = r.color;
        ctx.globalAlpha = r.opacity * (isDark ? 0.08 : 0.05);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // 2. Draw Force Poles glowing halos
      if (poleFactor > 0.01) {
        for (let i = 0; i < poles.length; i++) {
          const p = poles[i];
          const isNorth = p.strength > 0;
          
          ctx.beginPath();
          const pulse = 1.0 + Math.sin(time * 3 + i) * 0.15;
          const radius = Math.max(0.1, 28 * pulse * poleFactor);
          const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, radius);
          
          if (isNorth) {
            grad.addColorStop(0, isDark ? `rgba(0, 240, 255, ${0.22 * poleFactor})` : `rgba(2, 132, 199, ${0.18 * poleFactor})`);
            grad.addColorStop(1, "rgba(0, 240, 255, 0)");
          } else {
            grad.addColorStop(0, isDark ? `rgba(217, 70, 239, ${0.22 * poleFactor})` : `rgba(124, 58, 237, ${0.18 * poleFactor})`);
            grad.addColorStop(1, "rgba(217, 70, 239, 0)");
          }
          
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Cursor halo
      if (interactive && mouse.active && cursorMode !== "none") {
        ctx.beginPath();
        const pulse = 1.0 + Math.sin(time * 5) * 0.1;
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 2, mouse.x, mouse.y, 40 * pulse);
        
        if (cursorMode === "north") {
          grad.addColorStop(0, isDark ? "rgba(0, 240, 255, 0.26)" : "rgba(2, 132, 199, 0.22)");
          grad.addColorStop(1, "rgba(0, 240, 255, 0)");
        } else {
          grad.addColorStop(0, isDark ? "rgba(217, 70, 239, 0.26)" : "rgba(124, 58, 237, 0.22)");
          grad.addColorStop(1, "rgba(217, 70, 239, 0)");
        }
        
        ctx.fillStyle = grad;
        ctx.arc(mouse.x, mouse.y, 40 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render Compass Grid with Quadratic Needles & Jittered coordinates
      ctx.lineWidth = 0.9;
      for (let y = gridScale / 2; y < height; y += gridScale) {
        for (let x = gridScale / 2; x < width; x += gridScale) {
          
          // Coordinate jitter to make layout look organic/molecular
          const seedX = (x * 12.9898 + y * 78.233) * 43758.5453;
          const jitterX = (seedX - Math.floor(seedX) - 0.5) * 5.0; // +/-2.5px jitter
          
          const seedY = (y * 12.9898 + x * 78.233) * 43758.5453;
          const jitterY = (seedY - Math.floor(seedY) - 0.5) * 5.0;

          const cx = x + jitterX;
          const cy = y + jitterY;

          // Organic Perlin noise sway
          const sway = noise2D(cx * 0.002, cy * 0.002 + time * 0.12) * 0.28;

          // Find distance to closest North Pole (source) to calculate wave pulse
          let minSourceDist = Infinity;
          if (poleFactor > 0.15) {
            for (let i = 0; i < poles.length; i++) {
              if (poles[i].strength > 0) {
                const dx = cx - poles[i].x;
                const dy = cy - poles[i].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < minSourceDist) minSourceDist = d;
              }
            }
          }
          if (interactive && mouse.active && cursorMode === "north") {
            const dx = cx - mouse.x;
            const dy = cy - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minSourceDist) minSourceDist = d;
          }

          // Calculate light wave propagation pulsing along field direction
          const wave = minSourceDist === Infinity ? 0.5 : Math.sin(minSourceDist * 0.024 - time * 5.5) * 0.5 + 0.5;

          const field = getFieldAt(cx, cy, mouse.active, mouse.x, mouse.y);
          const t = Math.min(field.strength * 1.8, 1.0);
          
          ctx.strokeStyle = t > 0.3
            ? (t > 0.7 ? finalAccentColor : secondaryColor)
            : finalBaseColor;

          const len = needleLength * (0.75 + wave * 0.55);
          ctx.globalAlpha = (isDark ? (0.16 + t * 0.44) : (0.08 + t * 0.3)) * (0.35 + wave * 0.65);

          // Calculate start & end points centered around (cx, cy)
          const finalAngle = field.angle + sway;
          const cos = Math.cos(finalAngle);
          const sin = Math.sin(finalAngle);

          // Quadratic curve endpoints: bend lines slightly along the field curvature
          // Calculate B field direction slightly offset forwards and backwards
          const step = len / 2;
          const ax = cx + cos * step;
          const ay = cy + sin * step;
          const bx = cx - cos * step;
          const by = cy - sin * step;

          // Calculate a control point shifted slightly towards the perpendicular vector
          const perpX = -sin * (len * 0.16); // curvature bending multiplier
          const perpY = cos * (len * 0.16);
          const controlX = cx + perpX;
          const controlY = cy + perpY;

          // Render curved vector needle
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(controlX, controlY, ax, ay);
          ctx.stroke();

          // Draw micro terminal dot
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(ax, ay, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;

      // 4. Move & Render Flow Tracer Ribbon Trails
      for (let i = 0; i < tracers.length; i++) {
        const t = tracers[i];
        const field = getFieldAt(t.x, t.y, mouse.active, mouse.x, mouse.y);

        if (field.strength < 0.01) {
          tracers[i] = resetTracer(width, height);
          continue;
        }

        // Travel along magnetic lines of force
        const vx = (field.Bx / field.strength) * particleSpeed;
        const vy = (field.By / field.strength) * particleSpeed;

        t.x += vx;
        t.y += vy;
        t.life++;

        // Store history coordinate path
        t.history.push({ x: t.x, y: t.y });
        if (t.history.length > 5) {
          t.history.shift();
        }

        let nearSink = false;
        if (poleFactor > 0.15) {
          const southPoles = poles.filter(p => p.strength < 0);
          for (let j = 0; j < southPoles.length; j++) {
            const s = southPoles[j];
            const dx = t.x - s.x;
            const dy = t.y - s.y;
            if (dx * dx + dy * dy < 480) {
              nearSink = true;
              break;
            }
          }
        }

        if (interactive && mouse.active && cursorMode === "south") {
          const dx = t.x - mouse.x;
          const dy = t.y - mouse.y;
          if (dx * dx + dy * dy < 580) {
            nearSink = true;
          }
        }

        if (t.life >= t.maxLife || nearSink || t.x < 0 || t.x > width || t.y < 0 || t.y > height) {
          tracers[i] = resetTracer(width, height);
          continue;
        }

        const alpha = Math.sin((t.life / t.maxLife) * Math.PI) * 0.85;
        const mappedColor = t.color === accentColor ? finalAccentColor : secondaryColor;

        // Render continuous ribbon trail connecting the history array points
        if (t.history.length > 1) {
          // Three-pass volumetric ribbon pipeline:
          
          // 1. Glow outer sheath
          ctx.beginPath();
          ctx.moveTo(t.history[0].x, t.history[0].y);
          for (let k = 1; k < t.history.length; k++) {
            ctx.lineTo(t.history[k].x, t.history[k].y);
          }
          ctx.strokeStyle = mappedColor;
          ctx.lineWidth = t.size * 3.8;
          ctx.globalAlpha = isDark ? alpha * 0.16 : alpha * 0.12;
          ctx.stroke();

          // 2. Vibrant core fiber
          ctx.beginPath();
          ctx.moveTo(t.history[0].x, t.history[0].y);
          for (let k = 1; k < t.history.length; k++) {
            ctx.lineTo(t.history[k].x, t.history[k].y);
          }
          ctx.strokeStyle = mappedColor;
          ctx.lineWidth = t.size * 1.5;
          ctx.globalAlpha = isDark ? alpha * 0.7 : alpha * 0.6;
          ctx.stroke();

          // 3. Hot laser core
          ctx.beginPath();
          ctx.moveTo(t.history[0].x, t.history[0].y);
          for (let k = 1; k < t.history.length; k++) {
            ctx.lineTo(t.history[k].x, t.history[k].y);
          }
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = t.size * 0.6;
          ctx.globalAlpha = alpha * 0.95;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [gridScale, needleLength, particleCount, particleSpeed, cursorMode, interactive, baseColor, accentColor, isInView]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          display: "block",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
};

export default MagneticFieldBackground;
