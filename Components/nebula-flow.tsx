"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform float iMouseStrength;

// Colors
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

// Configurations
uniform float uSpeed;
uniform float uScale;
uniform float uDensity;
uniform float uInteractive;

// Hash function
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// 2D Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

// Fractal Brownian Motion (FBM) with rotation to create cosmic swirls
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    float frequency = 1.0;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        p = rot * p;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
    
    // Smooth interactive mouse gravity / swirl force
    vec2 mouseUV = (2.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);
    float mouseDist = length(p - mouseUV);
    
    float influence = exp(-mouseDist * mouseDist * 2.5) * iMouseStrength * uInteractive;
    
    // Swirl rotation matrix
    float angle = influence * 2.2 * sin(iTime * 1.2);
    mat2 swirl = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    p = swirl * p;
    
    // Displace coordinates towards mouse (gravitational pull)
    p -= (p - mouseUV) * influence * 0.12;

    // Nebula time flow
    float t = iTime * uSpeed * 0.15;
    
    // Double domain warping FBM to simulate detailed cosmic gas clouds
    vec2 q = vec2(fbm(p * uScale + vec2(t, t * 0.5)),
                  fbm(p * uScale + vec2(t * 0.2, t)));
                  
    vec2 r = vec2(fbm(p * uScale + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
                  fbm(p * uScale + 4.0 * q + vec2(8.3, 2.8) + t * 0.12));
                  
    float f = fbm(p * uScale + 4.0 * r);
    
    // Interpolate cosmic color gas layers
    vec3 col = mix(uColor1, uColor2, clamp(f * f * 4.0, 0.0, 1.0));
    col = mix(col, uColor3, clamp(length(q), 0.0, 1.0));
    
    // High-energy core highlights (cosmic dust stars)
    float stars = pow(f, 3.5) * uDensity * 0.75;
    col += vec3(stars * 1.2, stars * 1.0, stars * 1.3);
    
    // Vignette
    float vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.3;
    col *= max(0.0, vignette);

    // Final color grading
    col = clamp(col, 0.0, 1.0);
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface NebulaFlowProps {
  colors?: string[];
  speed?: number;
  scale?: number;
  density?: number; // Cosmic dust star density factor
  interactive?: boolean;
  backdropBlurAmount?: BlurSize;
  className?: string;
}

const blurClassMap: Record<BlurSize, string> = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

const hexToRgb = (hex: string): [number, number, number] => {
  try {
    const cleaned = hex.replace("#", "");
    const num = parseInt(cleaned, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  } catch {
    return [0, 0, 0];
  }
};

const defaultColors = ["#0c061a", "#290d54", "#ec4899"]; // Deep space pink-purple nebula colors

const NebulaFlow: React.FC<NebulaFlowProps> = ({
  colors = defaultColors,
  speed = 1.0,
  scale = 1.0,
  density = 1.0,
  interactive = true,
  backdropBlurAmount = "none",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const visibilityRef = useRef(true);

  // Mouse coords and active strength refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const mouseStrengthRef = useRef({ value: 0, targetValue: 0 });

  useEffect(() => {
    visibilityRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Parse custom colors
    const colorRGBs: [number, number, number][] = [];
    const parsed = colors.map(hexToRgb);
    colorRGBs.push(parsed[0] || [0.0, 0.0, 0.0]);
    colorRGBs.push(parsed[1] || parsed[0] || [0.0, 0.0, 0.0]);
    colorRGBs.push(parsed[2] || parsed[1] || parsed[0] || [0.0, 0.0, 0.0]);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const iMouseStrengthLocation = gl.getUniformLocation(program, "iMouseStrength");

    const uColor1Location = gl.getUniformLocation(program, "uColor1");
    const uColor2Location = gl.getUniformLocation(program, "uColor2");
    const uColor3Location = gl.getUniformLocation(program, "uColor3");
    
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uScaleLocation = gl.getUniformLocation(program, "uScale");
    const uDensityLocation = gl.getUniformLocation(program, "uDensity");
    const uInteractiveLocation = gl.getUniformLocation(program, "uInteractive");

    // Native mouse and touch listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    const handleMouseEnter = () => {
      if (!interactive) return;
      mouseStrengthRef.current.targetValue = 1.0;
    };

    const handleMouseLeave = () => {
      if (!interactive) return;
      mouseStrengthRef.current.targetValue = 0.0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = rect.height - (touch.clientY - rect.top);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive) return;
      mouseStrengthRef.current.targetValue = 1.0;
      handleTouchMove(e);
    };

    const handleTouchEnd = () => {
      if (!interactive) return;
      mouseStrengthRef.current.targetValue = 0.0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });

    let startTime = Date.now();
    let animationFrameId: number;

    const render = () => {
      if (!visibilityRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Handle resize and match resolution
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.useProgram(program);
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      // Lerp mouse coordinates and strength for smooth momentum
      const mouse = mouseRef.current;
      const mouseStrength = mouseStrengthRef.current;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouseStrength.value += (mouseStrength.targetValue - mouseStrength.value) * 0.08;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, mouse.x, mouse.y);
      gl.uniform1f(iMouseStrengthLocation, mouseStrength.value);

      // Set uniforms
      gl.uniform3fv(uColor1Location, colorRGBs[0]);
      gl.uniform3fv(uColor2Location, colorRGBs[1]);
      gl.uniform3fv(uColor3Location, colorRGBs[2]);

      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uScaleLocation, scale);
      gl.uniform1f(uDensityLocation, density);
      gl.uniform1f(uInteractiveLocation, interactive ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);

      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [colors, speed, scale, density, interactive]);

  const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["none"];

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block", pointerEvents: "auto" }}
      />
      <div className={`absolute inset-0 pointer-events-none ${finalBlurClass}`} />
    </div>
  );
};

export default NebulaFlow;
