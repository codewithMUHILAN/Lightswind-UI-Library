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

interface FluidChromeProps {
  linesGradient?: string[];
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;      // Mouse ripple speed/spread scale
  bendStrength?: number;    // Ripple height displacement
  shininess?: number;       // Specular hardness
  specStrength?: number;    // Specular brightness
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

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform float shininess;
uniform float specStrength;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

uniform bool transparentBg;

// 2D Noise helper
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Fractional Brownian Motion (FBM)
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

vec3 getLineColor(float t) {
  if (lineGradientCount <= 0) {
    return vec3(0.8, 0.82, 0.85); // Silver fallback
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
  vec2 coord = p * 2.0;
  
  // Turbulent noise heightmap
  float n1 = fbm(coord + vec2(time * 0.15, time * 0.12));
  float n2 = fbm(coord - vec2(time * 0.08, -time * 0.16) + n1 * 0.4);
  
  float h = n2 * 0.32;
  
  if (interactive && bendInfluence > 0.01) {
    vec2 mouseNorm = (iMouse.xy / iResolution.xy) - 0.5;
    // Map mouse screen aspect relative to canvas viewport coords
    vec2 mouseP = vec2(mouseNorm.x * 2.0, -mouseNorm.y * 1.5) * 1.5;
    
    float d = length(p - mouseP);
    
    // Wave ripple distortion
    float ripple = sin(d * 18.0 - time * 6.5) * exp(-d * d * bendRadius);
    h += ripple * bendStrength * 0.15 * bendInfluence;
  }
  
  return h;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  
  if (parallax) {
    uv += parallaxOffset;
  }

  // Calculate high-fidelity surface normals using central difference
  vec2 eps = vec2(0.008, 0.0);
  float hL = getHeight(uv - eps.xy);
  float hR = getHeight(uv + eps.xy);
  float hB = getHeight(uv - eps.yx);
  float hT = getHeight(uv + eps.yx);
  
  vec3 normal = normalize(vec3(hL - hR, 0.08, hB - hT));
  
  // Shifting color index based on normal slope & local height
  float colorIdx = normal.x * 0.45 + normal.z * 0.45 + getHeight(uv) * 0.5 + 0.5;
  vec3 baseColor = getLineColor(colorIdx);
  
  // Specular lighting (Blinn-Phong)
  vec3 lightDir = normalize(vec3(0.5, 1.2, 0.6));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  
  float ndotl = max(dot(normal, lightDir), 0.0);
  float spec = pow(max(dot(normal, halfDir), 0.0), shininess);
  
  // Combine base color shading with glossy specular light reflection
  vec3 finalColor = baseColor * (0.3 + ndotl * 0.45) + vec3(spec * specStrength);
  
  if (transparentBg) {
    float alpha = smoothstep(0.0, 0.12, max(max(finalColor.r, finalColor.g), finalColor.b));
    fragColor = vec4(finalColor, alpha);
  } else {
    fragColor = vec4(finalColor, 1.0);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;
const DEFAULT_GRADIENT = ["#ffffff", "#cbd5e1", "#94a3b8", "#475569"]; // Silver chrome default

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

export default function FluidChromeBackground({
  linesGradient = DEFAULT_GRADIENT,
  animationSpeed = 1.0,
  interactive = true,
  bendRadius = 1.5,
  bendStrength = -0.5,
  shininess = 50.0,
  specStrength = 1.0,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.15,
  mixBlendMode = "normal",
  transparentBg = false, // Set to false by default for chrome backgrounds to render solid metallic reflections
  className = "",
}: FluidChromeProps) {
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
      animationSpeed: { value: animationSpeed },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      shininess: { value: shininess },
      specStrength: { value: specStrength },

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
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    shininess,
    specStrength,
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
