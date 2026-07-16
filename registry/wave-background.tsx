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

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_has_custom_colors;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = (2.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);

    float dist = length(uv - mouseUV);
    vec2 dir = (uv - mouseUV) / (dist + 0.0001);

    // Wave distortion radiating outwards from mouse position
    float influence = exp(-dist * dist * 3.5) * iMouseStrength;
    uv += dir * influence * 0.2 * sin(dist * 10.0 - iTime * 4.0);

    for(float i = 1.0; i < 8.0; i++) {
        uv.y += i * 0.1 / i * 
            sin(uv.x * i * i + iTime * 0.5) * sin(uv.y * i * i + iTime * 0.5);
    }

    vec3 defaultCol;
    defaultCol.r = uv.y - 0.1;
    defaultCol.g = uv.y + 0.3;
    defaultCol.b = uv.y + 0.95;

    float t = clamp(uv.y + 0.5, 0.0, 1.0);
    vec3 customCol = mix(u_color1, u_color2, t);
    customCol = mix(customCol, u_color3, clamp(uv.y, 0.0, 1.0));

    vec3 col = mix(defaultCol, customCol, clamp(u_has_custom_colors, 0.0, 1.0));

    // Subtle glow highlight around mouse position
    float glow = exp(-dist * dist * 5.0) * iMouseStrength;
    vec3 glowColor = mix(vec3(0.5, 0.8, 1.0), u_color2, clamp(u_has_custom_colors, 0.0, 1.0));
    col += glowColor * glow * 0.35;

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface WaveBackgroundProps {
  backdropBlurAmount?: BlurSize;
  className?: string;
  colors?: string[];
  interactive?: boolean;
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

function WaveBackground({
  backdropBlurAmount = "sm",
  className = "",
  colors,
  interactive = true,
}: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const visibilityRef = useRef(true);

  // Mouse interactivity state refs (zero React re-renders during active mouseMove)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const mouseStrengthRef = useRef({ value: 0, targetValue: 0 });

  useEffect(() => {
    visibilityRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert colors prop if specified
    const hasCustomColors = colors && colors.length > 0;
    const colorRGBs: [number, number, number][] = [];
    if (hasCustomColors) {
      const parsed = colors!.map(hexToRgb);
      colorRGBs.push(parsed[0] || [0.0, 0.0, 0.0]);
      colorRGBs.push(parsed[1] || parsed[0] || [0.0, 0.0, 0.0]);
      colorRGBs.push(parsed[2] || parsed[1] || parsed[0] || [0.0, 0.0, 0.0]);
    }

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

    const uColor1Location = gl.getUniformLocation(program, "u_color1");
    const uColor2Location = gl.getUniformLocation(program, "u_color2");
    const uColor3Location = gl.getUniformLocation(program, "u_color3");
    const uHasCustomColorsLocation = gl.getUniformLocation(program, "u_has_custom_colors");

    // Track mouse events natively to keep high performance
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

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.useProgram(program);
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      // Lerp mouse target values for high class fluid movement
      const mouse = mouseRef.current;
      const mouseStrength = mouseStrengthRef.current;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouseStrength.value += (mouseStrength.targetValue - mouseStrength.value) * 0.08;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, mouse.x, mouse.y);
      gl.uniform1f(iMouseStrengthLocation, mouseStrength.value);

      if (hasCustomColors) {
        gl.uniform1f(uHasCustomColorsLocation, 1.0);
        gl.uniform3fv(uColor1Location, colorRGBs[0]);
        gl.uniform3fv(uColor2Location, colorRGBs[1]);
        gl.uniform3fv(uColor3Location, colorRGBs[2]);
      } else {
        gl.uniform1f(uHasCustomColorsLocation, 0.0);
      }

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
  }, [colors, interactive]);

  const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["sm"];

  return (
    <div ref={containerRef} className={`w-full max-w-screen h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full max-w-screen h-full overflow-hidden"
        style={{ display: "block" }}
      />
      <div className={`absolute inset-0 ${finalBlurClass}`} />
    </div>
  );
}

export default WaveBackground;
