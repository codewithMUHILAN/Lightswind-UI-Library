"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

interface WavyRippleBackgroundProps {
  className?: string;
  /** Primary wave color in CSS format (hex, rgb, etc.) */
  waveColor?: string;
  /** Background color of the container */
  backgroundColor?: string;
  /** Animation speed multiplier (default: 1.2) */
  speed?: number;
  /** Wave ripple frequency (default: 3.5) */
  frequency?: number;
  /** Thickness scaling/sharpness of the rings (default: 3.5) */
  ringSharpness?: number;
  /** Maximum opacity of the waves (default: 0.45) */
  maxOpacity?: number;
}

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uWaveColor;
uniform float uSpeed;
uniform float uFrequency;
uniform float uScale;
uniform float uMaxOpacity;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Center is locked to bottom-middle
  vec2 center = vec2(0.5, 0.0);
  
  // Apply aspect ratio correction for perfect concentric circular arcs
  float aspect = uResolution.x / uResolution.y;
  vec2 dir = uv - center;
  dir.x *= aspect;
  float dist = length(dir);
  
  // Concentric wave angle
  float angle = dist * uFrequency - uTime * uSpeed;
  float wave = sin(angle);
  float cosWave = cos(angle);
  
  // Map sin wave from [-1, 1] to [0, 1]
  float normWave = wave * 0.5 + 0.5;
  
  // Shape the wave to be thick and pillowy (wide peaks, thin valleys)
  float ringIntensity = pow(normWave, uScale);
  
  // High-fidelity 3D shading:
  // Compute height derivative (slope)
  float dH = uFrequency * cosWave * uScale * pow(normWave, max(0.01, uScale - 1.0)) * 0.5;
  
  // Radial normal mapping
  vec2 normal2D = normalize(dir) * dH;
  vec3 normal = normalize(vec3(normal2D.x, normal2D.y, 1.0));
  
  // Light from top-front
  vec3 lightDir = normalize(vec3(0.0, 1.0, 0.8));
  
  // Diffuse illumination
  float diffuse = max(0.0, dot(normal, lightDir));
  
  // Specular highlight for a glossy, premium plastic/glass finish
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(0.0, dot(normal, halfDir)), 24.0) * 0.3;
  
  // Combine wave color with 3D highlights and shadows
  vec3 litColor = uWaveColor * (0.35 + 0.65 * diffuse) + vec3(1.0) * specular;
  
  // Concentric half-ripple fade:
  // Fade out as it expands higher up the screen (uv.y: 0.0 -> 1.0) and further radially
  float distFade = smoothstep(0.85, 0.15, dist);
  float heightFade = smoothstep(0.85, 0.15, uv.y);
  
  float alpha = ringIntensity * distFade * heightFade * uMaxOpacity;
  
  fragColor = vec4(litColor, alpha);
}`;

export default function WavyRippleBackground({
  className = "",
  waveColor = "#3b82f6",
  backgroundColor = "transparent",
  speed = 0.8,
  frequency = 3.5, // adjusted to show exactly 4 concentric dome levels
  ringSharpness = 0.55, // lowered to make waves thick and cylindrical
  maxOpacity = 0.65,
}: WavyRippleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create OGL context
    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Dynamic full viewport geometry
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    // Create shader program
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uWaveColor: {
          value: (() => {
            const c = new Color(waveColor);
            return [c.r, c.g, c.b];
          })(),
        },
        uSpeed: { value: speed },
        uFrequency: { value: frequency },
        uScale: { value: ringSharpness },
        uMaxOpacity: { value: maxOpacity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    // Handle resizing
    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    window.addEventListener("resize", resize);
    resize();

    let animationId: number;
    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);

      program.uniforms.uTime.value = time * 0.001;
      program.uniforms.uWaveColor.value = (() => {
        const c = new Color(waveColor);
        return [c.r, c.g, c.b];
      })();
      program.uniforms.uSpeed.value = speed;
      program.uniforms.uFrequency.value = frequency;
      program.uniforms.uScale.value = ringSharpness;
      program.uniforms.uMaxOpacity.value = maxOpacity;

      renderer.render({ scene: mesh });
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [waveColor, speed, frequency, ringSharpness, maxOpacity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full z-0 overflow-hidden ${className}`}
      style={{ backgroundColor }}
    />
  );
}
