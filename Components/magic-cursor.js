"use client"; // only if using Next.js App Router with React Server Components
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from "react";
import { particlesCursor } from "../../../../node_modules/threejs-toys/build/threejs-toys.module";
const cn = (...classes) => classes.filter(Boolean).join(" ");
const defaultConfig = {
    colors: [0x00fffc, 0x0000ff],
    color: 0xff0000,
    coordScale: 0.5,
    noiseIntensity: 0.005,
    noiseTimeCoef: 0.0001,
    pointSize: 2,
    pointDecay: 0.0025,
    sleepRadiusX: 250,
    sleepRadiusY: 250,
    sleepTimeCoefX: 0.001,
    sleepTimeCoefY: 0.002,
    gpgpuSize: 512,
};
const MagicCursor = ({ target, config = {}, enabled = true, className, clickInteraction = true, resetDuration = 2000, showOnMobile = false, interactionColors = [
    0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
], children, }) => {
    const containerRef = useRef(null);
    const particlesCursorRef = useRef(null);
    const resetTimeoutRef = useRef();
    const resizeObserverRef = useRef(null);
    const isMobile = () => {
        if (typeof navigator === "undefined" || !navigator.userAgent)
            return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    const initializeParticles = useCallback(() => {
        if (!enabled || (isMobile() && !showOnMobile)) {
            particlesCursorRef.current?.destroy?.();
            resizeObserverRef.current?.disconnect?.();
            return;
        }
        const targetElement = typeof target === "string"
            ? document.querySelector(target)
            : target || containerRef.current;
        if (!targetElement)
            return;
        const mergedConfig = { ...defaultConfig, ...config };
        particlesCursorRef.current = particlesCursor({
            el: targetElement,
            ...mergedConfig,
        });
        const updateCanvasSize = () => {
            const width = targetElement.clientWidth;
            const height = targetElement.clientHeight;
            const canvas = targetElement.querySelector("canvas");
            if (canvas) {
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                canvas.style.display = "block";
            }
            particlesCursorRef.current?.renderer?.setSize(width, height);
            if (particlesCursorRef.current?.camera && width > 0 && height > 0) {
                particlesCursorRef.current.camera.aspect = width / height;
                particlesCursorRef.current.camera.updateProjectionMatrix();
            }
        };
        updateCanvasSize();
        const observer = new ResizeObserver(updateCanvasSize);
        observer.observe(targetElement);
        resizeObserverRef.current = observer;
        const handleMouseMove = (event) => {
            const rect = targetElement.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = 1 - (event.clientY - rect.top) / rect.height;
            particlesCursorRef.current?.uniforms?.uMousePos?.value?.set(x, y);
        };
        const handleClick = () => {
            if (!clickInteraction || !particlesCursorRef.current)
                return;
            const randomColor = interactionColors[Math.floor(Math.random() * interactionColors.length)];
            const uniforms = particlesCursorRef.current.uniforms;
            uniforms?.uColor?.value?.set(randomColor);
            uniforms.uCoordScale.value = 0.001 + Math.random() * 2;
            uniforms.uNoiseIntensity.value = 0.0001 + Math.random() * 0.001;
            uniforms.uPointSize.value = 1 + Math.random() * 10;
            if (resetTimeoutRef.current)
                clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = setTimeout(() => {
                const resetConfig = { ...defaultConfig, ...config };
                uniforms?.uColor?.value?.set(resetConfig.color || 0xff0000);
                uniforms.uCoordScale.value = resetConfig.coordScale || 0.5;
                uniforms.uNoiseIntensity.value = resetConfig.noiseIntensity || 0.005;
                uniforms.uPointSize.value = resetConfig.pointSize || 2;
            }, resetDuration);
        };
        targetElement.addEventListener("mousemove", handleMouseMove);
        if (clickInteraction)
            targetElement.addEventListener("click", handleClick);
        return () => {
            targetElement.removeEventListener("mousemove", handleMouseMove);
            targetElement.removeEventListener("click", handleClick);
            clearTimeout(resetTimeoutRef.current);
            resizeObserverRef.current?.disconnect?.();
            particlesCursorRef.current?.destroy?.();
        };
    }, [
        target,
        config,
        enabled,
        showOnMobile,
        clickInteraction,
        resetDuration,
        interactionColors,
    ]);
    useEffect(() => {
        const cleanup = initializeParticles();
        return () => cleanup?.();
    }, [initializeParticles]);
    if (!enabled || (isMobile() && !showOnMobile)) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx("div", { ref: containerRef, className: cn("relative w-full h-full overflow-hidden", className), style: {
            position: "relative",
            cursor: clickInteraction ? "pointer" : "default",
            minHeight: "100px",
            maxHeight: "100vh",
        }, children: children }));
};
export default MagicCursor;
