"use client";

import { useEffect, useRef } from "react";

/**
 * Valid blur sizes supported by Tailwind CSS.
 */
export type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

/**
 * @typedef {Object} HellBackgroundProps
 * @property {BlurSize} [backdropBlurAmount] - The size of the backdrop blur to apply.
 * @property {string} [className] - Additional CSS classes to apply to the container div.
 */
interface HellBackgroundProps {
  backdropBlurAmount?: string;
  className?: string;
}

/**
 * A mapping from simplified blur size names to full Tailwind CSS backdrop-blur classes.
 */
const blurClassMap: Record<BlurSize, string> = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

float cosRange(float amt, float range, float minimum) {
  return (((1.0 + cos(radians(amt))) * 0.5) * range) + minimum;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  const int zoom = 40;
  const float brightness = 0.975;
  float time = iTime * 1.25;
  vec2 uv = fragCoord.xy / iResolution.xy;
  vec2 p  = (2.0 * fragCoord.xy - iResolution.xy) / max(iResolution.x, iResolution.y);
  float ct = cosRange(time * 5.0, 3.0, 1.1);
  float xBoost = cosRange(time * 0.2, 5.0, 5.0);
  float yBoost = cosRange(time * 0.1, 10.0, 5.0);
  float fScale = cosRange(time * 15.5, 1.25, 0.5);

  for (int i = 1; i < zoom; i++) {
    float _i = float(i);
    vec2 newp = p;
    newp.x += 0.25 / _i * sin(_i * p.y + time * cos(ct) * 0.5 / 20.0 + 0.005 * _i) * fScale + xBoost;
    newp.y += 0.25 / _i * sin(_i * p.x + time * ct * 0.3 / 40.0 + 0.03 * float(i + 15)) * fScale + yBoost;
    p = newp;
  }

  vec3 col = vec3(
    0.5 * sin(3.0 * p.x) + 0.5,
    0.5 * sin(3.0 * p.y) + 0.5,
    sin(p.x + p.y)
  );
  col *= brightness;

  float vigAmt = 5.0;
  float vignette = (1. - vigAmt * (uv.y - 0.5) * (uv.y - 0.5)) * (1. - vigAmt * (uv.x - 0.5) * (uv.x - 0.5));
  float extrusion = (col.x + col.y + col.z) / 4.0;
  extrusion *= 1.5;
  extrusion *= vignette;

  fragColor = vec4(col, extrusion);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;


function GradientBackground({
  backdropBlurAmount = "none",
  className = "",
}: HellBackgroundProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    let startTime = Date.now();

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    render();
  }, []);

  const finalBlurClass = blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap["sm"];

return (
  <div className={`w-full max-w-screen h-full overflow-hidden bg-black dark:bg-black ${className}`}>
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full max-w-screen h-full overflow-hidden"
      style={{ display: "block" }}
    />
    <div className={`absolute inset-0 ${finalBlurClass}`} />
  </div>
);

}

export default GradientBackground;
