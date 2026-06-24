"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

interface CyberHiveProps {
  colorGrid?: string;        // Rest state cell color (e.g. dark teal/blue)
  colorNodes?: string;       // Hover state cell color (e.g. bright green/gold)
  speed?: number;            // Breathing animation speed
  gridDensity?: number;      // Density / frequency of hexagonal tiling
  warpRadius?: number;       // Radius of cursor hover gravity swell
  warpStrength?: number;     // Physical tile scaling indentation strength
  interactive?: boolean;     // Enable mouse/touch tracking
  mouseDamping?: number;     // Pointer movement lerp speed
  parallax?: boolean;        // Parallax depth offset shifting
  parallaxStrength?: number; // Parallax translation multiplier
  transparentBg?: boolean;   // Draw transparent background (transparent empty cell gaps)
  className?: string;
}

const vertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform vec2 iMouse;
uniform bool interactive;
uniform float warpRadius;
uniform float warpStrength;
uniform float hoverInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 uColorGrid;
uniform vec3 uColorNodes;

uniform bool transparentBg;
uniform float uGridDensity;

// Hash helper for cell random variations
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Distance to the boundary of a regular hexagon
float hexDist(vec2 p) {
  p = abs(p);
  float d = dot(p, normalize(vec2(1.0, 1.7320508)));
  return max(d, p.x);
}

// Hex cell coordinate mapping
struct HexInfo {
  vec2 gv;
  vec2 id;
};

HexInfo getHexInfo(vec2 uv) {
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r / 2.0;
  
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  
  if (length(a) < length(b)) {
    return HexInfo(a, uv - a);
  } else {
    return HexInfo(b, uv - h - b);
  }
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  
  if (parallax) {
    uv += parallaxOffset;
  }

  // Hex scaling based on resolution and density multiplier
  vec2 hexUv = uv * 3.5 * uGridDensity;
  HexInfo info = getHexInfo(hexUv);
  
  // Cursor coordinate warping
  float hover = 0.0;
  if (interactive) {
    vec2 mouseP = (2.0 * iMouse.xy - iResolution.xy) / iResolution.y;
    vec2 hexMouseP = mouseP * 3.5 * uGridDensity;
    float mouseDist = length(info.id - hexMouseP);
    hover = exp(-mouseDist * mouseDist * (1.2 / warpRadius)) * hoverInfluence;
  }
  
  // Physical scale warping on cell coordinates
  vec2 localGv = info.gv * (1.0 + hover * warpStrength * 0.28);
  float d = hexDist(localGv);
  
  // Pulse animation using unique cell ID hashes
  float cellHash = hash(info.id);
  float pulse = 0.5 + 0.5 * sin(iTime * animationSpeed * 1.6 + cellHash * 6.28);
  
  // Calculate pseudo-3D normals along hexagon borders for specular shading
  vec3 normal;
  if (d < 0.44) {
    normal = vec3(0.0, 0.0, 1.0); // Flat interior
  } else {
    // Slanted boundary normals
    vec2 dir = normalize(localGv);
    normal = normalize(mix(vec3(dir * 0.4, 0.85), vec3(0.0, 0.0, 1.0), smoothstep(0.44, 0.48, d)));
  }
  
  // Glossy specular highlight (Blinn-Phong)
  vec3 lightDir = normalize(vec3(0.4, 0.8, 1.0));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
  
  // Shading colors
  vec3 baseCol = mix(uColorGrid, uColorNodes, hover);
  float emission = mix(0.12 * (0.4 + 0.6 * pulse), 1.0, hover);
  
  // Base tile lighting and specular reflection
  vec3 col = baseCol * emission * (0.65 + max(dot(normal, lightDir), 0.0) * 0.35) + vec3(spec * (0.3 + 0.7 * hover));
  
  // Edge border glow
  float borderRing = exp(-abs(d - 0.46) * 20.0);
  col += uColorNodes * borderRing * (0.15 + 0.85 * hover);
  
  // Alpha transparency masking
  float tileMask = smoothstep(0.48, 0.45, d);
  float alpha = clamp(tileMask * (0.2 + 0.8 * emission) + borderRing * (0.4 + 0.6 * hover), 0.0, 1.0);
  
  // Vignette
  vec2 centerUv = fragCoord / iResolution.xy;
  float vignette = 1.0 - dot(centerUv - 0.5, centerUv - 0.5) * 1.2;
  vignette = max(0.0, vignette);
  
  col *= vignette;
  alpha *= vignette;
  
  if (transparentBg) {
    fragColor = vec4(col, alpha);
  } else {
    vec3 bgCol = vec3(0.005, 0.007, 0.012) + (centerUv.y * 0.008);
    fragColor = vec4(mix(bgCol, col, alpha), 1.0);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const defaultColorGrid = "#092942";  // Sleek tech blue/gray
const defaultColorNodes = "#00f0ff"; // Glowing cyan nodes

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim();
  if (value.startsWith("#")) {
    value = value.slice(1);
  }
  let r = 255;
  let g = 255;
  let b = 255;
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  return new Vector3(r / 255, g / 255, b / 255);
}

export default function CyberHiveBackground({
  colorGrid = defaultColorGrid,
  colorNodes = defaultColorNodes,
  speed = 1.0,
  gridDensity = 1.0, // Multiplier for global hex cell density
  warpRadius = 1.0,
  warpStrength = 1.0,
  interactive = true,
  mouseDamping = 0.08,
  parallax = true,
  parallaxStrength = 0.16,
  transparentBg = true,
  className = "",
}: CyberHiveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef);

  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef<number>(0);
  const currentInfluenceRef = useRef<number>(0);
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const scene = new Scene();

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: transparentBg });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    if (transparentBg) {
      renderer.setClearColor(0x000000, 0);
    }

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: speed },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      warpRadius: { value: warpRadius },
      warpStrength: { value: warpStrength },
      hoverInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      uColorGrid: { value: hexToVec3(colorGrid) },
      uColorNodes: { value: hexToVec3(colorNodes) },

      transparentBg: { value: transparentBg },
      uGridDensity: { value: gridDensity },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: transparentBg,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);
      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
    };

    setSize();

    const resizeObserver = new ResizeObserver(() => {
      if (active) setSize();
    });
    resizeObserver.observe(container);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();

      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
      targetParallaxRef.current.set(0, 0);
    };

    if (interactive) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);
    }

    let rafId = 0;
    const renderLoop = () => {
      if (!active) return;

      if (isInView) {
        uniforms.iTime.value = clock.getElapsedTime();

        if (interactive) {
          currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
          uniforms.iMouse.value.copy(currentMouseRef.current);

          currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
          uniforms.hoverInfluence.value = currentInfluenceRef.current;
        }

        if (parallax) {
          currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
          uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
        }

        renderer.render(scene, camera);
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();

      if (interactive) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [
    colorGrid,
    colorNodes,
    speed,
    gridDensity,
    warpRadius,
    warpStrength,
    interactive,
    mouseDamping,
    parallax,
    parallaxStrength,
    transparentBg,
    isInView,
  ]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{
        mixBlendMode: "normal",
        pointerEvents: "auto",
      }}
    />
  );
}
