import { useEffect } from "react";
const GlowingBackground = ({ zIndex = -1, height = "100vh", ringColors = ["#4c1d95", "#a78bfa", "#c084fc"], blurStrength = "blur-3xl", gradientFrom = "#2e026d", gradientVia = "#0f0c29", gradientTo = "#0b011b", }) => {
    useEffect(() => {
        const container = document.createElement("div");
        container.id = "glowing-bg";
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = height;
        container.style.zIndex = zIndex.toString();
        container.style.pointerEvents = "none";
        container.style.overflow = "hidden";
        container.innerHTML = `
      <div style="
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, ${gradientFrom}, ${gradientVia}, ${gradientTo});
        opacity: 0.8;
        z-index: 10;
      "></div>

      <div style="
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      ">
        <div style="
          width: 1000px;
          height: 1000px;
          border-radius: 9999px;
          border: 1px solid ${ringColors[0]}33;
          filter: blur(64px);
          animation: pulse 3s infinite;
          box-shadow: 0 0 200px ${ringColors[0]}33;
        "></div>
        <div style="
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 9999px;
          border: 1px solid ${ringColors[1]}1A;
          filter: blur(32px);
          box-shadow: 0 0 150px ${ringColors[1]}1A;
        "></div>
        <div style="
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 9999px;
          border: 1px solid ${ringColors[2]}1A;
          filter: blur(24px);
          box-shadow: 0 0 120px ${ringColors[2]}1A;
        "></div>
      </div>

      <style>
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      </style>
    `;
        document.body.appendChild(container);
        return () => {
            const existing = document.getElementById("glowing-bg");
            if (existing)
                existing.remove();
        };
    }, [zIndex, height, ringColors, blurStrength, gradientFrom, gradientVia, gradientTo]);
    return null;
};
export default GlowingBackground;
