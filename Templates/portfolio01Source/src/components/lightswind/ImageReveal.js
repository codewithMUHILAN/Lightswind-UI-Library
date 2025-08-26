"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MoveUpRight as ArrowIcon } from "lucide-react";
const visualData = [
    {
        key: 1,
        url: "https://images.pexels.com/photos/9002742/pexels-photo-9002742.jpeg",
        label: "Pinky Island",
    },
    {
        key: 2,
        url: "https://images.pexels.com/photos/31622979/pexels-photo-31622979.jpeg",
        label: "Greedy Model",
    },
    {
        key: 3,
        url: "https://images.pexels.com/photos/12187128/pexels-photo-12187128.jpeg",
        label: "Sigma Connect",
    },
    {
        key: 4,
        url: "https://images.pexels.com/photos/28168248/pexels-photo-28168248.jpeg",
        label: "Futuristic Gamma",
    },
];
const ImageReveal = () => {
    const [focusedItem, setFocusedItem] = useState(null);
    const [isLargeScreen, setIsLargeScreen] = useState(true);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const smoothX = useSpring(cursorX, { stiffness: 300, damping: 40 });
    const smoothY = useSpring(cursorY, { stiffness: 300, damping: 40 });
    useEffect(() => {
        const updateScreen = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return () => window.removeEventListener("resize", updateScreen);
    }, []);
    const onMouseTrack = (e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    };
    const onHoverActivate = (item) => {
        setFocusedItem(item);
    };
    const onHoverDeactivate = () => {
        setFocusedItem(null);
    };
    return (_jsxs("div", { className: "relative mx-auto w-full min-h-fit bg-background rounded-md border overflow-hidden", onMouseMove: onMouseTrack, onMouseLeave: onHoverDeactivate, children: [visualData.map((item) => (_jsxs("div", { className: "p-4 cursor-pointer relative sm:flex items-center justify-between", onMouseEnter: () => onHoverActivate(item), children: [!isLargeScreen && (_jsx("img", { src: item.url, className: "sm:w-32 sm:h-20 w-full h-52 object-cover rounded-md", alt: item.label })), _jsx("h2", { className: `newFont uppercase md:text-5xl sm:text-2xl text-xl font-semibold sm:py-6 py-2 leading-[100%] relative transition-colors duration-300 ${focusedItem?.key === item.key
                            ? "mix-blend-difference z-20 text-gray-300"
                            : "text-foreground"}`, children: item.label }), _jsx("button", { className: `sm:block hidden p-4 rounded-full transition-all duration-300 ease-out ${focusedItem?.key === item.key
                            ? "mix-blend-difference z-20 bg-white text-black"
                            : ""}`, children: _jsx(ArrowIcon, { className: "w-8 h-8" }) }), _jsx("div", { className: `h-[2px] dark:bg-white bg-black absolute bottom-0 left-0 transition-all duration-300 ease-linear ${focusedItem?.key === item.key ? "w-full" : "w-0"}` })] }, item.key))), isLargeScreen && focusedItem && (_jsx(motion.img, { src: focusedItem.url, alt: focusedItem.label, className: "fixed z-30 object-cover w-[300px] h-[400px] rounded-lg pointer-events-none shadow-2xl dark:bg-gray-950 bg-white", style: {
                    left: smoothX,
                    top: smoothY,
                    x: "-50%",
                    y: "-50%",
                }, initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.5 }, transition: { type: "spring", stiffness: 300, damping: 30 } }))] }));
};
export default ImageReveal;
