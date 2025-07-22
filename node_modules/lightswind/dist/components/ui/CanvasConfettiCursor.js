import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export const CanvasConfettiCursor = ({ colors = ["#FF3F8E", "#04C2C9", "#2E55C1", "#F9D423"], minSize = 2, maxSize = 7, particleCount = 40, frequency = 50, fillParent = false, overlayOpacity = 1, decay = 0.98, onExplosion, enabled = true, style, className, }) => {
    const canvasRef = useRef(null);
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const particles = useRef([]);
    const animId = useRef();
    const intervalRef = useRef();
    const parentRef = useRef(null);
    // Handle canvas resize
    const resizeCanvas = () => {
        if (!canvasRef.current)
            return;
        if (fillParent && parentRef.current) {
            canvasRef.current.width = parentRef.current.offsetWidth;
            canvasRef.current.height = parentRef.current.offsetHeight;
        }
        else {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };
    useEffect(() => {
        resizeCanvas();
        if (!fillParent) {
            window.addEventListener("resize", resizeCanvas);
        }
        return () => {
            if (!fillParent) {
                window.removeEventListener("resize", resizeCanvas);
            }
        };
    }, [fillParent]);
    // Confetti logic (particle class, animation, emission)
    useEffect(() => {
        if (!enabled)
            return;
        let disposed = false;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        let parentOffsetX = 0;
        let parentOffsetY = 0;
        if (fillParent && parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            parentOffsetX = rect.left;
            parentOffsetY = rect.top;
        }
        class Particle {
            x;
            y;
            size;
            color;
            speedX;
            speedY;
            constructor(x, y, size, color, speedX, speedY) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.speedX = speedX;
                this.speedY = speedY;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.size *= decay;
            }
            draw(ctx) {
                ctx.globalAlpha = overlayOpacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        const animate = () => {
            if (disposed || !canvasRef.current)
                return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.current = particles.current.filter((p) => {
                p.update();
                p.draw(ctx);
                return p.size > 0.5;
            });
            animId.current = requestAnimationFrame(animate);
        };
        animate();
        return () => {
            disposed = true;
            animId.current && cancelAnimationFrame(animId.current);
            particles.current = [];
        };
        // eslint-disable-next-line
    }, [decay, overlayOpacity, fillParent, enabled]);
    useEffect(() => {
        if (!enabled)
            return;
        // OnMove (mouse/touch)
        function moveHandler(event) {
            let x = 0, y = 0;
            if ("touches" in event && event.touches[0]) {
                x = event.touches[0].clientX;
                y = event.touches[0].clientY;
            }
            else if ("clientX" in event) {
                x = event.clientX;
                y = event.clientY;
            }
            if (fillParent && parentRef.current) {
                const rect = parentRef.current.getBoundingClientRect();
                x -= rect.left;
                y -= rect.top;
            }
            mousePos.current = { x, y };
        }
        // Listen on canvas for local, window for full
        const target = fillParent && parentRef.current ? parentRef.current : window;
        target.addEventListener("mousemove", moveHandler);
        target.addEventListener("touchmove", moveHandler);
        return () => {
            target.removeEventListener("mousemove", moveHandler);
            target.removeEventListener("touchmove", moveHandler);
        };
    }, [fillParent, enabled]);
    // Confetti burst logic (interval spawn)
    useEffect(() => {
        if (!enabled)
            return;
        function createExplosion(x, y) {
            if (!canvasRef.current)
                return;
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * (maxSize - minSize) + minSize;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const speedX = (Math.random() * 2 - 1) * 2;
                const speedY = (Math.random() * 2 - 1) * 2;
                particles.current.push(new (class {
                    x = x;
                    y = y;
                    size = size;
                    color = color;
                    speedX = speedX;
                    speedY = speedY;
                    update() { this.x += this.speedX; this.y += this.speedY; this.size *= decay; }
                    draw(ctx) {
                        ctx.globalAlpha = overlayOpacity;
                        ctx.fillStyle = this.color;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }
                })());
            }
            if (typeof onExplosion === "function")
                onExplosion(x, y);
        }
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            createExplosion(mousePos.current.x, mousePos.current.y);
        }, frequency);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [
        colors, minSize, maxSize, particleCount, frequency, decay,
        onExplosion, enabled, fillParent, overlayOpacity
    ]);
    if (!enabled)
        return null;
    return (_jsx("div", { ref: parentRef, style: fillParent
            ? { position: "relative", width: "100%", height: "100%" }
            : { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }, children: _jsx("canvas", { ref: canvasRef, style: {
                position: fillParent ? "absolute" : "fixed",
                top: 0, left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: fillParent ? "auto" : "none",
                background: "transparent",
                zIndex: 50,
                ...style
            }, className: className }) }));
};
