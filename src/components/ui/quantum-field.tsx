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
uniform vec3 uColorGrid;
uniform vec3 uColorNodes;

// Configurations
uniform float uSpeed;
uniform float uGridDensity;
uniform float uWarpStrength;
uniform float uInteractive;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized coordinates (-1 to 1)
    vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = (2.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float mouseDist = length(uv - mouseUV);
    
    // Warp coordinates based on cursor proximity (creates a gravity well / indentation)
    float warpFactor = exp(-mouseDist * mouseDist * 3.0) * iMouseStrength * uWarpStrength * uInteractive;
    
    // Displace uv coordinate towards mouse (pulling the grid lines)
    vec2 warpedUV = uv;
    if (mouseDist > 0.001) {
        warpedUV = uv - normalize(uv - mouseUV) * warpFactor * 0.15;
    }
    
    // Scale for grid density
    vec2 gridSpace = warpedUV * uGridDensity;
    
    // Simple robust grid lines (no fwidth needed)
    float lineThickness = 0.04;
    float gridX = smoothstep(0.5 - lineThickness, 0.5, abs(fract(gridSpace.x) - 0.5));
    float gridY = smoothstep(0.5 - lineThickness, 0.5, abs(fract(gridSpace.y) - 0.5));
    float lineVal = (1.0 - gridX) + (1.0 - gridY);
    lineVal = clamp(lineVal, 0.0, 1.0);
    
    // Grid glow based on proximity to mouse
    float gridGlow = exp(-mouseDist * mouseDist * 1.5) * iMouseStrength * uInteractive;
    vec3 col = mix(uColorGrid * 0.25, uColorGrid * 1.3, gridGlow) * lineVal;
    
    // Add pulsing quantum nodes at grid intersections
    vec2 ipos = floor(gridSpace);
    vec2 fpos = fract(gridSpace);
    
    // Node animation pulse
    float pulse = 0.5 + 0.5 * sin(iTime * uSpeed * 2.0 + hash(ipos) * 6.28);
    
    float nodeDist = length(fpos - 0.5);
    float nodeGlow = exp(-nodeDist * nodeDist * 40.0);
    
    // Add nodes light to color
    col += uColorNodes * nodeGlow * (0.35 + 0.65 * pulse);
    
    // Add bright highlight tracking the cursor
    float mouseGlow = exp(-mouseDist * mouseDist * 8.0) * iMouseStrength * uInteractive;
    col += uColorNodes * mouseGlow * 0.5;
    
    // Dark vignette
    vec2 centerUV = fragCoord.xy / iResolution.xy;
    float vignette = 1.0 - dot(centerUV - 0.5, centerUV - 0.5) * 1.5;
    vignette = max(0.0, vignette);

    // Calculate alpha transparency based on line density, nodes, and cursor glow
    float alpha = clamp(lineVal * 0.8 + nodeGlow * (0.35 + 0.65 * pulse) + mouseGlow * 0.5, 0.0, 1.0);

    col *= vignette;
    alpha *= vignette;

    fragColor = vec4(col, alpha);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface QuantumFieldProps {
  colorGrid?: string;
  colorNodes?: string;
  speed?: number;
  gridDensity?: number;
  warpStrength?: number;
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

const defaultColorGrid = "#0e4b85";  // Deep technological blue
const defaultColorNodes = "#00f0ff"; // Bright cyan pulse

const QuantumField: React.FC<QuantumFieldProps> = ({
  colorGrid = defaultColorGrid,
  colorNodes = defaultColorNodes,
  speed = 1.0,
  gridDensity = 12.0,
  warpStrength = 1.0,
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

    // Parse colors
    const parsedGrid = hexToRgb(colorGrid);
    const parsedNodes = hexToRgb(colorNodes);

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

    const uColorGridLocation = gl.getUniformLocation(program, "uColorGrid");
    const uColorNodesLocation = gl.getUniformLocation(program, "uColorNodes");
    
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uGridDensityLocation = gl.getUniformLocation(program, "uGridDensity");
    const uWarpStrengthLocation = gl.getUniformLocation(program, "uWarpStrength");
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
      gl.uniform3fv(uColorGridLocation, parsedGrid);
      gl.uniform3fv(uColorNodesLocation, parsedNodes);

      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uGridDensityLocation, gridDensity);
      gl.uniform1f(uWarpStrengthLocation, warpStrength);
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
  }, [colorGrid, colorNodes, speed, gridDensity, warpStrength, interactive]);

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

export default QuantumField;
