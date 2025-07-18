"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, easeOut } from "framer-motion";
import { cn } from "../lib/utils"; // Assuming you have this utility for class names
import { animate } from "framer-motion";
export function Draggable3DImageRing({ images, width = 300, perspective = 2000, imageDistance = 500, initialRotation = 180, animationDuration = 1.5, staggerDelay = 0.1, hoverOpacity = 0.5, containerClassName, ringClassName, imageClassName, backgroundColor, draggable = true, ease = "easeOut", mobileBreakpoint = 768, mobileScaleFactor = 0.8, inertiaPower = 0.8, // Default power for inertia
inertiaTimeConstant = 300, // Default time constant for inertia
inertiaVelocityMultiplier = 20, // Default multiplier for initial spin
 }) {
    const containerRef = useRef(null);
    const ringRef = useRef(null);
    const rotationY = useMotionValue(initialRotation);
    const startX = useRef(0);
    const currentRotationY = useRef(initialRotation);
    const isDragging = useRef(false);
    const velocity = useRef(0); // To track drag velocity
    const [currentScale, setCurrentScale] = useState(1);
    const [showImages, setShowImages] = useState(false);
    const angle = useMemo(() => 360 / images.length, [images.length]);
    const getBgPos = (imageIndex, currentRot, scale) => {
        const scaledImageDistance = imageDistance * scale;
        const effectiveRotation = currentRot - 180 - imageIndex * angle;
        const parallaxOffset = ((effectiveRotation % 360 + 360) % 360) / 360;
        return `${-(parallaxOffset * (scaledImageDistance / 1.5))}px 0px`;
    };
    useEffect(() => {
        const unsubscribe = rotationY.on("change", (latestRotation) => {
            if (ringRef.current) {
                Array.from(ringRef.current.children).forEach((imgElement, i) => {
                    imgElement.style.backgroundPosition = getBgPos(i, latestRotation, currentScale);
                });
            }
            currentRotationY.current = latestRotation;
        });
        return () => unsubscribe();
    }, [rotationY, images.length, imageDistance, currentScale, angle]);
    useEffect(() => {
        const handleResize = () => {
            const viewportWidth = window.innerWidth;
            const newScale = viewportWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
            setCurrentScale(newScale);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [mobileBreakpoint, mobileScaleFactor]);
    useEffect(() => {
        setShowImages(true);
    }, []);
    const handleDragStart = (event) => {
        if (!draggable)
            return;
        isDragging.current = true;
        const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
        startX.current = clientX;
        // Stop any ongoing animation instantly when drag starts
        rotationY.stop();
        velocity.current = 0; // Reset velocity
        if (ringRef.current) {
            ringRef.current.style.cursor = "grabbing";
        }
        // Attach global move and end listeners to document when dragging starts
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("touchmove", handleDrag);
        document.addEventListener("touchend", handleDragEnd);
    };
    const handleDrag = (event) => {
        // Only proceed if dragging is active
        if (!draggable || !isDragging.current)
            return;
        const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
        const deltaX = clientX - startX.current;
        // Update velocity based on deltaX
        velocity.current = -deltaX * 0.5; // Factor of 0.5 to control sensitivity
        rotationY.set(currentRotationY.current + velocity.current);
        startX.current = clientX;
    };
    const handleDragEnd = () => {
        isDragging.current = false;
        if (ringRef.current) {
            ringRef.current.style.cursor = "grab";
            currentRotationY.current = rotationY.get();
        }
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("touchmove", handleDrag);
        document.removeEventListener("touchend", handleDragEnd);
        const initial = rotationY.get();
        const velocityBoost = velocity.current * inertiaVelocityMultiplier;
        const target = initial + velocityBoost;
        // Animate with inertia manually using `animate()`
        animate(initial, target, {
            type: "inertia",
            velocity: velocityBoost,
            power: inertiaPower,
            timeConstant: inertiaTimeConstant,
            restDelta: 0.5,
            modifyTarget: (target) => Math.round(target / angle) * angle,
            onUpdate: (latest) => {
                rotationY.set(latest);
            },
        });
        velocity.current = 0;
    };
    // Corrected imageVariants: no function for 'visible' state
    const imageVariants = {
        hidden: { y: 200, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            // Transition properties will be defined directly on the motion.div using `custom` prop
        },
    };
    return (_jsx("div", { ref: containerRef, className: cn("w-full h-full overflow-hidden select-none relative", containerClassName), style: {
            backgroundColor,
            transform: `scale(${currentScale})`,
            transformOrigin: "center center",
        }, 
        // Attach initial drag start listeners only
        onMouseDown: draggable ? handleDragStart : undefined, onTouchStart: draggable ? handleDragStart : undefined, children: _jsx("div", { style: {
                perspective: `${perspective}px`,
                width: `${width}px`,
                height: `${width * 1.33}px`,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }, children: _jsx(motion.div, { ref: ringRef, className: cn("w-full h-full absolute", ringClassName), style: {
                    transformStyle: "preserve-3d",
                    rotateY: rotationY,
                    cursor: draggable ? "grab" : "default",
                }, children: _jsx(AnimatePresence, { children: showImages && images.map((imageUrl, index) => (_jsx(motion.div, { className: cn("w-full h-full absolute", imageClassName), style: {
                            transformStyle: "preserve-3d",
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backfaceVisibility: "hidden",
                            rotateY: index * -angle,
                            z: -imageDistance * currentScale,
                            transformOrigin: `50% 50% ${imageDistance * currentScale}px`,
                            backgroundPosition: getBgPos(index, currentRotationY.current, currentScale),
                        }, initial: "hidden", animate: "visible", exit: "hidden", variants: imageVariants, custom: index, transition: {
                            delay: index * staggerDelay, // Use index directly in transition
                            duration: animationDuration,
                            ease: easeOut, // Apply ease for entrance animation
                        }, whileHover: { opacity: 1, transition: { duration: 0.15 } }, onHoverStart: () => {
                            // Prevent hover effects while dragging
                            if (isDragging.current)
                                return;
                            if (ringRef.current) {
                                Array.from(ringRef.current.children).forEach((imgEl, i) => {
                                    if (i !== index) {
                                        imgEl.style.opacity = `${hoverOpacity}`;
                                    }
                                });
                            }
                        }, onHoverEnd: () => {
                            // Prevent hover effects while dragging
                            if (isDragging.current)
                                return;
                            if (ringRef.current) {
                                Array.from(ringRef.current.children).forEach((imgEl) => {
                                    imgEl.style.opacity = `1`;
                                });
                            }
                        } }, index))) }) }) }) }));
}
export default Draggable3DImageRing;
