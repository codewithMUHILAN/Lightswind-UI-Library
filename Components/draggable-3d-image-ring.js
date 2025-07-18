"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { gsap } from "gsap";
export function Draggable3DImageRing({ images, width = 300, height = 400, perspective = 2000, imageDistance = 500, initialRotation = 180, animationDuration = 1.5, staggerDelay = 0.1, hoverOpacity = 0.5, containerClassName, ringClassName, imageClassName, backgroundColor, draggable = true, ease = "expo", mobileBreakpoint = 768, mobileScaleFactor = 0.8, }) {
    const stageRef = useRef(null);
    const containerRef = useRef(null);
    const ringRef = useRef(null);
    const xPosRef = useRef(0);
    const currentScaleRef = useRef(1);
    // Get background position for parallax effect
    const getBgPos = (i) => {
        if (!ringRef.current)
            return "0px 0px";
        const rotationY = gsap.getProperty(ringRef.current, "rotationY");
        const angle = 360 / images.length;
        const scaledImageDistance = imageDistance * currentScaleRef.current;
        return ((100 - gsap.utils.wrap(0, 360, rotationY - 180 - i * angle) / 360 * (scaledImageDistance / 1)) +
            "px 0px");
    };
    // Drag functionality
    const dragStart = (e) => {
        if (!draggable || !ringRef.current)
            return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        xPosRef.current = Math.round(clientX);
        gsap.set(ringRef.current, { cursor: "grabbing" });
        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
    };
    const drag = (e) => {
        if (!ringRef.current)
            return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const deltaX = Math.round(clientX) - xPosRef.current;
        gsap.to(ringRef.current, {
            rotationY: "-=" + (deltaX * 0.5),
            onUpdate: () => {
                const imgElements = Array.from(ringRef.current?.children || []);
                gsap.set(imgElements, {
                    backgroundPosition: (i) => getBgPos(i),
                });
            },
            overwrite: "auto",
        });
        xPosRef.current = Math.round(clientX);
    };
    const dragEnd = () => {
        if (!ringRef.current)
            return;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("mouseup", dragEnd);
        document.removeEventListener("touchend", dragEnd);
        gsap.set(ringRef.current, { cursor: "grab" });
    };
    useEffect(() => {
        if (!ringRef.current || !containerRef.current || !images.length)
            return;
        const angle = 360 / images.length;
        const imgElements = Array.from(ringRef.current.children);
        const handleResize = () => {
            if (!containerRef.current)
                return;
            const viewportWidth = window.innerWidth;
            const newScale = viewportWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
            currentScaleRef.current = newScale;
            gsap.set(containerRef.current, {
                scale: newScale,
                transformOrigin: "center center",
            });
            gsap.set(imgElements, {
                transformOrigin: `50% 50% ${imageDistance * newScale}px`,
                z: -imageDistance * newScale,
                backgroundPosition: (i) => getBgPos(i),
            });
        };
        // Initialize the ring and images
        const tl = gsap.timeline();
        tl.set(ringRef.current, {
            rotationY: initialRotation,
            cursor: draggable ? "grab" : "default",
        })
            .set(imgElements, {
            rotateY: (i) => i * -angle,
            transformOrigin: `50% 50% ${imageDistance}px`,
            z: -imageDistance,
            backgroundImage: (i) => `url(${images[i]})`,
            backgroundPosition: (i) => getBgPos(i),
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backfaceVisibility: "hidden",
        })
            // No initial opacity setting here, so it remains visible by default
            .from(imgElements, {
            duration: animationDuration,
            y: 200,
            opacity: 1,
            stagger: staggerDelay,
            ease: ease,
        })
            .add(() => {
            // Add hover effects for individual images (opacity change on hover),
            // but not for the entire ring visibility.
            imgElements.forEach((img) => {
                img.addEventListener("mouseenter", (e) => {
                    const current = e.currentTarget;
                    gsap.to(imgElements, {
                        opacity: (i, target) => target === current ? 1 : hoverOpacity,
                        ease: "power3",
                    });
                });
                img.addEventListener("mouseleave", () => {
                    gsap.to(imgElements, {
                        opacity: 1,
                        ease: "power2.inOut",
                    });
                });
            });
        }, "-=0.5");
        // Add drag event listeners if draggable
        if (draggable && containerRef.current) {
            containerRef.current.addEventListener("mousedown", dragStart);
            containerRef.current.addEventListener("touchstart", dragStart);
        }
        // Removed the handleMouseEnter and handleMouseLeave for the overall component visibility.
        // The component will be visible by default.
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial call to set the correct scale
        // Cleanup
        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener("mousedown", dragStart);
                containerRef.current.removeEventListener("touchstart", dragStart);
            }
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("touchmove", drag);
            document.removeEventListener("mouseup", dragEnd);
            document.removeEventListener("touchend", dragEnd);
            window.removeEventListener("resize", handleResize);
            // Removed cleanup for stageRef hover listeners
            tl.kill(); // Kill the GSAP timeline on unmount
        };
    }, [images, imageDistance, initialRotation, animationDuration, staggerDelay, hoverOpacity, draggable, ease, mobileBreakpoint, mobileScaleFactor]);
    return (_jsx("div", { ref: stageRef, className: cn("w-full h-full overflow-hidden select-none relative", containerClassName), style: {
            backgroundColor,
            transformStyle: "preserve-3d",
        }, children: _jsx("div", { ref: containerRef, className: cn("absolute left-1/2 top-1/1 pt-20 -translate-x-1/2 -translate-y-1/2", ringClassName), style: {
                perspective: `${perspective}px`,
                width: `${width}px`,
                height: `${height}px`,
                // Removed initial opacity: 0 from inline style as well
            }, children: _jsx("div", { ref: ringRef, className: cn("w-full h-full absolute", ringClassName), style: {
                    transformStyle: "preserve-3d",
                }, children: images.map((_, index) => (_jsx("div", { className: cn("w-full h-full absolute", imageClassName), style: {
                        transformStyle: "preserve-3d",
                    } }, index))) }) }) }));
}
export default Draggable3DImageRing;
