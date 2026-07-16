"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/components/lib/utils";

interface VolumetricFractalBackgroundProps {
  className?: string;
  timeScale?: number;
  loopLimit?: number;
  chromaShift?: [number, number, number, number];
  lightFade?: number;
  advanceBase?: number;
  scatter?: number;
}

const VERT_SRC = `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_time_mul;
  uniform float u_loop_limit;
  uniform vec4  u_chroma;
  uniform float u_core_radius;
  uniform float u_advance;
  uniform float u_noise_freq;
  uniform float u_scatter;
  uniform float u_light_fade;

  void main() {
    vec2 uv = gl_FragCoord.xy;
    vec4 acc = vec4(0.0);

    float depth = 0.0;
    float t = u_time * u_time_mul;

    vec3 rd = normalize(vec3(uv * 2.0 - u_res, -u_res.y * 1.5));

    // Mouse rotation
    float ax = u_mouse.x * 1.2;
    float ay = u_mouse.y * 0.8;
    float cx = cos(ax), sx = sin(ax);
    float cy = cos(ay), sy = sin(ay);
    rd.xz = vec2(rd.x * cx - rd.z * sx, rd.x * sx + rd.z * cx);
    rd.yz = vec2(rd.y * cy - rd.z * sy, rd.y * sy + rd.z * cy);

    for (float i = 0.0; i < 200.0; i++) {
      if (i >= u_loop_limit) break;

      vec3 p = depth * rd;
      p.z += t * 0.5;
      p.xy += u_mouse * 2.5;

      float sv = 1.0;
      for (int j = 0; j < 7; j++) {
        if (sv > 10.0) break;
        vec3 sh = p.yzx * sv * u_noise_freq + t * 0.2;
        p += cos(sh) / sv;
        sv *= 1.45;
      }

      float lxy = length(p.xy);
      float cd  = abs(u_core_radius - lxy);
      float step_v = u_advance + cd * 0.07;
      depth += step_v;

      float sf = u_scatter / (step_v * 50.0);
      vec4  col = cos(depth + u_chroma + t * 0.12) + 1.0;
      acc += col * sf / (u_light_fade * 0.01);
    }

    gl_FragColor = vec4(acc.rgb, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export const VolumetricFractalBackground = ({
  className,
  timeScale = 0.4,
  loopLimit = 60.0,
  chromaShift = [6.3, 7.0, 3.6, 3.0],
  lightFade = 2600.0,
  advanceBase = 0.045,
  scatter = 2.0,
}: VolumetricFractalBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    // Compile & link
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes    = gl.getUniformLocation(prog, "u_res");
    const uTime   = gl.getUniformLocation(prog, "u_time");
    const uMouse  = gl.getUniformLocation(prog, "u_mouse");
    const uTMul   = gl.getUniformLocation(prog, "u_time_mul");
    const uLoop   = gl.getUniformLocation(prog, "u_loop_limit");
    const uChroma = gl.getUniformLocation(prog, "u_chroma");
    const uCore   = gl.getUniformLocation(prog, "u_core_radius");
    const uAdv    = gl.getUniformLocation(prog, "u_advance");
    const uFreq   = gl.getUniformLocation(prog, "u_noise_freq");
    const uScat   = gl.getUniformLocation(prog, "u_scatter");
    const uFade   = gl.getUniformLocation(prog, "u_light_fade");

    // Set static uniforms
    gl.uniform1f(uTMul,   timeScale);
    gl.uniform1f(uLoop,   loopLimit);
    gl.uniform4f(uChroma, ...chromaShift);
    gl.uniform1f(uCore,   2.1);
    gl.uniform1f(uAdv,    advanceBase);
    gl.uniform1f(uFreq,   0.7);
    gl.uniform1f(uScat,   scatter);
    gl.uniform1f(uFade,   lightFade);

    // Resize
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);

    // Mouse — attached to the CANVAS itself so it works inside iframes
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTarget.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouseTarget.y = -(((e.clientY - rect.top)  / rect.height) * 2 - 1);
    };
    canvas.addEventListener("pointermove", onPointerMove);

    // Animation loop
    let raf: number;
    const start = performance.now();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = (performance.now() - start) * 0.001;

      // Smooth mouse lerp with idle drift
      const idleX = Math.sin(t * 0.5) * 0.2;
      const idleY = Math.cos(t * 0.3) * 0.2;
      
      mouseCurrent.x += (mouseTarget.x + idleX - mouseCurrent.x) * 0.05;
      mouseCurrent.y += (mouseTarget.y + idleY - mouseCurrent.y) * 0.05;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseCurrent.x, mouseCurrent.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [timeScale, loopLimit, chromaShift, lightFade, advanceBase, scatter]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full block touch-none", className)}
    />
  );
};
