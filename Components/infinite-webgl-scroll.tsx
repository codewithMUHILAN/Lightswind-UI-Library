"use client";

import React, { useEffect, useRef, useState } from "react";

export interface InfiniteWebGLScrollProps {
  images?: string[];
  imageWidth?: number;
  imageHeight?: number;
  gap?: number;
  inertia?: number;
  bulgeStrength?: number;
  bulgeRadius?: number;
  className?: string;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', // Abstract Fluid
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80', // Cyberpunk City
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', // 3D Render
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', // Fashion Portrait
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Modern Arch
  'https://images.unsplash.com/photo-1541450805268-4822a3a774ca?w=800&q=80', // Neon Lights
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', // Nature Landscape
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80', // Minimalist Silhouette
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80', // Abstract Paper
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', // Gradient
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80', // Pastel Abstract
  'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&q=80', // Forest Road
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Tech/Hardware
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', // Retro Tech
  'https://images.unsplash.com/photo-1504333638930-c8787321eba0?w=800&q=80', // Dark Moody Nature
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Matrix Code
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', // Deep Blue Gradient
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', // Neon Geometry
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80', // Abstract 3D Shapes
  'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&q=80', // Soft Bokeh
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80', // Guitar/Music
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', // Misty Forest
  'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800&q=80', // Minimalist Interior
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', // Fashion Minimal
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', // Snowy Mountains
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', // Night Sky
  'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80', // Coffee Aesthetic
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80', // Lake Mountains
  'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&q=80', // Creative Desktop
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Tropical Beach
  'https://images.unsplash.com/photo-1514467958574-23bce366187f?w=800&q=80', // Geometric Glass
  'https://images.unsplash.com/photo-1552083375-1447ce886485?w=800&q=80', // Teal/Orange Portrait
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', // Colorful Paint
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', // Abstract Macro
  'https://images.unsplash.com/photo-1511447333015-45b65e57f6a7?w=800&q=80', // Space Nebula
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80', // City Streets
  'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80', // Urban Lights
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', // Paris/Vintage
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // Times Square
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', // Human Portrait
];

class InfinitePortraitGallery {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  gl: WebGLRenderingContext | null;
  images: HTMLImageElement[] = [];
  textures: WebGLTexture[] = [];
  imageWidth: number;
  imageHeight: number;
  gap: number;
  viewOffset: { x: number; y: number };
  drag: { isDragging: boolean; lastX: number; lastY: number; velocityX: number; velocityY: number };
  inertia: number;
  bulgeStrength: number;
  bulgeRadius: number;
  adjustedBulgeRadius: number;
  program: WebGLProgram | null = null;
  indexCount: number = 0;
  positionBuffer: WebGLBuffer | null = null;
  texCoordBuffer: WebGLBuffer | null = null;
  indexBuffer: WebGLBuffer | null = null;
  animationFrameId: number | null = null;
  onProgress: (percent: number) => void;
  sourceImages: string[];
  boundResizeCanvas: () => void;
  boundMousemove: (e: MouseEvent) => void;
  boundMouseup: () => void;
  boundTouchmove: (e: TouchEvent) => void;
  boundTouchend: () => void;
  boundKeydown: (e: KeyboardEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    props: InfiniteWebGLScrollProps,
    onProgress: (percent: number) => void
  ) {
    this.canvas = canvas;
    this.container = container;
    this.onProgress = onProgress;
    this.sourceImages = props.images && props.images.length > 0 ? props.images : DEFAULT_IMAGES;
    this.imageWidth = props.imageWidth || 150;
    this.imageHeight = props.imageHeight || 150;
    this.gap = props.gap !== undefined ? props.gap : 20;
    this.inertia = props.inertia !== undefined ? props.inertia : 0.95;
    this.bulgeStrength = props.bulgeStrength !== undefined ? props.bulgeStrength : 0.6;
    this.bulgeRadius = props.bulgeRadius !== undefined ? props.bulgeRadius : 1.5;
    this.adjustedBulgeRadius = this.bulgeRadius;
    this.viewOffset = { x: 0, y: 0 };
    this.drag = { isDragging: false, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 };

    this.boundResizeCanvas = this.resizeCanvas.bind(this);
    this.boundMousemove = this.handleMousemove.bind(this);
    this.boundMouseup = this.handleMouseup.bind(this);
    this.boundTouchmove = this.handleTouchmove.bind(this);
    this.boundTouchend = this.handleTouchend.bind(this);
    this.boundKeydown = this.handleKeydown.bind(this);

    this.gl = this.canvas.getContext("webgl");
    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    this.resizeCanvas();
    window.addEventListener("resize", this.boundResizeCanvas);

    this.init();
    this.loadPortraitImages();
    this.setupEventListeners();
    this.animate();
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    const t = Math.sqrt(
      Math.pow(this.canvas.width / Math.min(this.canvas.width, this.canvas.height), 2) +
      Math.pow(this.canvas.height / Math.min(this.canvas.width, this.canvas.height), 2)
    );
    this.adjustedBulgeRadius = Math.max(this.bulgeRadius, 0.6 * t * 1.2);
    if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  init() {
    if (!this.gl) return;
    const vsSource = `
        attribute vec2 aPosition;
        attribute vec2 aTexCoord;
        varying vec2 vTexCoord;
        uniform vec2 uResolution;
        uniform vec2 uOffset;
        uniform float uRotation;
        uniform vec2 uImagePosition;
        uniform float uBulgeStrength;
        uniform float uBulgeRadius;

        vec2 applyBulgeEffect(vec2 pos){
            vec2 normalizedPos = pos / uResolution;
            vec2 center = vec2(0.5,0.5);
            vec2 delta = normalizedPos - center;

            float aspect = uResolution.x / uResolution.y;
            delta.x *= aspect;

            float dist = length(delta);

            if(dist < uBulgeRadius){
                float t = dist / uBulgeRadius;
                float z = sqrt(1.5 - t*t);
                delta *= 0.35 + uBulgeStrength * z;
                delta.x /= aspect;

                normalizedPos = center + delta;
                pos = normalizedPos * uResolution;
            }
            return pos;
        }

        void main(){
            vec2 pos = aPosition * vec2(${this.imageWidth},${this.imageHeight});
            pos += uImagePosition;
            pos -= uOffset;

            vec2 center = uImagePosition + vec2(${this.imageWidth / 2},${this.imageHeight / 2}) - uOffset;
            pos -= center;
            float cosR = cos(uRotation);
            float sinR = sin(uRotation);
            pos = vec2(pos.x*cosR - pos.y*sinR, pos.x*sinR + pos.y*cosR);
            pos += center;

            pos = applyBulgeEffect(pos);

            vec2 clip = pos / uResolution * 2.0 - 1.0;
            // WebGL Y goes up, flip Y
            clip.y *= -1.0;
            gl_Position = vec4(clip,0.0,1.0);
            vTexCoord = aTexCoord;
        }
        `;

    const fsSource = `
        precision mediump float;
        varying vec2 vTexCoord;
        uniform sampler2D uSampler;
        void main(){
            vec2 uv = vec2(vTexCoord.x, vTexCoord.y);
            vec4 color = texture2D(uSampler, uv);
            if(color.a<0.01) discard;
            gl_FragColor = color;
        }
        `;

    this.program = this.createProgram(vsSource, fsSource);
    if (!this.program) return;

    const SUBDIV = 24;
    const positions: number[] = [];
    const texCoords: number[] = [];
    const indices: number[] = [];
    for (let y = 0; y <= SUBDIV; y++) {
      for (let x = 0; x <= SUBDIV; x++) {
        positions.push(x / SUBDIV, y / SUBDIV);
        texCoords.push(x / SUBDIV, y / SUBDIV);
      }
    }
    for (let y = 0; y < SUBDIV; y++) {
      for (let x = 0; x < SUBDIV; x++) {
        const i = y * (SUBDIV + 1) + x;
        indices.push(i, i + 1, i + SUBDIV + 1, i + 1, i + SUBDIV + 2, i + SUBDIV + 1);
      }
    }
    this.indexCount = indices.length;

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords), this.gl.STATIC_DRAW);

    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  async loadPortraitImages() {
    const totalImages = this.sourceImages.length;
    const loadPromises: Promise<void>[] = [];

    for (let i = 0; i < totalImages; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const promise = new Promise<void>((resolve) => {
        img.onload = () => {
          this.images.push(img);
          const tex = this.createTexture(img);
          if (tex) this.textures.push(tex);
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = this.sourceImages[i];
      });

      loadPromises.push(promise);

      promise.then(() => {
        const percent = Math.round((this.images.length / totalImages) * 100);
        this.onProgress(percent);
      });
    }

    await Promise.all(loadPromises);
    this.onProgress(100);
  }

  createTexture(t: HTMLImageElement) {
    if (!this.gl) return null;
    const s = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, s);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, t);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    return s;
  }

  getVisibleTiles() {
    const t: { x: number; y: number; imageIndex: number }[] = [];
    const s = this.imageWidth + this.gap;
    const i = this.imageHeight + this.gap;
    const e = this.viewOffset.x - this.canvas.width;
    const a = this.viewOffset.x + 2 * this.canvas.width;
    const h = this.viewOffset.y - this.canvas.height;
    const o = this.viewOffset.y + 2 * this.canvas.height;
    const n = Math.ceil(this.images.length / 10);
    
    if (this.images.length === 0) return [];

    for (let g = Math.floor(h / i) - 1; g <= Math.ceil(o / i) + 1; g++) {
      for (let hl = Math.floor(e / s) - 1; hl <= Math.ceil(a / s) + 1; hl++) {
        // Calculate a safe index mapping for infinite grid
        const absX = Math.abs(hl);
        const absY = Math.abs(g);
        const randIndex = (absX * 17 + absY * 31) % this.images.length;
        t.push({
          x: hl * s,
          y: g * i,
          imageIndex: randIndex
        });
      }
    }
    return t;
  }

  render() {
    if (!this.program || 0 === this.images.length || !this.gl) return;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);

    const t = this.gl.getAttribLocation(this.program, "aPosition");
    this.gl.enableVertexAttribArray(t);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(t, 2, this.gl.FLOAT, false, 0, 0);

    const s = this.gl.getAttribLocation(this.program, "aTexCoord");
    this.gl.enableVertexAttribArray(s);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.vertexAttribPointer(s, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    const i = this.gl.getUniformLocation(this.program, "uResolution");
    this.gl.uniform2f(i, this.canvas.width, this.canvas.height);
    
    const e = this.gl.getUniformLocation(this.program, "uOffset");
    const a = this.gl.getUniformLocation(this.program, "uImagePosition");
    const h = this.gl.getUniformLocation(this.program, "uSampler");
    const o = this.gl.getUniformLocation(this.program, "uBulgeStrength");
    const n = this.gl.getUniformLocation(this.program, "uBulgeRadius");
    
    this.gl.uniform1f(o, this.bulgeStrength);
    this.gl.uniform1f(n, this.adjustedBulgeRadius);

    const g = this.getVisibleTiles();

    for (const tile of g) {
      this.gl.uniform2f(e, this.viewOffset.x, this.viewOffset.y);
      this.gl.uniform2f(a, tile.x, tile.y);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[tile.imageIndex]);
      this.gl.uniform1i(h, 0);
      this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
    }
  }

  handleMousemove(t: MouseEvent) {
    if (!this.drag.isDragging) return;
    const s = t.clientX - this.drag.lastX;
    const i = t.clientY - this.drag.lastY;
    this.drag.velocityX = 0.3 * s + 0.7 * this.drag.velocityX;
    this.drag.velocityY = 0.3 * i + 0.7 * this.drag.velocityY;
    this.viewOffset.x -= this.drag.velocityX;
    this.viewOffset.y -= this.drag.velocityY;
    this.drag.lastX = t.clientX;
    this.drag.lastY = t.clientY;
  }

  handleMouseup() {
    this.drag.isDragging = false;
  }

  handleTouchmove(t: TouchEvent) {
    if (!this.drag.isDragging) return;
    t.preventDefault();
    const s = t.touches[0].clientX - this.drag.lastX;
    const i = t.touches[0].clientY - this.drag.lastY;
    this.drag.velocityX = 0.3 * s + 0.7 * this.drag.velocityX;
    this.drag.velocityY = 0.3 * i + 0.7 * this.drag.velocityY;
    this.viewOffset.x -= this.drag.velocityX;
    this.viewOffset.y -= this.drag.velocityY;
    this.drag.lastX = t.touches[0].clientX;
    this.drag.lastY = t.touches[0].clientY;
  }

  handleTouchend() {
    this.drag.isDragging = false;
  }

  handleKeydown(t: KeyboardEvent) {
    switch (t.key) {
      case "+":
      case "=":
        this.bulgeStrength = Math.min(1, this.bulgeStrength + 0.1);
        break;
      case "-":
      case "_":
        this.bulgeStrength = Math.max(0.1, this.bulgeStrength - 0.1);
        break;
      case "ArrowLeft":
        this.bulgeRadius = Math.max(0.1, this.bulgeRadius - 0.05);
        this.resizeCanvas();
        break;
      case "ArrowRight":
        this.bulgeRadius = Math.min(3, this.bulgeRadius + 0.05);
        this.resizeCanvas();
        break;
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousedown", (t) => {
      this.drag.isDragging = true;
      this.drag.lastX = t.clientX;
      this.drag.lastY = t.clientY;
    });
    window.addEventListener("mousemove", this.boundMousemove);
    window.addEventListener("mouseup", this.boundMouseup);
    
    this.canvas.addEventListener("touchstart", (t) => {
      t.preventDefault();
      this.drag.isDragging = true;
      this.drag.lastX = t.touches[0].clientX;
      this.drag.lastY = t.touches[0].clientY;
    }, { passive: false });
    
    window.addEventListener("touchmove", this.boundTouchmove, { passive: false });
    window.addEventListener("touchend", this.boundTouchend);
    
    this.canvas.addEventListener("wheel", (t) => {
      t.preventDefault();
      this.drag.velocityX += 0.3 * t.deltaX;
      this.drag.velocityY += 0.3 * t.deltaY;
    }, { passive: false });
    
    window.addEventListener("keydown", this.boundKeydown);
  }

  animate() {
    if (!this.drag.isDragging) {
      this.viewOffset.x -= this.drag.velocityX;
      this.viewOffset.y -= this.drag.velocityY;
      this.drag.velocityX *= this.inertia;
      this.drag.velocityY *= this.inertia;
      if (Math.abs(this.drag.velocityX) < 0.1) this.drag.velocityX = 0;
      if (Math.abs(this.drag.velocityY) < 0.1) this.drag.velocityY = 0;
    }
    
    this.render();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("resize", this.boundResizeCanvas);
    window.removeEventListener("mousemove", this.boundMousemove);
    window.removeEventListener("mouseup", this.boundMouseup);
    window.removeEventListener("touchmove", this.boundTouchmove);
    window.removeEventListener("touchend", this.boundTouchend);
    window.removeEventListener("keydown", this.boundKeydown);
    
    if (this.gl) {
      this.textures.forEach(tex => this.gl?.deleteTexture(tex));
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.positionBuffer) this.gl.deleteBuffer(this.positionBuffer);
      if (this.texCoordBuffer) this.gl.deleteBuffer(this.texCoordBuffer);
      if (this.indexBuffer) this.gl.deleteBuffer(this.indexBuffer);
    }
  }

  createProgram(t: string, s: string) {
    if (!this.gl) return null;
    const i = this.loadShader(this.gl.VERTEX_SHADER, t);
    const e = this.loadShader(this.gl.FRAGMENT_SHADER, s);
    if (!i || !e) return null;
    const a = this.gl.createProgram();
    if (!a) return null;
    this.gl.attachShader(a, i);
    this.gl.attachShader(a, e);
    this.gl.linkProgram(a);
    if (this.gl.getProgramParameter(a, this.gl.LINK_STATUS)) return a;
    console.error("Error program:", this.gl.getProgramInfoLog(a));
    return null;
  }

  loadShader(t: number, s: string) {
    if (!this.gl) return null;
    const i = this.gl.createShader(t);
    if (!i) return null;
    this.gl.shaderSource(i, s);
    this.gl.compileShader(i);
    if (this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS)) return i;
    console.error("Error shader:", this.gl.getShaderInfoLog(i));
    this.gl.deleteShader(i);
    return null;
  }
}

export default function InfiniteWebGLScroll(props: InfiniteWebGLScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const gallery = new InfinitePortraitGallery(
      canvasRef.current,
      containerRef.current,
      props,
      (percent) => {
        setProgress(percent);
        if (percent >= 100) {
          setTimeout(() => setIsLoading(false), 300);
        }
      }
    );

    return () => {
      gallery.destroy();
    };
  }, [props.images, props.imageWidth, props.imageHeight, props.gap, props.inertia, props.bulgeStrength, props.bulgeRadius]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${props.className || ''}`}
      style={{ touchAction: 'none' }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white transition-opacity duration-500">
          <div className="text-2xl font-bold tracking-widest uppercase mb-4">Loading Assets</div>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-white/60 font-mono">{progress}%</div>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full cursor-grab active:cursor-grabbing"
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white/80 px-6 py-3 rounded-full text-xs font-mono tracking-widest uppercase pointer-events-none select-none border border-white/10 shadow-xl">
        Drag & Scroll
      </div>
    </div>
  );
}
