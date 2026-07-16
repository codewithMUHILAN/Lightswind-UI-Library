"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

interface CosmicSingularityProps {
  particleCount?: number;   // Total particles (accretion disk + background dust)
  colorInner?: string;      // Color near singularity core (hex)
  colorOuter?: string;      // Color at outer edges of disk (hex)
  speed?: number;           // Rotation speed multiplier
  gravity?: number;         // Base gravitational pull
  interactive?: boolean;    // Enable pointer tracking
  mouseDamping?: number;    // Movement transition smoothness
  transparentBg?: boolean;  // Draw transparent canvas background
  className?: string;
}

const vertexShader = `
precision highp float;

attribute float aRadius;
attribute float aAngle;
attribute float aSpeed;
attribute float aRandom;
attribute float aSize;
attribute vec2 aAmbientPos;
attribute float aType; // 1.0 = permanent accretion disk, 0.0 = background starfield

uniform float iTime;
uniform float uSpeed;
uniform float uGravity;
uniform vec2 uSingularity;
uniform vec2 uVelocity;
uniform float uHoverActive; // 1.0 = hovered, 0.0 = spread/idle

varying vec3 vColor;
varying float vAlpha;

uniform vec3 uColorInner;
uniform vec3 uColorOuter;

void main() {
  vec2 finalPos;
  float visualDist;
  float localInfluence = 0.0;

  if (aType > 0.5) {
    // 1. Permanent Accretion Disk Particle (spreads out by default, condenses on hover)
    float orbitalSpeed = aSpeed * uSpeed * (0.95 / sqrt(max(aRadius, 0.05)));
    float angle = aAngle + iTime * orbitalSpeed;
    
    // Gravity contraction
    float r = aRadius * (1.0 - uGravity * 0.12 / (aRadius + 0.15));
    float wobble = sin(iTime * 1.5 + aRandom * 6.28) * 0.02 * aRadius;
    
    vec2 relativePos = vec2(
      cos(angle) * (r + wobble),
      sin(angle) * (r + wobble)
    );
    
    vec2 targetOrbitPos = uSingularity + relativePos;
    
    // Spread default position (ambient position with slow drift)
    vec2 p_spread = aAmbientPos;
    p_spread.x += sin(iTime * 0.07 + aRandom * 6.28) * 0.05;
    p_spread.y += cos(iTime * 0.05 + aRandom * 6.28) * 0.05;
    
    // Blend based on global hover active uniform
    finalPos = mix(p_spread, targetOrbitPos, uHoverActive);
    visualDist = mix(length(p_spread - uSingularity), r, uHoverActive);
    localInfluence = uHoverActive;
  } else {
    // 2. Interactive Background Particle (spreads out, gets pulled by gravity when cursor is close)
    vec2 p_ambient = aAmbientPos;
    
    // Ambient slow drift
    p_ambient.x += sin(iTime * 0.08 + aRandom * 6.28) * 0.04;
    p_ambient.y += cos(iTime * 0.06 + aRandom * 6.28) * 0.04;
    
    // Vector to singularity
    vec2 toSingularity = uSingularity - p_ambient;
    float dist = length(toSingularity);
    
    // Gravity pull radius
    float gravityRadius = 0.85;
    float influence = smoothstep(gravityRadius, 0.15, dist) * uHoverActive;
    localInfluence = influence;
    
    // Spin orbital mapping
    float initialAngle = atan(toSingularity.y, toSingularity.x);
    float spinSpeed = uSpeed * aSpeed * (1.4 / sqrt(max(dist, 0.08)));
    float angle = initialAngle + iTime * spinSpeed * influence;
    
    // Pull inwards
    float r_orbit = dist * (1.0 - influence * 0.4);
    vec2 orbitPos = uSingularity + vec2(cos(angle), sin(angle)) * r_orbit;
    
    finalPos = mix(p_ambient, orbitPos, influence);
    visualDist = mix(dist, r_orbit, influence);
  }

  // Velocity stretch / drag opposite of singularity motion direction
  float drag = exp(-visualDist * 1.5);
  finalPos -= uVelocity * drag * 1.2;

  // Accretion disk thermal color shift
  float colorMix = clamp(visualDist / 1.15, 0.0, 1.0);
  vec3 finalColor = mix(uColorInner, uColorOuter, colorMix);
  
  // White-hot core glow near event horizon (only when inside gravity well)
  float centerGlow = exp(-visualDist * 5.0) * localInfluence;
  finalColor = mix(finalColor, vec3(1.0, 0.97, 0.90), centerGlow * 0.9);
  
  vColor = finalColor;

  // Transparency fade near event horizon and far edge limits
  float innerFade = (aType > 0.5) ? mix(1.0, smoothstep(0.04, 0.12, visualDist), uHoverActive) : 1.0;
  float outerFade = smoothstep(2.5, 1.2, visualDist);
  
  vAlpha = innerFade * outerFade * (0.28 + 0.72 * aRandom);

  // Particle glow size (pulsates over time)
  gl_PointSize = aSize * (1.0 + centerGlow * 2.2) * (0.75 + 0.25 * sin(iTime * 2.0 + aRandom * 12.0));
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Soft Gaussian-like circular particle shading
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  
  if (dist > 0.5) {
    discard;
  }
  
  float intensity = smoothstep(0.5, 0.0, dist);
  gl_FragColor = vec4(vColor, vAlpha * intensity);
}
`;

const defaultColorInner = "#ffd700"; // Glowing gold core
const defaultColorOuter = "#7a00ff"; // Violet outer ring

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

export default function CosmicSingularityBackground({
  particleCount = 25000,
  colorInner = defaultColorInner,
  colorOuter = defaultColorOuter,
  speed = 1.0,
  gravity = 1.0,
  interactive = true,
  mouseDamping = 0.08,
  transparentBg = true,
  className = "",
}: CosmicSingularityProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef);

  const targetMouseRef = useRef<Vector2>(new Vector2(0, 0));
  const currentMouseRef = useRef<Vector2>(new Vector2(0, 0));
  const lastMouseRef = useRef<Vector2>(new Vector2(0, 0));
  
  const velocityRef = useRef<Vector2>(new Vector2(0, 0));
  const currentVelocityRef = useRef<Vector2>(new Vector2(0, 0));
  
  const targetGravityRef = useRef<number>(gravity);
  const currentGravityRef = useRef<number>(gravity);
  const currentHoverActiveRef = useRef<number>(0.0);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    targetGravityRef.current = gravity;
  }, [gravity]);

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

    // Initialize particle data structures
    const count = particleCount;
    const geometry = new BufferGeometry();

    const positions = new Float32Array(count * 3);
    const aAmbientPos = new Float32Array(count * 2);
    const aType = new Float32Array(count); // 1.0 = accretion, 0.0 = background
    const aRadius = new Float32Array(count);
    const aAngle = new Float32Array(count);
    const aSpeed = new Float32Array(count);
    const aRandom = new Float32Array(count);
    const aSize = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Split population: 35% dense permanent accretion disk, 65% background dust starfield
      const isAccretion = Math.random() < 0.35;
      const typeVal = isAccretion ? 1.0 : 0.0;
      aType[i] = typeVal;

      let x = 0;
      let y = 0;
      let r = 0;
      let angle = 0;

      if (isAccretion) {
        // Permanent Accretion disk: power distribution clustered near singularity center
        r = Math.pow(Math.random(), 1.6) * 0.9 + 0.05;
        angle = Math.random() * Math.PI * 2;
        x = Math.cos(angle) * r;
        y = Math.sin(angle) * r;
      } else {
        // Wide-spread background dust: covers the full screen boundaries
        x = (Math.random() - 0.5) * 6.0;
        y = (Math.random() - 0.5) * 4.0;
        r = Math.sqrt(x * x + y * y);
        angle = Math.atan2(y, x);
      }

      // Populate ambient positions
      const ambientX = (Math.random() - 0.5) * 6.0;
      const ambientY = (Math.random() - 0.5) * 4.0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = 0;

      aAmbientPos[i * 2] = isAccretion ? ambientX : x;
      aAmbientPos[i * 2 + 1] = isAccretion ? ambientY : y;
      
      aRadius[i] = r;
      aAngle[i] = angle;
      aSpeed[i] = 0.5 + Math.random() * 0.8;
      aRandom[i] = Math.random();
      aSize[i] = 1.0 + Math.random() * 3.5;
    }

    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aAmbientPos", new BufferAttribute(aAmbientPos, 2));
    geometry.setAttribute("aType", new BufferAttribute(aType, 1));
    geometry.setAttribute("aRadius", new BufferAttribute(aRadius, 1));
    geometry.setAttribute("aAngle", new BufferAttribute(aAngle, 1));
    geometry.setAttribute("aSpeed", new BufferAttribute(aSpeed, 1));
    geometry.setAttribute("aRandom", new BufferAttribute(aRandom, 1));
    geometry.setAttribute("aSize", new BufferAttribute(aSize, 1));

    const uniforms = {
      iTime: { value: 0 },
      uSpeed: { value: speed },
      uGravity: { value: gravity },
      uSingularity: { value: new Vector2(0, 0) },
      uVelocity: { value: new Vector2(0, 0) },
      uHoverActive: { value: 0.0 },
      uColorInner: { value: hexToVec3(colorInner) },
      uColorOuter: { value: hexToVec3(colorOuter) },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: transparentBg,
      depthWrite: false,
      depthTest: false,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    const clock = new Clock();

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const aspect = width / height;

      renderer.setSize(width, height, false);
      
      // Dynamic camera updates to maintain circular shapes on aspect resize
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
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
      const aspect = rect.width / rect.height;

      // Map canvas pixels to normalized orthographic camera coordinates
      const mouseX = (x / rect.width) * 2 * aspect - aspect;
      const mouseY = -(y / rect.height) * 2 + 1;

      targetMouseRef.current.set(mouseX, mouseY);
      isHoveredRef.current = true;
    };

    const handlePointerLeave = () => {
      isHoveredRef.current = false;
    };

    const handlePointerDown = () => {
      targetGravityRef.current = gravity * 2.5; // Strong gravity distortion on press
    };

    const handlePointerUp = () => {
      targetGravityRef.current = gravity;
    };

    if (interactive) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);
      container.addEventListener("pointerdown", handlePointerDown);
      container.addEventListener("pointerup", handlePointerUp);
    }

    let rafId = 0;
    const renderLoop = () => {
      if (!active) return;

      if (isInView) {
        const time = clock.getElapsedTime();
        uniforms.iTime.value = time;

        let targetX = 0;
        let targetY = 0;

        if (interactive && isHoveredRef.current) {
          targetX = targetMouseRef.current.x;
          targetY = targetMouseRef.current.y;
        } else {
          // Centered wandering motion when not interacting
          const wanderTime = time * 0.45;
          targetX = Math.sin(wanderTime) * 0.16;
          targetY = Math.cos(wanderTime * 2.0) * 0.08;
        }

        // Interpolate coordinates
        currentMouseRef.current.x += (targetX - currentMouseRef.current.x) * mouseDamping;
        currentMouseRef.current.y += (targetY - currentMouseRef.current.y) * mouseDamping;
        uniforms.uSingularity.value.copy(currentMouseRef.current);

        // Interpolate hover active state
        const targetHoverActive = isHoveredRef.current ? 1.0 : 0.0;
        currentHoverActiveRef.current += (targetHoverActive - currentHoverActiveRef.current) * 0.05;
        uniforms.uHoverActive.value = currentHoverActiveRef.current;

        // Calculate singularity movement velocity
        const vx = currentMouseRef.current.x - lastMouseRef.current.x;
        const vy = currentMouseRef.current.y - lastMouseRef.current.y;
        lastMouseRef.current.copy(currentMouseRef.current);

        velocityRef.current.set(vx, vy);
        currentVelocityRef.current.lerp(velocityRef.current, 0.12);
        uniforms.uVelocity.value.copy(currentVelocityRef.current);

        // Interpolate gravity
        currentGravityRef.current += (targetGravityRef.current - currentGravityRef.current) * 0.1;
        uniforms.uGravity.value = currentGravityRef.current;

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
        container.removeEventListener("pointerdown", handlePointerDown);
        container.removeEventListener("pointerup", handlePointerUp);
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
    particleCount,
    colorInner,
    colorOuter,
    speed,
    gravity,
    interactive,
    mouseDamping,
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
