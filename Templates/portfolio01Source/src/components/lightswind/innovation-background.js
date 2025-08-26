"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
const fragmentShader = `
uniform vec2 iResolution;
uniform float iTime;

// Helper function: clamped hyperbolic tangent
vec2 stanh(vec2 a) {
    return tanh(clamp(a, -40.,  40.));
}

void mainImage( out vec4 o, vec2 u )
{
    vec2 v = iResolution.xy;
         u = .2*(u+u-v)/v.y;    
         
    vec4 z = o = vec4(1,2,3,0);
     
    for (float a = .5, t = iTime, i; 
         ++i < 19.; 
         o += (1. + cos(z+t)) 
            / length((1.+i*dot(v,v)) 
                   * sin(1.5*u/(.5-dot(u,u)) - 9.*u.yx + t))
         )  
        v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u, 
        // use stanh here if shader has black artifacts
        //   vvvv
        u += tanh(40. * dot(u *= mat2(cos(i + .02*t - vec4(0,11,33,0)))
                           ,u)
                      * cos(1e2*u.yx + t)) / 2e2
           + .2 * a * u
           + cos(4./exp(dot(o,o)/1e2) + t) / 3e2;
              
     o = 25.6 / (min(o, 13.) + 164. / o) 
       - dot(u, u) / 250.;
}


void main() {
    vec4 color = vec4(0.0);
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}
`;
const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;
const ShaderBackground = () => {
    const meshRef = useRef(null);
    // Get size (width, height of the canvas) and camera from useThree hook
    const { size, camera } = useThree();
    // Reference for the ShaderMaterial to avoid re-creating it on every render
    const shaderMaterial = useRef(new THREE.ShaderMaterial({
        uniforms: {
            iResolution: { value: new THREE.Vector2(size.width, size.height) },
            iTime: { value: 0 },
        },
        fragmentShader,
        vertexShader,
    }));
    // Update iTime uniform in the animation loop
    useFrame(() => {
        if (meshRef.current) {
            // Use performance.now() for high-precision time
            shaderMaterial.current.uniforms.iTime.value = performance.now() * 0.001;
        }
    });
    // Effect to update iResolution and plane geometry when canvas size or camera zoom changes
    useEffect(() => {
        // 1. Update iResolution uniform for the shader
        shaderMaterial.current.uniforms.iResolution.value.set(size.width, size.height);
        // 2. Adjust plane geometry to perfectly fit the orthographic camera's view frustum
        const aspect = size.width / size.height;
        // For an orthographic camera at position [0,0,1] looking at [0,0,0],
        // the default vertical extent of the frustum (before zoom) is from -1 to 1,
        // so total height is 2 units.
        const frustumHeight = 2;
        const visibleHeight = frustumHeight / camera.zoom;
        const visibleWidth = aspect * visibleHeight;
        if (meshRef.current) {
            // Dispose of the old geometry to prevent memory leaks
            meshRef.current.geometry.dispose();
            // Create a new plane geometry with dimensions that exactly match the visible area
            meshRef.current.geometry = new THREE.PlaneGeometry(visibleWidth, visibleHeight);
        }
    }, [size, camera.zoom]); // Dependencies: re-run if canvas size or camera zoom changes
    return (_jsxs("mesh", { ref: meshRef, children: [_jsx("planeGeometry", { args: [1, 1] }), _jsx("primitive", { object: shaderMaterial.current, attach: "material" })] }));
};
export default function ElectroBackground() {
    return (_jsx("div", { className: "relative min-h-screen w-full ", children: _jsx("div", { className: "absolute inset-0 z-0", children: _jsx(Canvas, { orthographic: true, camera: { position: [0, 0, 1], zoom: 1 }, children: _jsx(ShaderBackground, {}) }) }) }));
}
