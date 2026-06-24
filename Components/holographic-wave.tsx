"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface HolographicWaveProps {
  speed?: number;
  frequency?: number;
  intensity?: number;
  theme?: "light" | "dark" | "system";
}

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uFrequency;
uniform float uIntensity;
uniform float uDarkTheme;

vec3 getRainbowColor(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return a + b * cos(6.28318530718 * (c * t + d));
}

mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 m = uMouse / uResolution.xy;
  
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / uResolution.y;
  
  vec2 mCorrected = m - 0.5;
  mCorrected.x *= uResolution.x / uResolution.y;
  
  float distToMouse = length(p - mCorrected);
  float t = uTime * uSpeed;
  
  // High-end fluid ripple displacement based on mouse distance
  float influence = smoothstep(0.6, 0.0, distToMouse);
  p += normalize(p - mCorrected + 0.001) * influence * 0.12 * sin(distToMouse * 10.0 - t * 3.0);
  
  for (float i = 1.0; i < 4.0; i++) {
    p.xy += sin(p.yx * 2.0 * uFrequency + t * i * 0.5) * 0.15;
    p = rotate2D(0.2) * p;
  }
  
  float wave1 = sin(p.x * 2.0 * uFrequency + t) * 0.5;
  float wave2 = cos(p.y * 3.0 * uFrequency - t * 0.8) * 0.3;
  
  float dist = length(p + vec2(wave1, wave2));
  vec3 col = getRainbowColor(dist * 0.5 - t * 0.1);
  
  float edge = 0.35 + sin(t * 0.3) * 0.1;
  float intensity = smoothstep(edge, 0.0, dist);
  
  vec3 finalCol = col;
  float alpha = intensity * uIntensity;
  
  // Boost transparency near mouse to highlight interaction
  alpha *= (1.0 + 0.15 * influence);
  
  if (uDarkTheme < 0.5) {
    finalCol = mix(finalCol, vec3(1.0), 0.2);
    alpha = clamp(alpha * 0.5, 0.0, 0.6);
  } else {
    finalCol = finalCol * 1.3;
    alpha = clamp(alpha * 0.85, 0.0, 0.95);
  }
  
  fragColor = vec4(finalCol * alpha, alpha);
}`;

export default function HolographicWave({
  speed = 1.0,
  frequency = 1.0,
  intensity = 1.0,
  theme = "system",
}: HolographicWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [darkThemeVal, setDarkThemeVal] = useState(1.0);

  useEffect(() => {
    // Check initial theme class
    const checkTheme = () => {
      if (theme === "system") {
        const isDark = document.documentElement.classList.contains("dark");
        setDarkThemeVal(isDark ? 1.0 : 0.0);
      } else {
        setDarkThemeVal(theme === "dark" ? 1.0 : 0.0);
      }
    };

    checkTheme();

    if (theme === "system") {
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uFrequency: { value: frequency },
        uIntensity: { value: intensity },
        uDarkTheme: { value: darkThemeVal },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uMouse: { value: [0, 0] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };
    window.addEventListener("resize", resize);
    resize();

    const targetMouse = { x: 0, y: 0 };
    let hasMoved = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = rect.bottom - e.clientY;
      hasMoved = true;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationId: number;

    const animate = (t: number) => {
      animationId = requestAnimationFrame(animate);

      if (!hasMoved) {
        const cx = container.offsetWidth / 2;
        const cy = container.offsetHeight / 2;
        const radius = Math.min(container.offsetWidth, container.offsetHeight) * 0.15;
        targetMouse.x = cx + Math.cos(t * 0.001) * radius;
        targetMouse.y = cy + Math.sin(t * 0.001) * radius;
      }

      mouseRef.current.x += (targetMouse.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouse.y - mouseRef.current.y) * 0.05;

      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uSpeed.value = speed;
      program.uniforms.uFrequency.value = frequency;
      program.uniforms.uIntensity.value = intensity;
      program.uniforms.uDarkTheme.value = darkThemeVal;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];

      renderer.render({ scene: mesh });
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [speed, frequency, intensity, darkThemeVal]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 -z-10 pointer-events-none" />;
}
