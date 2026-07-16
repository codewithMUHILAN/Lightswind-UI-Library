"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * InfiniteDrift Component
 * A high-performance, professional Three.js powered image drifting gallery.
 * Features multiple bands with independent speeds, rotations, and curvatures.
 */

export interface InfiniteDriftBand {
  /** Array of image URLs for this band */
  images: string[];
  /** Scrolling speed multiplier for this band (default: 1.0) */
  speed?: number;
  /** Rotation angle in degrees (default: 0) */
  rotation?: number;
  /** Vertical offset from center (default: 0) */
  offsetY?: number;
  /** Curvature intensity (default: 40.0) */
  curveAmount?: number;
  /** Direction of curvature (1 for convex, -1 for concave) */
  curveDirection?: 1 | -1;
  /** Rotation pivot point type */
  rotationType?: "fromLeft" | "fromCenter";
}

export interface InfiniteDriftProps {
  /** Configuration for each horizontal band */
  bands?: InfiniteDriftBand[];
  /** Height of the component (default: 600px) */
  height?: string | number;
  /** Gap between images in a band (default: 20) */
  gap?: number;
  /** Height of individual images (default: 100) */
  imageHeight?: number;
  /** Height of each band container (default: 120) */
  bandHeight?: number;
  /** Maximum width an image can take while maintaining ratio (default: 300) */
  maxImageWidth?: number;
  /** Scrolling inertia/friction (0 to 1, default: 0.92) */
  inertia?: number;
  /** Whether to preserve original image aspect ratios (default: true) */
  preserveOriginalRatios?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Overlay children (e.g., text or controls) */
  children?: React.ReactNode;
}

const DEFAULT_BANDS: InfiniteDriftBand[] = [
  {
    offsetY: -220,
    speed: 1.0,
    rotation: 7,
    rotationType: "fromLeft",
    curveAmount: 40.0,
    curveDirection: 1,
    images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400",
      "https://images.unsplash.com/photo-1550684399-3f0f745771d1?w=400",
      "https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=400",
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=400",
    ],
  },
  {
    offsetY: -110,
    speed: 1.3,
    rotation: 7,
    rotationType: "fromCenter",
    curveAmount: 35.0,
    curveDirection: 1,
    images: [
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
      "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400",
      "https://images.unsplash.com/photo-1557683325-3ba8f0df79de?w=400",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    ],
  },
  {
    offsetY: 0,
    speed: 0.7,
    rotation: 7,
    curveAmount: 40.0,
    curveDirection: 1,
    images: [
      "https://images.unsplash.com/photo-1511447333849-2b89ae13b002?w=400",
      "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400",
      "https://images.unsplash.com/photo-1543966888-7c1dc482a810?w=400",
      "https://images.unsplash.com/photo-1561070791-36c11767b26a?w=400",
    ],
  },
  {
    offsetY: 110,
    speed: 1.2,
    rotation: 7,
    curveAmount: 40.0,
    curveDirection: 1,
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?w=400",
      "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=400",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
      "https://images.unsplash.com/photo-1561070791-0626bcd0516e?w=400",
    ],
  },
  {
    offsetY: 220,
    speed: 0.9,
    rotation: 7,
    curveAmount: 35.0,
    curveDirection: 1,
    images: [
      "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400",
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
    ],
  },
];

export const InfiniteDrift: React.FC<InfiniteDriftProps> = ({
  bands = DEFAULT_BANDS,
  height = 600,
  gap = 20,
  imageHeight = 100,
  bandHeight = 120,
  maxImageWidth = 300,
  inertia = 0.92,
  preserveOriginalRatios = true,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollState = useRef({
    scrollY: 0,
    targetScrollY: 0,
    scrollVelocity: 0,
    isDragging: false,
    lastMouseY: 0,
  });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const meshes: THREE.Mesh[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    const textureLoader = new THREE.TextureLoader();

    // --- Loading State Management ---
    let totalImages = bands.reduce((acc, band) => acc + band.images.length, 0);
    let loadedImages = 0;

    const updateProgress = () => {
      loadedImages++;
    };

    // --- Texture Generation ---
    const createBandTexture = async (band: InfiniteDriftBand) => {
      const images: HTMLImageElement[] = await Promise.all(
        band.images.map(
          (url) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => {
                updateProgress();
                resolve(img);
              };
              img.onerror = () => {
                // Fallback colored canvas if image fails
                const fallback = document.createElement("canvas");
                fallback.width = 400;
                fallback.height = 300;
                const ctx = fallback.getContext("2d")!;
                ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
                ctx.fillRect(0, 0, 400, 300);
                updateProgress();
                resolve(fallback as any as HTMLImageElement);
              };
              img.src = url;
            })
        )
      );

      // Calculate total width of one sequence
      let sequenceWidth = 0;
      const imageInfos = images.map((img) => {
        const ratio = img.naturalWidth / img.naturalHeight || 1.5;
        let w, h;
        if (preserveOriginalRatios) {
          h = imageHeight;
          w = Math.round(h * ratio);
          if (w > maxImageWidth) {
            w = maxImageWidth;
            h = Math.round(w / ratio);
          }
        } else {
          h = imageHeight;
          w = Math.round(h * 1.5);
        }
        sequenceWidth += w + gap;
        return { img, w, h };
      });

      sequenceWidth -= gap;
      const cloneCount = 3;
      const totalWidth = sequenceWidth * cloneCount;

      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = totalWidth;
      offscreenCanvas.height = bandHeight;
      const ctx = offscreenCanvas.getContext("2d")!;

      let currentX = 0;
      for (let c = 0; c < cloneCount; c++) {
        imageInfos.forEach((info) => {
          const centeredY = (bandHeight - info.h) / 2;
          ctx.drawImage(info.img, currentX, centeredY, info.w, info.h);
          currentX += info.w + gap;
        });
      }

      const texture = new THREE.Texture(offscreenCanvas);
      texture.needsUpdate = true;
      return { texture, totalWidth, sequenceWidth };
    };

    // --- Shaders ---
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 uResolution;
      uniform sampler2D uTexture;
      uniform float uTextureWidth;
      uniform float uSequenceWidth;
      uniform float uBandHeight;
      uniform float uScroll;
      uniform float uSpeed;
      uniform float uOffsetY;
      uniform float uRotation;
      uniform float uRotationType;
      uniform float uHasRotation;
      uniform float uCurveAmount;
      uniform float uCurveDirection;
      varying vec2 vUv;

      mat2 rotate2d(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      void main() {
        vec2 pixelCoord = vUv * uResolution;
        vec2 originalPixelCoord = pixelCoord;
        
        float normalizedX = pixelCoord.x / uResolution.x;
        float curveFactor = 4.0 * (normalizedX - 0.5) * (normalizedX - 0.5);
        float curveOffset = (0.5 - curveFactor) * uCurveAmount * uCurveDirection;
        
        float bandTopBase = (uResolution.y - uBandHeight) * 0.5 + uOffsetY;
        float bandTop = bandTopBase + curveOffset;
        float bandBottom = bandTop + uBandHeight;
        float bandCenterY = bandTopBase + (uBandHeight * 0.5);
        
        if (uHasRotation > 0.5) {
          vec2 rotationCenter = (uRotationType > 0.5) ? vec2(0.0, bandCenterY) : vec2(uResolution.x * 0.5, bandCenterY);
          pixelCoord -= rotationCenter;
          pixelCoord = rotate2d(uRotation) * pixelCoord;
          pixelCoord += rotationCenter;
          originalPixelCoord -= rotationCenter;
          originalPixelCoord = rotate2d(uRotation) * originalPixelCoord;
          originalPixelCoord += rotationCenter;
        }
        
        float margin = 3.0;
        if (pixelCoord.y < bandTop - margin || pixelCoord.y > bandBottom + margin) {
          discard;
        }
        
        float scrollPos = uScroll * uSpeed;
        float wrappedX = mod(originalPixelCoord.x + scrollPos, uSequenceWidth);
        float textureX = (wrappedX + uSequenceWidth) / uTextureWidth;
        float texY = (pixelCoord.y - bandTop) / (bandBottom - bandTop);
        
        if (textureX < 0.0 || textureX > 1.0 || texY < 0.0 || texY > 1.0) {
          discard;
        }
        
        vec4 color = texture2D(uTexture, vec2(textureX, texY));
        if (color.a < 0.1) discard;
        
        float edge = min(pixelCoord.y - bandTop, bandBottom - pixelCoord.y);
        if (edge < margin) color.a *= smoothstep(0.0, margin, edge);
        
        gl_FragColor = color;
      }
    `;

    // --- Initialize Bands ---
    const initBands = async () => {
      for (let i = 0; i < bands.length; i++) {
        const config = bands[i];
        const { texture, totalWidth, sequenceWidth } = await createBandTexture(config);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uTexture: { value: texture },
            uTextureWidth: { value: totalWidth },
            uSequenceWidth: { value: sequenceWidth },
            uBandHeight: { value: bandHeight },
            uScroll: { value: 0 },
            uSpeed: { value: config.speed || 1.0 },
            uOffsetY: { value: config.offsetY || 0 },
            uRotation: { value: ((config.rotation || 0) * Math.PI) / 180 },
            uRotationType: { value: config.rotationType === "fromLeft" ? 1.0 : 0.0 },
            uHasRotation: { value: config.rotation ? 1.0 : 0.0 },
            uCurveAmount: { value: config.curveAmount || 0 },
            uCurveDirection: { value: config.curveDirection || 1 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = i * -0.01;
        scene.add(mesh);
        meshes.push(mesh);
        materials.push(material);
      }
    };

    initBands();

    // --- Animation & Input ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const state = scrollState.current;
      if (!state.isDragging) {
        state.targetScrollY += state.scrollVelocity;
        state.scrollVelocity *= inertia;
        if (Math.abs(state.scrollVelocity) < 0.1) state.scrollVelocity = 0;
      }

      state.scrollY += (state.targetScrollY - state.scrollY) * 0.1;

      materials.forEach((mat) => {
        mat.uniforms.uScroll.value = state.scrollY;
        mat.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Event Handlers ---
    // Local wheel (hover) – prevent default so page doesn't scroll while over component
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollState.current.targetScrollY += e.deltaY;
      scrollState.current.scrollVelocity = e.deltaY * 0.15;
    };

    // Global page scroll – drive drift with any scroll anywhere on the page
    let lastScrollTop = window.scrollY;
    const handleGlobalScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollTop;
      lastScrollTop = current;
      scrollState.current.targetScrollY += delta * 2.5;
      scrollState.current.scrollVelocity = delta * 0.3;
    };

    const handleMouseDown = (e: MouseEvent) => {
      scrollState.current.isDragging = true;
      scrollState.current.lastMouseY = e.clientY;
      scrollState.current.scrollVelocity = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollState.current.isDragging) return;
      const deltaY = e.clientY - scrollState.current.lastMouseY;
      scrollState.current.targetScrollY += deltaY * 2.0;
      scrollState.current.lastMouseY = e.clientY;
      scrollState.current.scrollVelocity = deltaY * 0.25;
    };

    const handleMouseUp = () => {
      scrollState.current.isDragging = false;
    };

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      materials.forEach((mat) => {
        mat.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    // Mobile events
    const handleTouchStart = (e: TouchEvent) => {
      scrollState.current.lastMouseY = e.touches[0].clientY;
      scrollState.current.isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!scrollState.current.isDragging) return;
      const deltaY = e.touches[0].clientY - scrollState.current.lastMouseY;
      scrollState.current.targetScrollY += deltaY * 2.5;
      scrollState.current.lastMouseY = e.touches[0].clientY;
      scrollState.current.scrollVelocity = deltaY * 0.3;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleGlobalScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleMouseUp);

      meshes.forEach(m => {
        scene.remove(m);
        m.geometry.dispose();
        (m.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
    };
  }, [bands, gap, imageHeight, bandHeight, maxImageWidth, inertia, preserveOriginalRatios]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden bg-background cursor-grab active:cursor-grabbing", className)}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {children}
    </div>
  );
};

export default InfiniteDrift;
