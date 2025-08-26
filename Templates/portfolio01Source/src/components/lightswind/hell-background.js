"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
/**
 * A mapping from simplified blur size names to full Tailwind CSS backdrop-blur classes.
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
const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;
const fragmentShaderSource = `
  precision mediump float;

  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec3 uColor;

  #define SPIN_ROTATION -2.0
  #define SPIN_SPEED 7.0
  #define OFFSET vec2(0.0)
  #define COLOUR_1 vec4(uColor.rgb, 1.0)
  #define COLOUR_2 vec4(0.0, 0.42, 0.706, 1.0)
  #define COLOUR_3 vec4(0.086, 0.137, 0.145, 1.0)
  #define CONTRAST 3.5
  #define LIGTHING 0.4
  #define SPIN_AMOUNT 0.25
  #define PIXEL_FILTER 745.0
  #define SPIN_EASE 1.0
  #define PI 3.14159265359
  #define IS_ROTATE false

  vec4 effect(vec2 screenSize, vec2 screen_coords) {
      float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
      vec2 uv = (floor(screen_coords.xy*(1./pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - OFFSET;
      float uv_len = length(uv);

      float speed = (SPIN_ROTATION*SPIN_EASE*0.2);
      if(IS_ROTATE){
         speed = iTime * speed;
      }
      speed += 302.2;

      float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE*20.*(1.*SPIN_AMOUNT*uv_len + (1. - 1.*SPIN_AMOUNT));
      vec2 mid = (screenSize.xy/length(screenSize.xy))/2.;
      uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

      uv *= 30.;
      speed = iTime*(SPIN_SPEED);
      vec2 uv2 = vec2(uv.x+uv.y);

      for(int i=0; i < 5; i++) {
          uv2 += sin(max(uv.x, uv.y)) + uv;
          uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
          uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
      }

      float contrast_mod = (0.25*CONTRAST + 0.5*SPIN_AMOUNT + 1.2);
      float paint_res = min(2., max(0.,length(uv)*(0.035)*contrast_mod));
      float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
      float c2p = max(0.,1. - contrast_mod*abs(paint_res));
      float c3p = 1. - min(1., c1p + c2p);
      float light = (LIGTHING - 0.2)*max(c1p*5. - 4., 0.) + LIGTHING*max(c2p*5. - 4., 0.);

      return (0.3/CONTRAST)*COLOUR_1 + (1. - 0.3/CONTRAST)*(COLOUR_1*c1p + COLOUR_2*c2p + vec4(c3p*COLOUR_3.rgb, c3p*COLOUR_1.a)) + light;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = fragCoord/iResolution.xy;
      fragColor = effect(iResolution.xy, uv * iResolution.xy);
  }

  void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;
function HellBackground({ backdropBlurAmount = "none", className = "", color = "#DE443B", }) {
    const canvasRef = useRef(null);
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
        const uColorLocation = gl.getUniformLocation(program, "uColor");
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.replace("#", ""), 16);
            return {
                r: ((bigint >> 16) & 255) / 255,
                g: ((bigint >> 8) & 255) / 255,
                b: (bigint & 255) / 255,
            };
        };
        let startTime = Date.now();
        const render = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
            const currentTime = (Date.now() - startTime) / 1000;
            gl.uniform2f(iResolutionLocation, width, height);
            gl.uniform1f(iTimeLocation, currentTime);
            const rgb = hexToRgb(color);
            gl.uniform3f(uColorLocation, rgb.r, rgb.g, rgb.b);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };
        render();
    }, [color]);
    const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["sm"];
    return (_jsxs("div", { className: `w-full max-w-screen h-full overflow-hidden ${className}`, children: [_jsx("canvas", { ref: canvasRef, className: "absolute inset-0 w-full max-w-screen h-full overflow-hidden", style: { display: "block" } }), _jsx("div", { className: `absolute inset-0 ${finalBlurClass}` })] }));
}
export default HellBackground;
