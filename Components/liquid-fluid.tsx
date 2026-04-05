'use client';
import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, RenderTarget, Vec2, Color, Texture } from 'ogl';
import { useAnimationFrame } from 'framer-motion';
import { gsap } from 'gsap';

export interface LiquidFluidProps {
    mouseForce?: number;
    cursorSize?: number;
    isViscous?: boolean;
    viscous?: number;
    iterationsViscous?: number;
    iterationsPoisson?: number;
    dt?: number;
    BFECC?: boolean;
    resolution?: number;
    isBounce?: boolean;
    colors?: string[];
    style?: React.CSSProperties;
    className?: string;
    autoDemo?: boolean;
    autoSpeed?: number;
    autoIntensity?: number;
    takeoverDuration?: number;
    autoResumeDelay?: number;
    autoRampDuration?: number;
}

const defaultColors = ['#00fffc', '#fff', '#00fffc'];

const baseVertex = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

const splatFrag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tVelocity;
    uniform vec2 force;
    uniform vec2 center;
    uniform float radius;
    uniform float aspect;
    void main() {
        vec2 p = vUv - center;
        p.x *= aspect;
        float d = exp(-dot(p, p) / radius);
        vec3 base = texture2D(tVelocity, vUv).xyz;
        gl_FragColor = vec4(base + d * vec3(force, 0.0), 1.0);
    }
`;

const advectionFrag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tVelocity;
    uniform sampler2D tSource;
    uniform float dt;
    uniform float dissipation;
    uniform vec2 fboSize;
    void main() {
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        vec2 coord = vUv - dt * texture2D(tVelocity, vUv).xy * ratio;
        gl_FragColor = dissipation * texture2D(tSource, coord);
    }
`;

const divergenceFrag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tVelocity;
    uniform vec2 px;
    void main() {
        float L = texture2D(tVelocity, vUv - vec2(px.x, 0.0)).x;
        float R = texture2D(tVelocity, vUv + vec2(px.x, 0.0)).x;
        float T = texture2D(tVelocity, vUv + vec2(0.0, px.y)).y;
        float B = texture2D(tVelocity, vUv - vec2(0.0, px.y)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`;

const poissonFrag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tPressure;
    uniform sampler2D tDivergence;
    uniform vec2 px;
    void main() {
        float L = texture2D(tPressure, vUv - vec2(px.x, 0.0)).x;
        float R = texture2D(tPressure, vUv + vec2(px.x, 0.0)).x;
        float T = texture2D(tPressure, vUv + vec2(0.0, px.y)).x;
        float B = texture2D(tPressure, vUv - vec2(0.0, px.y)).x;
        float div = texture2D(tDivergence, vUv).x;
        float p = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
    }
`;

const pressureFrag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tPressure;
    uniform sampler2D tVelocity;
    uniform vec2 px;
    void main() {
        float L = texture2D(tPressure, vUv - vec2(px.x, 0.0)).x;
        float R = texture2D(tPressure, vUv + vec2(px.x, 0.0)).x;
        float T = texture2D(tPressure, vUv + vec2(0.0, px.y)).x;
        float B = texture2D(tPressure, vUv - vec2(0.0, px.y)).x;
        vec2 vel = texture2D(tVelocity, vUv).xy;
        vel -= 0.5 * vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
`;

const outputFrag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tVelocity;
    uniform sampler2D tPalette;
    void main() {
        vec2 vel = texture2D(tVelocity, vUv).xy;
        float len = length(vel);
        vec3 color = texture2D(tPalette, vec2(len, 0.5)).rgb;
        gl_FragColor = vec4(color, len);
    }
`;

export default function LiquidFluid({
    mouseForce = 35,
    cursorSize = 80,
    iterationsPoisson = 32,
    dt = 0.014,
    resolution = 0.5,
    colors = defaultColors,
    style = {},
    className = '',
    autoDemo = true,
    autoSpeed = 0.5,
    autoIntensity = 2.2,
    autoResumeDelay = 1000,
}: LiquidFluidProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const glRef = useRef<any>(null);
    const programsRef = useRef<any>({});
    const targetsRef = useRef<any>({});
    const meshRef = useRef<Mesh | null>(null);

    // Physics markers
    const mouse = useRef(new Vec2(0.5, 0.5));
    const lastMouse = useRef(new Vec2(0.5, 0.5));
    const velocity = useRef(new Vec2(0, 0));
    const lastInputTime = useRef(0);
    const autoPos = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const renderer = new Renderer({ canvas: canvasRef.current, alpha: true, dpr: 2, premultipliedAlpha: false });
        const gl = renderer.gl;
        rendererRef.current = renderer;
        glRef.current = gl;

        const geometry = new Geometry(gl, {
            position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
            uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
        });

        // Extensions
        const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
        const floatType = isIOS ? (gl as any).HALF_FLOAT || 0x8D61 : gl.FLOAT;
        gl.getExtension('OES_texture_float');
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_half_float');
        gl.getExtension('OES_texture_half_float_linear');

        const createTarget = (w: number, h: number) => new RenderTarget(gl, {
            width: w,
            height: h,
            type: floatType,
            format: gl.RGBA,
            internalFormat: isIOS ? (gl as any).RGBA16F : (gl as any).RGBA32F || gl.RGBA,
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR,
            depth: false,
        });

        // Programs
        const programs = {
            advection: new Program(gl, {
                vertex: baseVertex, fragment: advectionFrag,
                uniforms: { tVelocity: { value: null }, tSource: { value: null }, dt: { value: dt }, dissipation: { value: 0.98 }, fboSize: { value: new Vec2() } }
            }),
            splat: new Program(gl, {
                vertex: baseVertex, fragment: splatFrag,
                uniforms: { tVelocity: { value: null }, force: { value: new Vec2() }, center: { value: new Vec2() }, radius: { value: cursorSize / 1000 }, aspect: { value: 1.0 } }
            }),
            divergence: new Program(gl, {
                vertex: baseVertex, fragment: divergenceFrag,
                uniforms: { tVelocity: { value: null }, px: { value: new Vec2() } }
            }),
            poisson: new Program(gl, {
                vertex: baseVertex, fragment: poissonFrag,
                uniforms: { tPressure: { value: null }, tDivergence: { value: null }, px: { value: new Vec2() } }
            }),
            pressure: new Program(gl, {
                vertex: baseVertex, fragment: pressureFrag,
                uniforms: { tPressure: { value: null }, tVelocity: { value: null }, px: { value: new Vec2() } }
            }),
            output: new Program(gl, {
                vertex: baseVertex, fragment: outputFrag,
                uniforms: { tVelocity: { value: null }, tPalette: { value: null } },
                transparent: true
            })
        };
        programsRef.current = programs;

        const mainMesh = new Mesh(gl, { geometry, program: programs.output });
        meshRef.current = mainMesh;

        // Palette
        const updatePalette = (cols: string[]) => {
            const data = new Uint8Array(cols.length * 4);
            cols.forEach((hex, i) => {
                const c = new Color(hex);
                data[i * 4 + 0] = Math.round(c.r * 255);
                data[i * 4 + 1] = Math.round(c.g * 255);
                data[i * 4 + 2] = Math.round(c.b * 255);
                data[i * 4 + 3] = 255;
            });
            return new Texture(gl, {
                image: data, width: cols.length, height: 1, format: gl.RGBA, minFilter: gl.LINEAR, magFilter: gl.LINEAR,
            });
        };
        programs.output.uniforms.tPalette.value = updatePalette(colors);

        const handleResize = () => {
            const w = containerRef.current!.clientWidth;
            const h = containerRef.current!.clientHeight;
            renderer.setSize(w, h);
            const sw = Math.max(1, Math.floor(w * resolution));
            const sh = Math.max(1, Math.floor(h * resolution));
            targetsRef.current = {
                vel0: createTarget(sw, sh), vel1: createTarget(sw, sh),
                pressure0: createTarget(sw, sh), pressure1: createTarget(sw, sh),
                div: createTarget(sw, sh)
            };
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // GSAP Auto Demo wandering
        let autoAnim: gsap.core.Tween | null = null;
        if (autoDemo) {
            autoAnim = gsap.to(autoPos.current, {
                x: 'random(0.2, 0.8)',
                y: 'random(0.2, 0.8)',
                duration: 2 / autoSpeed,
                repeat: -1,
                repeatRefresh: true,
                ease: 'sine.inOut'
            });
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            autoAnim?.kill();
        };
    }, [colors, resolution, autoDemo, autoSpeed]);

    useAnimationFrame((t) => {
        if (!glRef.current || !targetsRef.current.vel0) return;
        const renderer = rendererRef.current!;
        const gl = glRef.current;
        const targets = targetsRef.current;
        const progs = programsRef.current;
        const mesh = meshRef.current!;
        const camera = new Camera(gl);

        const sw = targets.vel0.width;
        const sh = targets.vel0.height;
        const px = new Vec2(1 / sw, 1 / sh);

        // Interaction
        const isAuto = autoDemo && Date.now() - lastInputTime.current > autoResumeDelay;
        const currentPos = isAuto ? new Vec2(autoPos.current.x, autoPos.current.y) : mouse.current;
        const diff = new Vec2().subVectors(currentPos, lastMouse.current);
        lastMouse.current.copy(currentPos);
        velocity.current.lerp(diff, 0.2);

        // Render passes
        // 1. Advection
        progs.advection.uniforms.tVelocity.value = targets.vel0.texture;
        progs.advection.uniforms.tSource.value = targets.vel0.texture;
        progs.advection.uniforms.fboSize.value.set(sw, sh);
        mesh.program = progs.advection;
        renderer.render({ scene: mesh, camera, target: targets.vel1 });

        // 2. Splat
        const force = isAuto ? autoIntensity * 0.01 : mouseForce;
        if (velocity.current.len() > 0.0001) {
            progs.splat.uniforms.tVelocity.value = targets.vel1.texture;
            progs.splat.uniforms.center.value.copy(currentPos);
            progs.splat.uniforms.force.value.set(velocity.current.x * force, velocity.current.y * force);
            progs.splat.uniforms.aspect.value = sw / sh;
            mesh.program = progs.splat;
            renderer.render({ scene: mesh, camera, target: targets.vel1, clear: false });
        }

        // 3. Divergence
        progs.divergence.uniforms.tVelocity.value = targets.vel1.texture;
        progs.divergence.uniforms.px.value.copy(px);
        mesh.program = progs.divergence;
        renderer.render({ scene: mesh, camera, target: targets.div });

        // 4. Pressure Solve
        for (let i = 0; i < iterationsPoisson; i++) {
            progs.poisson.uniforms.tPressure.value = (i === 0 ? targets.pressure0 : targets.pressure0).texture;
            progs.poisson.uniforms.tDivergence.value = targets.div.texture;
            progs.poisson.uniforms.px.value.copy(px);
            mesh.program = progs.poisson;
            renderer.render({ scene: mesh, camera, target: targets.pressure1 });
            [targets.pressure0, targets.pressure1] = [targets.pressure1, targets.pressure0];
        }

        // 5. Apply Pressure
        progs.pressure.uniforms.tPressure.value = targets.pressure0.texture;
        progs.pressure.uniforms.tVelocity.value = targets.vel1.texture;
        progs.pressure.uniforms.px.value.copy(px);
        mesh.program = progs.pressure;
        renderer.render({ scene: mesh, camera, target: targets.vel0 });

        // 6. Result
        progs.output.uniforms.tVelocity.value = targets.vel0.texture;
        mesh.program = progs.output;
        renderer.render({ scene: mesh, camera });
    });

    const handleInput = (e: any) => {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        if (x === undefined || y === undefined) return;

        lastInputTime.current = Date.now();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouse.current.set((x - rect.left) / rect.width, 1.0 - (y - rect.top) / rect.height);
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative overflow-hidden bg-black touch-none cursor-crosshair ${className}`}
            style={style}
            onMouseMove={handleInput}
            onTouchMove={handleInput}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
}
