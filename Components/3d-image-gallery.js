"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, } from "framer-motion";
/**
 * ThreeDImageGallery Component
 * Renders a responsive 3D image gallery with interactive and auto-rotate features.
 */
const ThreeDImageGallery = ({ 
// Default images if none are provided
images = [
    "https://images.pexels.com/photos/2514035/pexels-photo-2514035.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1271620/pexels-photo-1271620.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
], width = 800, // Default width for the gallery container
height = 300, // Default height for the gallery container
spacing = 1.5, // Default spacing multiplier
rotationAngle = 0.1, // Default rotation angle multiplier
borderRadius = 0.1, // Default border radius multiplier
autoRotate = false, // Default auto-rotate off
autoRotateSpeed = 0.3, // Default auto-rotate speed
className = "", // Default empty class name
style = {}, // Default empty style object
onImageClick, // Image click handler
 }) => {
    // State to manage the currently active (front-most) image index
    const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2));
    // Ref for the main container div to get its dimensions for mouse interactions
    const containerRef = useRef(null);
    // Motion values for X and Y rotation based on mouse position
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    // Effect to handle auto-rotation
    useEffect(() => {
        let intervalId = null; // Local variable to store the interval ID
        if (autoRotate) {
            // Set up an interval to change the active image index
            intervalId = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % images.length);
            }, autoRotateSpeed * 1000); // Convert speed to milliseconds
        }
        // Clean up function for the effect
        return () => {
            if (intervalId) {
                clearInterval(intervalId); // Clear the interval if it was set
            }
        };
    }, [autoRotate, autoRotateSpeed, images.length]); // Dependencies for the effect
    // Handler for mouse movement over the gallery container
    const handleMouseMove = (e) => {
        // Get the bounding rectangle of the container
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        // Calculate mouse position relative to the container
        const x = e.clientX - left;
        const y = e.clientY - top;
        // Calculate rotation values based on mouse position
        // Normalized x/y (0 to 1) then mapped to a rotation range (-10 to 10 degrees)
        const rotateYVal = (x / width - 0.5) * 20;
        const rotateXVal = (y / height - 0.5) * -20;
        // Update motion values
        rotateX.set(rotateXVal);
        rotateY.set(rotateYVal);
    };
    // Handler for mouse leaving the gallery container
    const handleMouseLeave = () => {
        // Reset rotation to 0 when mouse leaves
        rotateX.set(0);
        rotateY.set(0);
    };
    return (
    // Main container for the 3D gallery
    _jsx(motion.div, { ref: containerRef, className: `relative flex items-center justify-center ${className}`, style: {
            width, // Apply width from props
            height, // Apply height from props
            perspective: 1200, // Apply perspective for 3D effect
            transformStyle: "preserve-3d", // Preserve 3D transformations for children
            ...style, // Apply any additional inline styles
        }, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, children: _jsx(motion.div, { style: {
                rotateX, // Apply X rotation from motion value
                rotateY, // Apply Y rotation from motion value
                transformStyle: "preserve-3d", // Preserve 3D transformations for children
            }, className: "relative", children: _jsx(AnimatePresence, { initial: false, children: images.map((img, index) => {
                    // Calculate offset from the active image
                    const offset = index - activeIndex;
                    // Scale of the image (active image is full size, others are smaller)
                    const scale = index === activeIndex ? 1 : 0.8;
                    // Z-index to ensure correct layering in 3D space
                    const zIndex = -Math.abs(offset);
                    // X translation based on offset and spacing
                    const x = offset * spacing * 200; // 200 is the fixed width of an image
                    // Y rotation for each image to create the 3D fan effect
                    const rotateYImage = offset * -rotationAngle * 180;
                    return (
                    // Individual image container with motion properties
                    _jsx(motion.div, { className: "absolute rounded-lg overflow-hidden shadow-xl cursor-pointer", style: {
                            width: 200, // Fixed width for each image
                            height: 280, // Fixed height for each image
                            borderRadius: `${borderRadius * 100}px`, // Apply border radius
                            zIndex, // Apply calculated z-index
                        }, 
                        // Animation properties for image position, scale, rotation, and opacity
                        animate: {
                            x,
                            scale,
                            rotateY: rotateYImage,
                            opacity: Math.abs(offset) > 2 ? 0 : 1, // Hide images that are too far off-center
                            filter: index === activeIndex ? "brightness(1)" : "brightness(0.7)", // Dim non-active images
                        }, 
                        // Spring transition for smooth animations
                        transition: { type: "spring", stiffness: 150, damping: 20 }, 
                        // Click handler for images
                        onClick: () => {
                            // If a non-active image is clicked, make it active
                            if (index !== activeIndex)
                                return setActiveIndex(index);
                            // If the active image is clicked, trigger the onImageClick prop
                            onImageClick?.(index);
                        }, children: _jsx("img", { src: img, alt: `gallery-image-${index}`, className: "w-full h-full object-cover" // Ensure image covers its container
                            , 
                            // Fallback for broken image URLs
                            onError: (e) => {
                                e.currentTarget.src = `https://placehold.co/200x280/cccccc/333333?text=Image+Error`;
                                e.currentTarget.onerror = null; // Prevent infinite loop on error
                            } }) }, img));
                }) }) }) }));
};
export default ThreeDImageGallery;
