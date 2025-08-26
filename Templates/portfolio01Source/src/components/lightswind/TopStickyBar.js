import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { cn } from "../lib/utils"; // Assuming you have a utility for class name concatenation
import { useState, useEffect } from "react"; // Import useState and useEffect
const TopStickyBar = ({ show: externalShow = false, // Renamed to avoid conflict with internal state
showOnScroll = false, scrollThreshold = 200, children, className, duration = 0.4, ease = "easeInOut", initialY = -50, visibleY = 0, hiddenY = -50, }) => {
    const [internalShow, setInternalShow] = useState(externalShow); // Initialize with externalShow
    // Effect to manage scroll-based visibility
    useEffect(() => {
        if (!showOnScroll) {
            setInternalShow(externalShow); // If not scroll-controlled, use external prop
            return;
        }
        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                setInternalShow(true);
            }
            else {
                setInternalShow(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        // Call once on mount to set initial state based on current scroll
        handleScroll();
        return () => window.
            removeEventListener("scroll", handleScroll);
    }, [showOnScroll, scrollThreshold, externalShow]); // Re-run if these props change
    // Determine the final `show` value
    const finalShow = showOnScroll ? internalShow : externalShow;
    return (_jsx(motion.div, { initial: { y: initialY, opacity: 0 }, animate: {
            y: finalShow ? visibleY : hiddenY,
            opacity: finalShow ? 1 : 0,
        }, transition: { duration, ease }, className: cn("fixed top-0 left-0 w-full z-[60] bg-gray-800 text-white py-1 text-sm text-center shadow-md", className), children: children }));
};
export default TopStickyBar;
