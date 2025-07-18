"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
// Utility function 'cn' (classnames) - implemented directly to resolve import error
function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}
const DefaultCursorSVG = ({ size = 25, color = "black", className }) => {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: size * 2, height: size * 2.16, viewBox: "0 0 50 54", fill: "none", className: cn("pointer-events-none", className), children: [_jsxs("g", { filter: "url(#filter0_d_91_7928)", children: [_jsx("path", { d: "M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z", fill: color }), _jsx("path", { d: "M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z", stroke: "white", strokeWidth: 2.25825 })] }), _jsx("defs", { children: _jsxs("filter", { id: "filter0_d_91_7928", x: 0.602397, y: 0.952444, width: 49.0584, height: 52.428, filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [_jsx("feFlood", { floodOpacity: 0, result: "BackgroundImageFix" }), _jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), _jsx("feOffset", { dy: 2.25825 }), _jsx("feGaussianBlur", { stdDeviation: 2.25825 }), _jsx("feComposite", { in2: "hardAlpha", operator: "out" }), _jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" }), _jsx("feBlend", { mode: "normal", in2: "BackgroundImageFix", result: "effect1_dropShadow_91_7928" }), _jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "effect1_dropShadow_91_7928", result: "shape" })] }) })] }));
};
export function SmoothCursor({ cursor, springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
}, className, size = 25, color = "black", hideOnLeave = true, trailLength = 5, showTrail = false, rotateOnMove = true, scaleOnClick = true, glowEffect = false, magneticDistance = 50, magneticElements = "[data-magnetic]", onCursorMove, onCursorEnter, onCursorLeave, disabled = false, }) {
    const [isMoving, setIsMoving] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isClicking, setIsClicking] = useState(false);
    const [trail, setTrail] = useState([]);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const lastUpdateTime = useRef(Date.now());
    const previousAngle = useRef(0);
    const accumulatedRotation = useRef(0);
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const rotation = useSpring(0, {
        ...springConfig,
        damping: 60,
        stiffness: 300,
    });
    const scale = useSpring(1, {
        ...springConfig,
        stiffness: 500,
        damping: 35,
    });
    const defaultCursor = _jsx(DefaultCursorSVG, { size: size, color: color });
    const cursorElement = cursor || defaultCursor;
    useEffect(() => {
        if (disabled)
            return;
        const updateVelocity = (currentPos) => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastUpdateTime.current;
            if (deltaTime > 0) {
                velocity.current = {
                    x: (currentPos.x - lastMousePos.current.x) / deltaTime,
                    y: (currentPos.y - lastMousePos.current.y) / deltaTime,
                };
            }
            lastUpdateTime.current = currentTime;
            lastMousePos.current = currentPos;
        };
        const updateTrail = (pos) => {
            if (!showTrail)
                return;
            setTrail(function (prev) {
                var newTrail = [pos].concat(prev.slice(0, trailLength - 1));
                return newTrail;
            });
        };
        const findMagneticElement = (x, y) => {
            const elements = document.querySelectorAll(magneticElements);
            // Fix: Convert NodeListOf<Element> to an array for reliable iteration
            for (const element of Array.from(elements)) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                if (distance < magneticDistance) {
                    return { x: centerX, y: centerY, distance };
                }
            }
            return null;
        };
        const smoothMouseMove = (e) => {
            let currentPos = { x: e.clientX, y: e.clientY };
            // Check for magnetic elements
            const magneticTarget = findMagneticElement(currentPos.x, currentPos.y);
            if (magneticTarget) {
                const strength = 1 - (magneticTarget.distance / magneticDistance);
                currentPos = {
                    x: currentPos.x + (magneticTarget.x - currentPos.x) * strength * 0.3,
                    y: currentPos.y + (magneticTarget.y - currentPos.y) * strength * 0.3,
                };
            }
            updateVelocity(currentPos);
            updateTrail(currentPos);
            const speed = Math.sqrt(Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2));
            cursorX.set(currentPos.x);
            cursorY.set(currentPos.y);
            onCursorMove?.(currentPos);
            if (speed > 0.1 && rotateOnMove) {
                const currentAngle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
                    90;
                let angleDiff = currentAngle - previousAngle.current;
                if (angleDiff > 180)
                    angleDiff -= 360;
                if (angleDiff < -180)
                    angleDiff += 360;
                accumulatedRotation.current += angleDiff;
                rotation.set(accumulatedRotation.current);
                previousAngle.current = currentAngle;
                scale.set(0.95);
                setIsMoving(true);
                const timeout = setTimeout(function () {
                    scale.set(1);
                    setIsMoving(false);
                }, 150);
                return function () {
                    return clearTimeout(timeout);
                };
            }
        };
        const handleMouseEnter = function () {
            setIsVisible(true);
            onCursorEnter?.();
        };
        const handleMouseLeave = function () {
            if (hideOnLeave) {
                setIsVisible(false);
            }
            onCursorLeave?.();
        };
        const handleMouseDown = function () {
            if (scaleOnClick) {
                setIsClicking(true);
                scale.set(0.8);
            }
        };
        const handleMouseUp = function () {
            if (scaleOnClick) {
                setIsClicking(false);
                scale.set(1);
            }
        };
        let rafId;
        const throttledMouseMove = function (e) {
            if (rafId)
                return;
            rafId = requestAnimationFrame(function () {
                smoothMouseMove(e);
                rafId = 0;
            });
        };
        document.body.style.cursor = "none";
        window.addEventListener("mousemove", throttledMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        return function () {
            window.removeEventListener("mousemove", throttledMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "auto";
            if (rafId)
                cancelAnimationFrame(rafId);
        };
    }, [
        cursorX,
        cursorY,
        rotation,
        scale,
        disabled,
        showTrail,
        trailLength,
        rotateOnMove,
        scaleOnClick,
        hideOnLeave,
        magneticDistance,
        magneticElements,
        onCursorMove,
        onCursorEnter,
        onCursorLeave
    ]);
    if (disabled || !isVisible)
        return null;
    return (_jsxs(_Fragment, { children: [showTrail && trail.map(function (pos, index) {
                return (_jsx(motion.div, { style: {
                        position: "fixed",
                        left: pos.x,
                        top: pos.y,
                        translateX: "-50%",
                        translateY: "-50%",
                        zIndex: 99 - index,
                        pointerEvents: "none",
                        opacity: (trailLength - index) / trailLength * 0.5,
                        scale: (trailLength - index) / trailLength * 0.8,
                    }, className: "w-2 h-2 bg-current rounded-full" }, index));
            }), _jsx(motion.div, { style: {
                    position: "fixed",
                    left: cursorX,
                    top: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    rotate: rotateOnMove ? rotation : 0,
                    scale: scale,
                    zIndex: 100,
                    pointerEvents: "none",
                    willChange: "transform",
                    filter: glowEffect ? "drop-shadow(0 0 10px " + color + "40)" : "none", // String concatenation
                }, initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }, className: cn("select-none", className), children: cursorElement })] }));
}
export default SmoothCursor;
