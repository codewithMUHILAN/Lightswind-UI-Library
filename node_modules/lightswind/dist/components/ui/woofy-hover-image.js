import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';
import * as THREE from 'three';
const WoofyHoverImage = ({ src, alt = '', width = 'auto', height = 400, className, effectType = 'inversion', maskRadius = 0.35, turbulenceIntensity = 0.225, animationSpeed = 1.0, appearDuration = 0.4, disappearDuration = 0.3, effectIntensity = 0.5, invertMask = false, duotoneColor1 = '#3366cc', duotoneColor2 = '#e63333', onHover, onLeave, }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const uniformsRef = useRef(null);
    const animationIdRef = useRef(null);
    const isMouseInsideRef = useRef(false);
    const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
    const lerpedMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
    const vertexShader = `
    varying vec2 v_uv;
    
    void main() {
      v_uv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;
    const fragmentShader = `
    precision highp float;

    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_radius;
    uniform float u_speed;
    uniform float u_imageAspect;
    uniform float u_turbulenceIntensity;
    uniform int u_effectType;
    uniform vec3 u_effectColor1;
    uniform vec3 u_effectColor2;
    uniform float u_effectIntensity;
    uniform bool u_invertMask;

    varying vec2 v_uv;

    vec3 hash33(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p.zxy, p.yxz + 19.27);
      return fract(vec3(p.x * p.y, p.z * p.x, p.y * p.z));
    }

    float simplex_noise(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K2 * 2.0);
      vec3 d3 = d0 - (1.0 - 3.0 * K2);
      
      vec3 x0 = d0;
      vec3 x1 = d1;
      vec3 x2 = d2;
      vec3 x3 = d3;
      
      vec4 h = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(x0, hash33(i) * 2.0 - 1.0),
        dot(x1, hash33(i + i1) * 2.0 - 1.0),
        dot(x2, hash33(i + i2) * 2.0 - 1.0),
        dot(x3, hash33(i + 1.0) * 2.0 - 1.0)
      );
      
      return 0.5 + 0.5 * 31.0 * dot(n, vec4(1.0));
    }

    vec2 curl(vec2 p, float time) {
      const float epsilon = 0.001;
      
      float n1 = simplex_noise(vec3(p.x, p.y + epsilon, time));
      float n2 = simplex_noise(vec3(p.x, p.y - epsilon, time));
      float n3 = simplex_noise(vec3(p.x + epsilon, p.y, time));
      float n4 = simplex_noise(vec3(p.x - epsilon, p.y, time));
      
      float x = (n2 - n1) / (2.0 * epsilon);
      float y = (n4 - n3) / (2.0 * epsilon);
      
      return vec2(x, y);
    }

    float inkMarbling(vec2 p, float time, float intensity) {
      float result = 0.0;
      
      vec2 flow = curl(p * 1.5, time * 0.1) * intensity * 2.0;
      vec2 p1 = p + flow * 0.3;
      result += simplex_noise(vec3(p1 * 2.0, time * 0.15)) * 0.5;
      
      vec2 flow2 = curl(p * 3.0 + vec2(sin(time * 0.2), cos(time * 0.15)), time * 0.2) * intensity;
      vec2 p2 = p + flow2 * 0.2;
      result += simplex_noise(vec3(p2 * 4.0, time * 0.25)) * 0.3;
      
      vec2 flow3 = curl(p * 6.0 + vec2(cos(time * 0.3), sin(time * 0.25)), time * 0.3) * intensity * 0.5;
      vec2 p3 = p + flow3 * 0.1;
      result += simplex_noise(vec3(p3 * 8.0, time * 0.4)) * 0.2;
      
      float dist = length(p - vec2(0.5));
      float angle = atan(p.y - 0.5, p.x - 0.5);
      float spiral = sin(dist * 15.0 - angle * 2.0 + time * 0.3) * 0.5 + 0.5;
      
      result = mix(result, spiral, 0.3);
      result = result * 0.5 + 0.5;
      
      return result;
    }

    vec3 applySepia(vec3 color) {
      float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
      float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
      float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
      return vec3(r, g, b);
    }

    vec3 applyDuotone(vec3 color, vec3 color1, vec3 color2) {
      float gray = dot(color, vec3(0.299, 0.587, 0.114));
      return mix(color1, color2, gray);
    }

    vec3 applyPixelate(sampler2D tex, vec2 uv, float pixelSize) {
      float dx = pixelSize * (1.0 / u_resolution.x);
      float dy = pixelSize * (1.0 / u_resolution.y);
      vec2 pixelatedUV = vec2(dx * floor(uv.x / dx), dy * floor(uv.y / dy));
      return texture2D(tex, pixelatedUV).rgb;
    }

    vec3 applyBlur(sampler2D tex, vec2 uv, float blurAmount) {
      float dx = blurAmount * (1.0 / u_resolution.x);
      float dy = blurAmount * (1.0 / u_resolution.y);
      
      vec3 sum = vec3(0.0);
      sum += texture2D(tex, uv + vec2(-dx, -dy)).rgb * 0.0625;
      sum += texture2D(tex, uv + vec2(0.0, -dy)).rgb * 0.125;
      sum += texture2D(tex, uv + vec2(dx, -dy)).rgb * 0.0625;
      sum += texture2D(tex, uv + vec2(-dx, 0.0)).rgb * 0.125;
      sum += texture2D(tex, uv).rgb * 0.25;
      sum += texture2D(tex, uv + vec2(dx, 0.0)).rgb * 0.125;
      sum += texture2D(tex, uv + vec2(-dx, dy)).rgb * 0.0625;
      sum += texture2D(tex, uv + vec2(0.0, dy)).rgb * 0.125;
      sum += texture2D(tex, uv + vec2(dx, dy)).rgb * 0.0625;
      
      return sum;
    }

    void main() {
      vec2 uv = v_uv;
      float screenAspect = u_resolution.x / u_resolution.y;
      float ratio = u_imageAspect / screenAspect;

      vec2 texCoord = vec2(
        mix(0.5 - 0.5 / ratio, 0.5 + 0.5 / ratio, uv.x),
        uv.y
      );

      vec4 tex = texture2D(u_texture, texCoord);
      vec3 originalColor = tex.rgb;
      vec3 effectColor = originalColor;
      
      if (u_effectType == 1) {
        float gray = dot(originalColor, vec3(0.299, 0.587, 0.114));
        effectColor = vec3(gray);
      } 
      else if (u_effectType == 2) {
        effectColor = applySepia(originalColor);
      }
      else if (u_effectType == 3) {
        effectColor = applyDuotone(originalColor, u_effectColor1, u_effectColor2);
      }
      else if (u_effectType == 4) {
        effectColor = applyPixelate(u_texture, texCoord, u_effectIntensity * 20.0);
      }
      else if (u_effectType == 5) {
        effectColor = applyBlur(u_texture, texCoord, u_effectIntensity * 5.0);
      }
      
      vec2 correctedUV = uv;
      correctedUV.x *= screenAspect;
      vec2 correctedMouse = u_mouse;
      correctedMouse.x *= screenAspect;

      float dist = distance(correctedUV, correctedMouse);
      
      float marbleEffect = inkMarbling(uv * 2.0 + u_time * u_speed * 0.1, u_time, u_turbulenceIntensity * 2.0);
      float jaggedDist = dist + (marbleEffect - 0.5) * u_turbulenceIntensity * 2.0;
      
      float mask = u_radius > 0.001 ? step(jaggedDist, u_radius) : 0.0;

      vec3 invertedColor = vec3(0.0);
      if (u_effectType == 0) {
        float gray = dot(originalColor, vec3(0.299, 0.587, 0.114));
        invertedColor = vec3(1.0 - gray);
      } else {
        invertedColor = originalColor;
      }

      vec3 finalColor;
      if (u_invertMask) {
        finalColor = mix(invertedColor, effectColor, mask);
      } else {
        finalColor = mix(effectColor, invertedColor, mask);
      }
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;
    const getEffectTypeValue = (type) => {
        switch (type) {
            case 'blackwhite': return 1;
            case 'sepia': return 2;
            case 'duotone': return 3;
            case 'pixelate': return 4;
            case 'blur': return 5;
            default: return 0; // inversion
        }
    };
    const hexToRgb = (hex) => {
        return new THREE.Color(hex);
    };
    const initializeEffect = useCallback(() => {
        if (!containerRef.current)
            return;
        const container = containerRef.current;
        const loader = new THREE.TextureLoader();
        loader.load(src, (texture) => {
            const imageAspect = texture.image.width / texture.image.height;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = 8;
            texture.generateMipmaps = false;
            const scene = new THREE.Scene();
            sceneRef.current = scene;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const uniforms = {
                u_texture: { value: texture },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(containerWidth, containerHeight) },
                u_radius: { value: 0.0 },
                u_speed: { value: 0.75 },
                u_imageAspect: { value: imageAspect },
                u_turbulenceIntensity: { value: turbulenceIntensity },
                u_effectType: { value: getEffectTypeValue(effectType) },
                u_effectIntensity: { value: effectIntensity },
                u_invertMask: { value: invertMask },
                u_effectColor1: { value: hexToRgb(duotoneColor1) },
                u_effectColor2: { value: hexToRgb(duotoneColor2) },
            };
            uniformsRef.current = uniforms;
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                depthTest: false,
                depthWrite: false,
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            const renderer = new THREE.WebGLRenderer({
                antialias: false,
                powerPreference: "high-performance",
                alpha: true,
            });
            renderer.setPixelRatio(1);
            renderer.setSize(containerWidth, containerHeight);
            rendererRef.current = renderer;
            // Clear any existing canvas
            const existingCanvas = container.querySelector('canvas');
            if (existingCanvas) {
                existingCanvas.remove();
            }
            container.appendChild(renderer.domElement);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.zIndex = '1';
            // Animation loop
            const animate = () => {
                if (!uniformsRef.current || !rendererRef.current || !sceneRef.current)
                    return;
                lerpedMouseRef.current.lerp(targetMouseRef.current, 0.1);
                uniformsRef.current.u_mouse.value.copy(lerpedMouseRef.current);
                if (isMouseInsideRef.current) {
                    uniformsRef.current.u_time.value += 0.01 * animationSpeed;
                }
                rendererRef.current.render(sceneRef.current, camera);
                animationIdRef.current = requestAnimationFrame(animate);
            };
            animate();
        });
    }, [src, effectType, maskRadius, turbulenceIntensity, animationSpeed, effectIntensity, invertMask, duotoneColor1, duotoneColor2]);
    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current || !uniformsRef.current)
            return;
        const rect = containerRef.current.getBoundingClientRect();
        const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (inside) {
            targetMouseRef.current.x = (e.clientX - rect.left) / rect.width;
            targetMouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
            if (!isMouseInsideRef.current) {
                isMouseInsideRef.current = true;
                onHover?.();
                // Animate radius to target value
                const startRadius = uniformsRef.current.u_radius.value;
                const targetRadius = maskRadius;
                const startTime = Date.now();
                const animateRadius = () => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const progress = Math.min(elapsed / appearDuration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    uniformsRef.current.u_radius.value = startRadius + (targetRadius - startRadius) * easeProgress;
                    if (progress < 1) {
                        requestAnimationFrame(animateRadius);
                    }
                };
                animateRadius();
            }
        }
        else if (isMouseInsideRef.current) {
            isMouseInsideRef.current = false;
            onLeave?.();
            // Animate radius to zero
            const startRadius = uniformsRef.current.u_radius.value;
            const startTime = Date.now();
            const animateRadius = () => {
                const elapsed = (Date.now() - startTime) / 1000;
                const progress = Math.min(elapsed / disappearDuration, 1);
                const easeProgress = Math.pow(progress, 3); // ease-in cubic
                uniformsRef.current.u_radius.value = startRadius * (1 - easeProgress);
                if (progress < 1) {
                    requestAnimationFrame(animateRadius);
                }
            };
            animateRadius();
        }
    }, [maskRadius, appearDuration, disappearDuration, onHover, onLeave]);
    useEffect(() => {
        initializeEffect();
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [initializeEffect, handleMouseMove]);
    return (_jsx("div", { ref: containerRef, className: cn(`relative overflow-hidden flex 
        items-center justify-center`, className), style: { width, height }, children: _jsx("img", { src: src, alt: alt, className: "w-full h-full object-cover", style: { position: 'relative', zIndex: 0 } }) }));
};
export default WoofyHoverImage;
