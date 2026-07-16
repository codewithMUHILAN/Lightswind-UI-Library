"use client";

import { useRef, useEffect } from "react";

export interface GlowingLinesProps {
  /** Forward travel speed along the roller-coaster path. Default: 1.0 */
  speed?: number;
  /** Color of line 1 as [R, G, B] normalized 0–1. Default: cyan [0, 0.9, 1] */
  color1?: [number, number, number];
  /** Color of line 2 as [R, G, B] normalized 0–1. Default: magenta [1, 0.1, 0.9] */
  color2?: [number, number, number];
  /** Glow brightness. Default: 1.0 */
  glowIntensity?: number;
  /** Thickness of each neon line. Default: 1.0 */
  lineRadius?: number;
  /** Lateral separation between the two rails. Default: 8.0 */
  railSeparation?: number;
  /** Amplitude of the gentle banking undulation. Default: 6.0 */
  bankAmplitude?: number;
  /** How aggressively the camera path curves (roller coaster bends). Default: 1.0 */
  pathCurvature?: number;
  /** Camera field-of-view (lower = more telephoto / depth). Default: 1.2 */
  fov?: number;
  /** Resolution downscale (0.25–1) for performance. Default: 1.0 */
  resolutionScale?: number;
  /** Additional className for the wrapper */
  className?: string;
}

export default function GlowingLines({
  speed = 1.0,
  color1 = [0.0, 0.9, 1.0],
  color2 = [1.0, 0.1, 0.9],
  glowIntensity = 1.0,
  lineRadius = 1.0,
  railSeparation = 8.0,
  bankAmplitude = 6.0,
  pathCurvature = 1.0,
  fov = 1.2,
  resolutionScale = 1.0,
  className,
}: GlowingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({
    speed, color1, color2, glowIntensity, lineRadius,
    railSeparation, bankAmplitude, pathCurvature, fov,
  });

  useEffect(() => {
    propsRef.current = {
      speed, color1, color2, glowIntensity, lineRadius,
      railSeparation, bankAmplitude, pathCurvature, fov,
    };
  }, [speed, color1, color2, glowIntensity, lineRadius, railSeparation, bankAmplitude, pathCurvature, fov]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl2");
    if (!gl) { container.removeChild(canvas); return; }

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

    /* ─────────── FRAGMENT SHADER ─────────── */
    const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform float uSpeed;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uGlowIntensity;
uniform float uLineRadius;
uniform float uRailSep;
uniform float uBankAmp;
uniform float uPathCurv;
uniform float uFov;

// ── Roller-coaster camera path ──────────────────────────────────────────────
// Long-period gentle curves so the track bends and banks, never loops back.
vec3 pathCenter(float z) {
    float c = uPathCurv;
    // Two overlapping sine/cosine at very different frequencies for natural feel
    float x = sin(z * 0.009) * 40. * c + cos(z * 0.0031) * 20. * c;
    float y = cos(z * 0.007) * 25. * c + sin(z * 0.0041) * 10. * c;
    return vec3(x, y, z);
}

// ── Camera orientation (Frenet frame along path) ────────────────────────────
vec3 pathTangent(float z) {
    float h = 2.0;
    return normalize(pathCenter(z + h) - pathCenter(z - h));
}

mat3 cameraFrame(float z) {
    vec3 fwd = pathTangent(z);
    // Use world-up with small banking derived from path curvature
    vec3 worldUp = vec3(0., 1., 0.);
    vec3 rgt = normalize(cross(fwd, worldUp));
    vec3 up  = cross(rgt, fwd);
    // Slight banking: lean into corners
    vec3 nextFwd = pathTangent(z + 15.);
    vec3 bank = nextFwd - fwd;
    rgt = normalize(rgt + bank * 3.0);
    up  = normalize(cross(rgt, fwd));
    return mat3(rgt, up, fwd);
}

// ── Distance to the two neon rails ──────────────────────────────────────────
// Rails run ALONGSIDE the camera path (like roller-coaster tracks).
// Very long wavelength gentle undulation keeps them from looping back.
vec2 railDists(vec3 p) {
    vec3  q     = pathCenter(p.z);
    mat3  frame = cameraFrame(p.z);
    // Local XY in path frame
    vec3  dp    = p - q;
    float lx    = dot(dp, frame[0]);  // lateral (left-right)
    float ly    = dot(dp, frame[1]);  // vertical (up-down)

    // Very slow, long-period banking wave on the rails
    float wz = p.z * 0.0035;
    float bankX = sin(wz          ) * uBankAmp;
    float bankY = cos(wz + 1.047  ) * uBankAmp * 0.5;
    float bank2X= sin(wz + 3.14159) * uBankAmp;
    float bank2Y= cos(wz + 4.19   ) * uBankAmp * 0.5;

    // Rail 1 (left side + slow wave)
    float r1 = length(vec2(lx - (-uRailSep + bankX), ly - bankY))  - uLineRadius;
    // Rail 2 (right side + slow counter-wave)
    float r2 = length(vec2(lx - ( uRailSep + bank2X), ly - bank2Y)) - uLineRadius;

    return vec2(r1, r2);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution.xy * 0.5) / uResolution.y;

    // ── Camera setup ──
    float T   = uTime * uSpeed * 80.;       // forward travel distance
    vec3  ro  = pathCenter(T);
    mat3  fr  = cameraFrame(T);

    // Camera sits slightly above rail level
    ro += fr[1] * 3.0;

    // Ray direction using camera frame
    vec3 rd = normalize(fr[0] * uv.x + fr[1] * uv.y + fr[2] * uFov);

    // ── Volumetric raymarching ──
    vec3 col = vec3(0.);
    float d  = 1.0;
    float maxD = 600.;

    for (int i = 0; i < 160; i++) {
        vec3  p    = ro + rd * d;
        vec2  dsts = railDists(p);

        float d1 = dsts.x;
        float d2 = dsts.y;
        float sd = min(abs(d1), abs(d2));

        // Glow: inversely proportional to squared distance from each rail
        // Attenuate glow with march distance for depth perspective
        float att = 1.0 / (1.0 + d * d * 0.000012);
        float g1  = uGlowIntensity * att / (0.02 + d1 * d1 * 4.0);
        float g2  = uGlowIntensity * att / (0.02 + d2 * d2 * 4.0);

        col += uColor1 * g1 * 0.06;
        col += uColor2 * g2 * 0.06;

        // Adaptive step: tight near lines, large in empty space
        float step = max(sd * 0.55, 0.15);
        d += step;
        if (d > maxD) break;
    }

    // ── Tone-map & grade ──
    col  = 1.0 - exp(-col * 1.4);          // HDR exposure
    col  = pow(col, vec3(0.85));            // subtle gamma lift

    // Vignette
    float vig = length(uv * 0.55);
    col *= 1.0 - vig * vig * 0.8;

    fragColor = vec4(col, 1.0);
}`;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen triangle
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uLoc = {
      resolution:   gl.getUniformLocation(prog, "uResolution"),
      time:         gl.getUniformLocation(prog, "uTime"),
      speed:        gl.getUniformLocation(prog, "uSpeed"),
      color1:       gl.getUniformLocation(prog, "uColor1"),
      color2:       gl.getUniformLocation(prog, "uColor2"),
      glowIntensity:gl.getUniformLocation(prog, "uGlowIntensity"),
      lineRadius:   gl.getUniformLocation(prog, "uLineRadius"),
      railSep:      gl.getUniformLocation(prog, "uRailSep"),
      bankAmp:      gl.getUniformLocation(prog, "uBankAmp"),
      pathCurv:     gl.getUniformLocation(prog, "uPathCurv"),
      fov:          gl.getUniformLocation(prog, "uFov"),
    };

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (!w || !h) return;
      canvas.width  = Math.round(w * resolutionScale);
      canvas.height = Math.round(h * resolutionScale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog);
      gl.uniform2f(uLoc.resolution, w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    let rafId: number;
    const start = performance.now();

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      const pr = propsRef.current;
      if (!pr) return;

      gl.uniform1f(uLoc.time,          (t - start) / 1000);
      gl.uniform1f(uLoc.speed,         pr.speed);
      gl.uniform3fv(uLoc.color1,       pr.color1);
      gl.uniform3fv(uLoc.color2,       pr.color2);
      gl.uniform1f(uLoc.glowIntensity, pr.glowIntensity);
      gl.uniform1f(uLoc.lineRadius,    pr.lineRadius);
      gl.uniform1f(uLoc.railSep,       pr.railSeparation);
      gl.uniform1f(uLoc.bankAmp,       pr.bankAmplitude);
      gl.uniform1f(uLoc.pathCurv,      pr.pathCurvature);
      gl.uniform1f(uLoc.fov,           pr.fov);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [resolutionScale]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] overflow-hidden bg-black ${className || ""}`}
    />
  );
}
