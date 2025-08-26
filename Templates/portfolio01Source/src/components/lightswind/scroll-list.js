import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
const ScrollList = ({ data, renderItem, itemHeight = 155, // Default item height
 }) => {
    // useRef to get a reference to the scrollable div element
    const listRef = useRef(null);
    // useState to keep track of the index of the currently focused item
    const [focusedIndex, setFocusedIndex] = useState(0);
    // useScroll hook from Framer Motion to track scroll progress (can be used for additional animations)
    const { scrollYProgress } = useScroll({ container: listRef });
    useEffect(() => {
        const updateFocusedItem = () => {
            if (!listRef.current)
                return;
            const container = listRef.current;
            // Get all direct children (the motion.div items)
            const children = Array.from(container.children);
            const scrollTop = container.scrollTop; // Current vertical scroll position
            const containerCenter = container.clientHeight / 2; // Vertical center of the container
            let closestItemIndex = 0;
            let minDistanceToCenter = Infinity; // Initialize with a very large number
            // Iterate over each child item to find the one closest to the center
            children.forEach((child, index) => {
                const itemTop = child.offsetTop; // Top position of the item relative to its parent
                const actualItemHeight = child.offsetHeight; // Actual rendered height of the item
                const itemCenter = itemTop + actualItemHeight / 2; // Vertical center of the item
                // Calculate the distance from the item's center to the container's center, adjusted for scroll
                const distanceToCenter = Math.abs(itemCenter - scrollTop - containerCenter);
                // If this item is closer to the center than the previous closest
                if (distanceToCenter < minDistanceToCenter) {
                    minDistanceToCenter = distanceToCenter;
                    closestItemIndex = index;
                }
            });
            // Update the focused index state
            setFocusedIndex(closestItemIndex);
        };
        // Call immediately on mount to set initial focused item
        updateFocusedItem();
        // Add scroll event listener to update focused item on scroll
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", updateFocusedItem);
        }
        // Cleanup function: remove the event listener when the component unmounts
        return () => {
            if (listElement) {
                listElement.removeEventListener("scroll", updateFocusedItem);
            }
        };
    }, [data, itemHeight]); // Dependencies: Re-run effect if data or itemHeight changes
    // Framer Motion Variants for defining animation states for each item
    const itemVariants = {
        hidden: {
            opacity: 0,
            scale: 0.7,
            transition: { duration: 0.35, ease: "easeOut" },
        },
        focused: {
            opacity: 1,
            scale: 1,
            zIndex: 10,
            transition: { duration: 0.35, ease: "easeOut" },
        },
        next: {
            opacity: 1,
            scale: 0.95,
            zIndex: 5,
            transition: { duration: 0.35, ease: "easeOut" },
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.35, ease: "easeOut" },
        },
    };
    return (_jsx("div", { ref: listRef, 
        // Tailwind CSS classes for styling: hidden scrollbar, centered horizontally, full width
        className: "scroll-list__wrp scrollbar-hidden mx-auto w-full", 
        // Inline style for fixed height and scrollability of the main container
        style: { height: "600px", overflowY: "auto" }, children: data.map((item, index) => {
            let variant = "hidden"; // Default variant
            // Determine the animation variant based on the item's position relative to the focused item
            if (index === focusedIndex) {
                variant = "focused"; // The currently focused item
            }
            else if (index === focusedIndex + 1) {
                variant = "next"; // The item immediately following the focused one
            }
            else {
                // Items within a certain range (2 items above/below) of the focused item are visible
                const isWithinVisibleRange = Math.abs(index - focusedIndex) <= 2;
                if (isWithinVisibleRange) {
                    variant = "visible";
                }
            }
            return (_jsx(motion.div, { 
                // !!! IMPORTANT CHANGE HERE !!!
                // Use a fixed width Tailwind class, e.g., 'w-96' (384px) or 'w-[350px]' for a custom pixel value.
                // Using 'w-full' will make them take the full width of the parent, which is 'w-full' from scroll-list__wrp.
                className: "scroll-list__item mx-auto max-w-3xl" // Example: fixed width of 384px. Adjust as needed.
                , variants: itemVariants, initial: "hidden" // Initial animation state
                , animate: variant, 
                // Set the height of each individual item.
                style: {
                    height: itemHeight ? `${itemHeight}px` : "auto",
                }, children: renderItem(item, index) }, index));
        }) }));
};
export default ScrollList;
