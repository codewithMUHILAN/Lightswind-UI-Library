"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;
const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution; // Canvas resolution (width, height)
uniform float iTime;       // Time in seconds since the animation started
uniform vec2 iMouse;      // Mouse coordinates (x, y)
uniform vec3 u_color;     // Custom color uniform

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (1.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;

    vec2 mouse_uv = (4.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);

    float mouseInfluence = 0.0;
    if (length(iMouse) > 0.0) {
        float dist_to_mouse = distance(uv, mouse_uv);
        mouseInfluence = smoothstep(0.8, 0.0, dist_to_mouse);
    }

    for(float i = 8.0; i < 20.0; i++) {
        uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t);
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t);
    }

    float wave = abs(sin(t - uv.y - uv.x + mouseInfluence * 8.0));
    float glow = smoothstep(0.9, 0.0, wave);

    vec3 color = glow * u_color; // Use the custom color here

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
/**
 * A mapping from simplified blur size names to full Tailwind CSS backdrop-blur classes.
 * This ensures Tailwind's JIT mode can correctly detect and generate the CSS.
 */
const blurClassMap = {
    none: "backdrop-blur-none",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
};
/**
 * A React component that renders an interactive WebGL shader background.
 * The background features a turbulent, glowing wave pattern that responds to mouse movement.
 * An optional backdrop blur can be applied over the shader.
 *
 * @param {ShaderBackgroundProps} props - The component props.
 * @returns {JSX.Element} The rendered ShaderBackground component.
 */
function ShaderBackground({ backdropBlurAmount = "sm", color = "#07eae6ff", // Default purple color
className = "", }) {
    const canvasRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    // Helper to convert hex color to RGB (0-1 range)
    const hexToRgb = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16) / 255;
        const g = parseInt(hex.substring(3, 5), 16) / 255;
        const b = parseInt(hex.substring(5, 7), 16) / 255;
        return [r, g, b];
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }
        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            if (!shader)
                return null;
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
        if (!vertexShader || !fragmentShader)
            return;
        const program = gl.createProgram();
        if (!program)
            return;
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
        const iTimeLocation = gl.getUniformLocation(program, "iTime");
        const iMouseLocation = gl.getUniformLocation(program, "iMouse");
        const uColorLocation = gl.getUniformLocation(program, "u_color"); // Get uniform location for custom color
        let startTime = Date.now();
        // Set the initial color
        const [r, g, b] = hexToRgb(color);
        gl.uniform3f(uColorLocation, r, g, b);
        const render = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
            const currentTime = (Date.now() - startTime) / 1000;
            gl.uniform2f(iResolutionLocation, width, height);
            gl.uniform1f(iTimeLocation, currentTime);
            gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : 0, isHovering ? height - mousePosition.y : 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };
        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        };
        const handleMouseEnter = () => {
            setIsHovering(true);
        };
        const handleMouseLeave = () => {
            setIsHovering(false);
            setMousePosition({ x: 0, y: 0 });
        };
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseenter", handleMouseEnter);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        render();
        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseenter", handleMouseEnter);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isHovering, mousePosition, color]); // Add color to the dependency array
    // Get the correct Tailwind CSS class from the map
    const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["sm"];
    return (_jsxs("div", { className: `w-full max-w-screen h-full overflow-hidden ${className}`, children: [_jsx("canvas", { ref: canvasRef, className: "absolute inset-0 w-full max-w-screen h-full overflow-hidden", style: { display: "block" } }), _jsx("div", { className: `absolute inset-0 ${finalBlurClass}` })] }));
}
export default ShaderBackground;
