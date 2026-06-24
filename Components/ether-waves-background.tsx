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

export type WavePosition = {
  x: number;
  y: number;
  rotate: number;
};

interface EtherWavesProps {
  linesGradient?: string[];
  enabledWaves?: Array<"top" | "middle" | "bottom">; 
  lineCount?: number | number[];                     // Represents grid/particle density
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;                               // Mouse gravity influence radius
  bendStrength?: number;                             // Bending multiplier
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  transparentBg?: boolean;
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

uniform int topLineCount; // Grid density selector

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

uniform bool transparentBg;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 getLineColor(float t) {
  if (lineGradientCount <= 0) {
    return vec3(0.0, 0.94, 1.0); // Cyan fallback
  }
  
  if (lineGradientCount == 1) {
    return lineGradient[0];
  }
  
  float clampedT = clamp(t, 0.0, 0.9999);
  float scaled = clampedT * float(lineGradientCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  
  vec3 c1 = vec3(0.0);
  vec3 c2 = vec3(0.0);
  
  for (int i = 0; i < 8; i++) {
    if (i == idx) {
      c1 = lineGradient[i];
    }
    if (i == idx + 1) {
      c2 = lineGradient[i];
    }
  }
  
  return mix(c1, c2, f);
}

float getHeight(vec2 p) {
  float time = iTime * animationSpeed;
  
  // Complex multi-layered wave functions for organic liquid motion
  float w1 = sin(p.x * 0.7 + time * 0.4) * cos(p.y * 0.6 + time * 0.3) * 0.5;
  float w2 = cos(p.x * 1.3 - time * 0.6) * sin(p.y * 1.0 + time * 0.4) * 0.25;
  float w3 = sin(p.x * 2.8 + time * 1.1) * cos(p.y * 2.2 - time * 0.8) * 0.08;
  
  float h = w1 + w2 + w3;
  
  if (interactive) {
    // Coordinate mapping for 3D cursor position
    vec2 mouseNorm = (iMouse.xy / iResolution.xy) - 0.5;
    vec2 mouseP = vec2(mouseNorm.x * 5.5, -mouseNorm.y * 4.2);
    
    float d = length(p - mouseP);
    float influence = exp(-d * d * bendRadius);
    
    // Displace wave landscape
    h += influence * bendStrength * 1.5 * bendInfluence;
  }
  
  return h;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  // Setup Camera Ray
  vec3 ro = vec3(0.0, 1.9, 3.4); 
  vec3 rd = normalize(vec3(baseUv, -1.8)); 
  
  // Slow camera orbit
  float rx = 0.44;
  float ry = iTime * 0.035; 
  
  if (interactive) {
    vec2 mUv = (iMouse.xy / iResolution.xy) - 0.5;
    rx += mUv.y * 0.14;
    ry += mUv.x * 0.20;
  }
  
  mat2 rotX = rotate(rx);
  mat2 rotY = rotate(ry);
  
  ro.yz *= rotX; rd.yz *= rotX;
  ro.xz *= rotY; rd.xz *= rotY;
  
  float t = 0.01;
  float maxD = 25.0;
  bool hit = false;
  vec3 p;
  
  // Raymarch terrain surface
  for (int i = 0; i < 48; i++) {
    p = ro + rd * t;
    float h = getHeight(p.xz);
    float diff = p.y - h;
    
    if (diff < 0.01) {
      hit = true;
      t += diff * 0.5;
      break;
    }
    t += max(diff * 0.4, 0.05);
    if (t > maxD) break;
  }

  if (hit) {
    // Grid density scale mapping
    float gridScale = float(topLineCount) * 0.28;
    
    float valX = abs(fract(p.x * gridScale - 0.5) - 0.5);
    float valZ = abs(fract(p.z * gridScale - 0.5) - 0.5);
    
    // Distance to the nearest grid node intersection
    float distToNode = length(vec2(valX, valZ));
    
    // Adaptive dot node size in perspective
    float nodeRadius = 0.038 / (t * 0.12 + 0.4);
    float nodeGlow = exp(-distToNode * distToNode / (nodeRadius * nodeRadius));
    
    // Micro-thin constellation lines connecting nodes
    float lineThickness = 0.0022 + t * 0.0004;
    float lineX = smoothstep(lineThickness, 0.0, valX);
    float lineZ = smoothstep(lineThickness, 0.0, valZ);
    float lines = max(lineX, lineZ) * 0.26; // Faint connection line scale
    
    float grid = max(nodeGlow * 1.5, lines);
    
    // Map vertical height to color gradient stop
    float heightPercent = clamp((p.y + 0.65) / 1.3, 0.0, 1.0);
    vec3 lineCol = getLineColor(heightPercent);
    
    // Cursor proximity glow
    float glow = 0.0;
    if (interactive) {
      vec2 mouseNorm = (iMouse.xy / iResolution.xy) - 0.5;
      vec2 mouseP = vec2(mouseNorm.x * 5.5, -mouseNorm.y * 4.2);
      float d = length(p.xz - mouseP);
      glow = exp(-d * d * 1.6) * bendInfluence;
    }
    
    vec3 finalNodeCol = mix(lineCol, vec3(1.4), glow * 0.85);
    
    // Depth fog fade out
    float depthFade = smoothstep(maxD, 2.2, t);
    
    col = finalNodeCol * grid * depthFade;
    
    // Subtle background nebula fog
    vec3 nebulaFog = lineCol * 0.045 * (1.0 - depthFade);
    col += nebulaFog;
    
    if (transparentBg) {
      float alpha = smoothstep(0.0, 0.12, max(max(col.r, col.g), col.b));
      fragColor = vec4(col, alpha);
    } else {
      vec3 bgCol = vec3(0.01, 0.012, 0.018) + baseUv.y * 0.01;
      fragColor = vec4(col + bgCol, 1.0);
    }
  } else {
    // Subtle space dust twinkling in background
    float spaceDust = 0.0;
    vec3 dustPos = (ro + rd * maxD) * 1.6;
    float n = sin(floor(dustPos.x) * 12.98 + floor(dustPos.y) * 78.23 + floor(dustPos.z) * 43.7) * 43758.5453;
    if (fract(n) > 0.992) {
      vec3 localPos = fract(dustPos) - 0.5;
      spaceDust = exp(-length(localPos) * length(localPos) * 35.0) * (0.2 + sin(iTime * 1.6 + n) * 0.15);
    }

    if (transparentBg) {
      fragColor = vec4(vec3(1.0) * spaceDust * 0.35, spaceDust * 0.15);
    } else {
      vec3 bgCol = vec3(0.01, 0.012, 0.018) + baseUv.y * 0.01 + vec3(1.0) * spaceDust * 0.25;
      fragColor = vec4(bgCol, 1.0);
    }
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;
const DEFAULT_GRADIENT = ["#00f0ff", "#a855f7", "#d946ef", "#3b82f6"];

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

export default function EtherWavesBackground({
  linesGradient = DEFAULT_GRADIENT,
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition = { x: 10.0, y: 0.5, rotate: -0.4 },
  middleWavePosition = { x: 5.0, y: 0.0, rotate: 0.2 },
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: 0.4 },
  animationSpeed = 1.0,
  interactive = true,
  bendRadius = 0.5, 
  bendStrength = -0.6,
  mouseDamping = 0.06,
  parallax = true,
  parallaxStrength = 0.18,
  mixBlendMode = "normal",
  transparentBg = true,
  className = "",
}: EtherWavesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef);

  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef<number>(0);
  const currentInfluenceRef = useRef<number>(0);
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0));

  const density = typeof lineCount === "number" ? lineCount : (lineCount[0] ?? 6);

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
      animationSpeed: { value: animationSpeed },

      topLineCount: { value: density },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)),
      },
      lineGradientCount: { value: 0 },
      transparentBg: { value: transparentBg },
    };

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

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
          uniforms.bendInfluence.value = currentInfluenceRef.current;
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
    linesGradient,
    enabledWaves,
    density,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
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
        mixBlendMode,
        pointerEvents: "auto",
      }}
    />
  );
}
