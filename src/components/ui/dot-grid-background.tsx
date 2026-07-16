"use client";
import React, { useEffect, useRef } from "react";

export interface DotGridBackgroundProps {
  /** Number of dot columns */
  cols?: number;
  /** Dot diameter in pixels */
  dotSize?: number;
  /** Spacing multiplier relative to dotSize */
  dotSpacing?: number;
  /** Dot fill color */
  dotColor?: string;
  /** Canvas background color */
  backgroundColor?: string;
  /** Radial scale falloff exponent */
  scaleFactor?: number;
  /** Inertia friction after drag (0–1) */
  inertiaDamping?: number;
  /** Enable inertia after drag */
  inertia?: boolean;
  /** Minimum dot scale floor */
  minScale?: number;
  /** Extra CSS classes on the wrapper */
  className?: string;
  /** Content layered above the grid */
  children?: React.ReactNode;
}

const DotGridBackground: React.FC<DotGridBackgroundProps> = ({
  cols = 20,
  dotSize = 12,
  dotSpacing = 3.6,
  dotColor,
  backgroundColor = "transparent",
  scaleFactor = 6,
  inertiaDamping = 0.92,
  inertia = true,
  minScale = 0.04,
  className = "",
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = dotSize * dotSpacing;
    // Grid must be at least 3× the container in BOTH axes for full drag range
    const MULTIPLIER = 3;

    // Resolve foreground color once per resize to avoid computedStyle overhead in draw loop
    let resolvedDotColor = dotColor || "#ffffff";

    // Compute dots based on measured container size
    let dots: Float32Array = new Float32Array(0);
    let gridW = 0;
    let gridH = 0;

    const buildGrid = (wW: number, wH: number) => {
      const totalCols = Math.ceil((wW * MULTIPLIER) / cellSize) + 2;
      const totalRows = Math.ceil((wH * MULTIPLIER) / (cellSize * 0.866)) + 2;
      gridW = totalCols * cellSize + cellSize;
      gridH = totalRows * cellSize * 0.866 + cellSize;

      dots = new Float32Array(totalCols * totalRows * 2);
      let di = 0;
      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          dots[di++] = c * cellSize + (r % 2 ? cellSize * 0.5 : 0) + cellSize * 0.5;
          dots[di++] = r * cellSize * 0.866 + cellSize * 0.5;
        }
      }
    };

    // Grid state
    const gridPos = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let isDragging = false;
    let dragStart = { mouseX: 0, mouseY: 0, gridX: 0, gridY: 0 };
    let lastMouse = { x: 0, y: 0 };
    let animId = 0;

    /** Clamp so the grid always covers the full container in X and Y */
    const clamp = (x: number, y: number) => {
      const wW = wrapper.clientWidth;
      const wH = wrapper.clientHeight;
      return {
        x: Math.min(0, Math.max(wW - gridW, x)),
        y: Math.min(0, Math.max(wH - gridH, y)),
      };
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(cx, cy) * 1.15;
      const gx = gridPos.x;
      const gy = gridPos.y;
      const halfDot = dotSize * 0.5;
      const margin = dotSize * 6;

      ctx.fillStyle = resolvedDotColor;

      for (let i = 0; i < dots.length; i += 2) {
        const sx = dots[i] + gx;
        const sy = dots[i + 1] + gy;
        if (sx < -margin || sx > width + margin) continue;
        if (sy < -margin || sy > height + margin) continue;

        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = Math.max(minScale, (1.05 - dist / maxDist) ** scaleFactor);
        if (scale < 0.005) continue;

        ctx.beginPath();
        ctx.arc(sx, sy, halfDot * scale, 0, 6.2832);
        ctx.fill();
      }
    };

    const updateColorAndDraw = () => {
      if (!dotColor) {
        resolvedDotColor = getComputedStyle(wrapper).color || "#ffffff";
      } else {
        resolvedDotColor = dotColor;
      }
      draw();
    };

    const resize = () => {
      const wW = wrapper.clientWidth;
      const wH = wrapper.clientHeight;
      canvas.width = wW;
      canvas.height = wH;
      buildGrid(wW, wH);
      const c = clamp((wW - gridW) / 2, (wH - gridH) / 2);
      gridPos.x = c.x;
      gridPos.y = c.y;
      updateColorAndDraw();
    };

    // Watch for theme changes (dark/light mode toggle on html element)
    const observer = new MutationObserver(() => updateColorAndDraw());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

    // Inertia loop
    const tick = () => {
      if (!isDragging && inertia) {
        const speed = Math.abs(velocity.x) + Math.abs(velocity.y);
        if (speed > 0.05) {
          velocity.x *= inertiaDamping;
          velocity.y *= inertiaDamping;
          const c = clamp(gridPos.x + velocity.x, gridPos.y + velocity.y);
          gridPos.x = c.x;
          gridPos.y = c.y;
          draw();
        }
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    // Pointer handlers
    const onDown = (e: PointerEvent) => {
      isDragging = true;
      velocity.x = 0;
      velocity.y = 0;
      dragStart = { mouseX: e.clientX, mouseY: e.clientY, gridX: gridPos.x, gridY: gridPos.y };
      lastMouse = { x: e.clientX, y: e.clientY };
      wrapper.style.cursor = "grabbing";
      wrapper.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      // Track velocity in BOTH axes for any-angle drag
      velocity.x = e.clientX - lastMouse.x;
      velocity.y = e.clientY - lastMouse.y;
      lastMouse = { x: e.clientX, y: e.clientY };
      const c = clamp(
        dragStart.gridX + e.clientX - dragStart.mouseX,
        dragStart.gridY + e.clientY - dragStart.mouseY,
      );
      gridPos.x = c.x;
      gridPos.y = c.y;
      draw();
    };

    const onUp = () => {
      isDragging = false;
      wrapper.style.cursor = "grab";
    };

    wrapper.addEventListener("pointerdown", onDown);
    wrapper.addEventListener("pointermove", onMove);
    wrapper.addEventListener("pointerup", onUp);
    wrapper.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", resize);

    resize();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      wrapper.removeEventListener("pointerdown", onDown);
      wrapper.removeEventListener("pointermove", onMove);
      wrapper.removeEventListener("pointerup", onUp);
      wrapper.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", resize);
    };
  }, [cols, dotSize, dotSpacing, dotColor, backgroundColor, scaleFactor, inertiaDamping, inertia, minScale]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full overflow-hidden cursor-grab select-none ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default DotGridBackground;
