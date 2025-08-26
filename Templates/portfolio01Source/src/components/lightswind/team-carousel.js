"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils'; // Assuming this utility correctly merges class names
export const TeamCarousel = ({ members, title = "OUR TEAM", titleSize = "2xl", titleColor = "rgba(0, 76, 255, 1)", background, cardWidth = 280, cardHeight = 380, cardRadius = 20, showArrows = true, showDots = true, keyboardNavigation = true, touchNavigation = true, animationDuration = 800, autoPlay = 0, pauseOnHover = true, visibleCards = 2, sideCardScale = 0.9, sideCardOpacity = 0.8, grayscaleEffect = true, className, cardClassName, titleClassName, infoPosition = "bottom", infoTextColor = "rgb(8, 42, 123)", infoBackground = "transparent", onMemberChange, onCardClick, initialIndex = 0, }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0); // 0: no movement, 1: next, -1: prev
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const totalMembers = members.length;
    const paginate = useCallback((newDirection) => {
        if (totalMembers === 0)
            return;
        setDirection(newDirection);
        const nextIndex = (currentIndex + newDirection + totalMembers) % totalMembers;
        setCurrentIndex(nextIndex);
        onMemberChange?.(members[nextIndex], nextIndex);
    }, [currentIndex, totalMembers, members, onMemberChange]);
    const wrapIndex = (index) => {
        return (index + totalMembers) % totalMembers;
    };
    const calculatePosition = (index) => {
        const activeIndex = currentIndex;
        const diff = wrapIndex(index - activeIndex);
        if (diff === 0)
            return 'center';
        if (diff <= visibleCards)
            return `right-${diff}`;
        if (diff >= totalMembers - visibleCards)
            return `left-${totalMembers - diff}`;
        return 'hidden';
    };
    // Explicitly type the return of getVariantStyles to match framer-motion's expectations
    const getVariantStyles = (position) => {
        // FIX: Changed ease from number[] to an array of string presets or a valid CubicBezier type
        // Using string presets for simplicity and type compatibility.
        // If you need the exact cubic-bezier values, ensure they are compatible with framer-motion's Easing type.
        // For custom cubic-bezier, you might need to use a type assertion like `as [number, number, number, number]`
        // or import CubicBezier from 'framer-motion/types/value/types'.
        const transition = {
            duration: animationDuration / 1000,
            // You can use a string preset like 'easeInOut' or a valid cubic-bezier array if framer-motion's types support it directly
            // For the given numbers, 'easeInOut' is a close approximation or 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' if framer-motion accepted it directly as string
            // To strictly match [0.25, 0.46, 0.45, 0.94], framer-motion expects it as a CubicBezier tuple:
            ease: [0.25, 0.46, 0.45, 0.94],
        };
        switch (position) {
            case 'center':
                return {
                    zIndex: 10,
                    opacity: 1,
                    scale: 1.1,
                    x: 0,
                    filter: 'grayscale(0%)',
                    pointerEvents: 'auto',
                    transition,
                };
            case 'right-1':
                return {
                    zIndex: 5,
                    opacity: sideCardOpacity,
                    scale: sideCardScale,
                    x: cardWidth * 0.7,
                    filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)',
                    pointerEvents: 'auto',
                    transition,
                };
            case 'right-2':
                return {
                    zIndex: 1,
                    opacity: sideCardOpacity * 0.7,
                    scale: sideCardScale * 0.9,
                    x: cardWidth * 1.4,
                    filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)',
                    pointerEvents: 'auto',
                    transition,
                };
            case 'left-1':
                return {
                    zIndex: 5,
                    opacity: sideCardOpacity,
                    scale: sideCardScale,
                    x: -cardWidth * 0.7,
                    filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)',
                    pointerEvents: 'auto',
                    transition,
                };
            case 'left-2':
                return {
                    zIndex: 1,
                    opacity: sideCardOpacity * 0.7,
                    scale: sideCardScale * 0.9,
                    x: -cardWidth * 1.4,
                    filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)',
                    pointerEvents: 'auto',
                    transition,
                };
            default:
                return {
                    zIndex: 0,
                    opacity: 0,
                    scale: 0.8,
                    x: direction > 0 ? cardWidth * (visibleCards + 1) : -cardWidth * (visibleCards + 1),
                    pointerEvents: 'none',
                    filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)',
                    transition,
                };
        }
    };
    // Auto-play functionality
    useEffect(() => {
        let interval;
        if (autoPlay > 0) {
            interval = setInterval(() => {
                paginate(1);
            }, autoPlay);
        }
        const carouselContainer = document.getElementById('team-carousel-container');
        const handleMouseEnter = () => {
            if (pauseOnHover && autoPlay > 0)
                clearInterval(interval);
        };
        const handleMouseLeave = () => {
            if (pauseOnHover && autoPlay > 0) {
                interval = setInterval(() => {
                    paginate(1);
                }, autoPlay);
            }
        };
        if (carouselContainer && pauseOnHover && autoPlay > 0) {
            carouselContainer.addEventListener('mouseenter', handleMouseEnter);
            carouselContainer.addEventListener('mouseleave', handleMouseLeave);
        }
        return () => {
            clearInterval(interval);
            if (carouselContainer && pauseOnHover && autoPlay > 0) {
                carouselContainer.removeEventListener('mouseenter', handleMouseEnter);
                carouselContainer.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [autoPlay, paginate, pauseOnHover]);
    // Keyboard navigation
    useEffect(() => {
        if (!keyboardNavigation)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                paginate(-1);
            }
            else if (e.key === 'ArrowRight') {
                paginate(1);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [keyboardNavigation, paginate]);
    // Touch navigation
    const handleTouchStart = (e) => {
        if (!touchNavigation)
            return;
        setTouchStart(e.targetTouches[0].clientX);
    };
    const handleTouchMove = (e) => {
        if (!touchNavigation)
            return;
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const handleTouchEnd = () => {
        if (!touchNavigation)
            return;
        const swipeThreshold = 50;
        const diff = touchStart - touchEnd;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                paginate(1);
            }
            else {
                paginate(-1);
            }
        }
    };
    const titleSizeClasses = {
        sm: 'text-4xl',
        md: 'text-5xl',
        lg: 'text-6xl',
        xl: 'text-7xl',
        '2xl': 'text-8xl',
    };
    return (_jsxs("div", { id: "team-carousel-container", className: cn(`min-h-screen flex flex-col items-center justify-center overflow-hidden relative 
        transparent`, className), style: { background: background }, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: [title && (_jsx("h1", { className: cn("font-black uppercase tracking-tight absolute top-12 left-1/2 transform -translate-x-1/2 pointer-events-none whitespace-nowrap", titleSizeClasses[titleSize], titleClassName), style: {
                    color: 'transparent',
                    background: `linear-gradient(to bottom, ${titleColor}75 40%, transparent 76%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                }, children: title })), _jsxs("div", { className: "w-full max-w-6xl relative mt-20", style: {
                    height: cardHeight + 100,
                    perspective: '1000px',
                }, children: [showArrows && (_jsxs(_Fragment, { children: [_jsx(motion.button, { onClick: () => paginate(-1), className: "absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all duration-300 hover:scale-110", whileTap: { scale: 0.9 }, children: _jsx(ChevronLeft, { className: "w-6 h-6" }) }), _jsx(motion.button, { onClick: () => paginate(1), className: "absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all duration-300 hover:scale-110", whileTap: { scale: 0.9 }, children: _jsx(ChevronRight, { className: "w-6 h-6" }) })] })), _jsx("div", { className: "w-full h-full flex justify-center items-center relative", style: { transformStyle: 'preserve-3d' }, children: _jsx(AnimatePresence, { initial: false, custom: direction, children: members.map((member, index) => {
                                const position = calculatePosition(index);
                                const isCurrent = index === currentIndex;
                                if (position === 'hidden' && !isCurrent)
                                    return null;
                                return (_jsxs(motion.div, { className: cn("absolute bg-white overflow-hidden shadow-2xl cursor-pointer", cardClassName), style: {
                                        width: cardWidth,
                                        height: cardHeight,
                                        borderRadius: cardRadius,
                                        top: '50%',
                                        left: '50%',
                                        marginLeft: -cardWidth / 2,
                                        marginTop: -cardHeight / 2,
                                    }, initial: getVariantStyles('hidden'), animate: getVariantStyles(position), exit: getVariantStyles('hidden'), onClick: () => {
                                        if (!isCurrent) {
                                            const newDirection = index > currentIndex ? 1 : -1;
                                            setDirection(newDirection);
                                            setCurrentIndex(index);
                                            onMemberChange?.(members[index], index);
                                        }
                                        onCardClick?.(member, index);
                                    }, children: [_jsx("img", { src: member.image, alt: member.name, className: "w-full h-full object-cover" }), infoPosition === 'overlay' && (_jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 text-center", style: {
                                                background: infoBackground || "linear-gradient(transparent, rgba(0,0,0,0.8))",
                                                color: infoTextColor,
                                            }, children: [_jsx("h3", { className: "text-lg font-bold", children: member.name }), _jsx("p", { className: "text-sm opacity-90", children: member.role })] }))] }, member.id));
                            }) }) })] }), infoPosition === 'bottom' && members[currentIndex] && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: "text-center mt-10", children: [_jsxs("h2", { className: "text-4xl font-bold mb-3 relative inline-block", style: { color: infoTextColor }, children: [members[currentIndex].name, _jsx("span", { className: "absolute top-full left-0 w-full h-0.5 mt-2", style: { background: infoTextColor } })] }), _jsx("p", { className: "text-xl font-medium opacity-80 uppercase tracking-wider", style: { color: infoTextColor }, children: members[currentIndex].role }), members[currentIndex].bio && (_jsx("p", { className: "text-base mt-4 max-w-lg mx-auto opacity-70", children: members[currentIndex].bio }))] }, members[currentIndex].id + "-info")), showDots && (_jsx("div", { className: "flex justify-center gap-3 mt-15 ", children: members.map((_, index) => (_jsx(motion.button, { onClick: () => {
                        if (index !== currentIndex) {
                            const newDirection = index > currentIndex ? 1 : -1;
                            setDirection(newDirection);
                            setCurrentIndex(index);
                            onMemberChange?.(members[index], index);
                        }
                    }, className: cn("w-3 h-3 rounded-full transition-all duration-300", index === currentIndex
                        ? "scale-125"
                        : "hover:scale-110"), style: {
                        background: index === currentIndex
                            ? infoTextColor
                            : `${infoTextColor}40`,
                    }, whileTap: { scale: 0.9 } }, index))) }))] }));
};
export default TeamCarousel;
