// PlasmaGlobe.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface PlasmaGlobeProps {
  speed?: number; // global time speed multiplier
  intensity?: number; // color intensity multiplier
}

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/*
  Adapted & simplified plasma globe fragment shader (from Shadertoy-style code).
  Replaces texture-based noise with small procedural noise functions so it
  runs without external textures. Uses uniforms:
    - uTime (float)
    - uResolution (vec2)
    - uMouse (vec2)
    - uSpeed (float)
    - uIntensity (float)

  NOTE: keep an eye on precision and performance on low-end GPUs.
*/
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uIntensity;

#define NUM_RAYS 13.0
#define VOLUMETRIC_STEPS 19
#define MAX_ITER 35
#define FAR 6.0

// small 2x2 rotation matrix
mat2 mm2(float a){
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

// simple hash-based random
float hash1(float n){ return fract(sin(n)*43758.5453); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

// value noise from vec3 -> float (cheap, not high quality but ok)
float noise3(vec3 p){
  // grid cell
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  fp = fp*fp*(3.0-2.0*fp);

  float n000 = hash2(ip.xy + ip.z*7.0);
  float n100 = hash2(ip.xy + vec2(1.0,0.0) + ip.z*7.0);
  float n010 = hash2(ip.xy + vec2(0.0,1.0) + ip.z*7.0);
  float n110 = hash2(ip.xy + vec2(1.0,1.0) + ip.z*7.0);

  float nx0 = mix(n000, n100, fp.x);
  float nx1 = mix(n010, n110, fp.x);
  float nxy = mix(nx0, nx1, fp.y);

  // incorporate z as small modulation using hash
  float nz = mix(nxy, hash1(ip.z + 1.0), fp.z);
  return nz;
}

// light-weight fractal noise (based on noise3)
float flow(vec3 p, float t){
  float rz = 0.0;
  vec3 bp = p;
  float z = 2.0;
  // a few octaves
  for (int i = 1; i < 5; i++){
    p += t * 0.1;
    rz += (sin(noise3(p + t*0.8) * 6.0) * 0.5 + 0.5) / z;
    p = mix(bp, p, 0.6);
    z *= 2.0;
    p *= 2.01;
    p *= mat3(
      0.00,  0.80,  0.60,
     -0.80,  0.36, -0.48,
     -0.60, -0.48,  0.64
    );
  }
  return rz;
}

// helper used to create wavy variations (low-frequency)
float sins(float x, float t){
  float rz = 0.0;
  float z = 2.0;
  for (int i = 0; i < 3; i++){
    rz += abs(fract(x * 1.4) - 0.5) / z;
    x *= 1.3;
    z *= 1.15;
    x -= t * 0.65 * z;
  }
  return rz;
}

float segm(vec3 p, vec3 a, vec3 b){
  vec3 pa = p - a;
  vec3 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) * 0.5;
}

vec3 path(float i, float d, float t){
  // produce a pseudo-random endpoint on unit sphere influenced by i and d
  float sns2 = sins(d + i * 0.5, t) * 0.22;
  float sns = sins(d + i * 0.6, t) * 0.21;
  float a1 = (hash1(i * 10.569) - 0.5) * 6.2 + sns2;
  float a2 = (hash1(i * 4.732) - 0.5) * 6.2 + sns;
  vec3 en = vec3(0.0, 0.0, 1.0);
  en.xz *= mat2(cos(a1), -sin(a1), sin(a1), cos(a1));
  en.xy *= mat2(cos(a2), -sin(a2), sin(a2), cos(a2));
  return en;
}

vec2 map(vec3 p, float i, float t){
  float lp = length(p);
  vec3 bg = vec3(0.0);
  vec3 en = path(i, lp, t);
  float ins = smoothstep(0.11, 0.46, lp);
  float outs = 0.15 + smoothstep(0.0, 0.15, abs(lp - 1.0));
  p *= ins * outs;
  float id = ins * outs;
  float rz = segm(p, bg, en) - 0.011;
  return vec2(rz, id);
}

// sphere-ray intersection helper
vec2 iSphere2(vec3 ro, vec3 rd){
  vec3 oc = ro;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - 1.0;
  float h = b*b - c;
  if (h < 0.0) return vec2(-1.0);
  return vec2((-b - sqrt(h)), (-b + sqrt(h)));
}

// volumetric march (accumulates light along a ray)
vec3 vmarch(vec3 ro, vec3 rd, float j, vec3 orig, float t){
  vec3 p = ro;
  vec3 sum = vec3(0.0);
  for (int i = 0; i < VOLUMETRIC_STEPS; i++){
    vec2 r = map(p, j, t);
    p += rd * 0.03;
    float lp = length(p);
    // create color base per-step
    vec3 col = sin(vec3(1.05, 2.5, 1.52) * 3.94 + r.y) * 0.85 + 0.4;
    col *= smoothstep(0.0, 0.015, -r.x);
    col *= smoothstep(0.04, 0.2, abs(lp - 1.1));
    col *= smoothstep(0.1, 0.34, lp);
    // noise modulation
    float n = noise3(vec3(lp * 2.0 + j * 13.0 + t * 5.0));
    // attenuate with distance from origin and add
    float denom = max(0.0001, log(max(0.0001, distance(p, orig) - 2.0)) + 0.75);
    sum += abs(col) * 5.0 * (1.2 - n * 1.1) / denom;
  }
  return sum;
}

// ray-marching distance estimator to sphere-like structures
float march(vec3 ro, vec3 rd, float startf, float maxd, float j, float t){
  float precis = 0.001;
  float h = 0.5;
  float d = startf;
  for (int i = 0; i < MAX_ITER; i++){
    if (abs(h) < precis || d > maxd) break;
    d += h * 1.2;
    float res = map(ro + rd * d, j, t).x;
    h = res;
  }
  return d;
}

void main(){
  // Normalized coords (-0.5..0.5)
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) - 0.5;
  uv.x *= uResolution.x / uResolution.y;
  vec2 um = (uMouse.xy / uResolution.xy) - 0.5;

  // camera setup
  vec3 ro = vec3(0.0, 0.0, 5.0);
  vec3 rd = normalize(vec3(uv * 0.7, -1.5));
  mat2 mx = mm2(uTime * 0.4 + um.x * 6.0);
  mat2 my = mm2(uTime * 0.3 + um.y * 6.0);
  ro.xz *= mx; rd.xz *= mx;
  ro.xy *= my; rd.xy *= my;

  vec3 bro = ro;
  vec3 brd = rd;

  vec3 col = vec3(0.0125, 0.0, 0.025);

  // multiple rays to create many filaments
  for (float j = 1.0; j < NUM_RAYS + 1.0; j++){
    ro = bro;
    rd = brd;
    mat2 mm = mm2((uTime * 0.1 + ((j + 1.0) * 5.1)) * j * 0.25);
    ro.xy *= mm; rd.xy *= mm;
    ro.xz *= mm; rd.xz *= mm;
    float rz = march(ro, rd, 2.5, FAR, j, uTime);
    if (rz >= FAR) continue;
    vec3 pos = ro + rz * rd;
    col = max(col, vmarch(pos, rd, j, bro, uTime));
  }

  ro = bro;
  rd = brd;
  vec2 sph = iSphere2(ro, rd);

  if (sph.x > 0.0){
    vec3 pos = ro + rd * sph.x;
    vec3 pos2 = ro + rd * sph.y;
    vec3 rf = reflect(rd, normalize(pos));
    vec3 rf2 = reflect(rd, normalize(pos2));
    float nz = (-log(abs(flow(rf * 1.2, uTime) - 0.01) + 0.00001));
    float nz2 = (-log(abs(flow(rf2 * 1.2, -uTime) - 0.01) + 0.00001));
    col += (0.1 * nz * nz * vec3(0.12, 0.12, 0.5) + 0.05 * nz2 * nz2 * vec3(0.55, 0.2, 0.55)) * 0.8;
  }

  // final tone mapping & intensity
  col *= (1.0 + uIntensity * 0.6);
  col = pow(clamp(col, 0.0, 10.0), vec3(1.5));
  fragColor = vec4(col * 1.3, 1.0);
}
`;

export default function PlasmaGlobe({
  speed = 1.0,
  intensity = 1.0,
}: PlasmaGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // create renderer
    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // geometry
    const geometry = new Triangle(gl);

    // program
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uMouse: { value: [0, 0] },
        uSpeed: { value: speed },
        uIntensity: { value: intensity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    // resize
    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };
    window.addEventListener("resize", resize);
    resize();

    // mouse smoothing
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x += (e.clientX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (e.clientY - mouseRef.current.y) * 0.08;
    };
    window.addEventListener("mousemove", onMouse);

    let rafId = 0;
    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      // uTime passed in seconds, multiplied by speed
      program.uniforms.uTime.value = (t * 0.001) * speed;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      program.uniforms.uIntensity.value = intensity;
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [speed, intensity]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none 
            !rounded-xl !bg-transparent"
      style={{ transform: "scale(0.50)", borderRadius: '50px' }} // 0.75 = 75%
    />

  );
}
