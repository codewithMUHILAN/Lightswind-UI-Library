"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/app/component2/lib/utils";

// --- Types ---
export interface LiquidSurfaceProps {
    className?: string;
    style?: React.CSSProperties;
    colors?: string[];
    speed?: number;
    intensity?: number;
    grainIntensity?: number;
    zoom?: number;
    gradientSize?: number;
    gradientCount?: number;
    color1Weight?: number;
    color2Weight?: number;
    darkNavyColor?: string;
    scheme?: number;
    heading?: string;
    showCursor?: boolean;
}

// --- Utils ---
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        }
        : null;
}

function rgbToHex(r: number, g: number, b: number) {
    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

// --- Classes ---
class TouchTexture {
    size: number;
    width: number;
    height: number;
    maxAge: number;
    radius: number;
    speed: number;
    trail: any[];
    last: any;
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    texture!: THREE.Texture;

    constructor() {
        this.size = 64;
        this.width = this.height = this.size;
        this.maxAge = 64;
        this.radius = 0.25 * this.size;
        this.speed = 1 / this.maxAge;
        this.trail = [];
        this.last = null;
        this.initTexture();
    }

    initTexture() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.texture = new THREE.CanvasTexture(this.canvas);
    }

    update() {
        this.clear();
        let speed = this.speed;
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const point = this.trail[i];
            let f = point.force * speed * (1 - point.age / this.maxAge);
            point.x += point.vx * f;
            point.y += point.vy * f;
            point.age++;
            if (point.age > this.maxAge) {
                this.trail.splice(i, 1);
            } else {
                this.drawPoint(point);
            }
        }
        this.texture.needsUpdate = true;
    }

    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addTouch(point: { x: number; y: number }) {
        let force = 0;
        let vx = 0;
        let vy = 0;
        const last = this.last;
        if (last) {
            const dx = point.x - last.x;
            const dy = point.y - last.y;
            if (dx === 0 && dy === 0) return;
            const dd = dx * dx + dy * dy;
            let d = Math.sqrt(dd);
            vx = dx / d;
            vy = dy / d;
            force = Math.min(dd * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }

    drawPoint(point: any) {
        const pos = {
            x: point.x * this.width,
            y: (1 - point.y) * this.height,
        };

        let intensity = 1;
        if (point.age < this.maxAge * 0.3) {
            intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
        } else {
            const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
            intensity = -t * (t - 2);
        }
        intensity *= point.force;

        const radius = this.radius;
        let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
        let offset = this.size * 5;
        this.ctx.shadowOffsetX = offset;
        this.ctx.shadowOffsetY = offset;
        this.ctx.shadowBlur = radius * 1;
        this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,1)";
        this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class GradientBackground {
    sceneManager: any;
    mesh: THREE.Mesh | null;
    uniforms: any;

    constructor(sceneManager: any, props: LiquidSurfaceProps) {
        this.sceneManager = sceneManager;
        this.mesh = null;
        this.uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(100, 100) },
            uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor2: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uColor3: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor4: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uColor5: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor6: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uSpeed: { value: props.speed || 1.2 },
            uIntensity: { value: props.intensity || 1.8 },
            uTouchTexture: { value: null },
            uGrainIntensity: { value: props.grainIntensity || 0.08 },
            uZoom: { value: props.zoom || 1.0 },
            uDarkNavy: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uGradientSize: { value: props.gradientSize || 1.0 },
            uGradientCount: { value: props.gradientCount || 6.0 },
            uColor1Weight: { value: props.color1Weight || 1.0 },
            uColor2Weight: { value: props.color2Weight || 1.0 },
        };
    }

    init() {
        const viewSize = this.sceneManager.getViewSize();
        const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vec3 pos = position.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
                uniform vec3 uColor4; uniform vec3 uColor5; uniform vec3 uColor6;
                uniform float uSpeed; uniform float uIntensity; uniform sampler2D uTouchTexture;
                uniform float uGrainIntensity; uniform float uZoom; uniform vec3 uDarkNavy;
                uniform float uGradientSize; uniform float uGradientCount;
                uniform float uColor1Weight; uniform float uColor2Weight;
                
                varying vec2 vUv;
                #define PI 3.14159265359
                
                float grain(vec2 uv, float time) {
                    vec2 grainUv = uv * uResolution * 0.5;
                    float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
                    return grainValue * 2.0 - 1.0;
                }
                
                vec3 getGradientColor(vec2 uv, float time) {
                    float gradientRadius = uGradientSize;
                    vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
                    vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
                    vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
                    vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
                    vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
                    vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
                    vec2 center7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
                    vec2 center8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
                    vec2 center9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
                    vec2 center10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
                    vec2 center11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
                    vec2 center12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);
                    
                    float dist1 = length(uv - center1); float dist2 = length(uv - center2);
                    float dist3 = length(uv - center3); float dist4 = length(uv - center4);
                    float dist5 = length(uv - center5); float dist6 = length(uv - center6);
                    float dist7 = length(uv - center7); float dist8 = length(uv - center8);
                    float dist9 = length(uv - center9); float dist10 = length(uv - center10);
                    float dist11 = length(uv - center11); float dist12 = length(uv - center12);
                    
                    float influence1 = 1.0 - smoothstep(0.0, gradientRadius, dist1);
                    float influence2 = 1.0 - smoothstep(0.0, gradientRadius, dist2);
                    float influence3 = 1.0 - smoothstep(0.0, gradientRadius, dist3);
                    float influence4 = 1.0 - smoothstep(0.0, gradientRadius, dist4);
                    float influence5 = 1.0 - smoothstep(0.0, gradientRadius, dist5);
                    float influence6 = 1.0 - smoothstep(0.0, gradientRadius, dist6);
                    float influence7 = 1.0 - smoothstep(0.0, gradientRadius, dist7);
                    float influence8 = 1.0 - smoothstep(0.0, gradientRadius, dist8);
                    float influence9 = 1.0 - smoothstep(0.0, gradientRadius, dist9);
                    float influence10 = 1.0 - smoothstep(0.0, gradientRadius, dist10);
                    float influence11 = 1.0 - smoothstep(0.0, gradientRadius, dist11);
                    float influence12 = 1.0 - smoothstep(0.0, gradientRadius, dist12);
                    
                    vec2 rotatedUv1 = uv - 0.5;
                    float angle1 = time * uSpeed * 0.15;
                    rotatedUv1 = vec2(rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1), rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1)) + 0.5;
                    
                    vec2 rotatedUv2 = uv - 0.5;
                    float angle2 = -time * uSpeed * 0.12;
                    rotatedUv2 = vec2(rotatedUv2.x * cos(angle2) - rotatedUv2.y * sin(angle2), rotatedUv2.x * sin(angle2) + rotatedUv2.y * cos(angle2)) + 0.5;
                    
                    float radialGradient1 = length(rotatedUv1 - 0.5);
                    float radialGradient2 = length(rotatedUv2 - 0.5);
                    float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, radialGradient1);
                    float radialInfluence2 = 1.0 - smoothstep(0.0, 0.8, radialGradient2);
                    
                    vec3 color = vec3(0.0);
                    color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
                    color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
                    color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
                    color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
                    color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
                    color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
                    
                    if (uGradientCount > 6.0) {
                        color += uColor1 * influence7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
                        color += uColor2 * influence8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
                        color += uColor3 * influence9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
                        color += uColor4 * influence10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
                    }
                    if (uGradientCount > 10.0) {
                        color += uColor5 * influence11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
                        color += uColor6 * influence12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
                    }
                    
                    color += mix(uColor1, uColor3, radialInfluence1) * 0.45 * uColor1Weight;
                    color += mix(uColor2, uColor4, radialInfluence2) * 0.4 * uColor2Weight;
                    
                    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
                    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
                    color = mix(vec3(luminance), color, 1.35);
                    color = pow(color, vec3(0.92));
                    
                    float brightness1 = length(color);
                    float mixFactor1 = max(brightness1 * 1.2, 0.15);
                    color = mix(uDarkNavy, color, mixFactor1);
                    
                    float brightness = length(color);
                    if (brightness > 1.0) color = color * (1.0 / brightness);
                    
                    return color;
                }
                
                void main() {
                    vec2 uv = vUv;
                    vec4 touchTex = texture2D(uTouchTexture, uv);
                    float vx = -(touchTex.r * 2.0 - 1.0);
                    float vy = -(touchTex.g * 2.0 - 1.0);
                    float intensity = touchTex.b;
                    
                    uv.x += vx * 0.8 * intensity;
                    uv.y += vy * 0.8 * intensity;
                    
                    vec2 center = vec2(0.5);
                    float dist = length(uv - center);
                    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * intensity;
                    float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * intensity;
                    uv += vec2(ripple + wave);
                    
                    vec3 color = getGradientColor(uv, uTime);
                    color += grain(uv, uTime) * uGrainIntensity;
                    
                    float timeShift = uTime * 0.5;
                    color.r += sin(timeShift) * 0.02;
                    color.g += cos(timeShift * 1.4) * 0.02;
                    color.b += sin(timeShift * 1.2) * 0.02;
                    
                    float brightness2 = length(color);
                    float mixFactor2 = max(brightness2 * 1.2, 0.15);
                    color = mix(uDarkNavy, color, mixFactor2);
                    color = clamp(color, vec3(0.0), vec3(1.0));
                    
                    float brightness = length(color);
                    if (brightness > 1.0) color = color * (1.0 / brightness);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.z = 0;
        this.sceneManager.scene.add(this.mesh);
    }

    update(delta: number) {
        if (this.uniforms.uTime) {
            this.uniforms.uTime.value += delta;
        }
    }

    onResize(width: number, height: number) {
        const viewSize = this.sceneManager.getViewSize();
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        }
        if (this.uniforms.uResolution) {
            this.uniforms.uResolution.value.set(width, height);
        }
    }
}

class WebGLApp {
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    clock: THREE.Clock;
    touchTexture: TouchTexture;
    gradientBackground: GradientBackground;
    colorSchemes: Record<number, any>;
    currentScheme: number;
    mouse: { x: number; y: number };
    animationId: number = 0;
    props: LiquidSurfaceProps;

    constructor(container: HTMLDivElement, props: LiquidSurfaceProps) {
        this.props = props;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Safety check: remove any existing canvases to prevent duplicates
        if (container.children.length > 0) {
            container.innerHTML = "";
        }
        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
        this.camera.position.z = 50;
        this.scene = new THREE.Scene();

        const bgHex = props.darkNavyColor ? parseInt(props.darkNavyColor.replace("#", ""), 16) : 0x0a0e27;
        this.scene.background = new THREE.Color(bgHex);
        this.clock = new THREE.Clock();

        this.touchTexture = new TouchTexture();
        this.gradientBackground = new GradientBackground(this, props);
        this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

        this.colorSchemes = {
            1: { color1: new THREE.Vector3(0.945, 0.353, 0.133), color2: new THREE.Vector3(0.039, 0.055, 0.153) },
            2: { color1: new THREE.Vector3(1.0, 0.424, 0.314), color2: new THREE.Vector3(0.251, 0.878, 0.816) },
            3: {
                color1: new THREE.Vector3(0.945, 0.353, 0.133),
                color2: new THREE.Vector3(0.039, 0.055, 0.153),
                color3: new THREE.Vector3(0.251, 0.878, 0.816),
            },
            4: {
                color1: new THREE.Vector3(0.949, 0.4, 0.2),
                color2: new THREE.Vector3(0.176, 0.42, 0.427),
                color3: new THREE.Vector3(0.82, 0.686, 0.612),
            },
            5: {
                color1: new THREE.Vector3(0.945, 0.353, 0.133),
                color2: new THREE.Vector3(0.0, 0.259, 0.22),
                color3: new THREE.Vector3(0.945, 0.353, 0.133),
                color4: new THREE.Vector3(0.0, 0.0, 0.0),
                color5: new THREE.Vector3(0.945, 0.353, 0.133),
                color6: new THREE.Vector3(0.0, 0.0, 0.0),
            },
        };
        this.currentScheme = props.scheme || 1;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    setColorScheme(scheme: number) {
        if (!this.colorSchemes[scheme]) return;
        this.currentScheme = scheme;
        const colors = this.colorSchemes[scheme];
        const uniforms = this.gradientBackground.uniforms;

        if (scheme === 3) {
            uniforms.uColor1.value.copy(colors.color1);
            uniforms.uColor2.value.copy(colors.color2);
            uniforms.uColor3.value.copy(colors.color3);
            uniforms.uColor4.value.copy(colors.color1);
            uniforms.uColor5.value.copy(colors.color2);
            uniforms.uColor6.value.copy(colors.color3);
        } else if (scheme === 4) {
            uniforms.uColor1.value.copy(colors.color1);
            uniforms.uColor2.value.copy(colors.color2);
            uniforms.uColor3.value.copy(colors.color3);
            uniforms.uColor4.value.copy(colors.color1);
            uniforms.uColor5.value.copy(colors.color2);
            uniforms.uColor6.value.copy(colors.color3);
        } else if (scheme === 5) {
            uniforms.uColor1.value.copy(colors.color1);
            uniforms.uColor2.value.copy(colors.color2);
            uniforms.uColor3.value.copy(colors.color3);
            uniforms.uColor4.value.copy(colors.color4);
            uniforms.uColor5.value.copy(colors.color5);
            uniforms.uColor6.value.copy(colors.color6);
        } else {
            uniforms.uColor1.value.copy(colors.color1);
            uniforms.uColor2.value.copy(colors.color2);
            uniforms.uColor3.value.copy(colors.color1);
            uniforms.uColor4.value.copy(colors.color2);
            uniforms.uColor5.value.copy(colors.color1);
            uniforms.uColor6.value.copy(colors.color2);
        }

        if (scheme === 1 || scheme === 6 || scheme === 7 || scheme === 8 || scheme === 5) {
            const bgHex = this.props.darkNavyColor ? parseInt(this.props.darkNavyColor.replace("#", ""), 16) : 0x0a0e27;
            this.scene.background = new THREE.Color(bgHex);
            const darkRgb = hexToRgb(this.props.darkNavyColor || "#0a0e27");
            if (darkRgb) uniforms.uDarkNavy.value.set(darkRgb.r, darkRgb.g, darkRgb.b);
            uniforms.uGradientSize.value = 0.45;
            uniforms.uGradientCount.value = 12.0;
            uniforms.uSpeed.value = 1.5;
            uniforms.uColor1Weight.value = 0.5;
            uniforms.uColor2Weight.value = 1.8;
        } else if (scheme === 4) {
            this.scene.background = new THREE.Color(0xffffff);
            uniforms.uDarkNavy.value.set(0, 0, 0);
        } else {
            const bgHex = this.props.darkNavyColor ? parseInt(this.props.darkNavyColor.replace("#", ""), 16) : 0x0a0e27;
            this.scene.background = new THREE.Color(bgHex);
            const darkRgb = hexToRgb(this.props.darkNavyColor || "#0a0e27");
            if (darkRgb) uniforms.uDarkNavy.value.set(darkRgb.r, darkRgb.g, darkRgb.b);
            uniforms.uGradientSize.value = 1.0;
            uniforms.uGradientCount.value = 6.0;
            uniforms.uSpeed.value = 1.2;
            uniforms.uColor1Weight.value = 1.0;
            uniforms.uColor2Weight.value = 1.0;
        }
    }

    updateColors(colorArray: string[]) {
        const uniforms = this.gradientBackground.uniforms;
        colorArray.forEach((hex, i) => {
            const rgb = hexToRgb(hex);
            if (rgb) {
                const u = uniforms[`uColor${i + 1}`];
                if (u) u.value.set(rgb.r, rgb.g, rgb.b);
            }
        });
    }

    init() {
        this.gradientBackground.init();
        this.setColorScheme(this.currentScheme);
        if (this.props.colors) {
            this.updateColors(this.props.colors);
        }
        this.tick();
    }

    getViewSize() {
        const fovInRadians = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);
        return { width: height * this.camera.aspect, height };
    }

    tick() {
        const delta = Math.min(this.clock.getDelta(), 0.1);
        this.touchTexture.update();
        this.gradientBackground.update(delta);
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.tick());
    }

    onResize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.gradientBackground.onResize(width, height);
    }

    handleTouch(x: number, y: number, width: number, height: number) {
        this.touchTexture.addTouch({ x: x / width, y: 1 - y / height });
    }

    dispose() {
        cancelAnimationFrame(this.animationId);
        this.renderer.dispose();
    }
}

export default function LiquidSurface({
    className,
    style,
    colors,
    speed,
    intensity,
    grainIntensity,
    zoom,
    gradientSize,
    gradientCount,
    color1Weight,
    color2Weight,
    darkNavyColor,
    scheme,
    heading,
    showCursor = true,
}: LiquidSurfaceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<WebGLApp | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const app = new WebGLApp(containerRef.current, {
            speed,
            intensity,
            grainIntensity,
            zoom,
            gradientSize,
            gradientCount,
            color1Weight,
            color2Weight,
            darkNavyColor,
            scheme,
            colors,
        });
        appRef.current = app;

        const onResize = () => {
            if (containerRef.current) {
                app.onResize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            }
        };
        const onMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                app.handleTouch(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
            }

            if (showCursor && cursorRef.current) {
                gsap.to(cursorRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: "power2.out",
                });
            }
        };
        const onTouchMove = (e: TouchEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                app.handleTouch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top, rect.width, rect.height);
            }
        };

        const containerNode = containerRef.current.parentElement;
        if (containerNode) {
            containerNode.addEventListener("mousemove", onMouseMove);
            containerNode.addEventListener("touchmove", onTouchMove, { passive: false });
        }
        window.addEventListener("resize", onResize);

        // Initial resize with a small delay to ensure container has dimensions
        const timeoutId = setTimeout(onResize, 50);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", onResize);
            if (containerNode) {
                containerNode.removeEventListener("mousemove", onMouseMove);
                containerNode.removeEventListener("touchmove", onTouchMove);
            }
            // Use local app instance for cleanup to ensure correct disposal in React Strict Mode
            app.dispose();
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []); // Only initialize once

    // Handle prop updates
    useEffect(() => {
        if (appRef.current) {
            if (scheme !== undefined) appRef.current.setColorScheme(scheme);
            if (colors) appRef.current.updateColors(colors);

            const uniforms = appRef.current.gradientBackground.uniforms;
            if (speed !== undefined) uniforms.uSpeed.value = speed;
            if (intensity !== undefined) uniforms.uIntensity.value = intensity;
            if (grainIntensity !== undefined) uniforms.uGrainIntensity.value = grainIntensity;
            if (zoom !== undefined) uniforms.uZoom.value = zoom;
            if (gradientSize !== undefined) uniforms.uGradientSize.value = gradientSize;
            if (gradientCount !== undefined) uniforms.uGradientCount.value = gradientCount;
            if (color1Weight !== undefined) uniforms.uColor1Weight.value = color1Weight;
            if (color2Weight !== undefined) uniforms.uColor2Weight.value = color2Weight;

            if (darkNavyColor) {
                const darkRgb = hexToRgb(darkNavyColor);
                if (darkRgb) uniforms.uDarkNavy.value.set(darkRgb.r, darkRgb.g, darkRgb.b);
            }
        }
    }, [scheme, colors, speed, intensity, grainIntensity, zoom, gradientSize, gradientCount, color1Weight, color2Weight, darkNavyColor]);

    // Hover for custom cursor
    const handleMouseEnter = () => {
        if (showCursor) gsap.to(cursorRef.current, { width: 50, height: 50, borderWidth: 3, duration: 0.2 });
    };
    const handleMouseLeave = () => {
        if (showCursor) gsap.to(cursorRef.current, { width: 40, height: 40, borderWidth: 2, duration: 0.2 });
    };

    return (
        <div
            className={cn("relative w-full h-full overflow-hidden bg-black font-sans", className)}
            style={{ ...style, cursor: showCursor ? "none" : "auto" }}
        >
            {showCursor && (
                <div
                    ref={cursorRef}
                    className="fixed top-0 left-0 w-10 h-10 border-2 border-white rounded-full pointer-events-none z-[1000] mix-blend-difference -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                    <div className="w-2 h-2 bg-white rounded-full" />
                </div>
            )}

            {/* Three.js Canvas Container */}
            <div ref={containerRef} className="absolute inset-0 z-0" />

            {heading && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 w-full h-full text-white text-center">
                    <h1
                        className="font-bold tracking-tight px-4"
                        style={{ fontFamily: '"Syne", sans-serif', fontSize: "clamp(3.5rem, 9vw, 9rem)" }}
                        dangerouslySetInnerHTML={{ __html: heading }}
                    />
                </div>
            )}

        </div>
    );
}
