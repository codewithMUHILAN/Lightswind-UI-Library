"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { cn } from "@/components/lib/utils";

export interface AnimatedWaveProps {
  className?: string;
  /** Primary wave color from (CSS hex or RGB) */
  colorFrom?: string;
  /** Secondary wave color to (CSS hex or RGB) */
  colorTo?: string;
  /** Wave animation speed factor (default: 0.8) */
  speed?: number;
  /** Wave amplitude scale (default: 20) */
  amplitude?: number;
  /** Show wireframe mesh lines (default: true) */
  wireframe?: boolean;
  /** Show floating particle points (default: true) */
  showParticles?: boolean;
  /** Size of the particle dots (default: 4) */
  particleSize?: number;
  /** Grid segments resolution (default: 60) */
  resolution?: number;
  /** Enable mouse interactive sways and ripples (default: true) */
  mouseInteraction?: boolean;
  /** Background color override (default: transparent) */
  backgroundColor?: string;
  /** Wave opacity (default: 0.6) */
  opacity?: number;
  /** Camera X coordinate (default: 0) */
  cameraX?: number;
  /** Camera Y coordinate (default: 160) */
  cameraY?: number;
  /** Camera Z coordinate (default: 250) */
  cameraZ?: number;
}

// Helper to create circular particle texture
const createCircleTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  return new THREE.CanvasTexture(canvas);
};

export const AnimatedWave: React.FC<AnimatedWaveProps> = ({
  className,
  colorFrom = "#6366f1", // indigo
  colorTo = "#06b6d4",   // cyan
  speed = 0.8,
  amplitude = 25,
  wireframe = true,
  showParticles = true,
  particleSize = 5,
  resolution = 70,
  mouseInteraction = true,
  backgroundColor = "transparent",
  opacity = 0.6,
  cameraX = 0,
  cameraY = 160,
  cameraZ = 250,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions based on parent container client size
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // 1. Create Scene
    const scene = new THREE.Scene();

    // 2. Create Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 3000);
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(0, 0, 0);

    // 3. Create WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: "mediump",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL initialization failed", e);
      setWebGLFailed(true);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 1000);
    pointLight.position.set(0, 300, 200);
    scene.add(pointLight);

    // 5. Geometry setup (wide spacing to fully cover background borders)
    const gridSize = resolution;
    const gridSpacing = 45;

    const geometry = new THREE.BufferGeometry();
    const count = gridSize * gridSize;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cFrom = new THREE.Color(colorFrom);
    const cTo = new THREE.Color(colorTo);

    let index = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const posX = (x - gridSize / 2) * gridSpacing;
        const posZ = (y - gridSize / 2) * gridSpacing;

        positions[index] = posX;
        positions[index + 1] = 0;
        positions[index + 2] = posZ;

        // Gradient coloring
        const t = x / gridSize;
        const mixedColor = new THREE.Color().lerpColors(cFrom, cTo, t);
        colors[index] = mixedColor.r;
        colors[index + 1] = mixedColor.g;
        colors[index + 2] = mixedColor.b;

        index += 3;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Optional Grid Mesh lines
    let lineSegments: THREE.LineSegments | null = null;
    if (wireframe) {
      const indices: number[] = [];
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          const currentIdx = x * gridSize + y;
          if (x < gridSize - 1) {
            indices.push(currentIdx, (x + 1) * gridSize + y);
          }
          if (y < gridSize - 1) {
            indices.push(currentIdx, x * gridSize + (y + 1));
          }
        }
      }
      geometry.setIndex(indices);

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: opacity * 0.4,
        blending: THREE.NormalBlending,
      });
      lineSegments = new THREE.LineSegments(geometry, lineMaterial);
      scene.add(lineSegments);
    }

    // Glowing Particle Points
    let points: THREE.Points | null = null;
    if (showParticles) {
      const pointsMaterial = new THREE.PointsMaterial({
        size: particleSize,
        vertexColors: true,
        transparent: true,
        opacity: opacity,
        sizeAttenuation: true,
        map: createCircleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      points = new THREE.Points(geometry, pointsMaterial);
      scene.add(points);
    }

    // Simplex Noise Generator
    const noise2D = createNoise2D();
    const clock = new THREE.Clock();

    // Mouse Tracking
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const planeXZ = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      mouse.x = (mouseX / rect.width) * 2 - 1;
      mouse.y = -(mouseY / rect.height) * 2 + 1;
    };

    if (mouseInteraction) {
      container.addEventListener("mousemove", onMouseMove);
    }

    // Resize Observer (resizes WebGL relative to parent bounds, NOT full screen)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Camera Sway Interpolations
    const targetCamera = new THREE.Vector3(cameraX, cameraY, cameraZ);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      const time = clock.getElapsedTime() * speed;

      // Project Mouse to XZ Plane
      if (mouseInteraction) {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(planeXZ, targetMouse);
        
        // Camera parallax movement
        targetCamera.x = cameraX + mouse.x * 90;
        targetCamera.y = cameraY + mouse.y * 50;
        camera.position.x += (targetCamera.x - camera.position.x) * 0.05;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.05;
        camera.lookAt(0, -30, 0);
      }

      // Height displacement
      const posArray = geometry.attributes.position.array as Float32Array;
      let idx = 0;
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          const posX = posArray[idx];
          const posZ = posArray[idx + 2];

          // Natural waves (scaled for gridSpacing = 45)
          const n1 = noise2D(posX * 0.0004, posZ * 0.0004 + time) * amplitude;
          const n2 = Math.sin(posX * 0.001 + time * 2) * Math.cos(posZ * 0.001 + time) * (amplitude * 0.4);
          let height = n1 + n2;

          // Mouse distortion ripple
          if (mouseInteraction) {
            const dx = posX - targetMouse.x;
            const dz = posZ - targetMouse.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 280) {
              const rippleFactor = (1 - dist / 280);
              height += Math.sin(dist * 0.04 - time * 6) * (amplitude * 1.5) * rippleFactor;
            }
          }

          posArray[idx + 1] = height;
          idx += 3;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (mouseInteraction) {
        container.removeEventListener("mousemove", onMouseMove);
      }
      
      geometry.dispose();
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    colorFrom,
    colorTo,
    speed,
    amplitude,
    wireframe,
    showParticles,
    particleSize,
    resolution,
    mouseInteraction,
    opacity,
    cameraX,
    cameraY,
    cameraZ,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full z-0 overflow-hidden select-none",
        !mouseInteraction && "pointer-events-none",
        className
      )}
      style={{ backgroundColor }}
    >
      {webGLFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-background/90 text-foreground z-20">
          <p className="text-sm font-semibold">🚫 WebGL Support Required</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Unable to render the 3D animated wave. Please enable hardware acceleration in your browser settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimatedWave;