import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
const ImageMarquee = ({ images, speed = 50, // speed in pixels per second
direction = "left", 
// Default Tailwind width for the card div, now responsive
imageWidth = "w-[240px] sm:w-[300px] md:w-[360px]", 
// Default Tailwind height for the card div, now responsive
imageHeight = "h-[160px] sm:h-[200px] md:h-[240px]", 
// Default Tailwind horizontal margin for the card div, now responsive
imageMarginX = "mx-1 sm:mx-2", }) => {
    const containerRef = useRef(null);
    const x = useRef(0); // This will store the translateX value
    // Initialize x.current based on direction for seamless start
    useEffect(() => {
        if (containerRef.current) {
            const initialScrollWidth = containerRef.current.scrollWidth;
            if (initialScrollWidth > 0) {
                const singleSetWidth = initialScrollWidth / 2;
                if (direction === "right") {
                    x.current = -singleSetWidth;
                }
                else {
                    x.current = 0;
                }
                // Apply initial transform immediately
                containerRef.current.style.transform = `translateX(${x.current}px)`;
            }
        }
    }, [direction, images]); // Re-run if direction or images change
    useAnimationFrame((t, delta) => {
        if (containerRef.current) {
            const fullContentWidth = containerRef.current.scrollWidth;
            // If fullContentWidth is 0, the content hasn't rendered or has no width yet.
            // Exit early to prevent division by zero or incorrect calculations.
            if (fullContentWidth === 0)
                return;
            const singleSetWidth = fullContentWidth / 2;
            const moveBy = (speed * delta) / 1000;
            if (direction === "left") {
                x.current -= moveBy;
                // If scrolled past the first set to the left, reset to show start of second set
                if (x.current <= -singleSetWidth) {
                    x.current = 0;
                }
            }
            else {
                // direction === "right"
                x.current += moveBy;
                // If scrolled past the end of the second set to the right (i.e., x.current becomes 0 or positive)
                // reset to show the start of the first set again by pulling back.
                if (x.current >= 0) {
                    x.current = -singleSetWidth;
                }
            }
            containerRef.current.style.transform = `translateX(${x.current}px)`;
        }
    });
    const allImages = [...images, ...images]; // Duplicate images for seamless scroll
    return (_jsx("div", { className: "overflow-hidden w-full relative", children: _jsx("div", { ref: containerRef, className: "flex w-max" // w-max ensures the flex container takes the width of all its children
            , style: {
                willChange: "transform", // Optimize for animation
            }, children: allImages.map((src, idx) => (_jsx("div", { className: `${imageWidth} ${imageHeight} ${imageMarginX} flex-shrink-0 
    transform hover:scale-125 transition-transform duration-300 
    border border-white/20 hover:border-blue-500/40 p-2 
    rounded-xl shadow-lg backdrop-blur-md 
    bg-gray-200/60 dark:bg-white/5`, children: _jsx(motion.img, { src: src, alt: `marquee-image-${idx}`, 
                    // The image itself should now fill its parent div
                    className: "w-full h-full object-contain rounded-xl shadow-lg bg-black", draggable: false }) }, idx))) }) }));
};
export default ImageMarquee;
