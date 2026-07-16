"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Color } from "ogl";

export interface GlassCoinCarouselProps {
  className?: string;
  /** Number of coins in the carousel (default: 9) */
  coinsCount?: number;
  /** Orbit radius of the carousel (default: 2.3) */
  radius?: number;
  /** Radius of each individual coin (default: 0.65) */
  coinRadius?: number;
  /** Thickness of each individual coin (default: 0.12) */
  coinThickness?: number;
  /** Rotation speed multiplier (default: 0.8) */
  speed?: number;
  /** Primary gradient color 1 (default: "#3b82f6" - Blue) */
  color1?: string;
  /** Primary gradient color 2 (default: "#a855f7" - Purple) */
  color2?: string;
  /** Maximum opacity level of the glass coins (default: 0.85) */
  maxOpacity?: number;
  /** Center overlay text */
  centerText?: string;
  /** Custom class name for center text overlay styling */
  centerTextClassName?: string;
}

const VERTEX_SHADER_SOURCE = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uRadius;
uniform float uCoinRadius;
uniform float uCoinThickness;
uniform float uSpeed;
uniform int uCoinsCount;
uniform float uMaxOpacity;
uniform float uDarkTheme; // 1.0 for dark mode, 0.0 for light mode

out vec4 fragColor;

// Ellipsoid SDF from Inigo Quilez
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

// Global scene map function
float map(vec3 p, out int hitId, out vec3 localP, out float hitAngle, out float wobbleVal) {
  float d = 1e10;
  hitId = -1;
  
  // Dynamically loop over coins
  for (int i = 0; i < 9; i++) {
    float angle = float(i) * 6.2831853 / 9.0 + uTime * uSpeed;
    
    // Position on XZ plane
    vec3 center = vec3(uRadius * cos(angle), 0.0, uRadius * sin(angle));
    vec3 lp = p - center;
    
    // Tangent orientation vectors
    vec3 N = vec3(cos(angle), 0.0, sin(angle)); // radial
    vec3 B = vec3(0.0, 1.0, 0.0);               // vertical
    vec3 T = vec3(-sin(angle), 0.0, cos(angle)); // tangent
    
    // Project ray coordinates to local coin space
    vec3 localCoord = vec3(
      dot(lp, N),
      dot(lp, B),
      dot(lp, T)
    );
    
    // Add local wobble tilt for organic movement
    float wobble = sin(uTime * 1.5 + float(i) * 0.8) * 0.12;
    float cosW = cos(wobble);
    float sinW = sin(wobble);
    
    float ly = localCoord.y * cosW - localCoord.z * sinW;
    float lz = localCoord.y * sinW + localCoord.z * cosW;
    localCoord.y = ly;
    localCoord.z = lz;
    
    // Compute distance to ellipsoid
    float distCoin = sdEllipsoid(localCoord, vec3(uCoinRadius, uCoinRadius, uCoinThickness));
    
    if (distCoin < d) {
      d = distCoin;
      hitId = i;
      localP = localCoord;
      hitAngle = angle;
      wobbleVal = wobble;
    }
  }
  return d;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  
  // Tilted orbit camera path (downward angle)
  vec3 ro = vec3(0.0, 2.3, 4.8);
  vec3 ta = vec3(0.0, -0.15, 0.0);
  
  // Camera transform setup
  vec3 cw = normalize(ta - ro);
  vec3 cp = vec3(0.0, 1.0, 0.0);
  vec3 cu = normalize(cross(cw, cp));
  vec3 cv = cross(cu, cw);
  vec3 rd = normalize(uv.x * cu + uv.y * cv + 2.0 * cw);
  
  // Raymarch path
  float t = 0.0;
  int hitId = -1;
  vec3 localP;
  float hitAngle = 0.0;
  float wobbleVal = 0.0;
  
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    int currHitId;
    vec3 currLocalP;
    float currHitAngle;
    float currWobble;
    float d = map(p, currHitId, currLocalP, currHitAngle, currWobble);
    if (d < 0.001) {
      hitId = currHitId;
      localP = currLocalP;
      hitAngle = currHitAngle;
      wobbleVal = currWobble;
      break;
    }
    t += d;
    if (t > 10.0) break;
  }
  
  if (hitId != -1) {
    vec3 p = ro + rd * t;
    
    // Calculate 100% accurate analytical normals for the ellipsoid
    vec3 r = vec3(uCoinRadius, uCoinRadius, uCoinThickness);
    vec3 localNormal = localP / (r * r);
    localNormal = normalize(localNormal);
    
    // Reconstruct world-space normal using the wobbled orthogonal frame vectors
    vec3 N = vec3(cos(hitAngle), 0.0, sin(hitAngle)); // radial
    vec3 B = vec3(0.0, 1.0, 0.0);                    // vertical
    vec3 T = vec3(-sin(hitAngle), 0.0, cos(hitAngle)); // tangent
    
    // Apply local wobble rotation to the frame vectors
    float cosW = cos(wobbleVal);
    float sinW = sin(wobbleVal);
    vec3 B_wobbled = B * cosW + T * sinW;
    vec3 T_wobbled = -B * sinW + T * cosW;
    
    // Transform local normal to world space
    vec3 normal = localNormal.x * N + localNormal.y * B_wobbled + localNormal.z * T_wobbled;
    normal = normalize(normal);
    
    // Gradient coloring based on the orbit angle and local position
    vec3 baseColor = mix(uColor1, uColor2, sin(hitAngle) * 0.5 + 0.5);
    float localGrad = localP.x / uCoinRadius * 0.5 + 0.5;
    baseColor = mix(baseColor, mix(uColor2, uColor1, sin(hitAngle) * 0.5 + 0.5), localGrad);
    
    // Fresnel glass reflection mapping (power 2.5 for thicker edge visibility)
    vec3 viewDir = -rd;
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.5);
    
    // Dual Light Sources (key light from top-right-front, fill light from bottom-left)
    vec3 keyLightDir = normalize(vec3(1.5, 3.0, 2.0));
    vec3 fillLightDir = normalize(vec3(-1.0, -1.0, -1.0));
    
    // Deeper shadows inside the coin for better contrast against white backgrounds in Light theme
    float shadowMin = mix(0.18, 0.35, uDarkTheme);
    float keyDiffuse = max(0.0, dot(normal, keyLightDir));
    float fillDiffuse = max(0.0, dot(normal, fillLightDir));
    float shadow = mix(shadowMin, 1.0, keyDiffuse);
    
    // In light mode, glass edges refract less light towards the eye, creating a dark boundary
    // In dark mode, they catch light and glow
    float edgeOcclusion = mix(1.0 - fresnel * 0.55, 1.0, uDarkTheme);
    
    // Specular highlights (sharp high-gloss + soft ambient specular)
    // Softened slightly in light mode to prevent blending with white background
    float specIntensity = mix(0.6, 1.0, uDarkTheme);
    vec3 keyHalfDir = normalize(keyLightDir + viewDir);
    float specSharp = pow(max(0.0, dot(normal, keyHalfDir)), 64.0) * 1.6 * specIntensity;
    float specSoft = pow(max(0.0, dot(normal, keyHalfDir)), 8.0) * 0.35 * specIntensity;
    float specular = specSharp + specSoft;
    
    // Rim glow: bright in dark mode, subdued in light mode
    float rimIntensity = mix(0.25, 0.85, uDarkTheme);
    vec3 rimColor = mix(vec3(0.3, 0.75, 1.0), vec3(0.85, 0.4, 1.0), sin(hitAngle) * 0.5 + 0.5);
    vec3 rimGlow = rimColor * fresnel * rimIntensity;
    
    // Internal light transmission
    vec3 glassColor = baseColor * (shadow * edgeOcclusion + 0.15 * fillDiffuse) + rimGlow + vec3(1.0) * specular;
    
    // Render glass transparency (Light mode is less transparent/higher body opacity to remain visible against white)
    float minAlpha = mix(0.55, 0.42, uDarkTheme);
    float alpha = mix(minAlpha, 0.96, fresnel) * uMaxOpacity;
    alpha = max(alpha, specSharp * 0.6); // keep specular reflections opaque
    
    fragColor = vec4(glassColor, alpha);
  } else {
    // Transparent background
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}`;

export default function GlassCoinCarousel({
  className = "",
  coinsCount = 9,
  radius = 2.3,
  coinRadius = 0.65,
  coinThickness = 0.12,
  speed = 0.8,
  color1 = "#3b82f6",
  color2 = "#a855f7",
  maxOpacity = 0.85,
  centerText = "WANNATHIS.ONE",
  centerTextClassName = "",
}: GlassCoinCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) {
      console.error("WebGL 2 context not available.");
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Dynamic full viewport geometry
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Compile shaders
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed: ", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniforms
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResolutionLoc = gl.getUniformLocation(program, "uResolution");
    const uColor1Loc = gl.getUniformLocation(program, "uColor1");
    const uColor2Loc = gl.getUniformLocation(program, "uColor2");
    const uRadiusLoc = gl.getUniformLocation(program, "uRadius");
    const uCoinRadiusLoc = gl.getUniformLocation(program, "uCoinRadius");
    const uCoinThicknessLoc = gl.getUniformLocation(program, "uCoinThickness");
    const uSpeedLoc = gl.getUniformLocation(program, "uSpeed");
    const uCoinsCountLoc = gl.getUniformLocation(program, "uCoinsCount");
    const uMaxOpacityLoc = gl.getUniformLocation(program, "uMaxOpacity");
    const uDarkThemeLoc = gl.getUniformLocation(program, "uDarkTheme");

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    window.addEventListener("resize", resize);
    resize();

    let animationId: number;
    const render = (time: number) => {
      animationId = requestAnimationFrame(render);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Pass uniforms
      gl.uniform1f(uTimeLoc, time * 0.001);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      
      const c1 = new Color(color1);
      const c2 = new Color(color2);
      gl.uniform3f(uColor1Loc, c1.r, c1.g, c1.b);
      gl.uniform3f(uColor2Loc, c2.r, c2.g, c2.b);

      gl.uniform1f(uRadiusLoc, radius);
      gl.uniform1f(uCoinRadiusLoc, coinRadius);
      gl.uniform1f(uCoinThicknessLoc, coinThickness);
      gl.uniform1f(uSpeedLoc, speed);
      gl.uniform1i(uCoinsCountLoc, coinsCount);
      gl.uniform1f(uMaxOpacityLoc, maxOpacity);
      
      // Determine if active theme is dark
      const isDark = resolvedTheme !== "light";
      gl.uniform1f(uDarkThemeLoc, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    render(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [coinsCount, radius, coinRadius, coinThickness, speed, color1, color2, maxOpacity, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden bg-transparent ${className}`}
    >
      {/* WebGL Render Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block pointer-events-none" />

      {/* Center Text Overlay */}
      {centerText && (
        <div
          className={`absolute z-10 pointer-events-auto text-center font-black select-none tracking-tight font-sans text-neutral-900 dark:text-white filter drop-shadow-md transition-all duration-300 ${centerTextClassName}`}
        >
          {centerText}
        </div>
      )}
    </div>
  );
}
